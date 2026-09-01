import "./AdminReports.css";

function AdminReports({
  goBack,
  medicines = [],
  pharmacies = [],
  pharmacists = [],
}) {
  // =========================
  // PHARMACY MEDICINES
  // =========================

  const pharmacyMedicines =
    pharmacies.flatMap((pharmacy) =>
      (pharmacy.medicines || []).map(
        (medicine) => ({
          ...medicine,
          pharmacyId: pharmacy.id,
          pharmacyName: pharmacy.name,
          source: "pharmacy",
        })
      )
    );

  // =========================
  // OLD ADMIN MEDICINES
  // =========================

  const oldAdminMedicines =
    medicines.map((medicine) => ({
      ...medicine,
      pharmacyId: null,
      pharmacyName: "Unassigned",
      source: "admin",
    }));

  // =========================
  // ALL MEDICINES
  // =========================

  const allMedicines = [
    ...pharmacyMedicines,
    ...oldAdminMedicines,
  ];

  const totalMedicines =
    allMedicines.length;

  const totalPharmacies =
    pharmacies.length;

  const totalPharmacists =
    pharmacists.length;

  // =========================
  // STOCK COUNTS
  // =========================

  const inStock =
    allMedicines.filter(
      (medicine) =>
        Number(medicine.stock || 0) > 10
    ).length;

  const lowStock =
    allMedicines.filter(
      (medicine) => {
        const stock =
          Number(
            medicine.stock || 0
          );

        return (
          stock > 0 &&
          stock <= 10
        );
      }
    ).length;

  const outOfStock =
    allMedicines.filter(
      (medicine) =>
        Number(
          medicine.stock || 0
        ) === 0
    ).length;

  const totalStock =
    allMedicines.reduce(
      (total, medicine) =>
        total +
        Number(
          medicine.stock || 0
        ),
      0
    );

  return (
    <main className="reports-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="reports-header">

        <div className="reports-title">

          <div className="reports-icon">
            📈
          </div>

          <div>
            <h1>
              Reports & Analytics
            </h1>

            <p>
              Monitor MediPharm system
              performance and inventory
            </p>
          </div>

        </div>

        <button
          className="reports-back-button"
          onClick={goBack}
        >
          ← Dashboard
        </button>

      </header>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="reports-summary">

        <div className="report-card">

          <div className="report-card-icon">
            💊
          </div>

          <div>
            <span>
              Total Medicines
            </span>

            <h2>
              {totalMedicines}
            </h2>
          </div>

        </div>

        <div className="report-card">

          <div className="report-card-icon">
            🏪
          </div>

          <div>
            <span>
              Total Pharmacies
            </span>

            <h2>
              {totalPharmacies}
            </h2>
          </div>

        </div>

        <div className="report-card">

          <div className="report-card-icon">
            👨‍⚕️
          </div>

          <div>
            <span>
              Pharmacists
            </span>

            <h2>
              {totalPharmacists}
            </h2>
          </div>

        </div>

        <div className="report-card">

          <div className="report-card-icon">
            📦
          </div>

          <div>
            <span>
              Total Stock
            </span>

            <h2>
              {totalStock}
            </h2>
          </div>

        </div>

      </section>

      {/* =========================
          INVENTORY STATUS
      ========================= */}

      <section className="reports-section">

        <div className="reports-section-heading">

          <div>

            <h2>
              Inventory Report
            </h2>

            <p>
              Current medicine availability
            </p>

          </div>

        </div>

        <div className="inventory-report">

          <div className="inventory-item">

            <div className="inventory-label">

              <span className="inventory-dot in-stock-dot"></span>

              In Stock

            </div>

            <strong>
              {inStock}
            </strong>

          </div>

          <div className="inventory-item">

            <div className="inventory-label">

              <span className="inventory-dot low-stock-dot"></span>

              Low Stock

            </div>

            <strong>
              {lowStock}
            </strong>

          </div>

          <div className="inventory-item">

            <div className="inventory-label">

              <span className="inventory-dot out-stock-dot"></span>

              Out of Stock

            </div>

            <strong>
              {outOfStock}
            </strong>

          </div>

        </div>

      </section>

      {/* =========================
          MEDICINE STOCK TABLE
      ========================= */}

      <section className="reports-section">

        <div className="reports-section-heading">

          <div>

            <h2>
              Medicine Stock Details
            </h2>

            <p>
              Detailed inventory status
              of registered medicines
            </p>

          </div>

        </div>

        {allMedicines.length ===
        0 ? (

          <div className="reports-empty-table">

            <div className="reports-empty-icon">
              💊
            </div>

            <h3>
              No medicines available
            </h3>

            <p>
              Medicines added by
              pharmacists will appear
              here.
            </p>

          </div>

        ) : (

          <div className="reports-table-wrapper">

            <table className="reports-table">

              <thead>

                <tr>
                  <th>
                    Medicine
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Pharmacy
                  </th>

                  <th>
                    Price
                  </th>

                  <th>
                    Stock
                  </th>

                  <th>
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {allMedicines.map(
                  (medicine) => {

                    const medicineStock =
                      Number(
                        medicine.stock ||
                          0
                      );

                    let status =
                      "In Stock";

                    let statusClass =
                      "report-in-stock";

                    if (
                      medicineStock ===
                      0
                    ) {
                      status =
                        "Out of Stock";

                      statusClass =
                        "report-out-stock";
                    } else if (
                      medicineStock <=
                      10
                    ) {
                      status =
                        "Low Stock";

                      statusClass =
                        "report-low-stock";
                    }

                    return (
                      <tr
                        key={`${medicine.source}-${medicine.pharmacyId}-${medicine.id}`}
                      >

                        <td>

                          <div className="report-medicine-name">

                            <div className="report-medicine-icon">
                              💊
                            </div>

                            <strong>
                              {
                                medicine.name
                              }
                            </strong>

                          </div>

                        </td>

                        <td>
                          {medicine.category ||
                            "General"}
                        </td>

                        <td>
                          <strong>
                            {
                              medicine.pharmacyName
                            }
                          </strong>
                        </td>

                        <td>
                          ₹
                          {
                            medicine.price
                          }
                        </td>

                        <td>
                          <strong>
                            {
                              medicineStock
                            }
                          </strong>
                        </td>

                        <td>

                          <span
                            className={`report-status ${statusClass}`}
                          >

                            <span className="report-status-dot"></span>

                            {status}

                          </span>

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

      {/* =========================
          STOCK CHART
      ========================= */}

      <section className="reports-section">

        <div className="reports-section-heading">

          <div>

            <h2>
              Stock Status
            </h2>

            <p>
              Quick visual overview
              of inventory
            </p>

          </div>

        </div>

        {totalMedicines ===
        0 ? (

          <div className="stock-status-box">

            <div className="reports-empty-icon">
              📊
            </div>

            <h3>
              No inventory data
              available
            </h3>

          </div>

        ) : (

          <div className="stock-status-box">

            <div className="reports-chart">

              <div
                className="chart-bar in-stock-bar"
                style={{
                  height: `${Math.max(
                    inStock * 35,
                    25
                  )}px`,
                }}
              >
                <span>
                  {inStock}
                </span>
              </div>

              <div
                className="chart-bar low-stock-bar"
                style={{
                  height: `${Math.max(
                    lowStock * 35,
                    25
                  )}px`,
                }}
              >
                <span>
                  {lowStock}
                </span>
              </div>

              <div
                className="chart-bar out-stock-bar"
                style={{
                  height: `${Math.max(
                    outOfStock *
                      35,
                    25
                  )}px`,
                }}
              >
                <span>
                  {outOfStock}
                </span>
              </div>

            </div>

            <div className="chart-labels">

              <span>
                In Stock
              </span>

              <span>
                Low Stock
              </span>

              <span>
                Out of Stock
              </span>

            </div>

          </div>

        )}

      </section>

      {/* =========================
          SYSTEM SUMMARY
      ========================= */}

      <section className="reports-section">

        <div className="reports-section-heading">

          <div>

            <h2>
              System Summary
            </h2>

            <p>
              Current MediPharm
              resources
            </p>

          </div>

        </div>

        <div className="system-summary-grid">

          <div className="summary-box">

            <span>
              💊
            </span>

            <div>

              <strong>
                {
                  totalMedicines
                }
              </strong>

              <small>
                Medicines registered
              </small>

            </div>

          </div>

          <div className="summary-box">

            <span>
              🏪
            </span>

            <div>

              <strong>
                {
                  totalPharmacies
                }
              </strong>

              <small>
                Pharmacies registered
              </small>

            </div>

          </div>

          <div className="summary-box">

            <span>
              👨‍⚕️
            </span>

            <div>

              <strong>
                {
                  totalPharmacists
                }
              </strong>

              <small>
                Pharmacists registered
              </small>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default AdminReports;