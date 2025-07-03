import type { ChangeEvent } from "react";
import { Upload } from "lucide-react";

interface Props {
  onFilesUpload: (files: FileList) => void;
}

export const ImageUploader = ({ onFilesUpload }: Props) => {
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      onFilesUpload(e.target.files);
    }
  }

  return (
    <div>
      <label className="flex w-max items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition-colors">
        <Upload className="mr-2" />
        Upload Images
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </label>
    </div>
  );
};
