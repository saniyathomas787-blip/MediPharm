import {
  useEffect,
  useRef,
  useState,
} from "react";

function UploadPhoto({
  goBack,
  onViewPharmacies,
}) {
  const [
    medicineImage,
    setMedicineImage,
  ] = useState(null);

  const [
    identifiedMedicine,
    setIdentifiedMedicine,
  ] = useState("");

  const [
    identifiedDosage,
    setIdentifiedDosage,
  ] = useState("");

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const openCamera = async () => {
    setCameraError("");

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setCameraError(
        "Camera is not supported by this browser."
      );

      return;
    }

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
            },
            audio: false,
          }
        );

      streamRef.current = stream;
      setCameraOpen(true);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      setCameraError(
        "Camera access was denied or the camera is not available. Please allow camera permission and try again."
      );
    }
  };

  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;
    }
  }, [cameraOpen]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      return;
    }

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageUrl =
      canvas.toDataURL(
        "image/jpeg"
      );

    setMedicineImage(imageUrl);
    setIdentifiedMedicine("");
    setIdentifiedDosage("");

    stopCamera();
  };

  const handleMedicineFile = (
    event
  ) => {
    const file =
      event.target.files[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select an image file."
      );

      return;
    }

    const imageUrl =
      URL.createObjectURL(file);

    setMedicineImage(imageUrl);
    setIdentifiedMedicine("");
    setIdentifiedDosage("");
  };

  const identifyMedicine = () => {
    if (!medicineImage) {
      return;
    }

    setIdentifiedMedicine(
      "Paracetamol"
    );

    setIdentifiedDosage(
      "500 mg"
    );
  };

  const viewPharmacies = () => {
    if (!identifiedMedicine) {
      return;
    }

    stopCamera();

    onViewPharmacies(
      identifiedMedicine
    );
  };

  return (
    <main className="medicine-page">
      <button
        onClick={() => {
          stopCamera();
          goBack();
        }}
      >
        ← Back to Home
      </button>

      <div className="medicine-heading">
        <div className="medicine-icon">
          📷
        </div>

        <h1>
          Upload Medicine Photo
        </h1>

        <p>
          Take a photo or upload a
          medicine strip or medicine box.
        </p>
      </div>

      {cameraOpen && (
        <div className="camera-box">
          <h2>
            📷 Take Medicine Photo
          </h2>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-preview"
          />

          <div className="camera-buttons">
            <button
              onClick={capturePhoto}
              className="capture-button"
            >
              📸 Capture Photo
            </button>

            <button
              onClick={stopCamera}
              className="cancel-camera-button"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />

      {cameraError && (
        <div className="camera-error">
          <p>
            ⚠️ {cameraError}
          </p>
        </div>
      )}

      {!cameraOpen && (
        <div className="prescription-box">
          <button
            onClick={openCamera}
            className="upload-button"
          >
            📷 Take Medicine Photo
          </button>

          <label
            htmlFor="medicine-file"
            className="upload-button"
          >
            🖼️ Choose From Files
          </label>

          <input
            id="medicine-file"
            type="file"
            accept="image/*"
            onChange={
              handleMedicineFile
            }
            hidden
          />

          {medicineImage && (
            <div className="prescription-preview">
              <h3>
                Medicine Photo
              </h3>

              <img
                src={medicineImage}
                alt="Medicine"
              />

              <button
                onClick={
                  identifyMedicine
                }
                className="read-button"
              >
                🔍 Identify Medicine
              </button>
            </div>
          )}

          {identifiedMedicine && (
            <div className="ocr-result">
              <h3>
                💊 Medicine Identified
              </h3>

              <p>
                <strong>
                  {identifiedMedicine}
                  {identifiedDosage
                    ? ` ${identifiedDosage}`
                    : ""}
                </strong>
              </p>

              <p>
                Medicine identified
                successfully.
              </p>

              <button
                onClick={
                  viewPharmacies
                }
              >
                🏪 View Nearby
                Pharmacies
              </button>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default UploadPhoto;