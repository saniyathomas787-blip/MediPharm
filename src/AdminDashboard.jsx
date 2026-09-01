import "./AdminDashboard.css";

function AdminDashboard({
  goBack,
  openPharmacists,
  openPharmacies,
  openMedicines,
  openReports,
  medicines = [],
  pharmacies = [],
  pharmacists = [],
}) {
  const pharmacyMedicines = pharmacies.flatMap(
    (pharmacy) =>
      (pharmacy.medicines || []).map(
        (medicine) => ({
          ...medicine,
          pharmacyName: pharmacy.name,
        })
      )
  );

  const allMedicines = [
    ...pharmacyMedicines,
    ...medicines,
  ];

  const totalMedicines = allMedicines.length;

  const totalPharmacies = pharmacies.length;

  const totalPharmacists = pharmacists.length;

  const lowStockMedicines = allMedicines.filter(
    (medicine) => {
      const stock = Number(
        medicine.stock || 0
      );

      return stock > 0 && stock <= 10;
    }
  ).length;

  return (
    <main className="admin-dashboard">

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">

          <div className="admin-logo-icon">
            💊
          </div>

          <div>
            <h2>MediPharm</h2>
            <span>Admin Panel</span>
          </div>

        </div>

        <nav className="admin-sidebar-nav">

          <button className="sidebar-item active">
            📊
            <span>Dashboard</span>
          </button>

          <button
            className="sidebar-item"
            onClick={openMedicines}
          >
            💊
            <span>Medicines</span>
          </button>

          <button
            className="sidebar-item"
            onClick={openPharmacies}
          >
            🏪
            <span>Pharmacies</span>
          </button>

          <button
            className="sidebar-item"
            onClick={openPharmacists}
          >
            👨‍⚕️
            <span>Pharmacists</span>
          </button>

          <button
            className="sidebar-item"
            onClick={openReports}
          >
            📈
            <span>Reports</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="sidebar-item logout-item"
            onClick={goBack}
          >
            🚪
            <span>Logout</span>
          </button>

        </div>

      </aside>

      <section className="admin-main">

        <header className="admin-topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Welcome back, Admin 👋
            </p>
          </div>

          <div className="admin-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>Administrator</strong>
              <span>System Admin</span>
            </div>

          </div>

        </header>

        <section className="admin-stats">

          <div className="stat-card">

            <div className="stat-icon medicine-icon">
              💊
            </div>

            <div>
              <span>Total Medicines</span>

              <h2>
                {totalMedicines}
              </h2>

              <small>
                Currently registered
              </small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pharmacy-icon">
              🏪
            </div>

            <div>
              <span>Total Pharmacies</span>

              <h2>
                {totalPharmacies}
              </h2>

              <small>
                Registered pharmacies
              </small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon pharmacist-icon">
              👨‍⚕️
            </div>

            <div>
              <span>Pharmacists</span>

              <h2>
                {totalPharmacists}
              </h2>

              <small>
                Active pharmacists
              </small>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon warning-icon">
              ⚠️
            </div>

            <div>
              <span>Low Stock</span>

              <h2>
                {lowStockMedicines}
              </h2>

              <small>
                Need attention
              </small>
            </div>

          </div>

        </section>

        <section className="admin-section">

          <div className="section-heading">

            <div>
              <h2>
                System Management
              </h2>

              <p>
                Manage MediPharm resources
              </p>
            </div>

          </div>

          <div className="management-grid">

            <div className="management-card">

              <div className="management-card-top">

                <div className="management-icon">
                  💊
                </div>

                <span className="card-arrow">
                  →
                </span>

              </div>

              <h3>
                Medicine Management
              </h3>

              <p>
                Add, update and monitor medicines
                available in the system.
              </p>

              <button onClick={openMedicines}>
                Manage Medicines
              </button>

            </div>

            <div className="management-card">

              <div className="management-card-top">

                <div className="management-icon">
                  🏪
                </div>

                <span className="card-arrow">
                  →
                </span>

              </div>

              <h3>
                Pharmacy Management
              </h3>

              <p>
                Manage pharmacies and their
                registration details.
              </p>

              <button onClick={openPharmacies}>
                Manage Pharmacies
              </button>

            </div>

            <div className="management-card">

              <div className="management-card-top">

                <div className="management-icon">
                  👨‍⚕️
                </div>

                <span className="card-arrow">
                  →
                </span>

              </div>

              <h3>
                Pharmacist Management
              </h3>

              <p>
                Add pharmacists and assign them
                to registered pharmacies.
              </p>

              <button onClick={openPharmacists}>
                Manage Pharmacists
              </button>

            </div>

            <div className="management-card">

              <div className="management-card-top">

                <div className="management-icon">
                  📈
                </div>

                <span className="card-arrow">
                  →
                </span>

              </div>

              <h3>
                Reports & Analytics
              </h3>

              <p>
                Monitor stock, medicines and
                system information.
              </p>

              <button onClick={openReports}>
                View Reports
              </button>

            </div>

          </div>

        </section>

        <section className="admin-section">

          <div className="section-heading">

            <div>
              <h2>
                Inventory Overview
              </h2>

              <p>
                Current medicine stock status
              </p>
            </div>

          </div>

          <div className="activity-box">

            {totalMedicines === 0 ? (

              <>
                <div className="activity-empty-icon">
                  📦
                </div>

                <h3>
                  No inventory data
                </h3>

                <p>
                  Add medicines to see inventory
                  information here.
                </p>
              </>

            ) : (

              <>
                <div className="activity-empty-icon">
                  📦
                </div>

                <h3>
                  {totalMedicines} medicine
                  {totalMedicines !== 1 ? "s" : ""}{" "}
                  in inventory
                </h3>

                <p>
                  {lowStockMedicines > 0
                    ? `${lowStockMedicines} medicine${
                        lowStockMedicines !== 1
                          ? "s"
                          : ""
                      } need stock attention.`
                    : "All medicines have sufficient stock."}
                </p>

                <button
                  onClick={openMedicines}
                  className="manage-inventory-button"
                >
                  Manage Inventory
                </button>
              </>

            )}

          </div>

        </section>

        <section className="admin-section">

          <div className="section-heading">

            <div>
              <h2>
                Recent Activity
              </h2>

              <p>
                Latest system activities
              </p>
            </div>

          </div>

          <div className="activity-box">

            <div className="activity-empty-icon">
              📋
            </div>

            <h3>
              System is ready
            </h3>

            <p>
              Medicine, pharmacy, pharmacist and
              report management are available.
            </p>

          </div>

        </section>

      </section>

    </main>
  );
}

export default AdminDashboard;