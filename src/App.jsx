import { useState } from "react";
import "./App.css";

import Home from "./Home";
import Medicine from "./Medicine.jsx";
import UploadPhoto from "./UploadPhoto.jsx";

import AdminLogin from "./AdminLogin.jsx";
import PharmacistLogin from "./PharmacistLogin.jsx";

import AdminDashboard from "./AdminDashboard.jsx";
import AdminPharmacists from "./AdminPharmacists.jsx";
import AdminPharmacies from "./AdminPharmacies.jsx";
import AdminMedicines from "./AdminMedicines.jsx";
import AdminReports from "./AdminReports.jsx";

import PharmacistDashboard from "./PharmacistDashboard.jsx";

import logo from "./assets/MediPharm-logo.png";

function App() {
  const [medicine, setMedicine] = useState("");

  const [showUploadPhoto, setShowUploadPhoto] =
    useState(false);

  const [showAdminLogin, setShowAdminLogin] =
    useState(false);

  const [adminLoggedIn, setAdminLoggedIn] =
    useState(false);

  const [
    showPharmacistLogin,
    setShowPharmacistLogin,
  ] = useState(false);

  const [
    pharmacistLoggedIn,
    setPharmacistLoggedIn,
  ] = useState(false);

  const [
    loggedInPharmacist,
    setLoggedInPharmacist,
  ] = useState(null);

  const [
    showAdminPharmacists,
    setShowAdminPharmacists,
  ] = useState(false);

  const [
    showAdminPharmacies,
    setShowAdminPharmacies,
  ] = useState(false);

  const [
    showAdminMedicines,
    setShowAdminMedicines,
  ] = useState(false);

  const [
    showAdminReports,
    setShowAdminReports,
  ] = useState(false);

  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "medipharm_medicines"
      );

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });

  const [pharmacies, setPharmacies] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "medipharm_pharmacies"
        );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const [pharmacists, setPharmacists] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          "medipharm_pharmacists"
        );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch {
        return [];
      }
    });

  const updateMedicines = (value) => {
    setMedicines((current) => {
      const updated =
        typeof value === "function"
          ? value(current)
          : value;

      localStorage.setItem(
        "medipharm_medicines",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const updatePharmacies = (value) => {
    setPharmacies((current) => {
      const updated =
        typeof value === "function"
          ? value(current)
          : value;

      localStorage.setItem(
        "medipharm_pharmacies",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const updatePharmacists = (value) => {
    setPharmacists((current) => {
      const updated =
        typeof value === "function"
          ? value(current)
          : value;

      localStorage.setItem(
        "medipharm_pharmacists",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  const assignedPharmacy =
    loggedInPharmacist
      ? pharmacies.find(
          (pharmacy) =>
            String(pharmacy.name || "")
              .trim()
              .toLowerCase() ===
            String(
              loggedInPharmacist.pharmacy || ""
            )
              .trim()
              .toLowerCase()
        )
      : null;

  const goBackHome = () => {
    setMedicine("");
    setShowUploadPhoto(false);
    setShowAdminLogin(false);
    setShowPharmacistLogin(false);
    setShowAdminPharmacists(false);
    setShowAdminPharmacies(false);
    setShowAdminMedicines(false);
    setShowAdminReports(false);

    setAdminLoggedIn(false);

    setPharmacistLoggedIn(false);
    setLoggedInPharmacist(null);
  };

  const openUploadPhoto = () => {
    setMedicine("");
    setShowUploadPhoto(true);
    setShowAdminLogin(false);
    setShowPharmacistLogin(false);
  };

  const handlePhotoMedicineSearch = (
    medicineName
  ) => {
    const cleanName = String(
      medicineName || ""
    ).trim();

    if (!cleanName) {
      return;
    }

    setShowUploadPhoto(false);
    setMedicine(cleanName);
  };

  const openAdminLogin = () => {
    setShowAdminLogin(true);
    setShowUploadPhoto(false);
    setShowPharmacistLogin(false);
    setMedicine("");
  };

  const handleAdminLogin = () => {
    setAdminLoggedIn(true);
    setShowAdminLogin(false);
  };

  const openPharmacistLogin = () => {
    setShowPharmacistLogin(true);
    setShowAdminLogin(false);
    setShowUploadPhoto(false);
    setMedicine("");
    setAdminLoggedIn(false);
  };

  const handlePharmacistLogin = (
    pharmacist
  ) => {
    setLoggedInPharmacist(pharmacist);
    setPharmacistLoggedIn(true);
    setShowPharmacistLogin(false);
  };

  const openAdminPharmacists = () => {
    setShowAdminPharmacists(true);
    setShowAdminPharmacies(false);
    setShowAdminMedicines(false);
    setShowAdminReports(false);
  };

  const openAdminPharmacies = () => {
    setShowAdminPharmacies(true);
    setShowAdminPharmacists(false);
    setShowAdminMedicines(false);
    setShowAdminReports(false);
  };

  const openAdminMedicines = () => {
    setShowAdminMedicines(true);
    setShowAdminPharmacists(false);
    setShowAdminPharmacies(false);
    setShowAdminReports(false);
  };

  const openAdminReports = () => {
    setShowAdminReports(true);
    setShowAdminPharmacists(false);
    setShowAdminPharmacies(false);
    setShowAdminMedicines(false);
  };

  const backToAdminDashboard = () => {
    setShowAdminPharmacists(false);
    setShowAdminPharmacies(false);
    setShowAdminMedicines(false);
    setShowAdminReports(false);
  };

  const pharmacistLogout = () => {
    setPharmacistLoggedIn(false);
    setLoggedInPharmacist(null);
    setShowPharmacistLogin(true);
  };

  const adminLogout = () => {
    setAdminLoggedIn(false);
    setShowAdminLogin(false);
    setShowAdminPharmacists(false);
    setShowAdminPharmacies(false);
    setShowAdminMedicines(false);
    setShowAdminReports(false);
  };

  return (
    <div className="app">
      <header className="navbar">
        <div
          className="brand"
          onClick={goBackHome}
        >
          <img
            src={logo}
            alt="MediPharm"
            className="brand-logo"
          />
        </div>

        <nav>
          <a
            href="#home"
            onClick={goBackHome}
          >
            Home
          </a>

          <a href="#medicines">
            Medicines
          </a>

          <a href="#pharmacies">
            Nearby Pharmacies
          </a>

          <a href="#about">
            About
          </a>

          <button
            className="admin-nav-button"
            onClick={openAdminLogin}
          >
            🔐 Admin
          </button>

          <button
            className="admin-nav-button"
            onClick={openPharmacistLogin}
          >
            👨‍⚕️ Pharmacist
          </button>
        </nav>
      </header>

      {pharmacistLoggedIn &&
      loggedInPharmacist ? (
        <PharmacistDashboard
          pharmacist={loggedInPharmacist}
          pharmacy={assignedPharmacy}
          pharmacies={pharmacies}
          setPharmacies={updatePharmacies}
          medicines={medicines}
          setMedicines={updateMedicines}
          onLogout={pharmacistLogout}
          goBack={pharmacistLogout}
        />
      ) : adminLoggedIn &&
        showAdminMedicines ? (
        <AdminMedicines
          goBack={backToAdminDashboard}
          medicines={medicines}
          setMedicines={updateMedicines}
          pharmacies={pharmacies}
          setPharmacies={updatePharmacies}
        />
      ) : adminLoggedIn &&
        showAdminPharmacies ? (
        <AdminPharmacies
          goBack={backToAdminDashboard}
          pharmacies={pharmacies}
          setPharmacies={updatePharmacies}
        />
      ) : adminLoggedIn &&
        showAdminPharmacists ? (
        <AdminPharmacists
          goBack={backToAdminDashboard}
          pharmacists={pharmacists}
          setPharmacists={updatePharmacists}
          pharmacies={pharmacies}
        />
      ) : adminLoggedIn &&
        showAdminReports ? (
        <AdminReports
          goBack={backToAdminDashboard}
          medicines={medicines}
          pharmacies={pharmacies}
          pharmacists={pharmacists}
        />
      ) : adminLoggedIn ? (
        <AdminDashboard
          goBack={adminLogout}
          openPharmacists={
            openAdminPharmacists
          }
          openPharmacies={
            openAdminPharmacies
          }
          openMedicines={
            openAdminMedicines
          }
          openReports={
            openAdminReports
          }
          medicines={medicines}
          pharmacies={pharmacies}
          pharmacists={pharmacists}
        />
      ) : showPharmacistLogin ? (
        <PharmacistLogin
          onLogin={handlePharmacistLogin}
          goBack={goBackHome}
          pharmacists={pharmacists}
        />
      ) : showAdminLogin ? (
        <AdminLogin
          onLogin={handleAdminLogin}
          goBack={goBackHome}
        />
      ) : showUploadPhoto ? (
        <UploadPhoto
          goBack={goBackHome}
          onViewPharmacies={
            handlePhotoMedicineSearch
          }
        />
      ) : medicine !== "" ? (
        <Medicine
          medicine={medicine}
          goBack={goBackHome}
          medicines={medicines}
          pharmacies={pharmacies}
        />
      ) : (
        <Home
          setMedicine={setMedicine}
          openUploadPhoto={
            openUploadPhoto
          }
        />
      )}

      <footer>
        © 2026 MediPharm — Your Medicine Nearby
      </footer>
    </div>
  );
}

export default App;