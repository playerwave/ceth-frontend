// StyledAutocomplete.tsx
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";

export const Root = styled("div")(() => ({
  color: "rgba(0,0,0,0.85)",
  fontSize: "14px",
}));

export const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

export const InputWrapper = styled("div")(() => ({
  width: "100%",
  border: "1px solid #d9d9d9",
  backgroundColor: "#fff",
  borderRadius: "4px",
  padding: "1px",
  display: "flex",
  flexWrap: "wrap",
  "& input": {
    backgroundColor: "#fff",
    color: "rgba(0,0,0,.85)",
    height: "30px",
    padding: "4px 6px",
    width: "100%", // 👈 เปลี่ยนจาก 0 เป็น 100% เพื่อให้กดได้
    minWidth: "30px",
    flexGrow: 1,
    border: 0,
    margin: 0,
    outline: 0,
  },
}));

export const Listbox = styled("ul")(() => ({
  width: "100%",
  margin: "2px 0 0",
  padding: 0,
  position: "absolute",
  listStyle: "none",
  backgroundColor: "#fff",
  overflow: "auto",
  maxHeight: "250px",
  borderRadius: "4px",
  boxShadow: "0 2px 8px rgb(0 0 0 / 0.15)",
  zIndex: 1,
  "& li": {
    padding: "5px 12px",
    display: "flex",
    "& span": {
      flexGrow: 1,
    },
    "& svg": {
      color: "transparent",
    },
  },
  "& li[aria-selected='true']": {
    backgroundColor: "#fafafa",
    fontWeight: 600,
    "& svg": {
      color: "#1890ff",
    },
  },
  [`& li.${autocompleteClasses.focused}`]: {
    backgroundColor: "#e6f7ff",
    cursor: "pointer",
    "& svg": {
      color: "currentColor",
    },
  },
}));
