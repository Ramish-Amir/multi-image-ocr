import React, { useState } from "react";
import { ImageUploader } from "./components/ImageUploader";
import Tesseract from "tesseract.js";
import heic2any from "heic2any";
import { ScanLoader } from "./components/scanLoader";
import { FileText, ClipboardCopy } from "lucide-react";

function App() {
  // Store uploaded files for reference if you want, optional
  const [files, setFiles] = useState<File[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<number>(0);
  const [copySuccess, setCopySuccess] = useState(false);

  // Store combined extracted text from all images
  const [combinedText, setCombinedText] = useState("");

  const [loading, setLoading] = useState(false);

  // Copy to clipboard handler
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(combinedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (err) {
      setCopySuccess(false);
    }
  }

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
    <div className="min-h-screen max-w-full w-full bg-gray-100 flex flex-col justify-start items-center">
      <header className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="mr-2" />
            Multi Image OCR Extractor
          </h1>
        </div>
      </header>

      {loading && <ScanLoader />}

      <div className="box-border flex flex-col justify-center items-center w-full max-w-7xl px-4 py-6">
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
          <div className="relative flex justify-center items-center w-full ">
            <textarea
              readOnly={loading}
              className="w-full min-h-[200px] bg-white mt-6 border rounded p-2 resize-y"
              value={combinedText}
              onChange={handleTextChange}
              spellCheck={false}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow transition-all flex items-center"
              style={{ zIndex: 10 }}
              aria-label="Copy to clipboard"
              disabled={loading}
            >
              <ClipboardCopy className="w-5 h-5" />
              <span className="sr-only">Copy</span>
            </button>
            {copySuccess && (
              <span className="absolute top-10 right-20 bg-green-500 text-white px-2 py-1 rounded text-xs shadow">
                Copied!
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
