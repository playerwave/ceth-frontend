import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

interface Food {
  name: string;
  price: number;
  phone: string;
}

interface Props {
  data: Food[];
}

const FoodTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "name", headerName: "ชื่อเมนู", flex: 1 },
    { field: "price", headerName: "ราคา", flex: 1 },
    { field: "phone", headerName: "เบอร์ติดต่อ", flex: 1 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data.map((item, index) => ({ id: index, ...item }))}
        columns={columns}
        pageSizeOptions={[5, 10]}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        onRowClick={(params: GridRowParams) =>
          navigate("/edit-food", { state: { food: params.row } })
        }
        sx={{
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
            backgroundColor: "#1E3A8A",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: "16px",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "#FFFFFF",
          },
          "& .MuiSvgIcon-root": {
            color: "#FFFFFF",
          },
          "& .MuiTablePagination-root, & .MuiTablePagination-toolbar": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            color: "#000000 !important",
          },
          "& .MuiSelect-select, & .MuiSvgIcon-root.MuiSelect-icon": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-actions button": {
            color: "#000000 !important",
          },
          "& .MuiTablePagination-actions button svg": {
            color: "#000000 !important",
          },
        }}
      />
    </div>
  );
};

export default FoodTable;
