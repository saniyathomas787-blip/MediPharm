import { useState, useEffect } from "react";
import "./AdminPharmacists.css";

function AdminPharmacists({
  goBack,
  pharmacists,
  setPharmacists,
  pharmacies = [],
}) {
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pharmacy, setPharmacy] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
  });

  // =========================
  // TOAST
  // =========================

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

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {
    setName("");
    setUsername("");
    setPassword("");
    setPharmacy("");
    setEditingId(null);
    setShowForm(false);
  };

  // =========================
  // ADD / UPDATE
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !username.trim() ||
      !password.trim() ||
      !pharmacy.trim()
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingId !== null) {
      setPharmacists((current) =>
        current.map((pharmacist) =>
          pharmacist.id === editingId
            ? {
                ...pharmacist,
                name: name.trim(),
                username: username.trim(),
                password,
                pharmacy: pharmacy.trim(),
              }
            : pharmacist
        )
      );

      showToast(
        "Pharmacist updated successfully!"
      );
    } else {
      const newPharmacist = {
        id: Date.now(),
        name: name.trim(),
        username: username.trim(),
        password,
        pharmacy: pharmacy.trim(),
        status: "Active",
      };

      setPharmacists((current) => [
        ...current,
        newPharmacist,
      ]);

      showToast(
        "Pharmacist added successfully!"
      );
    }

    resetForm();
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (pharmacist) => {
    setEditingId(pharmacist.id);
    setName(pharmacist.name);
    setUsername(pharmacist.username);
    setPassword(pharmacist.password);
    setPharmacy(pharmacist.pharmacy);
    setShowForm(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    setPharmacists((current) =>
      current.filter(
        (pharmacist) => pharmacist.id !== id
      )
    );

    showToast(
      "Pharmacist deleted successfully!"
    );
  };

  // =========================
  // SEARCH
  // =========================

  const filteredPharmacists =
    pharmacists.filter((pharmacist) => {
      const searchText =
        search.toLowerCase();

      return (
        pharmacist.name
          .toLowerCase()
          .includes(searchText) ||
        pharmacist.username
          .toLowerCase()
          .includes(searchText) ||
        pharmacist.pharmacy
          .toLowerCase()
          .includes(searchText)
      );
    });

  return (
    <main className="pharmacist-management-page">

      {/* =========================
          TOAST
      ========================= */}

      {toast.show && (
        <div className="pharmacist-toast">
          ✓ {toast.message}
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <header className="pharmacist-page-header">

        <div>

          <div className="page-title-row">

            <div className="page-title-icon">
              👨‍⚕️
            </div>

            <div>

              <h1>
                Pharmacist Management
              </h1>

              <p>
                Manage MediPharm pharmacist accounts
              </p>

            </div>

          </div>

        </div>

        <button
          className="back-dashboard-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>

      </header>

      {/* =========================
          TOOLBAR
      ========================= */}

      <section className="pharmacist-toolbar">

        <div className="search-box">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search pharmacist or pharmacy..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <button
          className="add-pharmacist-button"
          onClick={() => {
            setEditingId(null);
            setName("");
            setUsername("");
            setPassword("");
            setPharmacy("");
            setShowForm(true);
          }}
        >
          + Add Pharmacist
        </button>

      </section>

      {/* =========================
          FORM
      ========================= */}

      {showForm && (
        <section className="pharmacist-form-card">

          <div className="form-card-header">

            <div>

              <h2>
                {editingId !== null
                  ? "Edit Pharmacist"
                  : "Add New Pharmacist"}
              </h2>

              <p>
                Enter pharmacist account details
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

            <div className="form-grid">

              <div className="form-field">

                <label>
                  Pharmacist Name
                </label>

                <input
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>

              <div className="form-field">

                <label>
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                />

              </div>

              <div className="form-field">

                <label>
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />

              </div>

              <div className="form-field">

                <label>
                  Assigned Pharmacy
                </label>

                <select
                  value={pharmacy}
                  onChange={(e) =>
                    setPharmacy(e.target.value)
                  }
                >

                  <option value="">
                    Select pharmacy
                  </option>

                  {pharmacies.map(
                    (item) => (
                      <option
                        key={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-pharmacist-button"
              >
                {editingId !== null
                  ? "Save Changes"
                  : "Create Pharmacist"}
              </button>

            </div>

          </form>

        </section>
      )}

      {/* =========================
          CONTENT
      ========================= */}

      <section className="pharmacist-content">

        <div className="content-heading">

          <div>

            <h2>
              Registered Pharmacists
            </h2>

            <p>
              {pharmacists.length} pharmacist
              {pharmacists.length !== 1
                ? "s"
                : ""}{" "}
              registered
            </p>

          </div>

          <div className="total-pharmacist-badge">
            👨‍⚕️ {pharmacists.length}
          </div>

        </div>

        {/* =========================
            EMPTY STATE
        ========================= */}

        {pharmacists.length === 0 ? (

          <div className="pharmacist-empty-state">

            <div className="empty-pharmacist-icon">
              👨‍⚕️
            </div>

            <h3>
              No pharmacists registered
            </h3>

            <p>
              Add your first pharmacist to start
              managing pharmacy staff.
            </p>

            <button
              className="empty-add-button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setUsername("");
                setPassword("");
                setPharmacy("");
                setShowForm(true);
              }}
            >
              + Add First Pharmacist
            </button>

          </div>

        ) : filteredPharmacists.length === 0 ? (

          <div className="pharmacist-empty-state">

            <div className="empty-pharmacist-icon">
              🔍
            </div>

            <h3>
              No results found
            </h3>

            <p>
              Try searching with a different
              name or pharmacy.
            </p>

          </div>

        ) : (

          <div className="pharmacist-table-wrapper">

            <table className="pharmacist-table">

              <thead>

                <tr>
                  <th>Pharmacist</th>
                  <th>Username</th>
                  <th>Assigned Pharmacy</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredPharmacists.map(
                  (pharmacist) => (

                    <tr key={pharmacist.id}>

                      <td>

                        <div className="pharmacist-name-cell">

                          <div className="pharmacist-avatar">
                            {pharmacist.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>

                            <strong>
                              {pharmacist.name}
                            </strong>

                            <span>
                              Pharmacist
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>

                        <span className="username-text">
                          @{pharmacist.username}
                        </span>

                      </td>

                      <td>

                        <div className="pharmacy-cell">

                          <span className="pharmacy-small-icon">
                            🏪
                          </span>

                          {pharmacist.pharmacy}

                        </div>

                      </td>

                      <td>

                        <span className="status-badge">

                          <span className="status-dot"></span>

                          Active

                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEdit(
                                pharmacist
                              )
                            }
                            title="Edit pharmacist"
                          >
                            ✏️
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                pharmacist.id
                              )
                            }
                            title="Delete pharmacist"
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}

export default AdminPharmacists;