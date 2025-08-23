import React from 'react';
import { useLocation } from 'react-router-dom';
import { URLEncryption, ProtectionLevel, RouteHelpers } from '../utils/urlEncryption';

// 📋 Props สำหรับ SecureRoute
interface SecureRouteProps {
  children: React.ReactNode;
  protectionLevel: ProtectionLevel;
  fallback?: React.ReactNode;
}

// 🔐 คอมโพเนนต์สำหรับจัดการเส้นทางที่เข้ารหัส
export const SecureRoute: React.FC<SecureRouteProps> = ({ 
  children, 
  protectionLevel, 
  fallback = <div>ไม่สามารถเข้าถึงข้อมูลได้</div> 
}) => {
  const location = useLocation();
  const [params, setParams] = React.useState<Record<string, unknown>>({});
  const [isValid, setIsValid] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      // ดึงพารามิเตอร์จาก URL
      const extractedParams = RouteHelpers.parseSecureParams(location.pathname, protectionLevel);
      
      if (Object.keys(extractedParams).length > 0) {
        setParams(extractedParams);
        setIsValid(true);
      } else {
        // ถ้าไม่มีพารามิเตอร์ที่เข้ารหัส ให้ตรวจสอบว่าเป็น URL ปกติหรือไม่
        setIsValid(protectionLevel === ProtectionLevel.NONE);
      }
    } catch (error) {
      console.error('ไม่สามารถประมวลผลเส้นทางที่เข้ารหัสได้:', error);
      setIsValid(false);
    }
  }, [location.pathname, protectionLevel]);

  // ส่งพารามิเตอร์ที่ถอดรหัสแล้วให้กับ children
  const childrenWithParams = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, { secureParams: params });
    }
    return child;
  });

  if (!isValid) {
    return <>{fallback}</>;
  }

  return <>{childrenWithParams}</>;
};

// 🔧 Hook สำหรับใช้พารามิเตอร์ที่เข้ารหัสในคอมโพเนนต์
export const useSecureParams = () => {
  const location = useLocation();
  const [params, setParams] = React.useState<Record<string, unknown>>({});

  React.useEffect(() => {
    // ตรวจสอบว่า URL มีข้อมูลที่เข้ารหัสหรือไม่
    if (URLEncryption.isEncryptedURL(location.pathname)) {
      const extractedParams = URLEncryption.extractParams(location.pathname, true);
      setParams(extractedParams);
    } else {
      // ถ้าไม่ใช่ URL ที่เข้ารหัส ให้ดึงจาก query parameters
      const url = new URL(location.pathname, window.location.origin);
      const queryParams: Record<string, unknown> = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      setParams(queryParams);
    }
  }, [location.pathname]);

  return params;
};

// 🔗 Hook สำหรับสร้าง URL ที่เข้ารหัส
export const useSecureNavigation = () => {
  const navigate = (basePath: string, params: Record<string, unknown>, protectionLevel: ProtectionLevel = ProtectionLevel.ENCRYPTED) => {
    const securePath = RouteHelpers.generateSecurePath(basePath, params, protectionLevel);
    window.location.href = securePath;
  };

  return { navigate };
}; 