import "../index.css";

export const ScanLoader = () => {
  return (
    <div className="m-8 flex justify-center">
      <div className="relative flex justify-center items-center w-full md:w-1/3 mb-12 mt-8 md:mb-0 md:mt-0">
        <img
          src="https://images.unsplash.com/photo-1664706599545-41abae195a57?auto=format&fit=crop&q=80&w=1974"
          alt="Document Scanning"
          className="w-72 rounded-xl shadow-2xl"
        />
        <div className="ocrloader">
          <p>Scanning</p>
          <em></em>
          <span></span>
        </div>
      </div>
    </div>
  );
};
