import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { Food } from "../../../../../types/model"; // ชี้ path ให้ถูกต้อง
interface Props {
  data: Food[];
}


const FoodTable: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    { field: "food_id", headerName: "ID", flex: 1 },
    { field: "food_name", headerName: "ชื่อเมนู", flex: 1 },

  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data.map((item) => ({ id: item.food_id, ...item }))}

        columns={columns}
        pageSizeOptions={[5, 10]}
        pagination
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        onRowClick={(params: GridRowParams) =>
          navigate(`/update-food-teacher?id=${params.row.food_id}`)


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
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
          {
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
