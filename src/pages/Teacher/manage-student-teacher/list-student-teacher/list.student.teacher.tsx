import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import CustomCard from "@/components/Card";
import Searchbar from "@/components/Searchbar";
import Button from "@/components/Button";
import TableRedesign from "@/components/Table_re";
import DonutChart from "@/components/Charts/DonutChart";
import GroupBarChart from "@/components/Charts/GroupBarChart";
import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, FormControlLabel, Box } from "@mui/material";
import { useUserStore } from "@/stores/Teacher/student.store";

const ListUserTeacher: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Error boundary state
  const [hasError, setHasError] = React.useState(false);
  const [errorInfo, setErrorInfo] = React.useState<string | null>(null);
  
  // Local search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Department name state
  const [departmentName, setDepartmentName] = useState("");
  
  // User store
  const {
    filteredStudents,
    selectedYears,
    selectedStatuses,
    loading,
    error,
    fetchStudentsByDepartment,
    filterStudentsByYear,
    filterStudentsByStatus,
    exportStudentsToExcel
  } = useUserStore();


  // Table columns configuration - Updated to match backend data structure
  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "ชื่อ-นามสกุล",
      width: 300,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => {
        // ✅ Try to get Thai name first, fallback to English name
        const firstName = params.row.first_name_tha || params.row.first_name || '';
        const lastName = params.row.last_name_tha || params.row.last_name || '';
        return `${firstName} ${lastName}`.trim() || params.value;
      },
    },
    {
      field: "year",
      headerName: "ชั้นปี",
      width: 150,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => (
        <span className="text-sm font-semibold">
          {params.value}
        </span>
      ),
    },
    {
      field: "username",
      headerName: "รหัสนิสิต",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => {
        const username = params.value || params.row.username || 'ไม่ระบุ';
        return (
          <span className="text-sm px-2 py-1 rounded">
            {username}
          </span>
        );
      },
    },
    {
      field: "department",
      headerName: "สาขา",
      width: 200,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => params.value?.department_short_name || params.value,
    },
    {
      field: "risk_status",
      headerName: "ความเสี่ยง",
      width: 270,
      headerAlign: "center",
      align: "center",
      cellClassName: "px-8",
      renderCell: (params) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          params.value === 'Normal' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {params.value}
        </span>
      ),
    },
  ];

  // ✅ Realtime search function
  const handleSearch = useCallback((searchValue: string) => {
    console.log("🔍 Search term:", searchValue);
    // ✅ ส่งค่าไปยัง parent state (ไม่ต้องตรวจสอบค่าว่างที่นี่)
    setSearchTerm(searchValue);
  }, []);

  // ✅ Realtime filtered students based on search term
  const realtimeFilteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return filteredStudents;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    
    return filteredStudents.filter(student => {
      if (!student) return false;

      // ✅ Search in Thai names
      const thaiFirstName = student.first_name_tha?.toLowerCase() || '';
      const thaiLastName = student.last_name_tha?.toLowerCase() || '';
      
      // ✅ Search in English names  
      const engFirstName = student.first_name_eng?.toLowerCase() || '';
      const engLastName = student.last_name_eng?.toLowerCase() || '';
      
      // ✅ Search in username (if available)
      const username = student.username?.toLowerCase() || '';
      
      return (
        thaiFirstName.includes(searchLower) ||
        thaiLastName.includes(searchLower) ||
        engFirstName.includes(searchLower) ||
        engLastName.includes(searchLower) ||
        username.includes(searchLower)
      );
    });
  }, [filteredStudents, searchTerm]);

  // ✅ Update charts data based on realtime filtered results
  const realtimeDonutChartData = useMemo(() => {
    if (!realtimeFilteredStudents || realtimeFilteredStudents.length === 0) {
      return [
        {
          name: "คนที่มีสถานะ Normal",
          value: 0,
          color: "bg-green-400"
        },
        {
          name: "คนที่มีสถานะ Risk",
          value: 0,
          color: "bg-red-600"
        }
      ];
    }
    
    const normalCount = realtimeFilteredStudents.filter(student => student && student.risk_status === 'Normal').length;
    const riskCount = realtimeFilteredStudents.filter(student => student && student.risk_status === 'Risk').length;
    const totalCount = realtimeFilteredStudents.length;
    
    const normalPercentage = totalCount > 0 ? Math.round((normalCount / totalCount) * 100) : 0;
    const riskPercentage = totalCount > 0 ? Math.round((riskCount / totalCount) * 100) : 0;
    
    return [
      {
        name: "คนที่มีสถานะ Normal",
        value: normalPercentage,
        color: "bg-green-400"
      },
      {
        name: "คนที่มีสถานะ Risk",
        value: riskPercentage,
        color: "bg-red-600"
      }
    ];
  }, [realtimeFilteredStudents]);

  // ✅ Update bar chart data based on realtime filtered results
  const realtimeBarChartData = useMemo(() => {
    if (!realtimeFilteredStudents || realtimeFilteredStudents.length === 0) {
      return [];
    }
    
    const yearData: { [key: string]: { normal: number; risk: number } } = {};
    
    const validStudents = realtimeFilteredStudents.filter(student => {
      if (!student) return false;
      if (!student.year || typeof student.year !== 'number') return false;
      return true;
    });
    
    validStudents.forEach(student => {
      const year = student.year.toString();
      if (!yearData[year]) {
        yearData[year] = { normal: 0, risk: 0 };
      }
      
      if (student.risk_status === 'Normal') {
        yearData[year].normal++;
      } else if (student.risk_status === 'Risk') {
        yearData[year].risk++;
      }
    });
    
    return Object.entries(yearData).map(([year, data]) => ({
      name: year,
      "คนที่มีสถานะ Normal": data.normal,
      "คนที่มีสถานะ Risk": data.risk
    }));
  }, [realtimeFilteredStudents]);

  // Handle year filter changes
  const handleYearChange = (year: number) => {
    const newYears = selectedYears.includes(year) 
      ? selectedYears.filter(y => y !== year)
      : [...selectedYears, year];
    
    console.log("🔍 Year filter changed:", {
      year,
      selectedYears,
      newYears
    });
    
    filterStudentsByYear(newYears);
  };

  // Handle status filter changes
  const handleStatusChange = (status: string) => {
    const newStatuses = selectedStatuses.includes(status) 
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    
    console.log("🔍 Status filter changed:", {
      status,
      selectedStatuses,
      newStatuses
    });
    
    filterStudentsByStatus(newStatuses);
  };

  // Handle export button click
  const handleExport = async () => {
    try {
      console.log("📤 Export button clicked");
      const result = await exportStudentsToExcel();
      
      if (result.success) {
        console.log("✅ Export successful:", result.message);
      } else {
        console.error("❌ Export failed:", result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error("❌ Export error:", error);
      alert("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    }
  };

  useEffect(() => {
    const department = searchParams.get("department");
    if (department) {
      console.log("🔍 Department Code from URL:", department);
      // Reset search term when department changes
      setSearchTerm("");
      // Fetch students for the department
      fetchStudentsByDepartment(department);
      
      // Set department name based on department code
      const departmentNames: { [key: string]: string } = {
        "SE": "วิศวกรรมซอฟต์แวร์",
        "AAI": "ปัญญาประดิษฐ์ประยุกต์",
        "CS": "วิทยาการคอมพิวเตอร์",
        "IT": "เทคโนโลยีสารสนเทศ"
      };
      setDepartmentName(departmentNames[department] || department);
    }
  }, [searchParams, fetchStudentsByDepartment]);

  // Debug logging
  useEffect(() => {
    console.log("🔍 [COMPONENT] Current state:", {
      filteredStudents: filteredStudents.length,
      loading,
      error,
      selectedYears,
      selectedStatuses
    });
    
    // ✅ Debug: Log first student data structure
    if (filteredStudents.length > 0) {
      console.log("🔍 [COMPONENT] First student data:", filteredStudents[0]);
      console.log("🔍 [COMPONENT] Student keys:", Object.keys(filteredStudents[0]));
      console.log("🔍 [COMPONENT] Username:", filteredStudents[0].username);
      console.log("🔍 [COMPONENT] User ID:", filteredStudents[0].user_id);
    }
  }, [filteredStudents, loading, error, selectedYears, selectedStatuses]);

  // Error handling
  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error("🚨 Component error caught:", error);
      setHasError(true);
      setErrorInfo(error.message);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Show error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
          <p className="text-gray-600 mb-4">{errorInfo}</p>
          <button 
            onClick={() => {
              setHasError(false);
              setErrorInfo(null);
              window.location.reload();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            รีเฟรชหน้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">
            จัดการนิสิต สาขา {departmentName}
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-3">
            <Button 
              bgColor="green" 
              textColor="#FFFFFF"
              onClick={handleExport}
              disabled={loading}
            >
              {loading ? "กำลังส่งออก..." : "Export"}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center w-full mb-4">
          <Searchbar 
            onSearch={handleSearch} 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {/* Student List Card */}
        <CustomCard className="p-6 mb-8" width={"100%"} minHeight={"700px"}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">รายชื่อนิสิต</h2>
              {searchTerm.trim() ? (
                <p className="text-sm text-blue-600 mt-1">
                  แสดง {realtimeFilteredStudents.length} จาก {filteredStudents.length} คน
                </p>
              ) : (
                <p className="text-sm text-gray-600 mt-1">
                  แสดงทั้งหมด {filteredStudents.length} คน
                </p>
              )}
            </div>
            <div className="flex space-x-6">
              {/* Year Filter */}
              <Box className="flex items-center space-x-2">
                <Chip 
                  label="ชั้นปี" 
                  sx={{ 
                    backgroundColor: '#1E3A8A', 
                    color: 'white',
                    borderRadius: '4px',
                    '& .MuiChip-label': {
                      fontWeight: 'bold'
                    }
                  }} 
                />
                {[1, 2, 3, 4].map((year) => (
                  <FormControlLabel
                    key={year}
                    control={
                      <Checkbox
                        checked={selectedYears.includes(year)}
                        onChange={() => handleYearChange(year)}
                        sx={{
                          color: '#3B82F6', // bg-blue-500
                          '&.Mui-checked': {
                            color: '#3B82F6', // bg-blue-500
                          },
                        }}
                      />
                    }
                    label={year.toString()}
                    sx={{ margin: 0 }}
                  />
                ))}
              </Box>

              {/* Status Filter */}
              <Box className="flex items-center space-x-2">
                <Chip 
                  label="สถานะ" 
                  sx={{ 
                    backgroundColor: '#1E3A8A', 
                    color: 'white',
                    borderRadius: '4px',
                    '& .MuiChip-label': {
                      fontWeight: 'bold'
                    }
                  }} 
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedStatuses.includes('Normal')}
                      onChange={() => handleStatusChange('Normal')}
                      sx={{
                        color: '#3B82F6', // bg-blue-500
                        '&.Mui-checked': {
                          color: '#3B82F6', // bg-blue-500
                        },
                      }}
                    />
                  }
                  label="ปกติ"
                  sx={{ margin: 0 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedStatuses.includes('Risk')}
                      onChange={() => handleStatusChange('Risk')}
                      sx={{
                        color: '#3B82F6', // bg-blue-500
                        '&.Mui-checked': {
                          color: '#3B82F6', // bg-blue-500
                        },
                      }}
                    />
                  }
                  label="เสี่ยง"
                  sx={{ margin: 0 }}
                />
              </Box>
            </div>
          </div>

          {/* Student Table */}
          <TableRedesign
            columns={columns}
            rows={realtimeFilteredStudents}
            height={600}
            width="100%"
            getRowId={(row: any) => {
              // ✅ Handle missing student_id
              if (row.student_id) {
                return row.student_id;
              }
              // ✅ Fallback to email
              if (row.email) {
                return row.email;
              }
              // ✅ Fallback to department + email
              if (row.department?.department_short_name && row.email) {
                return `${row.department.department_short_name}-${row.email}`;
              }
              // ✅ Final fallback
              return `student-${Math.random().toString(36).substr(2, 9)}`;
            }}
            initialPageSize={50}
            pageSizeOptions={[25, 50, 100, 200]}
          />
        </CustomCard>

        {/* Charts Section Card */}
        <CustomCard className="p-6" width={"100%"} minHeight={"400px"}>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            สรุปข้อมูลของสาขา
            {searchTerm.trim() ? (
              <span className="text-sm text-blue-600 ml-2">
                (ค้นหา: "{searchTerm}")
              </span>
            ) : (
              <span className="text-sm text-gray-600 ml-2">
                (แสดงทั้งหมด)
              </span>
            )}
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Donut Chart */}
            <CustomCard className="p-6" width={"100%"} minHeight={"300px"}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                สถานะนิสิต
                {searchTerm.trim() ? (
                  <span className="text-sm text-blue-600 ml-2">
                    (ค้นหา: "{searchTerm}")
                  </span>
                ) : (
                  <span className="text-sm text-gray-600 ml-2">
                    (แสดงทั้งหมด)
                  </span>
                )}
              </h3>
              <DonutChart
                data={realtimeDonutChartData}
                height={250}
                outerRadius={90}
                innerRadius={50}
                showLegend={true}
                legendPosition="right"
                showTotal={true}
                centerValue={realtimeFilteredStudents.length}
                totalText={`รวมทั้งหมด ${realtimeFilteredStudents.length} คน`}
              />
            </CustomCard>

            {/* Bar Chart */}
            <CustomCard className="p-6" width={"100%"} minHeight={"300px"}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                ข้อมูลตามชั้นปี
                {searchTerm.trim() ? (
                  <span className="text-sm text-blue-600 ml-2">
                    (ค้นหา: "{searchTerm}")
                  </span>
                ) : (
                  <span className="text-sm text-gray-600 ml-2">
                    (แสดงทั้งหมด)
                  </span>
                )}
              </h3>
              <GroupBarChart
                data={realtimeBarChartData}
                height={250}
                yAxisLabel="จำนวนคน"
                xAxisLabel="ชั้นปี"
                colors={["bg-green-400", "bg-red-600"]}
                showLegend={true}
                legendPosition="bottom"
                barSize={40}
              />
            </CustomCard>
          </div>
        </CustomCard>
      </div>
    </div>
  );
};

export default ListUserTeacher;
