import { Assessment } from "../../../../../types/model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";

interface TableRowProps {
  act: Assessment;
}

const TableRow: React.FC<TableRowProps> = ({ act }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    console.log("แก้ไข:", act.assessment_id);
    handleMenuClose();
  };

  const handleView = () => {
    console.log("ดูข้อมูล:", act.assessment_id);
    handleMenuClose();
  };

  return (
    <tr className="border-t text-center hover:bg-gray-100 transition">
      <td className="p-2">{act.assessment_name}</td>
      <td className="p-2">{act.create_date ? new Date(act.create_date).toLocaleDateString("th-TH") : "ยังไม่ระบุ"}</td>
      <td className="p-2">{act.last_update ? new Date(act.last_update).toLocaleDateString("th-TH") : "ยังไม่ระบุ"}</td>
      <td className="p-2 text-right">
        <IconButton onClick={handleMenuOpen}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleView}>ดูรายละเอียด</MenuItem>
          <MenuItem onClick={handleEdit}>แก้ไข</MenuItem>
        </Menu>
      </td>
    </tr>
  );
};

export default TableRow;