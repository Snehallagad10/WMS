import React, { useState } from "react";
import { uploadPhotos } from "../services/api";

export default function PhotoUpload() {
  const [files, setFiles] = useState([]);
  const [type, setType] = useState("FULL_PALLET");

  const handleUpload = async () => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("photo_type", type);

    await uploadPhotos(formData);
    alert("Photos Uploaded");
  };

  return (
    <div>
      <h3>📸 Upload Photos</h3>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <div>
        <label>
          <input
            type="radio"
            value="FULL_PALLET"
            checked={type === "FULL_PALLET"}
            onChange={(e) => setType(e.target.value)}
          />
          Full Pallet
        </label>

        <label>
          <input
            type="radio"
            value="CARTON_STACK"
            checked={type === "CARTON_STACK"}
            onChange={(e) => setType(e.target.value)}
          />
          Carton Stack
        </label>
      </div>

      <div className="preview">
        {files.map((file, i) => (
          <img
            key={i}
            src={URL.createObjectURL(file)}
            width="100"
            alt=""
          />
        ))}
      </div>

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}