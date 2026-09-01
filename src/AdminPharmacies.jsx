import { useState } from "react";
import "./AdminPharmacies.css";

function AdminPharmacies({
  goBack,
  pharmacies = [],
  setPharmacies,
  medicines = [],
  setMedicines,
}) {
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    status: "Open",
  });

  const [showMedicineForm, setShowMedicineForm] =
    useState(null);

  const [medicineData, setMedicineData] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // =========================
  // SEARCH
  // =========================

  const filteredPharmacies = pharmacies.filter(
    (pharmacy) =>
      String(pharmacy.name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      String(pharmacy.location || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  // =========================
  // OPEN ADD PHARMACY FORM
  // =========================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      location: "",
      phone: "",
      email: "",
      status: "Open",
    });

    setShowForm(true);
  };

  // =========================
  // OPEN EDIT PHARMACY FORM
  // =========================

  const openEditForm = (pharmacy) => {
    setEditingId(pharmacy.id);

    setFormData({
      name: pharmacy.name || "",
      location: pharmacy.location || "",
      phone: pharmacy.phone || "",
      email: pharmacy.email || "",
      status: pharmacy.status || "Open",
    });

    setShowForm(true);
  };

  // =========================
  // PHARMACY FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // SAVE PHARMACY
  // =========================

  const savePharmacy = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please enter pharmacy name.");
      return;
    }

    if (!formData.location.trim()) {
      alert("Please enter pharmacy location.");
      return;
    }

    if (editingId !== null) {
      const updated = pharmacies.map(
        (pharmacy) =>
          pharmacy.id === editingId
            ? {
                ...pharmacy,
                ...formData,
                name: formData.name.trim(),
                location: formData.location.trim(),
                medicines:
                  pharmacy.medicines || [],
              }
            : pharmacy
      );

      setPharmacies(updated);
    } else {
      const newPharmacy = {
        id: Date.now(),
        ...formData,
        name: formData.name.trim(),
        location: formData.location.trim(),
        medicines: [],
      };

      setPharmacies([
        ...pharmacies,
        newPharmacy,
      ]);
    }

    setShowForm(false);
    setEditingId(null);

    setFormData({
      name: "",
      location: "",
      phone: "",
      email: "",
      status: "Open",
    });
  };

  // =========================
  // DELETE PHARMACY
  // =========================

  const deletePharmacy = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pharmacy?"
    );

    if (!confirmed) return;

    setPharmacies(
      pharmacies.filter(
        (pharmacy) => pharmacy.id !== id
      )
    );
  };

  // =========================
  // OPEN MEDICINE FORM
  // =========================

  const openMedicineForm = (pharmacyId) => {
    setShowMedicineForm(pharmacyId);

    setMedicineData({
      name: "",
      price: "",
      stock: "",
    });
  };

  // =========================
  // MEDICINE INPUT
  // =========================

  const handleMedicineChange = (e) => {
    const { name, value } = e.target;

    setMedicineData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // ADD MEDICINE
  // =========================

  const savePharmacyMedicine = (pharmacyId) => {
    if (!medicineData.name.trim()) {
      alert("Please enter medicine name.");
      return;
    }

    if (
      medicineData.price === "" ||
      medicineData.stock === ""
    ) {
      alert("Please enter price and stock.");
      return;
    }

    const medicineName =
      medicineData.name.trim();

    const medicinePrice =
      Number(medicineData.price);

    const medicineStock =
      Number(medicineData.stock);

    if (
      isNaN(medicinePrice) ||
      isNaN(medicineStock)
    ) {
      alert(
        "Please enter valid price and stock."
      );
      return;
    }

    if (
      medicinePrice < 0 ||
      medicineStock < 0
    ) {
      alert(
        "Price and stock cannot be negative."
      );
      return;
    }

    // =========================
    // NEW PHARMACY MEDICINE
    // =========================

    const newPharmacyMedicine = {
      id: Date.now(),
      name: medicineName,
      price: medicinePrice,
      stock: medicineStock,
    };

    // =========================
    // UPDATE PHARMACY DATA
    // =========================

    const updatedPharmacies =
      pharmacies.map((pharmacy) => {
        if (pharmacy.id !== pharmacyId) {
          return pharmacy;
        }

        return {
          ...pharmacy,
          medicines: [
            ...(pharmacy.medicines || []),
            newPharmacyMedicine,
          ],
        };
      });

    setPharmacies(updatedPharmacies);

    // =========================
    // UPDATE ADMIN MEDICINES
    // =========================

    if (setMedicines) {
      const existingMedicine =
        medicines.find(
          (medicine) =>
            String(medicine.name || "")
              .toLowerCase() ===
            medicineName.toLowerCase()
        );

      if (existingMedicine) {
        // =========================
        // UPDATE EXISTING MEDICINE
        // =========================

        const updatedMedicines =
          medicines.map((medicine) =>
            medicine.id ===
            existingMedicine.id
              ? {
                  ...medicine,
                  price: medicinePrice,
                  stock: medicineStock,
                  status:
                    medicineStock > 0
                      ? "In Stock"
                      : "Out of Stock",
                }
              : medicine
          );

        setMedicines(updatedMedicines);
      } else {
        // =========================
        // ADD NEW ADMIN MEDICINE
        // =========================

        const newAdminMedicine = {
          id: Date.now() + 1,
          name: medicineName,
          category: "General",
          price: medicinePrice,
          stock: medicineStock,
          status:
            medicineStock > 0
              ? "In Stock"
              : "Out of Stock",
        };

        setMedicines([
          ...medicines,
          newAdminMedicine,
        ]);
      }
    }

    // =========================
    // CLOSE FORM
    // =========================

    setShowMedicineForm(null);

    setMedicineData({
      name: "",
      price: "",
      stock: "",
    });
  };

  // =========================
  // UPDATE MEDICINE
  // =========================

  const editMedicine = (
    pharmacyId,
    medicine
  ) => {
    const newPrice = window.prompt(
      "Enter new price:",
      medicine.price
    );

    if (
      newPrice === null ||
      newPrice === ""
    ) {
      return;
    }

    const newStock = window.prompt(
      "Enter new stock:",
      medicine.stock
    );

    if (
      newStock === null ||
      newStock === ""
    ) {
      return;
    }

    const priceNumber = Number(newPrice);
    const stockNumber = Number(newStock);

    if (
      isNaN(priceNumber) ||
      isNaN(stockNumber)
    ) {
      alert(
        "Please enter valid price and stock."
      );
      return;
    }

    if (
      priceNumber < 0 ||
      stockNumber < 0
    ) {
      alert(
        "Price and stock cannot be negative."
      );
      return;
    }

    // =========================
    // UPDATE PHARMACY MEDICINE
    // =========================

    const updatedPharmacies =
      pharmacies.map((pharmacy) => {
        if (pharmacy.id !== pharmacyId) {
          return pharmacy;
        }

        return {
          ...pharmacy,

          medicines: (
            pharmacy.medicines || []
          ).map((item) =>
            item.id === medicine.id
              ? {
                  ...item,
                  price: priceNumber,
                  stock: stockNumber,
                }
              : item
          ),
        };
      });

    setPharmacies(updatedPharmacies);

    // =========================
    // UPDATE ADMIN MEDICINE TOO
    // =========================

    if (setMedicines) {
      const updatedMedicines =
        medicines.map((item) =>
          String(item.name || "")
            .toLowerCase() ===
          String(medicine.name || "")
            .toLowerCase()
            ? {
                ...item,
                price: priceNumber,
                stock: stockNumber,
                status:
                  stockNumber > 0
                    ? "In Stock"
                    : "Out of Stock",
              }
            : item
        );

      setMedicines(updatedMedicines);
    }
  };

  // =========================
  // DELETE MEDICINE
  // =========================

  const deleteMedicine = (
    pharmacyId,
    medicineId
  ) => {
    const confirmed = window.confirm(
      "Delete this medicine from this pharmacy?"
    );

    if (!confirmed) return;

    const pharmacy =
      pharmacies.find(
        (item) =>
          item.id === pharmacyId
      );

    const medicineToDelete =
      pharmacy?.medicines?.find(
        (item) =>
          item.id === medicineId
      );

    // =========================
    // DELETE FROM PHARMACY
    // =========================

    const updatedPharmacies =
      pharmacies.map((pharmacyItem) => {
        if (
          pharmacyItem.id !==
          pharmacyId
        ) {
          return pharmacyItem;
        }

        return {
          ...pharmacyItem,

          medicines: (
            pharmacyItem.medicines || []
          ).filter(
            (medicine) =>
              medicine.id !== medicineId
          ),
        };
      });

    setPharmacies(updatedPharmacies);

    // =========================
    // DELETE FROM ADMIN MEDICINES
    // =========================

    if (
      setMedicines &&
      medicineToDelete
    ) {
      const stillExistsInAnotherPharmacy =
        pharmacies.some(
          (pharmacyItem) =>
            pharmacyItem.id !==
              pharmacyId &&
            (pharmacyItem.medicines || []).some(
              (item) =>
                String(
                  item.name || ""
                ).toLowerCase() ===
                String(
                  medicineToDelete.name ||
                    ""
                ).toLowerCase()
            )
        );

      if (
        !stillExistsInAnotherPharmacy
      ) {
        setMedicines(
          medicines.filter(
            (item) =>
              String(
                item.name || ""
              ).toLowerCase() !==
              String(
                medicineToDelete.name ||
                  ""
              ).toLowerCase()
          )
        );
      }
    }
  };

  // =========================
  // MEDICINE STATUS
  // =========================

  const getMedicineStatus = (stock) => {
    const value = Number(stock || 0);

    if (value === 0) {
      return {
        text: "Out of Stock",
        className: "status-out",
      };
    }

    if (value <= 10) {
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
    <main className="pharmacy-management">

      {/* =========================
          HEADER
      ========================= */}

      <div className="pharmacy-toolbar">

        <div>
          <h1>
            Pharmacy Management
          </h1>

          <p>
            Add, edit and manage MediPharm
            pharmacies
          </p>
        </div>

        <button
          className="add-pharmacy-button"
          onClick={openAddForm}
        >
          + Add Pharmacy
        </button>

      </div>

      {/* =========================
          SEARCH + BACK
      ========================= */}

      <div className="pharmacy-tools">

        <input
          type="text"
          placeholder="Search pharmacy..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="pharmacy-search"
        />

        <button
          className="pharmacy-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>

      </div>

      {/* =========================
          ADD / EDIT PHARMACY FORM
      ========================= */}

      {showForm && (
        <form
          className="pharmacy-form"
          onSubmit={savePharmacy}
        >

          <h2>
            {editingId !== null
              ? "Edit Pharmacy"
              : "Add New Pharmacy"}
          </h2>

          <div className="pharmacy-form-grid">

            <input
              type="text"
              name="name"
              placeholder="Pharmacy Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Open">
                Open
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

          </div>

          <div className="pharmacy-form-actions">

            <button
              type="submit"
              className="save-pharmacy-button"
            >
              {editingId !== null
                ? "Update Pharmacy"
                : "Save Pharmacy"}
            </button>

            <button
              type="button"
              className="cancel-pharmacy-button"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

          </div>

        </form>
      )}

      {/* =========================
          PHARMACY TABLE
      ========================= */}

      <div className="pharmacy-table-card">

        {filteredPharmacies.length === 0 ? (

          <div className="pharmacy-empty">

            <div>🏪</div>

            <h2>
              No pharmacies found
            </h2>

            <p>
              Add a pharmacy to start
              managing availability.
            </p>

          </div>

        ) : (

          <div className="pharmacy-table-wrapper">

            <table className="pharmacy-table">

              <thead>

                <tr>
                  <th>Pharmacy</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Medicines</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredPharmacies.map(
                  (pharmacy) => {

                    const pharmacyMedicines =
                      pharmacy.medicines ||
                      [];

                    return (
                      <tr
                        key={pharmacy.id}
                      >

                        <td>

                          <div className="pharmacy-name-cell">

                            <div className="pharmacy-table-icon">
                              🏪
                            </div>

                            <strong>
                              {pharmacy.name}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {pharmacy.location}
                        </td>

                        <td>
                          {pharmacy.phone ||
                            "—"}
                        </td>

                        <td>

                          <span
                            className={
                              pharmacy.status ===
                              "Closed"
                                ? "pharmacy-status closed"
                                : "pharmacy-status open"
                            }
                          >
                            {pharmacy.status ||
                              "Open"}
                          </span>

                        </td>

                        <td>

                          <span className="medicine-count">
                            {
                              pharmacyMedicines.length
                            }
                          </span>

                        </td>

                        <td>

                          <button
                            className="edit-button"
                            onClick={() =>
                              openEditForm(
                                pharmacy
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deletePharmacy(
                                pharmacy.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =========================
          PHARMACY MEDICINE MANAGEMENT
      ========================= */}

      {filteredPharmacies.map(
        (pharmacy) => {

          const pharmacyMedicines =
            pharmacy.medicines || [];

          return (
            <section
              className="pharmacy-medicine-section"
              key={`medicine-${pharmacy.id}`}
            >

              <div className="pharmacy-medicine-header">

                <div>

                  <h2>
                    💊 {pharmacy.name}
                  </h2>

                  <p>
                    Manage medicine price,
                    stock and availability
                  </p>

                </div>

                <button
                  className="add-medicine-button"
                  onClick={() =>
                    openMedicineForm(
                      pharmacy.id
                    )
                  }
                >
                  + Add Medicine
                </button>

              </div>

              {/* =========================
                  MEDICINE FORM
              ========================= */}

              {showMedicineForm ===
                pharmacy.id && (
                <div className="medicine-form">

                  <input
                    type="text"
                    name="name"
                    placeholder="Medicine name"
                    value={medicineData.name}
                    onChange={
                      handleMedicineChange
                    }
                  />

                  <input
                    type="number"
                    name="price"
                    placeholder="Price ₹"
                    min="0"
                    value={medicineData.price}
                    onChange={
                      handleMedicineChange
                    }
                  />

                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    min="0"
                    value={medicineData.stock}
                    onChange={
                      handleMedicineChange
                    }
                  />

                  <button
                    className="save-medicine-button"
                    onClick={() =>
                      savePharmacyMedicine(
                        pharmacy.id
                      )
                    }
                  >
                    Save
                  </button>

                  <button
                    className="cancel-medicine-button"
                    onClick={() =>
                      setShowMedicineForm(
                        null
                      )
                    }
                  >
                    Cancel
                  </button>

                </div>
              )}

              {/* =========================
                  MEDICINE TABLE
              ========================= */}

              {pharmacyMedicines.length ===
              0 ? (

                <div className="no-pharmacy-medicines">

                  <span>💊</span>

                  <p>
                    No medicines added to
                    this pharmacy yet.
                  </p>

                </div>

              ) : (

                <div className="medicine-table-wrapper">

                  <table className="pharmacy-medicine-table">

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

                      {pharmacyMedicines.map(
                        (medicine) => {

                          const status =
                            getMedicineStatus(
                              medicine.stock
                            );

                          return (
                            <tr
                              key={
                                medicine.id
                              }
                            >

                              <td>
                                <strong>
                                  {medicine.name}
                                </strong>
                              </td>

                              <td>
                                ₹{medicine.price}
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

                                <button
                                  className="edit-medicine-button"
                                  onClick={() =>
                                    editMedicine(
                                      pharmacy.id,
                                      medicine
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="delete-medicine-button"
                                  onClick={() =>
                                    deleteMedicine(
                                      pharmacy.id,
                                      medicine.id
                                    )
                                  }
                                >
                                  Delete
                                </button>

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
          );
        }
      )}

    </main>
  );
}

export default AdminPharmacies;