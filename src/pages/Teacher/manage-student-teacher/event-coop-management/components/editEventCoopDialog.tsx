import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { EventCoop } from '@/types/eventcoop.type';
import { useEventCoopStore } from '@/stores/Teacher/eventCoop.store';
import Button from '@/components/Button';

interface EditEventCoopDialogProps {
  open: boolean;
  onClose: () => void;
  eventCoop: EventCoop | null;
}

const EditEventCoopDialog: React.FC<EditEventCoopDialogProps> = ({
  open,
  onClose,
  eventCoop
}) => {
  console.log("🔍 EditEventCoopDialog rendered with:", { open, eventCoop: eventCoop?.eventcoop_id });
  const { updateEventCoop } = useEventCoopStore();
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [isOnCoop, setIsOnCoop] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // อัปเดต selectedDate และ isOnCoop เมื่อ eventCoop เปลี่ยน
  useEffect(() => {
    if (eventCoop) {
      if (eventCoop.date) {
        setSelectedDate(dayjs(eventCoop.date));
      } else {
        setSelectedDate(null);
      }
      setIsOnCoop(eventCoop.is_on_coop || false);
    } else {
      setSelectedDate(null);
      setIsOnCoop(false);
    }
    setSubmitError(null);
  }, [eventCoop]);

  // ฟังก์ชันสำหรับบันทึกการแก้ไข
  const handleSave = async () => {
    if (!eventCoop || !selectedDate) {
      setSubmitError('กรุณาเลือกวันที่');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // สร้าง payload สำหรับ PATCH - ส่งเฉพาะ field ที่ต้องการอัปเดต
      const updatePayload = {
        eventcoop_id: eventCoop.eventcoop_id,
        date: selectedDate.toDate(),
        is_on_coop: isOnCoop,
      };

      console.log('📝 [DIALOG] Patching Event Coop with payload:', updatePayload);
      console.log('📝 [DIALOG] isOnCoop state:', isOnCoop);
      
      await updateEventCoop(updatePayload as EventCoop);
      
      console.log('✅ Event Coop date updated successfully');
      onClose();
    } catch (error) {
      console.error('❌ Error updating Event Coop:', error);
      setSubmitError('ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ฟังก์ชันสำหรับยกเลิก
  const handleCancel = () => {
    setSelectedDate(eventCoop && eventCoop.date ? dayjs(eventCoop.date) : null);
    setSubmitError(null);
    onClose();
  };

  // ฟังก์ชันคำนวณจำนวนวัน
  const calculateDaysUntilCoop = (coopDate: dayjs.Dayjs | null) => {
    if (!coopDate) return null;
    
    const today = dayjs();
    const diffDays = coopDate.diff(today, 'day');
    return diffDays;
  };

  const remainingDays = calculateDaysUntilCoop(selectedDate);

  // ตรวจสอบว่า Dialog ควรเปิดหรือไม่
  if (!open) {
    console.log("🔍 Dialog not open, returning null");
    return null;
  }

  console.log("🔍 Dialog should be visible now");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <Dialog 
        open={open} 
        onClose={handleCancel}
        maxWidth="sm"
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
            แก้ไขวันที่ไปสหกิจศึกษา
          </Typography>
          {eventCoop && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ชั้นปี: ปี {eventCoop.grade_id}{eventCoop.th_year ? ` (${eventCoop.th_year})` : ''} | สาขา: {(eventCoop as any).department_name_tha || 'ไม่ระบุ'}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* แสดงข้อผิดพลาด */}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}

            {/* DateTime Picker */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                วันที่ไปสหกิจศึกษา *
              </Typography>
              <DateTimePicker
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: 'outlined',
                    placeholder: 'เลือกวันที่ไปสหกิจศึกษา',
                    error: !selectedDate,
                    helperText: !selectedDate ? 'กรุณาเลือกวันที่' : undefined
                  }
                }}
                format="DD/MM/YYYY"
                views={['year', 'month', 'day']}
                disablePast={false}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Box>

            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isOnCoop}
                    onChange={(e) => setIsOnCoop(e.target.checked)}
                    color="primary"
                  />
                }
                label="บังคับออกฝึก"
                sx={{
                  '& .MuiFormControlLabel-label': {
                    fontWeight: 500,
                    color: '#374151'
                  }
                }}
              />
            </Box>

            {/* แสดงจำนวนวันที่เหลือ */}
            {selectedDate && remainingDays !== null && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: remainingDays > 0 ? '#e8f5e8' : remainingDays === 0 ? '#fff3cd' : '#f8d7da',
                borderRadius: 2,
                border: `1px solid ${remainingDays > 0 ? '#c3e6c3' : remainingDays === 0 ? '#ffeaa7' : '#f5c6cb'}`
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  จำนวนวันที่เหลือก่อนไปสหกิจศึกษา:
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: remainingDays > 0 ? '#28a745' : remainingDays === 0 ? '#856404' : '#dc3545'
                  }}
                >
                  {remainingDays > 0 
                    ? `${remainingDays} วัน` 
                    : remainingDays === 0 
                    ? 'วันนี้' 
                    : `ผ่านไปแล้ว ${Math.abs(remainingDays)} วัน`
                  }
                </Typography>
              </Box>
            )}

            {/* ข้อมูลเดิม */}
            {eventCoop && eventCoop.date && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                  วันที่เดิม:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dayjs(eventCoop.date).format('DD MMMM YYYY')}
                </Typography>
              </Box>
            )}
          </Box>
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
            onClick={handleCancel}
            bgColor="red"
            textColor="#FFFFFF"
            disabled={isSubmitting}
            className="px-4 py-2"
          >
            ยกเลิก
          </Button>
          <Button 
            onClick={handleSave}
            textColor="#FFFFFF"
            disabled={isSubmitting || !selectedDate}
            className="px-4 py-2"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default EditEventCoopDialog;
