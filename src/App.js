import React, { useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const RECOGNIZE_DOMAIN = process.env.RECOGNIZE_DOMAIN || 'http://localhost:5000';

function App() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState("");
    const [recognizedText, setRecognizedText] = useState("");
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {

        const file = event.target.files[0];
        if (file) {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                if (img.width === 120 && img.height === 100) {
                    setImage(file);
                    setError("");
                } else {
                    setError("Image size must be 120x100");
                    setImage(null);
                }
            };
        }
    };

    const handleRecognize = async () => {
        if (!image) return;
        setRecognizedText("Recognizing...");

        const formData = new FormData();
        formData.append("file", image);

        try {
            const response = await fetch(`${RECOGNIZE_DOMAIN}/recognize`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setRecognizedText(`Recognition Result: ${data.text}`);
        } catch (err) {
            setRecognizedText("Recognition Failed");
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 text-center shadow-lg" style={{ width: "350px" }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="d-none"
                    ref={fileInputRef}
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="btn btn-primary mb-3"
                >
                    Choose File
                </button>
                {error && <p className="text-danger">{error}</p>}
                {image && (
                    <>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Uploaded"
                            className="border p-2 mb-3 rounded"
                            style={{ width: 120, height: 100 }}
                        />
                        <button
                            onClick={handleRecognize}
                            className="btn btn-success"
                        >
                            Recognize
                        </button>
                    </>
                )}
                {recognizedText && <p className="mt-3 fw-bold">{recognizedText}</p>}
            </div>
        </div>
    );
}

export default App;