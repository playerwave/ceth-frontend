import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from '@mui/material';
import Button from '../../../../../components/Button';
import { useUserStore } from '../../../../../stores/Teacher/student.store';

interface UploadStudentsDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadStudentsDialog: React.FC<UploadStudentsDialogProps> = ({
  open,
  onClose,
  onUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  
  const { uploadStudents, loading } = useUserStore();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setToastMessage("กรุณาเลือกไฟล์");
      setToastSeverity('error');
      setToastOpen(true);
      return;
    }
    
    try {
      const result = await uploadStudents(selectedFile);
      
      if (result.success) {
        setToastMessage(result.message);
        setToastSeverity('success');
        setToastOpen(true);
        setSelectedFile(null);
        onClose();
      } else {
        setToastMessage(result.message);
        setToastSeverity('error');
        setToastOpen(true);
      }
    } catch (error) {
      setToastMessage("เกิดข้อผิดพลาดในการอัปโหลด");
      setToastSeverity('error');
      setToastOpen(true);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          textAlign: 'center', 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#1E3A8A',
          padding: '24px 24px 16px 24px'
        }}
      >
        อัปโหลดข้อมูลนิสิต
      </DialogTitle>
      
      <DialogContent sx={{ padding: '0 24px 24px 24px' }}>
        <div className="flex flex-col items-center justify-center">
          {/* File Upload Area */}
          <div
            className={`relative w-full max-w-md h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : selectedFile 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileInput}
              accept=".xlsx,.xls,.csv"
            />
            
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Upload Icon */}
                <div className="text-blue-400">
                  <svg height="60" viewBox="0 0 640 512" className="mx-auto">
                    <path 
                      d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" 
                      fill="currentColor"
                    />
                  </svg>
                </div>
                
                {selectedFile ? (
                  <div className="text-center">
                    <p className="text-green-600 font-semibold text-lg">ไฟล์ที่เลือก</p>
                    <p className="text-gray-600 text-sm mt-1">{selectedFile.name}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-700 font-semibold text-lg">ลากและวางไฟล์</p>
                    <p className="text-gray-500 text-sm mt-1">หรือ</p>
                    <span className="inline-block mt-2 px-4 py-2 bg-blue-400 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors">
                      เลือกไฟล์
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>
          
          {/* File Format Info */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              รองรับไฟล์: .xlsx, .xls, .csv
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ขนาดไฟล์สูงสุด: 10 MB
            </p>
          </div>
        </div>
      </DialogContent>
      
      <DialogActions sx={{ padding: '0 24px 24px 24px', justifyContent: 'center', gap: '12px' }}>
        <Button 
          onClick={handleClose}
          bgColor="#6B7280"
          textColor="#FFFFFF"
        >
          ยกเลิก
        </Button>
        <Button 
          onClick={handleUpload}
          bgColor="#1E3A8A"
          textColor="#FFFFFF"
          disabled={!selectedFile || loading}
        >
          {loading ? "กำลังอัปโหลด..." : "อัปโหลด"}
        </Button>
      </DialogActions>
      
      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToastOpen(false)} 
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default UploadStudentsDialog;
