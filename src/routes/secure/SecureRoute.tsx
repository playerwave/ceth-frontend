import React from 'react';
import { useLocation } from 'react-router-dom';
import { URLEncryption, ProtectionLevel, RouteHelpers } from './urlEnCryption';

// 📋 Type definitions
interface SecureParams {
  [key: string]: string | number | boolean | null | undefined;
}

interface SecureRouteProps {
  children: React.ReactNode;
  protectionLevel: ProtectionLevel;
  fallback?: React.ReactNode;
}

interface SecureComponentProps {
  secureParams: SecureParams;
}

// 🔐 คอมโพเนนต์สำหรับจัดการเส้นทางที่เข้ารหัส
export const SecureRoute: React.FC<SecureRouteProps> = ({ 
  children, 
  protectionLevel, 
  fallback = <div>ไม่สามารถเข้าถึงข้อมูลได้</div> 
}) => {
  const location = useLocation();
  const [params, setParams] = React.useState<SecureParams>({});
  const [isValid, setIsValid] = React.useState<boolean>(true);

  React.useEffect(() => {
    try {
      // ดึงพารามิเตอร์จาก URL
      const extractedParams = RouteHelpers.parseSecureParams(location.pathname, protectionLevel);
      
      if (Object.keys(extractedParams).length > 0) {
        // มีข้อมูลที่เข้ารหัส
        setParams(extractedParams as SecureParams);
        setIsValid(true);
      } else if (protectionLevel === ProtectionLevel.NONE) {
        // ไม่เข้ารหัส - ให้ผ่านเสมอ
        setIsValid(true);
      } else {
        // มีการตั้งค่าให้เข้ารหัส แต่ไม่มีข้อมูลที่เข้ารหัส
        // ให้ผ่านไปได้ (สำหรับ URL ปกติที่ยังไม่เข้ารหัส)
        setIsValid(true);
        console.warn('⚠️ URL ไม่ได้เข้ารหัส แต่ยังให้ผ่านไปได้');
      }
    } catch (error) {
      console.error('ไม่สามารถประมวลผลเส้นทางที่เข้ารหัสได้:', error);
      // ให้ผ่านไปได้แม้มี error (สำหรับ backward compatibility)
      setIsValid(true);
    }
  }, [location.pathname, protectionLevel]);

  // ส่งพารามิเตอร์ที่ถอดรหัสแล้วให้กับ children
  const childrenWithParams = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      // ใช้ type assertion ที่ปลอดภัยกว่า
      return React.cloneElement(child as React.ReactElement<SecureComponentProps>, { 
        secureParams: params 
      });
    }
    return child;
  });

  if (!isValid) {
    return <>{fallback}</>;
  }

  return <>{childrenWithParams}</>;
};

// 🔧 Hook สำหรับใช้พารามิเตอร์ที่เข้ารหัสในคอมโพเนนต์
export const useSecureParams = (): SecureParams => {
  const location = useLocation();
  const [params, setParams] = React.useState<SecureParams>({});

  React.useEffect(() => {
    // ตรวจสอบว่า URL มีข้อมูลที่เข้ารหัสหรือไม่
    if (URLEncryption.isEncryptedURL(location.pathname)) {
      const extractedParams = URLEncryption.extractParams(location.pathname, true);
      setParams(extractedParams as SecureParams);
    } else {
      // ถ้าไม่ใช่ URL ที่เข้ารหัส ให้ดึงจาก query parameters
      const url = new URL(location.pathname, window.location.origin);
      const queryParams: SecureParams = {};
      url.searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      setParams(queryParams);
    }
  }, [location.pathname]);

  return params;
};

// 🔗 Hook สำหรับสร้าง URL ที่เข้ารหัส
export const useSecureLink = () => {
  const createSecureLink = (
    basePath: string, 
    params: Record<string, any>, 
    protectionLevel: ProtectionLevel = ProtectionLevel.ENCRYPTED
  ): string => {
    return RouteHelpers.generateSecurePath(basePath, params, protectionLevel);
  };

  const navigateToSecure = (
    basePath: string, 
    params: Record<string, any>, 
    protectionLevel: ProtectionLevel = ProtectionLevel.ENCRYPTED
  ): void => {
    const securePath = createSecureLink(basePath, params, protectionLevel);
    window.location.href = securePath;
  };

  return { 
    createSecureLink, 
    navigateToSecure 
  };
};

// 🔧 Utility function สำหรับ type-safe parameter extraction
export const extractSecureParam = <T extends string | number | boolean>(
  params: SecureParams, 
  key: string, 
  defaultValue: T
): T => {
  const value = params[key];
  if (value === undefined || value === null) {
    return defaultValue;
  }
  
  // Type-safe conversion
  if (typeof defaultValue === 'number') {
    return (Number(value) || defaultValue) as T;
  }
  if (typeof defaultValue === 'boolean') {
    return (value === 'true' || value === true) as T;
  }
  return (String(value)) as T;
};

// 🔧 Utility function สำหรับตรวจสอบ parameter
export const hasSecureParam = (params: SecureParams, key: string): boolean => {
  return params[key] !== undefined && params[key] !== null;
};