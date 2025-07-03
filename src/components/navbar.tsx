import { cn } from "@/lib/utils";
import { CameraIcon } from "lucide-react";

const Navbar = () => {
  return (
    <nav
      className={cn(
        "w-full bg-white border-b shadow-sm px-6 py-3 flex items-center gap-3"
      )}
    >
      <CameraIcon className="h-7 w-7 text-blue-600" />
      <span className="text-xl font-semibold tracking-tight text-gray-800">
        Multi Image OCR Extractor
      </span>
    </nav>
  );
};

export default Navbar;
