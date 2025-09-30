import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface TablePendingRowProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  columns: GridColDef[];
  rows: any[];
  title?: string;
  initialPageSize?: number;
}

export default function TablePendingRow({
  height = 500,
  width = "100%",
  columns,
  rows,
  // title,
  initialPageSize,
}: TablePendingRowProps) {
  
  const navigate = useNavigate();

  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (params) => {
    const activityId = params.row.ac_id;
    if (activityId) {
      console.log("🔄 Double clicked activity:", activityId);
      console.log("🔗 Navigating to assessment page");
      navigate(`/assessment-student/${activityId}`);
    }
  };

  return (
    <Box
      sx={{
        height,
        width,
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <DataGrid
        columns={columns}
        rows={rows}
        onRowDoubleClick={handleRowDoubleClick}
        pageSizeOptions={[5, 10, 20]}
        initialState={{
          pagination: { paginationModel: { pageSize: initialPageSize || 10, page: 0 } },
        }}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          height: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#1E3A8A",
            color: "white",
            fontWeight: "bold",
            fontSize: "0.95rem",
            textTransform: "none",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#1E3A8A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            textAlign: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              top: "25%",
              bottom: "25%",
              width: "1px",
              backgroundColor: "white",
              opacity: 0,
              transition: "opacity 0.3s",
            },
            "&:hover::after": {
              opacity: 1,
            },
          },
          "& .MuiDataGrid-columnHeader:last-of-type::after": {
            display: "none",
          },
          "& .MuiDataGrid-iconSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-sortIcon": {
            color: "white",
          },
          "& .MuiDataGrid-menuIcon": {
            display: "none",
          },
          "& .MuiDataGrid-row": {
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #e0e0e0",
          },
        }}
      />
    </Box>
  );
}
