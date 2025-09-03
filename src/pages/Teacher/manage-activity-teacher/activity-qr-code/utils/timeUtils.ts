/**
 * แสดงเวลาตรงๆ จาก database โดยไม่แปลง timezone
 * @param timeString - เวลาในรูปแบบ string จาก database
 * @returns เวลาในรูปแบบ string หรือ "-" ถ้าไม่มีข้อมูล
 */
export const formatTimeDirect = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  
  try {
    const date = new Date(timeString);
    
    // แสดงเวลาตรงๆ จาก database โดยไม่แปลง timezone
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    console.error("❌ Error formatting time:", error);
    return "-";
  }
};

/**
 * แปลงเวลาเป็น local time สำหรับประเทศไทย
 * @param timeString - เวลาในรูปแบบ string (UTC หรือ local)
 * @returns เวลาในรูปแบบ local string หรือ "-" ถ้าไม่มีข้อมูล
 */
export const formatTimeToLocal = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  
  try {
    const date = new Date(timeString);
    
    // ตรวจสอบว่าเป็น UTC time หรือไม่
    const isUTC = timeString.includes('Z') || timeString.includes('UTC');
    
    if (isUTC) {
      // ถ้าเป็น UTC ให้แปลงเป็น local time (+7 hours for Thailand)
      const localDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
      return localDate.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
      });
    } else {
      // ถ้าไม่ใช่ UTC ให้แสดงเป็น local time โดยตรง
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
      });
    }
  } catch (error) {
    console.error("❌ Error formatting time:", error);
    return "-";
  }
};

/**
 * แปลงเวลาเป็น local time แบบย่อ (เฉพาะเวลา)
 * @param timeString - เวลาในรูปแบบ string
 * @returns เวลาในรูปแบบ local string หรือ "-" ถ้าไม่มีข้อมูล
 */
export const formatTimeOnly = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  
  try {
    const date = new Date(timeString);
    
    // ตรวจสอบว่าเป็น UTC time หรือไม่
    const isUTC = timeString.includes('Z') || timeString.includes('UTC');
    
    if (isUTC) {
      // ถ้าเป็น UTC ให้แปลงเป็น local time (+7 hours for Thailand)
      const localDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
      return localDate.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
      });
    } else {
      // ถ้าไม่ใช่ UTC ให้แสดงเป็น local time โดยตรง
      return date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
      });
    }
  } catch (error) {
    console.error("❌ Error formatting time only:", error);
    return "-";
  }
};

/**
 * แปลงเวลาเป็น local date แบบย่อ (เฉพาะวันที่)
 * @param timeString - เวลาในรูปแบบ string
 * @returns วันที่ในรูปแบบ local string หรือ "-" ถ้าไม่มีข้อมูล
 */
export const formatDateOnly = (timeString: string | null | undefined): string => {
  if (!timeString) return "-";
  
  try {
    const date = new Date(timeString);
    
    // ตรวจสอบว่าเป็น UTC time หรือไม่
    const isUTC = timeString.includes('Z') || timeString.includes('UTC');
    
    if (isUTC) {
      // ถ้าเป็น UTC ให้แปลงเป็น local time (+7 hours for Thailand)
      const localDate = new Date(date.getTime() + (7 * 60 * 60 * 1000));
      return localDate.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Bangkok'
      });
    } else {
      // ถ้าไม่ใช่ UTC ให้แสดงเป็น local date โดยตรง
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Bangkok'
      });
    }
  } catch (error) {
    console.error("❌ Error formatting date only:", error);
    return "-";
  }
};
