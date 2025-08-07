import React from "react";

interface ActivityLinkProps {
  url: string;
  label: string;
}

const ActivityLink: React.FC<ActivityLinkProps> = ({ url, label }) => {
  return (
    <div className="flex items-center gap-2 font-[Sarabun] font-semibold cursor-default">
      <p>ลิ้งค์กิจกรรม: {""}</p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer hover:text-blue-900"
      >
        {label}
      </a>
    </div>
  );
};

export default ActivityLink;
