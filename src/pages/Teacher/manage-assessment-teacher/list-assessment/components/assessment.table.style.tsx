// components/styles/tableStyle.ts
export const dataGridStyle = {
  border: "none",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#1E3A8A",
    color: "white",
    fontWeight: "bold",
    fontSize: "0.95rem",
    textTransform: "none",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  "& .MuiDataGrid-columnHeader": {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  "& .MuiDataGrid-cell": {
    fontSize: "0.9rem",
    textAlign: "center",
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
};

// tableStyle.ts
// components/styles/tableStyle.ts
export const tableBaseClass = "w-full mt-2 border-collapse overflow-hidden rounded-lg"; // ลบ shadow-md ออก

export const headerRowClass = "bg-blue-900 text-white rounded-t-lg";

export const cellClass = "p-2 text-center";