import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { Box, Typography, FormControl, SelectChangeEvent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export interface TableListRowProps {
  height?: number | string;
  width?: number | string;
  borderRadius?: number | string;
  columns: GridColDef[];
  rows: any[];
  title?: string;
  initialPageSize?: number;
  selectedTypes: string[]; // <-- เพิ่มรับ selectedTypes จาก parent
}

export default function TableListRow({
  height = 500,
  width = "100%",
  columns,
  rows,
  title,
  initialPageSize,
  selectedTypes,
}: TableListRowProps) {
  const navigate = useNavigate();
  const [locationFilter, setLocationFilter] = useState<string>("");

  console.log("🔍 [DEBUG] TableListRow - rows received:", rows);
  console.log("🔍 [DEBUG] TableListRow - rows length:", rows?.length);
  console.log("🔍 [DEBUG] TableListRow - columns:", columns);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    // Single click - ไม่ทำอะไร (หรืออาจจะเพิ่ม highlight effect)
  };

  const handleRowDoubleClick: GridEventListener<"rowDoubleClick"> = (
    params
  ) => {
    const id = params.row.activity_id;
    if (id) navigate(`/activity-info-student/${id}`);
  };

  const handleLocationChange = (event: SelectChangeEvent) => {
    setLocationFilter(event.target.value);
  };

  const filteredRows = rows.filter((row) => {
    const passLocation =
      !locationFilter || row.location_type === locationFilter;

    const passType =
      !selectedTypes || selectedTypes.length === 0
        ? true
        : selectedTypes.includes(row.type);

    return passLocation && passType;
  });

  console.log(filteredRows.map((r) => r.activity_id));

  const columnsWithDropdown = columns.map((col) => {
    if (col.field === "event_format") {
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
          ></FormControl>
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
            height: "100%",
          }}
        >
          <DataGrid
            columns={columnsWithDropdown}
            rows={filteredRows}
            onRowClick={handleRowClick}
            onRowDoubleClick={handleRowDoubleClick}
            // 👇ใช้ activity_id เป็น id หลักของ row
            getRowId={(row) => row.activity_id}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: initialPageSize ?? 5, page: 0 },
              },
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
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
