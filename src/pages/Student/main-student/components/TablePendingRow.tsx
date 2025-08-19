import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  FormControl,
  SelectChangeEvent
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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
  title,
  initialPageSize,
}: TablePendingRowProps) {
  
  const [locationFilter, setLocationFilter] = useState<string>("");

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    const id = params.row.ac_id;
    if (id) {
      // Navigate to assessment page for pending evaluation activities
      console.log("Navigating to assessment for activity:", id);
      // You can customize this navigation based on your routing
    }
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocationFilter(event.target.value);
  };

  const filteredRows = locationFilter
    ? rows.filter((row) => row.ac_location_type === locationFilter)
    : rows;

  const columnsWithDropdown = columns.map((col) => {
    if (col.field === "ac_location_type") {
      return {
        ...col,
        renderHeader: () => (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography fontWeight={600}>สถานที่</Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <select
                value={locationFilter}
                onChange={handleLocationChange}
                style={{
                  padding: "4px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <option value="">ทั้งหมด</option>
                <option value="Online">Online</option>
                <option value="Onsite">Onsite</option>
                <option value="Course">Course</option>
              </select>
            </FormControl>
          </Box>
        ),
      };
    }
    return col;
  });

  return (
    <Box
      sx={{
        height,
        width,
        overflow: "hidden",
        backgroundColor: "white",
        boxShadow: 2,
        borderRadius: borderRadius || 2,
      }}
    >
      <DataGrid
        columns={columnsWithDropdown}
        rows={filteredRows}
        onRowClick={handleRowClick}
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
