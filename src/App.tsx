import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import { FileText } from "lucide-react";
import Tesseract from "tesseract.js";
import heic2any from "heic2any";
import { ScanLoader } from "./components/scanLoader";

function App() {
  // Store uploaded files for reference if you want, optional
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Store combined extracted text from all images
  const [combinedText, setCombinedText] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleFilesUpload(filesList: FileList) {
    setLoading(true);

    const filesArray = Array.from(filesList);
    setFiles(filesArray);
    setCombinedText(""); // reset text

    for (let i = 0; i < filesArray.length; i++) {
      const file = filesArray[i];
      setCurrentFileIndex(i + 1); // 1-based
      setCurrentFileName(file.name);
      setCurrentProgress(0); // reset progress

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
            if (m.status === "recognizing text" && m.progress !== undefined) {
              setCurrentProgress(m.progress);
            }
          },
        });

        setCombinedText((prev) => prev + text.trim() + "\n\n");
      } catch (error) {
        console.error("OCR error for file", file.name, error);
      }
    }

    setCurrentFileIndex(null);
    setCurrentFileName(null);
    setCurrentProgress(0);

    setLoading(false);
  }

  // Handle edits in the single textarea
  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCombinedText(e.target.value);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-2" />
            Multi Image OCR Extractor
          </h1>
        </div>
      </header>

      {loading && <ScanLoader />}

      <div className="flex flex-col justify-center items-center w-7xl mx-auto px-4 py-6">
        {!loading && <ImageUploader onFilesUpload={handleFilesUpload} />}

        {loading && (
          <div className="flex flex-col items-center justify-center mt-6 w-full max-w-2xl">
            <p className="text-gray-700 mb-2">
              Processing image {currentFileIndex} of {files.length}
            </p>
            <p className="text-sm text-gray-500 mb-4 italic truncate max-w-full">
              {currentFileName}
            </p>
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-200"
                style={{
                  width: `${
                    (currentFileIndex! - 1) * (100 / files.length) +
                    currentProgress
                  }%`,
                }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {(
                (currentFileIndex! - 1) * (100 / files.length) +
                currentProgress
              ).toFixed(0)}
              %
            </p>
          </div>
        )}

        {combinedText?.length > 0 && (
          <textarea
            readOnly={loading}
            className="w-full min-h-[200px] bg-white mt-6 border rounded p-2 resize-y"
            value={combinedText}
            onChange={handleTextChange}
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}

export default App;
