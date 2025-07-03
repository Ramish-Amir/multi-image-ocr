import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";

import Tesseract from "tesseract.js";
import heic2any from "heic2any";

export const App: React.FC = () => {
  // Store uploaded files for reference if you want, optional
  const [files, setFiles] = useState<File[]>([]);

  // Store combined extracted text from all images
  const [combinedText, setCombinedText] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleFilesUpload(filesList: FileList) {
    setLoading(true);

    const filesArray = Array.from(filesList);
    setFiles(filesArray);
    setCombinedText(""); // reset text

    let combined = "";

    for (const file of filesArray) {
      try {
        let processedFile = file;

        if (
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic")
        ) {
          const convertedBlob = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 0.9,
          });
          processedFile = new File(
            [convertedBlob as Blob],
            file.name + ".jpg",
            {
              type: "image/jpeg",
            }
          );
        }

        const {
          data: { text },
        } = await Tesseract.recognize(processedFile, "eng", {
          logger: (m) => {
            // Optional: handle progress updates
          },
        });

        combined += text.trim() + "\n\n"; // Append text + blank line
      } catch (error) {
        console.error("OCR error for file", file.name, error);
        combined += `[Error extracting text from ${file.name}]\n\n`;
      }
    }

    setCombinedText(combined.trim());
    setLoading(false);
  }

  // Handle edits in the single textarea
  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCombinedText(e.target.value);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Multi Image OCR Extractor</h1>

      <ImageUploader onFilesUpload={handleFilesUpload} />

      {loading && (
        <p className="mt-4 text-blue-600">Extracting text from images...</p>
      )}

      {!loading && combinedText && (
        <textarea
          className="w-full min-h-[200px] mt-6 border rounded p-2 resize-y"
          value={combinedText}
          onChange={handleTextChange}
          spellCheck={false}
        />
      )}
    </div>
  );
};

export default App;
