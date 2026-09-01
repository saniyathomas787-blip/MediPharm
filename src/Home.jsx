import { useState } from "react";

function Home({ setMedicine, openUploadPhoto }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    const medicineName = search.trim();

    if (!medicineName) {
      alert("Please enter a medicine name.");
      return;
    }

    setMedicine(medicineName);
  };

  const findNearbyPharmacies = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const mapsUrl = `https://www.google.com/maps/search/pharmacy/@${latitude},${longitude},15z`;

        window.open(mapsUrl, "_blank");
      },
      () => {
        alert(
          "Please allow location access to find nearby pharmacies."
        );
      }
    );
  };

  return (
    <main className="home">
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>
            Your Medicine, <span>Nearby</span>
          </h1>

          <p>
            Search for medicines and find nearby pharmacies easily.
          </p>

          <div className="home-medicine-search">
            <input
              className="home-medicine-input"
              type="text"
              placeholder="Enter medicine name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button
              className="home-search-button"
              onClick={handleSearch}
            >
              🔍 Search Medicine
            </button>
          </div>

          <div className="action-buttons">
            <button onClick={findNearbyPharmacies}>
              📍 Nearby Pharmacies
            </button>

            <button onClick={openUploadPhoto}>
              📷 Upload Medicine Photo
            </button>
          </div>
        </div>
      </section>

      <section id="pharmacies" className="section">
        <h2>📍 Nearby Pharmacies</h2>

        <p className="section-subtitle">
          Find pharmacies near your current location.
        </p>

        <div className="pharmacy-box">
          <h3>🏪 Find Pharmacies Near You</h3>

          <p>
            Allow location access to find pharmacies near your current
            location.
          </p>

          <button onClick={findNearbyPharmacies}>
            🗺️ Find Nearby Pharmacies
          </button>
        </div>
      </section>

      <section id="about" className="section">
        <h2>About MediPharm</h2>

        <p>
          MediPharm helps users find medicine information and nearby
          pharmacies quickly and easily.
        </p>

        <p>
          Users can search for medicines by name or upload a medicine
          strip or box photo.
        </p>
      </section>
    </main>
  );
}

export default Home;