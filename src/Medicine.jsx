import "./Medicine.css";

function Medicine({
  medicine,
  goBack,
  medicines = [],
  pharmacies = [],
}) {
  const searchName = String(medicine || "")
    .trim()
    .toLowerCase();

  const availablePharmacies = pharmacies
    .map((pharmacy) => {
      const pharmacyMedicines =
        pharmacy.medicines || [];

      const pharmacyMedicine =
        pharmacyMedicines.find(
          (item) =>
            String(item.name || "")
              .trim()
              .toLowerCase() ===
            searchName
        );

      if (!pharmacyMedicine) {
        return null;
      }

      const stock = Number(
        pharmacyMedicine.stock || 0
      );

      let medicineStatus = "In Stock";

      if (stock === 0) {
        medicineStatus = "Out of Stock";
      } else if (stock <= 10) {
        medicineStatus = "Low Stock";
      }

      return {
        ...pharmacy,
        medicineData:
          pharmacyMedicine,
        price:
          pharmacyMedicine.price,
        stock,
        medicineStatus,
      };
    })
    .filter(Boolean);

  const globalMedicine =
    medicines.find(
      (item) =>
        String(item.name || "")
          .trim()
          .toLowerCase() ===
        searchName
    );

  const pharmacyMatchedMedicine =
    availablePharmacies.length > 0
      ? availablePharmacies[0]
          .medicineData
      : null;

  const matchedMedicine =
    pharmacyMatchedMedicine ||
    globalMedicine ||
    null;

  const validPrices =
    availablePharmacies
      .map((pharmacy) =>
        Number(pharmacy.price)
      )
      .filter(
        (price) =>
          !Number.isNaN(price)
      );

  const startingPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : matchedMedicine
      ? Number(
          matchedMedicine.price || 0
        )
      : 0;

  const displayName =
    matchedMedicine?.name ||
    medicine;

  return (
    <main className="medicine-page">

      <section className="medicine-header">

        <button
          className="medicine-back-button"
          onClick={goBack}
        >
          ← Back
        </button>

        <div className="medicine-heading">

          <div className="medicine-main-icon">
            💊
          </div>

          <div>
            <h1>
              {displayName}
            </h1>

            <p>
              Medicine availability near you
            </p>
          </div>

        </div>

      </section>

      {matchedMedicine ? (

        <section className="medicine-info-card">

          <div className="medicine-info-top">

            <div>

              <span className="medicine-label">
                Medicine
              </span>

              <h2>
                {displayName}
              </h2>

              {matchedMedicine.category && (
                <p>
                  Category:{" "}
                  {
                    matchedMedicine.category
                  }
                </p>
              )}

            </div>

            <div className="medicine-summary-price">
              ₹{startingPrice}
            </div>

          </div>

          <div className="medicine-details">

            <div className="medicine-detail-box">

              <span>
                💰 Starting Price
              </span>

              <strong>
                ₹{startingPrice}
              </strong>

            </div>

            <div className="medicine-detail-box">

              <span>
                🏪 Pharmacies
              </span>

              <strong>
                {
                  availablePharmacies.length
                }
              </strong>

            </div>

            <div className="medicine-detail-box">

              <span>
                📍 Availability
              </span>

              <strong>
                {availablePharmacies.length >
                0
                  ? "Available"
                  : "Not Available"}
              </strong>

            </div>

          </div>

        </section>

      ) : (

        <section className="medicine-not-found">

          <div className="not-found-icon">
            🔍
          </div>

          <h2>
            Medicine not found
          </h2>

          <p>
            No nearby pharmacy has
            "{medicine}" available.
          </p>

          <button onClick={goBack}>
            Search Another Medicine
          </button>

        </section>

      )}

      {matchedMedicine && (

        <section className="medicine-pharmacies">

          <div className="medicine-section-heading">

            <div>

              <h2>
                Nearby Pharmacies
              </h2>

              <p>
                Pharmacies where this
                medicine is available
              </p>

            </div>

          </div>

          {availablePharmacies.length ===
          0 ? (

            <div className="pharmacy-empty">

              <div>
                🏪
              </div>

              <h3>
                Medicine not available nearby
              </h3>

              <p>
                No registered pharmacy
                currently has this medicine.
              </p>

            </div>

          ) : (

            <div className="pharmacy-list">

              {availablePharmacies.map(
                (
                  pharmacy,
                  index
                ) => {
                  const stock =
                    Number(
                      pharmacy.stock ||
                        0
                    );

                  let statusClass =
                    "pharmacy-status-available";

                  if (stock === 0) {
                    statusClass =
                      "pharmacy-status-out";
                  } else if (
                    stock <= 10
                  ) {
                    statusClass =
                      "pharmacy-status-low";
                  }

                  return (
                    <div
                      className="user-pharmacy-card"
                      key={
                        pharmacy.id ||
                        index
                      }
                    >

                      <div className="user-pharmacy-icon">
                        🏪
                      </div>

                      <div className="user-pharmacy-info">

                        <h3>
                          {pharmacy.name ||
                            "Registered Pharmacy"}
                        </h3>

                        <p>
                          📍{" "}
                          {pharmacy.location ||
                            pharmacy.address ||
                            "Location not available"}
                        </p>

                      </div>

                      <div className="pharmacy-medicine-info">

                        <strong>
                          ₹
                          {
                            pharmacy.price
                          }
                        </strong>

                        <span>
                          {stock} available
                        </span>

                      </div>

                      <div
                        className={`user-pharmacy-status ${statusClass}`}
                      >

                        <span className="pharmacy-available-dot"></span>

                        {
                          pharmacy.medicineStatus
                        }

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </section>

      )}

    </main>
  );
}

export default Medicine;