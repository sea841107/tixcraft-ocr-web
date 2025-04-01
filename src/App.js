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
        <div className="d-flex align-items-center vh-100 bg-light" style={{ flexDirection: "column", marginTop: "50px" }}>
            <div className="mb-4">
                <ul>
                    <li className="text-center list-group-item active" style={{ fontSize: "1.5rem" }}>Steps</li>
                    <li className="list-group-item active" style={{ fontSize: "1rem" }}>
                        1. Download the CAPTCHA images below.<br />
                        <img src="https://i.ibb.co/pjjsL5PH/1742811006661.png" alt=""></img>&nbsp;
                        <img src="https://i.ibb.co/NnnyGBzT/1742810855545-0.png" alt=""></img>&nbsp;
                        <img src="https://i.ibb.co/cXQGdvtD/1741465416611-1.png" alt=""></img>
                        <br />
                        2. Or download it from <a href="https://tixcraft.com" target="_blank" rel="noopener noreferrer">Tixcraft</a>.<br />
                        3. Upload the CAPTCHA image.<br />
                        4. Click "Choose File" to select the image.<br />
                        5. Click "Recognize" to get the result.<br />
                        6. The result will be displayed below the button.<br />
                        7. Make sure the image size is 120x100 pixels.<br />
                        8. If the image size is incorrect, an error message will be shown.<br />
                    </li>
                </ul>
            </div>
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