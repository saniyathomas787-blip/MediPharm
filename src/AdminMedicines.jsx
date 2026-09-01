import { useState, useEffect } from "react";
import "./AdminMedicines.css";

function AdminMedicines({
  goBack,
  medicines = [],
  setMedicines,
  pharmacies = [],
  setPharmacies,
}) {
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [selectedPharmacyId, setSelectedPharmacyId] =
    useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingSource, setEditingSource] =
    useState(null);

  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({
      show: true,
      message,
    });
  };

  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast({
        show: false,
        message: "",
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show]);

  const pharmacyMedicines = pharmacies.flatMap(
    (pharmacy) =>
      (pharmacy.medicines || []).map((medicine) => ({
        ...medicine,
        pharmacyId: pharmacy.id,
        pharmacyName: pharmacy.name,
        source: "pharmacy",
      }))
  );

  const oldAdminMedicines = medicines.map(
    (medicine) => ({
      ...medicine,
      pharmacyId: null,
      pharmacyName: "Unassigned",
      source: "admin",
    })
  );

  const allMedicines = [
    ...pharmacyMedicines,
    ...oldAdminMedicines,
  ];

  const resetForm = () => {
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setSelectedPharmacyId("");
    setEditingId(null);
    setEditingSource(null);
    setShowForm(false);
  };

  const getStatus = (stockValue) => {
    const value = Number(stockValue || 0);

    if (value === 0) {
      return "Out of Stock";
    }

    if (value <= 10) {
      return "Low Stock";
    }

    return "In Stock";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !category.trim() ||
      price === "" ||
      stock === ""
    ) {
      showToast("Please fill all fields.");
      return;
    }

    const priceNumber = Number(price);
    const stockNumber = Number(stock);

    if (
      Number.isNaN(priceNumber) ||
      Number.isNaN(stockNumber)
    ) {
      showToast(
        "Please enter valid price and stock values."
      );
      return;
    }

    if (priceNumber < 0 || stockNumber < 0) {
      showToast(
        "Price and stock cannot be negative."
      );
      return;
    }

    if (
      editingId === null &&
      !selectedPharmacyId
    ) {
      showToast(
        "Please select a pharmacy."
      );
      return;
    }

    if (
      editingId !== null &&
      editingSource === "pharmacy"
    ) {
      const updatedPharmacies = pharmacies.map(
        (pharmacy) => {
          if (
            String(pharmacy.id) !==
            String(selectedPharmacyId)
          ) {
            return pharmacy;
          }

          return {
            ...pharmacy,

            medicines: (
              pharmacy.medicines || []
            ).map((medicine) =>
              medicine.id === editingId
                ? {
                    ...medicine,
                    name: name.trim(),
                    category:
                      category.trim(),
                    price: priceNumber,
                    stock: stockNumber,
                    status:
                      getStatus(
                        stockNumber
                      ),
                  }
                : medicine
            ),
          };
        }
      );

      setPharmacies(updatedPharmacies);

      showToast(
        "Medicine updated successfully!"
      );

      resetForm();
      return;
    }

    if (
      editingId !== null &&
      editingSource === "admin"
    ) {
      if (!selectedPharmacyId) {
        showToast(
          "Please select a pharmacy."
        );
        return;
      }

      const oldMedicine =
        medicines.find(
          (medicine) =>
            medicine.id === editingId
        );

      if (!oldMedicine) return;

      const newPharmacyMedicine = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        price: priceNumber,
        stock: stockNumber,
        status:
          getStatus(stockNumber),
      };

      const updatedPharmacies =
        pharmacies.map((pharmacy) =>
          String(pharmacy.id) ===
          String(selectedPharmacyId)
            ? {
                ...pharmacy,
                medicines: [
                  ...(pharmacy.medicines ||
                    []),
                  newPharmacyMedicine,
                ],
              }
            : pharmacy
        );

      setPharmacies(updatedPharmacies);

      setMedicines(
        medicines.filter(
          (medicine) =>
            medicine.id !== editingId
        )
      );

      showToast(
        "Medicine assigned to pharmacy successfully!"
      );

      resetForm();
      return;
    }

    const newMedicine = {
      id: Date.now(),
      name: name.trim(),
      category: category.trim(),
      price: priceNumber,
      stock: stockNumber,
      status:
        getStatus(stockNumber),
    };

    const updatedPharmacies =
      pharmacies.map((pharmacy) =>
        String(pharmacy.id) ===
        String(selectedPharmacyId)
          ? {
              ...pharmacy,
              medicines: [
                ...(pharmacy.medicines ||
                  []),
                newMedicine,
              ],
            }
          : pharmacy
      );

    setPharmacies(updatedPharmacies);

    showToast(
      "Medicine added successfully!"
    );

    resetForm();
  };

  const handleEdit = (medicine) => {
    setEditingId(medicine.id);
    setEditingSource(medicine.source);

    setName(medicine.name || "");

    setCategory(
      medicine.category || "General"
    );

    setPrice(
      String(medicine.price ?? "")
    );

    setStock(
      String(medicine.stock ?? "")
    );

    setSelectedPharmacyId(
      medicine.pharmacyId
        ? String(medicine.pharmacyId)
        : ""
    );

    setShowForm(true);
  };

  const handleDelete = (medicine) => {
    if (medicine.source === "admin") {
      setMedicines(
        medicines.filter(
          (item) =>
            item.id !== medicine.id
        )
      );

      showToast(
        "Medicine deleted successfully!"
      );

      return;
    }

    const updatedPharmacies =
      pharmacies.map((pharmacy) =>
        pharmacy.id ===
        medicine.pharmacyId
          ? {
              ...pharmacy,

              medicines: (
                pharmacy.medicines || []
              ).filter(
                (item) =>
                  item.id !== medicine.id
              ),
            }
          : pharmacy
      );

    setPharmacies(updatedPharmacies);

    showToast(
      "Medicine deleted successfully!"
    );
  };

  const filteredMedicines =
    allMedicines.filter((medicine) => {
      const searchText =
        search.trim().toLowerCase();

      return (
        String(medicine.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(medicine.category || "")
          .toLowerCase()
          .includes(searchText) ||
        String(medicine.pharmacyName || "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  const openAddMedicineForm = () => {
    setEditingId(null);
    setEditingSource(null);
    setName("");
    setCategory("");
    setPrice("");
    setStock("");
    setSelectedPharmacyId("");
    setShowForm(true);
  };

  return (
    <main className="medicine-management-page">

      {toast.show && (
        <div className="medicine-toast">
          ✓ {toast.message}
        </div>
      )}

      <header className="medicine-page-header">

        <div className="medicine-title-row">

          <div className="medicine-title-icon">
            💊
          </div>

          <div>
            <h1>
              Medicine Management
            </h1>

            <p>
              Manage medicines available in
              MediPharm
            </p>
          </div>

        </div>

        <button
          className="back-dashboard-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>

      </header>

      <section className="medicine-toolbar">

        <div className="medicine-search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search medicine, category or pharmacy..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          className="add-medicine-button"
          onClick={openAddMedicineForm}
        >
          + Add Medicine
        </button>

      </section>

      {showForm && (
        <section className="medicine-form-card">

          <div className="medicine-form-header">

            <div>

              <h2>
                {editingId !== null
                  ? "Edit Medicine"
                  : "Add New Medicine"}
              </h2>

              <p>
                Enter medicine details
              </p>

            </div>

            <button
              type="button"
              className="close-medicine-form"
              onClick={resetForm}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="medicine-form-grid">

              <div className="medicine-field">

                <label>
                  Medicine Name
                </label>

                <input
                  type="text"
                  placeholder="Enter medicine name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              <div className="medicine-field">

                <label>
                  Category
                </label>

                <input
                  type="text"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="medicine-field">

                <label>
                  Price (₹)
                </label>

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

              <div className="medicine-field">

                <label>
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="Enter stock quantity"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                />

              </div>

              <div className="medicine-field">

                <label>
                  Pharmacy
                </label>

                <select
                  value={
                    selectedPharmacyId
                  }
                  onChange={(e) =>
                    setSelectedPharmacyId(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Select pharmacy
                  </option>

                  {pharmacies.map(
                    (pharmacy) => (
                      <option
                        key={pharmacy.id}
                        value={pharmacy.id}
                      >
                        {pharmacy.name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <div className="medicine-form-actions">

              <button
                type="button"
                className="cancel-medicine-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-medicine-button"
              >
                {editingId !== null
                  ? "Save Changes"
                  : "Create Medicine"}
              </button>

            </div>

          </form>

        </section>
      )}

      <section className="medicine-content">

        <div className="medicine-content-heading">

          <div>

            <h2>
              Registered Medicines
            </h2>

            <p>
              {allMedicines.length} medicine
              {allMedicines.length !== 1
                ? "s"
                : ""}{" "}
              registered
            </p>

          </div>

          <div className="total-medicine-badge">
            💊 {allMedicines.length}
          </div>

        </div>

        {allMedicines.length === 0 ? (

          <div className="medicine-empty-state">

            <div className="empty-medicine-icon">
              💊
            </div>

            <h3>
              No medicines registered
            </h3>

            <p>
              Medicines added by pharmacists
              will appear here.
            </p>

            <button
              className="empty-add-medicine-button"
              onClick={
                openAddMedicineForm
              }
            >
              + Add First Medicine
            </button>

          </div>

        ) : filteredMedicines.length === 0 ? (

          <div className="medicine-empty-state">

            <div className="empty-medicine-icon">
              🔍
            </div>

            <h3>
              No results found
            </h3>

            <p>
              Try searching with a
              different medicine or
              pharmacy.
            </p>

          </div>

        ) : (

          <div className="medicine-table-wrapper">

            <table className="medicine-table">

              <thead>

                <tr>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Pharmacy</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredMedicines.map(
                  (medicine) => {

                    const medicineStatus =
                      getStatus(
                        medicine.stock
                      );

                    return (
                      <tr
                        key={`${medicine.source}-${medicine.pharmacyId}-${medicine.id}`}
                      >

                        <td>

                          <div className="medicine-name-cell">

                            <div className="medicine-avatar">
                              💊
                            </div>

                            <div>

                              <strong>
                                {medicine.name}
                              </strong>

                              <span>
                                Registered Medicine
                              </span>

                            </div>

                          </div>

                        </td>

                        <td>
                          <span className="category-text">
                            {medicine.category ||
                              "General"}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {medicine.pharmacyName}
                          </strong>
                        </td>

                        <td>
                          <span className="price-text">
                            ₹{medicine.price}
                          </span>
                        </td>

                        <td>
                          <span className="stock-text">
                            {medicine.stock}
                          </span>
                        </td>

                        <td>

                          <span
                            className={
                              medicineStatus ===
                              "Out of Stock"
                                ? "medicine-status-badge medicine-out-stock"
                                : "medicine-status-badge"
                            }
                          >

                            <span className="medicine-status-dot"></span>

                            {medicineStatus}

                          </span>

                        </td>

                        <td>

                          <div className="medicine-action-buttons">

                            <button
                              className="medicine-edit-button"
                              onClick={() =>
                                handleEdit(
                                  medicine
                                )
                              }
                              title="Edit medicine"
                            >
                              ✏️
                            </button>

                            <button
                              className="medicine-delete-button"
                              onClick={() =>
                                handleDelete(
                                  medicine
                                )
                              }
                              title="Delete medicine"
                            >
                              🗑️
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminMedicines;