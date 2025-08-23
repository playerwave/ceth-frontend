import React from 'react';
import { Link } from 'react-router-dom';
import { ProtectionLevel, RouteHelpers } from '../utils/urlEncryption';

// 📋 Props สำหรับ SecureLink
interface SecureLinkProps {
  to: string;
  params?: Record<string, unknown>;
  protectionLevel?: ProtectionLevel;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

// 🔗 คอมโพเนนต์สำหรับสร้างลิงก์ที่เข้ารหัส
export const SecureLink: React.FC<SecureLinkProps> = ({
  to,
  params = {},
  protectionLevel = ProtectionLevel.ENCRYPTED,
  children,
  className,
  onClick
}) => {
  // สร้าง URL ที่เข้ารหัส
  const securePath = RouteHelpers.generateSecurePath(to, params, protectionLevel);

  return (
    <Link 
      to={securePath} 
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

// 🔗 คอมโพเนนต์สำหรับสร้างลิงก์ที่เข้ารหัสแบบง่าย
export const EncodedLink: React.FC<Omit<SecureLinkProps, 'protectionLevel'>> = (props) => {
  return <SecureLink {...props} protectionLevel={ProtectionLevel.ENCODED} />;
};

// 🔗 คอมโพเนนต์สำหรับสร้างลิงก์ที่เข้ารหัสแบบเต็ม
export const EncryptedLink: React.FC<Omit<SecureLinkProps, 'protectionLevel'>> = (props) => {
  return <SecureLink {...props} protectionLevel={ProtectionLevel.ENCRYPTED} />;
};

// 🔗 คอมโพเนนต์สำหรับสร้างลิงก์ปกติ (ไม่เข้ารหัส)
export const NormalLink: React.FC<Omit<SecureLinkProps, 'protectionLevel'>> = (props) => {
  return <SecureLink {...props} protectionLevel={ProtectionLevel.NONE} />;
};

// 🔧 Hook สำหรับสร้าง URL ที่เข้ารหัส
export const useSecureLink = () => {
  const createSecureLink = (
    basePath: string, 
    params: Record<string, unknown>, 
    protectionLevel: ProtectionLevel = ProtectionLevel.ENCRYPTED
  ) => {
    return RouteHelpers.generateSecurePath(basePath, params, protectionLevel);
  };

  const navigateToSecure = (
    basePath: string, 
    params: Record<string, unknown>, 
    protectionLevel: ProtectionLevel = ProtectionLevel.ENCRYPTED
  ) => {
    const securePath = createSecureLink(basePath, params, protectionLevel);
    window.location.href = securePath;
  };

  return {
    createSecureLink,
    navigateToSecure
  };
}; 