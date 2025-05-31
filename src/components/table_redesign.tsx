// ✅ TableRedesign.tsx
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { center } from "@cloudinary/url-gen/qualifiers/textAlignment";

export interface TableRedesignProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  columns: GridColDef[];
  rows: any[];
  title?: string;
}

export default function TableRedesign({
  height = 500,
  width = "100%",
  columns,
  rows,
  title,
}: TableRedesignProps) {
  const navigate = useNavigate();

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    const id = params.row.id;
    if (id) navigate("/activity-info-admin", { state: { id } });
  };

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography variant="h6" fontWeight={600} mb={1} textAlign="center">
          {title}
        </Typography>
      )}
      <Box
        sx={{
          height,
          width,
          overflow: "hidden",
          backgroundColor: "white",
          boxShadow: 2,
          textAlign: center,
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          onRowClick={handleRowClick}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
          disableRowSelectionOnClick
          sx={{
            border: "none",
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
              // แก้ปัญหาไอคอน sort เบียด
              "& .MuiDataGrid-columnHeaderTitleContainer": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                width: "100%",
                textAlign: "center",
                lineHeight: "1.5rem",
                whiteSpace: "normal",
                fontWeight: "600",
              },
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
            "& .MuiDataGrid-cell": {
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            },
          }}
        />
      </Box>
    </Box>
  );
}
