import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CustomCard from "../../../../components/Card";
import Searchbar from "../../../../components/Searchbar";
import Button from "../../../../components/Button";
import TableRedesign from "../../../../components/Table_re";
import DonutChart from "../../../../components/Charts/DonutChart";
import GroupBarChart from "../../../../components/Charts/GroupBarChart";
import { GridColDef } from "@mui/x-data-grid";
import { Chip, Checkbox, FormControlLabel, Box } from "@mui/material";
import { useUserStore } from "../../../../stores/Teacher/student.store";

const ListUserTeacher: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Error boundary state
  const [hasError, setHasError] = React.useState(false);
  const [errorInfo, setErrorInfo] = React.useState<string | null>(null);
  
  // User store
  const {
    filteredStudents,
    selectedYears,
    selectedStatuses,
    loading,
    error,
    fetchStudentsByDepartment,
    searchStudents,
    filterStudentsByYear,
    filterStudentsByStatus
  } = useUserStore();


  // Table columns configuration - Updated to match backend data structure
  const columns: GridColDef[] = [
    {
      field: "full_name",
      headerName: "ชื่อ-นามสกุล",
      width: 350,
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
      width: 250,
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
      field: "department",
      headerName: "สาขา",
      width: 300,
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

  // Calculate chart data from real students data
  const donutChartData = React.useMemo(() => {
    if (!filteredStudents || filteredStudents.length === 0) {
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
    
    const normalCount = filteredStudents.filter(student => student && student.risk_status === 'Normal').length;
    const riskCount = filteredStudents.filter(student => student && student.risk_status === 'Risk').length;
    const totalCount = filteredStudents.length;
    
    // ✅ Calculate percentages
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
  }, [filteredStudents]);

  // Calculate bar chart data from real students data
  const barChartData = React.useMemo(() => {
    if (!filteredStudents || filteredStudents.length === 0) {
      return [];
    }
    
    const yearData: { [key: string]: { normal: number; risk: number } } = {};
    
    // ✅ Filter out invalid students first
    const validStudents = filteredStudents.filter(student => {
      if (!student) {
        console.warn("⚠️ Null/undefined student found");
        return false;
      }
      
      if (!student.year || typeof student.year !== 'number') {
        console.warn("⚠️ Student with invalid year:", {
          student_id: student.student_id,
          year: student.year,
          email: student.email
        });
        return false;
      }
      
      return true;
    });
    
    console.log(`🔍 Processing ${validStudents.length} valid students out of ${filteredStudents.length} total`);
    
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
  }, [filteredStudents]);

  const handleSearch = (searchValue: string) => {
    console.log("🔍 Search term:", searchValue);
    searchStudents(searchValue);
  };

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

  useEffect(() => {
    const department = searchParams.get("department");
    if (department) {
      console.log("🔍 Department Code from URL:", department);
      // Fetch students for the department
      fetchStudentsByDepartment(department);
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
        <h1 className="text-3xl font-bold text-black text-center mb-8">
          จัดการนิสิต
        </h1>

        {/* Action Buttons */}
        <div className="flex justify-end items-center mb-4">
          <div className="flex space-x-3">
            <Button bgColor="#1E3A8A" textColor="#FFFFFF">
              Import
            </Button>
            <Button bgColor="#1E3A8A" textColor="#FFFFFF">
              Export
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center w-full mb-4">
          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Student List Card */}
        <CustomCard className="p-6 mb-8" width={"100%"} minHeight={"500px"}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">รายชื่อนิสิต</h2>
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
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">กำลังโหลดข้อมูลนิสิต...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg font-semibold mb-2">เกิดข้อผิดพลาด</p>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <p className="text-gray-600 text-lg">ไม่พบข้อมูลนิสิต</p>
                <p className="text-gray-500 text-sm">กรุณาตรวจสอบสาขาที่เลือก</p>
              </div>
            </div>
          ) : (
            <TableRedesign
              columns={columns}
              rows={filteredStudents}
              height={400}
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
              initialPageSize={10}
            />
          )}
        </CustomCard>

        {/* Charts Section Card */}
        <CustomCard className="p-6" width={"100%"} minHeight={"400px"}>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
            สรุปข้อมูลของสาขา
          </h2>
          
          <div className="grid grid-cols-2 gap-8">
            {/* Donut Chart */}
            <CustomCard className="p-6" width={"100%"} minHeight={"300px"}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">สถานะนิสิต</h3>
              <DonutChart
                data={donutChartData}
                height={250}
                outerRadius={90}
                innerRadius={50}
                showLegend={true}
                legendPosition="right"
                showTotal={true}
                centerValue={filteredStudents.length}
                totalText={`รวมทั้งหมด ${filteredStudents.length} คน`}
              />
            </CustomCard>

            {/* Bar Chart */}
            <CustomCard className="p-6" width={"100%"} minHeight={"300px"}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">ข้อมูลตามชั้นปี</h3>
              <GroupBarChart
                data={barChartData}
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
