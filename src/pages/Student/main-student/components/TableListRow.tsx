// ✅ TableRedesign.tsx
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputBase,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react"; // เพิ่มไอคอน ChevronDown

export interface TableRedesignProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  columns: GridColDef[];
  rows: any[];
  title?: string;
  initialPageSize?: number;
}

export default function TableRedesign({
  height = 500,
  width = "100%",
  columns,
  rows,
  title,
  initialPageSize,
}: TableRedesignProps) {
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState<string>("");

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    const id = params.row.id;
    if (id) navigate("/activity-info-student", { state: { id } });
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocationFilter(event.target.value);
  };

  const filteredRows = locationFilter
    ? rows.filter((row) => row.location_type === locationFilter)
    : rows;

    console.log(filteredRows.map((r) => r.id));
  

  const columnsWithDropdown = columns.map((col) => {
    if (col.field === "location_type") {
      return {
        ...col,
        renderHeader: () => (
          <FormControl
            size="small"
            variant="standard"
            sx={{
              minWidth: 40,
              backgroundColor: "#1E3A8A",
              alignItems: "center",
              justifyContent: "center",
              px: 0.2,
              display: "flex",
              flexDirection: "row",
              gap: 0.2,
            }}
          >
            <MapPin size={18} color="white" />
            <Select
              value={locationFilter}
              onChange={handleLocationChange}
              displayEmpty
              renderValue={() => (
                <span style={{ color: "white", fontSize: 14 }}> </span>
              )}
              input={<InputBase sx={{ color: "white", fontSize: 14 }} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    border: "1px solid #ccc",
                    mt: 1,
                    "& .MuiMenuItem-root": {
                      fontSize: 13,
                    },
                  },
                },
              }}
              sx={{
                color: "white",
                border: "none",
                fontSize: 14,
                padding: 0,
                minWidth: 20,
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: 0,
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              <MenuItem value="">ทั้งหมด</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Onsite">Onsite</MenuItem>
              <MenuItem value="Course">Course</MenuItem>
            </Select>
          </FormControl>
        ),
      };
    }
    return col;
  });

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
          overflowX: "auto",
          overflowY: "hidden",
          backgroundColor: "white",
          boxShadow: 2,
          textAlign: "center",
          maxWidth: "100vw",
        }}
      >
        <Box
          sx={{
            minWidth: "100%",
            width: "max-content",
          }}
        >
          <DataGrid
            columns={columnsWithDropdown}
            rows={filteredRows}
            onRowClick={handleRowClick}
            getRowId={(row) => row.id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: initialPageSize ?? 5, page: 0 },
              },
            }}
            disableRowSelectionOnClick
            autoHeight={false}
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
              "& .MuiDataGrid-iconSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "white",
              },
              "& .MuiDataGrid-menuIcon": {
                display: "none",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.9rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
