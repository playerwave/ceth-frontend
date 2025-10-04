import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import Button from '../../../../../components/Button';

interface UploadReviewDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewData: {
    totalRecords: number;
    duplicateRecords: number;
    newRecords: number;
    duplicateDetails: any[];
    newUserDetails: any[];
    summary: {
      duplicatesPercentage: number;
      newRecordsPercentage: number;
    };
  } | null;
  loading: boolean;
}

const UploadReviewDialog: React.FC<UploadReviewDialogProps> = ({
  open,
  onClose,
  onConfirm,
  reviewData,
  loading
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!open) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          ตรวจสอบข้อมูลก่อนอัปโหลด
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>กำลังตรวจสอบข้อมูล...</Typography>
          </Box>
        ) : reviewData ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Summary Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                  {reviewData.totalRecords}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  จำนวนทั้งหมด
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                  {reviewData.duplicateRecords}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ข้อมูลซ้ำ ({reviewData.summary.duplicatesPercentage.toFixed(1)}%)
                </Typography>
              </Paper>
              
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e8' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                  {reviewData.newRecords}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ข้อมูลใหม่ ({reviewData.summary.newRecordsPercentage.toFixed(1)}%)
                </Typography>
              </Paper>
            </Box>

            {/* Alert Messages */}
            {reviewData.duplicateRecords > 0 && (
              <Alert severity="warning">
                พบข้อมูลซ้ำ {reviewData.duplicateRecords} รายการ ข้อมูลเหล่านี้จะไม่ถูกเพิ่มเข้าไปในระบบ
              </Alert>
            )}
            
            {reviewData.newRecords > 0 && (
              <Alert severity="success">
                พบข้อมูลใหม่ {reviewData.newRecords} รายการ ที่จะถูกเพิ่มเข้าไปในระบบ
              </Alert>
            )}

            {/* Details Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                onClick={() => setShowDetails(!showDetails)}
                bgColor="#6c757d"
                textColor="#FFFFFF"
                className="px-4 py-2"
              >
                {showDetails ? 'ซ่อนรายละเอียด' : 'แสดงรายละเอียด'}
              </Button>
            </Box>

            {/* Detailed Tables */}
            {showDetails && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Duplicate Records Table */}
                {reviewData.duplicateDetails.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
                      ข้อมูลซ้ำ ({reviewData.duplicateDetails.length} รายการ)
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Username</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reviewData.duplicateDetails.slice(0, 10).map((duplicate, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Chip label={duplicate.username} color="warning" size="small" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {reviewData.duplicateDetails.length > 10 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        และอีก {reviewData.duplicateDetails.length - 10} รายการ...
                      </Typography>
                    )}
                  </Box>
                )}

                {/* New Records Table */}
                {reviewData.newUserDetails.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32' }}>
                      ข้อมูลใหม่ ({reviewData.newUserDetails.length} รายการ)
                    </Typography>
                    <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Username</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reviewData.newUserDetails.slice(0, 10).map((user, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                <Chip label={user.username} color="success" size="small" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    {reviewData.newUserDetails.length > 10 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        และอีก {reviewData.newUserDetails.length - 10} รายการ...
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            )}
          </Box>
        ) : (
          <Typography>ไม่พบข้อมูลสำหรับตรวจสอบ</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        pt: 2, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end'
      }}>
        <Button 
          onClick={onClose}
          bgColor="#6B7280"
          textColor="#FFFFFF"
          disabled={loading}
          className="px-4 py-2"
        >
          ยกเลิก
        </Button>
        <Button 
          onClick={onConfirm}
          bgColor={loading ? "#6B7280" : "#28a745"}
          textColor="#FFFFFF"
          disabled={loading || !reviewData || reviewData.newRecords === 0}
          className="px-4 py-2 flex items-center gap-2"
        >
          {loading ? (
            <>
              <CircularProgress size={16} color="inherit" />
              กำลังอัปโหลด...
            </>
          ) : (
            `อัปโหลดข้อมูล (${reviewData?.newRecords || 0} รายการ)`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadReviewDialog;
