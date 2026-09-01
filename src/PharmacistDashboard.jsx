import { useState } from "react";
import "./PharmacistDashboard.css";

function PharmacistDashboard({
  pharmacist,
  pharmacy,
  pharmacies = [],
  setPharmacies,
  goBack,
}) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [toast, setToast] = useState(null);

  const assignedPharmacy =
    pharmacies.find(
      (item) => item.id === pharmacy?.id
    ) ||
    pharmacies.find(
      (item) =>
        String(item.name || "")
          .trim()
          .toLowerCase() ===
        String(pharmacy?.name || "")
          .trim()
          .toLowerCase()
    );

  const currentPharmacy =
    assignedPharmacy || pharmacy || {};

  const medicines =
    currentPharmacy.medicines || [];

  const showToast = (
    type,
    title,
    message
  ) => {
    setToast({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast(
        "error",
        "Missing information",
        "Please enter medicine name."
      );
      return;
    }

    if (price === "" || stock === "") {
      showToast(
        "error",
        "Missing information",
        "Please enter price and stock."
      );
      return;
    }

    if (!assignedPharmacy) {
      showToast(
        "error",
        "Pharmacy not found",
        "Assigned pharmacy could not be found."
      );
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (
      Number.isNaN(priceNumber) ||
      Number.isNaN(stockNumber)
    ) {
      showToast(
        "error",
        "Invalid values",
        "Please enter valid price and stock."
      );
      return;
    }

    let updatedMedicines;

    if (editingId !== null) {
      updatedMedicines = medicines.map(
        (medicine) =>
          medicine.id === editingId
            ? {
                ...medicine,
                name: name.trim(),
                price: priceNumber,
                stock: stockNumber,
                status:
                  stockNumber === 0
                    ? "Out of Stock"
                    : stockNumber <= 10
                    ? "Low Stock"
                    : "In Stock",
              }
            : medicine
      );
    } else {
      updatedMedicines = [
        ...medicines,
        {
          id: Date.now(),
          name: name.trim(),
          price: priceNumber,
          stock: stockNumber,
          status:
            stockNumber === 0
              ? "Out of Stock"
              : stockNumber <= 10
              ? "Low Stock"
              : "In Stock",
        },
      ];
    }

    const updatedPharmacies =
      pharmacies.map((item) =>
        item.id === assignedPharmacy.id
          ? {
              ...item,
              medicines: updatedMedicines,
            }
          : item
      );

    setPharmacies(updatedPharmacies);

    if (editingId !== null) {
      showToast(
        "success",
        "Medicine updated",
        "Medicine details updated successfully."
      );
    } else {
      showToast(
        "success",
        "Medicine added",
        "Medicine added successfully."
      );
    }

    resetForm();
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setName(medicine.name);
    setPrice(String(medicine.price));
    setStock(String(medicine.stock));
    setShowForm(true);
  };

  const handleDelete = (medicineId) => {
    if (!assignedPharmacy) return;

    const updatedMedicines =
      medicines.filter(
        (medicine) =>
          medicine.id !== medicineId
      );

    const updatedPharmacies =
      pharmacies.map((item) =>
        item.id === assignedPharmacy.id
          ? {
              ...item,
              medicines: updatedMedicines,
            }
          : item
      );

    setPharmacies(updatedPharmacies);

    showToast(
      "success",
      "Medicine deleted",
      "Medicine removed successfully."
    );
  };

  const getStatus = (value) => {
    const stockValue = Number(value || 0);

    if (stockValue === 0) {
      return {
        text: "Out of Stock",
        className: "status-out",
      };
    }

    if (stockValue <= 10) {
      return {
        text: "Low Stock",
        className: "status-low",
      };
    }

    return {
      text: "In Stock",
      className: "status-in",
    };
  };

  return (
    <main className="pharmacist-dashboard-page">

      {toast && (
        <div
          className={`pharmacist-toast ${toast.type}`}
        >
          <div className="pharmacist-toast-icon">
            {toast.type === "success"
              ? "✓"
              : "!"}
          </div>

          <div>
            <strong>{toast.title}</strong>
            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
          >
            ×
          </button>
        </div>
      )}

      <header className="pharmacist-dashboard-header">

        <div className="pharmacist-welcome">

          <div className="pharmacist-header-icon">
            👨‍⚕️
          </div>

          <div>
            <h1>Pharmacist Dashboard</h1>

            <p>
              Welcome,{" "}
              {pharmacist?.name ||
                "Pharmacist"}
            </p>
          </div>

        </div>

        <button
          className="pharmacist-logout-button"
          onClick={goBack}
        >
          Logout
        </button>

      </header>

      <section className="assigned-pharmacy-card">

        <div className="assigned-pharmacy-icon">
          🏪
        </div>

        <div className="assigned-pharmacy-info">

          <span>Assigned Pharmacy</span>

          <h2>
            {currentPharmacy.name ||
              "Assigned Pharmacy"}
          </h2>

          <p>
            📍{" "}
            {currentPharmacy.location ||
              "Location not available"}
          </p>

        </div>

        <span
          className={
            currentPharmacy.status === "Closed"
              ? "pharmacy-status closed"
              : "pharmacy-status open"
          }
        >
          {currentPharmacy.status || "Open"}
        </span>

      </section>

      <section className="pharmacist-medicine-section">

        <div className="pharmacist-medicine-header">

          <div>
            <h2>💊 Pharmacy Medicines</h2>

            <p>
              Manage medicines available in{" "}
              <strong>
                {currentPharmacy.name}
              </strong>
            </p>
          </div>

          <button
            className="pharmacist-add-medicine-button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setPrice("");
              setStock("");
              setShowForm(true);
            }}
          >
            + Add Medicine
          </button>

        </div>

        {showForm && (
          <section className="pharmacist-medicine-form">

            <div className="form-header">

              <div>
                <h3>
                  {editingId !== null
                    ? "Edit Medicine"
                    : "Add New Medicine"}
                </h3>

                <p>
                  Enter medicine price and
                  stock details
                </p>
              </div>

              <button
                className="close-form-button"
                onClick={resetForm}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="pharmacist-form-grid">

                <div className="form-field">
                  <label>Medicine Name</label>

                  <input
                    type="text"
                    placeholder="Enter medicine name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Price (₹)</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) =>
                      setPrice(e.target.value)
                    }
                  />
                </div>

                <div className="form-field">
                  <label>Stock Quantity</label>

                  <input
                    type="number"
                    min="0"
                    placeholder="Enter stock"
                    value={stock}
                    onChange={(e) =>
                      setStock(e.target.value)
                    }
                  />
                </div>

              </div>

              <div className="pharmacist-form-actions">

                <button
                  type="button"
                  className="pharmacist-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="pharmacist-save-button"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Add Medicine"}
                </button>

              </div>

            </form>

          </section>
        )}

        <div className="pharmacist-available-heading">

          <div>
            <h2>Available Medicines</h2>

            <p>
              {medicines.length} medicine
              {medicines.length !== 1
                ? "s"
                : ""}{" "}
              in this pharmacy
            </p>
          </div>

          <div className="pharmacist-medicine-count">
            💊 {medicines.length}
          </div>

        </div>

        {medicines.length === 0 ? (

          <div className="pharmacist-empty-state">

            <div>💊</div>

            <h3>No medicines added</h3>

            <p>
              Add medicines to this pharmacy
              to manage price and stock.
            </p>

            <button
              className="empty-add-medicine-button"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Add Medicine
            </button>

          </div>

        ) : (

          <div className="pharmacist-medicine-table-wrapper">

            <table className="pharmacist-medicine-table">

              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {medicines.map((medicine) => {

                  const status =
                    getStatus(
                      medicine.stock
                    );

                  return (
                    <tr key={medicine.id}>

                      <td>
                        <div className="pharmacist-medicine-name">

                          <div className="medicine-icon">
                            💊
                          </div>

                          <div>
                            <strong>
                              {medicine.name}
                            </strong>

                            <span>
                              Pharmacy Medicine
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <strong>
                          ₹{medicine.price}
                        </strong>
                      </td>

                      <td>
                        {medicine.stock}
                      </td>

                      <td>
                        <span
                          className={`medicine-stock-status ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </td>

                      <td>
                        <div className="pharmacist-action-buttons">

                          <button
                            className="pharmacist-edit-button"
                            onClick={() =>
                              handleEdit(
                                medicine
                              )
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="pharmacist-delete-button"
                            onClick={() =>
                              handleDelete(
                                medicine.id
                              )
                            }
                          >
                            🗑️
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </main>
  );
}

export default PharmacistDashboard;