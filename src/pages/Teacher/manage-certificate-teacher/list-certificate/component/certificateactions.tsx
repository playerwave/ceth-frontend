import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../components/Button";

interface Props {
  id: number;
}

const CertificateActions: React.FC<Props> = ({ id }) => {
  const navigate = useNavigate();

  const handlePreview = () => {
    navigate(`/preview-certificate-teacher?id=${id}`);
  };

  const handleDownload = () => {
    console.log("Download certificate for ID:", id);
    // หรือจะเรียก API/download logic ที่นี่
  };

  return (

    <div className="flex justify-center items-center gap-4 mt-2">
      <button onClick={handlePreview} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 min-w-[100px] font-medium">


        Preview
      </button>
      <button
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 min-w-[100px] font-medium"
        onClick={handleDownload}
      >
        Download
      </button>
    </div>
    );
};

    export default CertificateActions;
