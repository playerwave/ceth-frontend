import * as React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

interface Room {
  id: number;
  name: string;
  floor: number;
  building: string;
  seats: number;
}

interface RoomTableProps {
  data: Room[];
}

const RoomTable: React.FC<RoomTableProps> = ({ data }) => {
  const navigate = useNavigate();
  console.log("data ที่ส่งเข้า DataGrid:", data);
  const columns: GridColDef[] = [
    { field: "name", headerName: "ชื่อห้อง", flex: 1 },
    { field: "floor", headerName: "ชั้น", flex: 1 },
    { field: "building", headerName: "ตึก/อาคาร", flex: 1 },
    {
      field: "seats",
      headerName: "จำนวนที่นั่ง",
      flex: 1,
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        pageSizeOptions={[5, 10]}
        onRowClick={(params: GridRowParams) =>
          navigate("/edit-room", { state: { room: params.row } })
        }
        getRowId={(row) => row.id}
        sx={{
          // หัวตาราง
          "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader": {
            backgroundColor: "#1E3A8A",
            color: "#FFFFFF",
            fontWeight: "bold",
            fontSize: "16px",
          },
          // ไอคอนเรียงลำดับ
          "& .MuiDataGrid-sortIcon": {
            color: "#FFFFFF",
          },
          "& .MuiSvgIcon-root": {
            color: "#FFFFFF",
          },

          // Pagination สีดำ
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

          // ปุ่มลูกศร Pagination
          "& .MuiTablePagination-actions button": {
            color: "#000000 !important",
          },
          // เผื่อไอคอน svg ภายในปุ่ม
          "& .MuiTablePagination-actions button svg": {
            color: "#000000 !important",
          },
        }}
      />
    </div>
  );
};

export default RoomTable;
