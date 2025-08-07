import React from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { QuestionItem } from "../type/type.create";

type Props = {
  anchorEl: null | HTMLElement;
  menuOpen: boolean;
  onMenuClick: (e: React.MouseEvent<HTMLElement>) => void;
  onMenuClose: () => void;
 onAdd: (type: QuestionItem["type"]) => void;
};

const ButtonAdd: React.FC<Props> = ({
  anchorEl,
  menuOpen,
  onMenuClick,
  onMenuClose,
  onAdd,
}) => (
  <div className="flex justify-center mt-6">
    <IconButton
      type="button"
      color="primary"
      size="small"
      onClick={onMenuClick}
      style={{
        background: "#1E3A8A",
        color: "#fff",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <AddIcon fontSize="small" />
    </IconButton>
    <Menu anchorEl={anchorEl} open={menuOpen} onClose={onMenuClose}>
      <MenuItem onClick={() => { onAdd("choice"); onMenuClose(); }}>
        เพิ่มคำถามแบบตัวเลือก
      </MenuItem>
      <MenuItem onClick={() => { onAdd("checkbox"); onMenuClose(); }}>
        เพิ่มคำถามแบบหลายตัวเลือก
      </MenuItem>
      <MenuItem onClick={() => { onAdd("complacent"); onMenuClose(); }}>
        เพิ่มคำถามความพึงพอใจ
      </MenuItem>
      <MenuItem onClick={() => { onAdd("openques"); onMenuClose(); }}>
        เพิ่มคำถามแบบเขียนตอบ
      </MenuItem>
    </Menu>
  </div>
);

export default ButtonAdd;