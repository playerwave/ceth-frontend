import React, { useEffect } from "react";
import { useEmailStore } from "../../stores/Teacher/email.store.teacher";
import { 
  Button, 
  TextField, 
  Box, 
  Typography, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Alert,
  CircularProgress
} from "@mui/material";

const EmailTemplatePreview: React.FC = () => {
  const {
    templates,
    selectedTemplate,
    previewHtml,
    templateData,
    loading,
    error,
    fetchTemplates,
    setSelectedTemplate,
    setTemplateData,
    updateTemplateData,
    previewTemplate,
    sendEmail,
    clearError
  } = useEmailStore();

  // ดึงรายการ templates เมื่อ component mount
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // เมื่อเลือก template ให้ preview ทันที
  useEffect(() => {
    if (selectedTemplate) {
      // ตั้งค่าข้อมูลเริ่มต้นสำหรับ template ที่เลือก
      const defaultData = getDefaultData(selectedTemplate);
      setTemplateData(defaultData);
      // preview template
      setTimeout(() => previewTemplate(), 100);
    }
  }, [selectedTemplate]);

  const handleDataChange = (field: string, value: string) => {
    updateTemplateData(field, value);
    // เมื่อกรอกข้อมูลให้ preview ใหม่
    if (selectedTemplate) {
      setTimeout(() => previewTemplate(), 300); // debounce 300ms
    }
  };

  // ข้อมูลตัวอย่างสำหรับแต่ละ template
  const getTemplateFields = (templateName: string) => {
      const commonFields = [
    { key: "name", label: "ชื่อผู้รับ", placeholder: "สมชาย ใจดี" },
    { key: "message", label: "ข้อความเพิ่มเติม", placeholder: "ข้อความพิเศษสำหรับผู้รับ" },
    { key: "recipientEmail", label: "อีเมลผู้รับ", placeholder: "user@example.com" }
  ];

    switch (templateName) {
      case "OpenRegisterTemplate":
        return [
          ...commonFields,
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Workshop การพัฒนาทักษะ" },
          { key: "activityDate", label: "วันที่", placeholder: "20 ธันวาคม 2024" },
          { key: "activityTime", label: "เวลา", placeholder: "09:00 - 16:00" },
          { key: "building", label: "ตึก", placeholder: "อาคารคณะวิทยาการสารสนเทศ" },
          { key: "floor", label: "ชั้น", placeholder: "3" },
          { key: "room", label: "ห้อง", placeholder: "301" },
          { key: "maxParticipants", label: "จำนวนที่รับ", placeholder: "30" },
          { key: "registrationLink", label: "ลิงก์ลงทะเบียน", placeholder: "https://example.com/register" },
          { key: "deadline", label: "วันหมดเขต", placeholder: "15 ธันวาคม 2024" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "activity@buu.ac.th" },
          { key: "activityImage", label: "ลิงก์รูปภาพ", placeholder: "https://example.com/image.jpg" },
          { key: "activityDateISO", label: "วันที่เริ่มต้น (ISO)", placeholder: "20241220T090000Z" },
          { key: "activityEndDateISO", label: "วันที่สิ้นสุด (ISO)", placeholder: "20241220T160000Z" },
          { key: "organizerName", label: "ชื่อผู้จัด", placeholder: "คณะวิทยาการสารสนเทศ" },
          { key: "activityType", label: "ประเภทกิจกรรม", placeholder: "Soft Skill" },
          { key: "hoursEarned", label: "จำนวนชั่วโมง", placeholder: "3" }
        ];
      
      case "ReminderTemplate":
        return [
          ...commonFields,
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Workshop การพัฒนาทักษะ" },
          { key: "activityDate", label: "วันที่", placeholder: "พรุ่งนี้" },
          { key: "activityTime", label: "เวลา", placeholder: "09:00 - 16:00" },
          { key: "building", label: "ตึก", placeholder: "อาคารคณะวิทยาการสารสนเทศ" },
          { key: "floor", label: "ชั้น", placeholder: "3" },
          { key: "room", label: "ห้อง", placeholder: "301" },
          { key: "requirements", label: "สิ่งที่ต้องเตรียม", placeholder: "เอกสารและเครื่องเขียน" },
          { key: "activityLink", label: "ลิงก์กิจกรรม", placeholder: "https://example.com/activity" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "activity@buu.ac.th" },
          { key: "activityImage", label: "ลิงก์รูปภาพ", placeholder: "https://example.com/image.jpg" },
          { key: "activityDateISO", label: "วันที่เริ่มต้น (ISO)", placeholder: "20241220T090000Z" },
          { key: "activityEndDateISO", label: "วันที่สิ้นสุด (ISO)", placeholder: "20241220T160000Z" },
          { key: "organizerName", label: "ชื่อผู้จัด", placeholder: "คณะวิทยาการสารสนเทศ" },
          { key: "activityType", label: "ประเภทกิจกรรม", placeholder: "Soft Skill" },
          { key: "hoursEarned", label: "จำนวนชั่วโมง", placeholder: "3" }
        ];
      
      case "updateActivityTemplate":
        return [
          ...commonFields,
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Workshop การพัฒนาทักษะ" },
          { key: "activityDate", label: "วันที่", placeholder: "20 ธันวาคม 2024" },
          { key: "activityTime", label: "เวลา", placeholder: "09:00 - 16:00" },
          { key: "building", label: "ตึก", placeholder: "อาคารคณะวิทยาการสารสนเทศ" },
          { key: "floor", label: "ชั้น", placeholder: "3" },
          { key: "room", label: "ห้อง", placeholder: "301" },
          { key: "activityLink", label: "ลิงก์กิจกรรม", placeholder: "https://example.com/activity" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "tanapatwave14@gmail.com" },
          { key: "activityImage", label: "ลิงก์รูปภาพ", placeholder: "https://example.com/image.jpg" },
          { key: "activityDateISO", label: "วันที่เริ่มต้น (ISO)", placeholder: "20241220T090000Z" },
          { key: "activityEndDateISO", label: "วันที่สิ้นสุด (ISO)", placeholder: "20241220T160000Z" },
          { key: "organizerName", label: "ชื่อผู้จัด", placeholder: "คณะวิทยาการสารสนเทศ" },
          { key: "activityType", label: "ประเภทกิจกรรม", placeholder: "Soft Skill" },
          { key: "hoursEarned", label: "จำนวนชั่วโมง", placeholder: "3" },
          { key: "maxParticipants", label: "จำนวนที่รับ", placeholder: "50" }
        ];
      
      case "createActivityTemplate":
        return [
          ...commonFields,
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Workshop การพัฒนาทักษะ" },
          { key: "activityDate", label: "วันที่", placeholder: "20 ธันวาคม 2024" },
          { key: "activityTime", label: "เวลา", placeholder: "09:00 - 16:00" },
          { key: "activityLocation", label: "สถานที่", placeholder: "ห้องประชุม 301" },
          { key: "activityType", label: "ประเภทกิจกรรม", placeholder: "Workshop" },
          { key: "activityLink", label: "ลิงก์กิจกรรม", placeholder: "https://example.com/activity" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "tanapatwave14@gmail.com" }
        ];
      
      case "WarningStudentTemplate":
        return [
          ...commonFields,
          { key: "warningType", label: "ประเภทคำเตือน", placeholder: "พฤติกรรมไม่เหมาะสม" },
          { key: "warningDate", label: "วันที่เตือน", placeholder: "วันนี้" },
          { key: "warningDetails", label: "รายละเอียด", placeholder: "กรุณาปรับปรุงพฤติกรรม" },
          { key: "consequences", label: "ผลกระทบ", placeholder: "อาจส่งผลต่อการประเมินผล" },
          { key: "contactLink", label: "ลิงก์ติดต่อ", placeholder: "https://example.com/contact" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "advisor@buu.ac.th" }
        ];
      
      case "DeleteActivityTemplate":
        return [
          { key: "recipientEmail", label: "อีเมลผู้รับ", placeholder: "tanapatwave14@gmail.com" },
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Workshop การพัฒนาทักษะ" },
          { key: "activityDate", label: "วันที่ที่เคยกำหนด", placeholder: "20 ธันวาคม 2024" },
          { key: "activityTime", label: "เวลาที่เคยกำหนด", placeholder: "09:00 - 16:00" },
          { key: "building", label: "ตึก", placeholder: "อาคารคณะวิทยาการสารสนเทศ" },
          { key: "floor", label: "ชั้น", placeholder: "3" },
          { key: "room", label: "ห้อง", placeholder: "301" },
          { key: "contactLink", label: "ลิงก์ติดต่อ", placeholder: "https://example.com/contact" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "tanapatwave14@gmail.com" },
          { key: "activityImage", label: "ลิงก์รูปภาพ", placeholder: "https://example.com/image.jpg" },
          { key: "organizerName", label: "ชื่อผู้จัด", placeholder: "คณะวิทยาการสารสนเทศ" },
          { key: "activityType", label: "ประเภทกิจกรรม", placeholder: "Soft Skill" },
          { key: "hoursEarned", label: "จำนวนชั่วโมง", placeholder: "3" },
          { key: "maxParticipants", label: "จำนวนที่เคยรับ", placeholder: "50" }
        ];
      
      case "TestDeleteTemplate":
        return [
          { key: "recipientEmail", label: "อีเมลผู้รับ", placeholder: "tanapatwave14@gmail.com" },
          { key: "activityName", label: "ชื่อกิจกรรม", placeholder: "Test Activity" }
        ];
      
      case "NewCourseTemplate":
        return [
          { key: "recipientEmail", label: "อีเมลผู้รับ", placeholder: "tanapatwave14@gmail.com" },
          { key: "activityName", label: "ชื่อคอร์ส", placeholder: "คอร์สการพัฒนาทักษะ" },
          { key: "organizerName", label: "ผู้สอน", placeholder: "คณะวิทยาการสารสนเทศ" },
          { key: "activityType", label: "ประเภท", placeholder: "Hard Skill" },
          { key: "hoursEarned", label: "ชั่วโมงที่ได้รับ", placeholder: "6" },
          { key: "message", label: "ข้อความ", placeholder: "คอร์สได้เริ่มต้นแล้ว กรุณาเข้าร่วมตามเวลาที่กำหนด" },
          { key: "contactEmail", label: "อีเมลติดต่อ", placeholder: "instructor@buu.ac.th" },
          { key: "activityLink", label: "ลิงก์คอร์ส", placeholder: "https://example.com/course" },
          { key: "activityImage", label: "ลิงก์รูปภาพ", placeholder: "https://example.com/image.jpg" }
        ];
      
      default:
        return commonFields;
    }
  };

  // ข้อมูลเริ่มต้นสำหรับแต่ละ template
  const getDefaultData = (templateName: string) => {
    switch (templateName) {
      case "OpenRegisterTemplate":
        return {
    name: "สมชาย ใจดี",
    message: "กิจกรรมนี้จะช่วยพัฒนาทักษะการทำงานเป็นทีม",
          recipientEmail: "tanapatwave14@gmail.com",
    activityName: "Workshop การพัฒนาทักษะการนำเสนอ",
    activityDate: "20 ธันวาคม 2024",
    activityTime: "09:00 - 16:00",
          building: "อาคารคณะวิทยาการสารสนเทศ",
          floor: "3",
          room: "301",
    maxParticipants: "30",
    registrationLink: "https://example.com/register",
    deadline: "15 ธันวาคม 2024",
    contactEmail: "activity@buu.ac.th",
          activityImage: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
          activityDateISO: "20241220T090000Z",
          activityEndDateISO: "20241220T160000Z",
          organizerName: "คณะวิทยาการสารสนเทศ",
          activityType: "Soft Skill",
          hoursEarned: "3"
        };
      
            case "ReminderTemplate":
        return {
          name: "สมชาย ใจดี",
          message: "กรุณาเตรียมเอกสารและเครื่องเขียนมาให้ครบ",
          recipientEmail: "tanapatwave14@gmail.com",
          activityName: "Workshop การพัฒนาทักษะการนำเสนอ",
          activityDate: "พรุ่งนี้",
          activityTime: "09:00 - 16:00",
          building: "อาคารคณะวิทยาการสารสนเทศ",
          floor: "3",
          room: "301",
          requirements: "เอกสารและเครื่องเขียน",
          activityLink: "https://example.com/activity",
          contactEmail: "activity@buu.ac.th",
          activityImage: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
          activityDateISO: "20241220T090000Z",
          activityEndDateISO: "20241220T160000Z",
          organizerName: "คณะวิทยาการสารสนเทศ",
          activityType: "Soft Skill",
          hoursEarned: "3"
        };
      
      case "updateActivityTemplate":
        return {
          name: "สมชาย ใจดี",
          message: "มีการเปลี่ยนแปลงในรายละเอียดกิจกรรม กรุณาตรวจสอบข้อมูลใหม่",
          recipientEmail: "tanapatwave14@gmail.com",
          activityName: "Workshop การพัฒนาทักษะการนำเสนอ",
          activityDate: "25 ธันวาคม 2024",
          activityTime: "13:00 - 17:00",
          building: "อาคารคณะวิทยาการสารสนเทศ",
          floor: "4",
          room: "401",
          activityLink: "https://example.com/activity",
          contactEmail: "tanapatwave14@gmail.com",
          activityImage: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
          activityDateISO: "20241225T130000Z",
          activityEndDateISO: "20241225T170000Z",
          organizerName: "คณะวิทยาการสารสนเทศ",
          activityType: "Soft Skill",
          hoursEarned: "4",
          maxParticipants: "40"
        };
      
      case "createActivityTemplate":
        return {
          name: "สมชาย ใจดี",
          message: "กิจกรรมใหม่ได้ถูกสร้างขึ้นในระบบเรียบร้อยแล้ว",
          activityName: "Workshop การพัฒนาทักษะการนำเสนอ",
          activityDate: "20 ธันวาคม 2024",
          activityTime: "09:00 - 16:00",
          activityLocation: "ห้องประชุม 301 อาคาร 3",
          activityType: "Workshop",
          activityLink: "https://example.com/activity",
          contactEmail: "tanapatwave14@gmail.com"
        };
      
      case "WarningStudentTemplate":
        return {
          name: "สมชาย ใจดี",
          message: "กรุณาปรับปรุงพฤติกรรมและปฏิบัติตามกฎระเบียบ",
          warningType: "พฤติกรรมไม่เหมาะสม",
          warningDate: "วันนี้",
          warningDetails: "มาสายและไม่ส่งงานตรงเวลา",
          consequences: "อาจส่งผลต่อการประเมินผลและเกรด",
          contactLink: "https://example.com/contact",
          contactEmail: "advisor@buu.ac.th"
        };
      
      case "DeleteActivityTemplate":
        return {
          recipientEmail: "tanapatwave14@gmail.com",
          activityName: "Workshop การพัฒนาทักษะการนำเสนอ",
          activityDate: "20 ธันวาคม 2024",
          activityTime: "09:00 - 16:00",
          building: "อาคารคณะวิทยาการสารสนเทศ",
          floor: "3",
          room: "301",
          contactLink: "https://example.com/contact",
          contactEmail: "tanapatwave14@gmail.com",
          activityImage: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg",
          organizerName: "คณะวิทยาการสารสนเทศ",
          activityType: "Soft Skill",
          hoursEarned: "3",
          maxParticipants: "50"
        };
      
      case "TestDeleteTemplate":
        return {
          recipientEmail: "tanapatwave14@gmail.com",
          activityName: "Test Activity"
        };
      
      case "NewCourseTemplate":
        return {
          recipientEmail: "tanapatwave14@gmail.com",
          activityName: "คอร์สการพัฒนาทักษะการนำเสนอ",
          organizerName: "คณะวิทยาการสารสนเทศ",
          activityType: "Hard Skill",
          hoursEarned: "6",
          message: "คอร์สการพัฒนาทักษะการนำเสนอได้เริ่มต้นแล้ว กรุณาเข้าร่วมตามเวลาที่กำหนด",
          contactEmail: "instructor@buu.ac.th",
          activityLink: "https://example.com/course",
          activityImage: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/F1F2/production/_118283916_b19c5a1f-162b-410b-8169-f58f0d153752.jpg"
        };
      
      default:
        return {
          name: "ผู้ใช้",
          message: "ข้อความตัวอย่าง",
          recipientEmail: "user@example.com"
        };
    }
  };

  const currentFields = selectedTemplate ? getTemplateFields(selectedTemplate) : [];

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        📧 Email Template Preview
      </Typography>

      {/* Template Selection Card */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          เลือก Template และข้อมูล
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Template</InputLabel>
            <Select
              value={selectedTemplate}
              label="Template"
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              {templates.map((template) => (
                <MenuItem key={template} value={template}>
                  {template}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={previewTemplate}
            disabled={loading || !selectedTemplate}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "กำลังโหลด..." : "Refresh Preview"}
          </Button>

          <Button
            variant="outlined"
            onClick={fetchTemplates}
            disabled={loading}
          >
            Refresh Templates
          </Button>

              <Button
                variant="contained"
                color="success"
                onClick={sendEmail}
                disabled={loading || !selectedTemplate || !templateData.recipientEmail}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "กำลังส่ง..." : "📧 ส่งอีเมล"}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {error}
          </Alert>
        )}

        {/* Dynamic Form Fields */}
        {selectedTemplate && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              ข้อมูลสำหรับ Template: {selectedTemplate}
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
              {currentFields.map((field) => (
          <TextField
                  key={field.key}
                  fullWidth
                  label={field.label}
                  value={templateData[field.key] || ""}
                  onChange={(e) => handleDataChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  size="small"
                />
              ))}
        </Box>
        </Box>
        )}
      </Paper>

      {/* Preview Result */}
      {previewHtml ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Preview Result
          </Typography>
          
          <Box sx={{ 
            border: "1px solid #ddd", 
            borderRadius: 1, 
            p: 3, 
            backgroundColor: "#f9f9f9",
            minHeight: 600,
            maxHeight: 800,
            overflow: "auto",
            width: "100%"
          }}>
            <div 
              dangerouslySetInnerHTML={{ __html: previewHtml }}
              style={{ 
                fontFamily: "Arial, sans-serif",
                lineHeight: 1.6
              }}
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              HTML Source:
            </Typography>
            <Box
              component="pre"
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                fontSize: "0.8rem",
                maxHeight: 300
              }}
            >
              {previewHtml}
            </Box>
          </Box>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, textAlign: "center", minHeight: 400 }}>
          <Typography color="text.secondary">
            เลือก template เพื่อดู preview
          </Typography>
        </Paper>
      )}

      {templates.length === 0 && !loading && (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            ไม่พบ templates ที่ใช้งานได้
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default EmailTemplatePreview;
