import React from "react";
import type { ChangeEvent } from "react";

interface Props {
  onFilesUpload: (files: FileList) => void;
}

export const ImageUploader: React.FC<Props> = ({ onFilesUpload }) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onFilesUpload(e.target.files);
    }
  }

  return (
    <div>
      <label
        htmlFor="imageUpload"
        className="inline-block cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Upload Images
      </label>
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};
