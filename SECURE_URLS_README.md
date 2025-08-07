# 🔐 ระบบ URL ที่เข้ารหัส (Encrypted/Encoded URLs)

## 📋 ภาพรวม

ระบบนี้ช่วยให้คุณสามารถสร้าง URL ที่เข้ารหัสเพื่อปกป้องข้อมูลสำคัญในแอปพลิเคชัน React ของคุณ โดยมีระดับการป้องกัน 3 ระดับ:

1. **ไม่เข้ารหัส (NONE)** - สำหรับหน้าทั่วไป
2. **เข้ารหัสแบบง่าย (ENCODED)** - สำหรับข้อมูลที่ไม่สำคัญมาก
3. **เข้ารหัสแบบเต็ม (ENCRYPTED)** - สำหรับข้อมูลสำคัญ

## 🚀 การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install crypto-js @types/crypto-js
```

### 2. ตั้งค่า Environment Variable

สร้างไฟล์ `.env` และเพิ่ม:

```env
VITE_ENCRYPTION_KEY=your-secret-key-here
```

## 📁 โครงสร้างไฟล์

```
src/
├── utils/
│   └── urlEncryption.ts          # ระบบเข้ารหัสหลัก
├── components/
│   ├── SecureRoute.tsx           # คอมโพเนนต์จัดการเส้นทางที่เข้ารหัส
│   └── SecureLink.tsx            # คอมโพเนนต์สร้างลิงก์ที่เข้ารหัส
└── examples/
    └── SecureURLExample.tsx      # ตัวอย่างการใช้งาน
```

## 🔧 การใช้งาน

### 1. การกำหนดค่าเส้นทาง

```typescript
// routes/activity.route.tsx
import { ProtectionLevel } from "../utils/urlEncryption";

export const activityRoutes = [
  {
    path: "/activity-info-admin/:id",
    element: <ActivityInfoAdmin />,
    protectionLevel: ProtectionLevel.ENCRYPTED, // เข้ารหัสแบบเต็ม
    roles: ["Teacher", "Admin"]
  },
  {
    path: "/create-activity-admin",
    element: <CreateActivityAdmin />,
    protectionLevel: ProtectionLevel.ENCODED, // เข้ารหัสแบบง่าย
    roles: ["Teacher", "Admin"]
  }
];
```

### 2. การใช้งานใน App.tsx

```typescript
import { SecureRoute } from "./components/SecureRoute";

function App() {
  const renderSecureRoutesByRole = (routes, role) => {
    return routes
      .filter(route => route.roles.includes(role))
      .map((route, index) => (
        <Route
          key={`secure-route-${index}`}
          path={route.path}
          element={
            <ProtectedRoute>
              <Navbar>
                <SecureRoute protectionLevel={route.protectionLevel}>
                  {route.element}
                </SecureRoute>
              </Navbar>
            </ProtectedRoute>
          }
        />
      ));
  };

  return (
    <Routes>
      {renderSecureRoutesByRole(activityRoutes, role)}
    </Routes>
  );
}
```

### 3. การสร้างลิงก์ที่เข้ารหัส

```typescript
import { EncryptedLink, EncodedLink, NormalLink } from "./components/SecureLink";

// ลิงก์ที่เข้ารหัสแบบเต็ม
<EncryptedLink
  to="/activity-info-admin"
  params={{ id: 123, userId: 456 }}
>
  ดูข้อมูลกิจกรรม
</EncryptedLink>

// ลิงก์ที่เข้ารหัสแบบง่าย
<EncodedLink
  to="/create-activity-admin"
  params={{ type: "internship" }}
>
  สร้างกิจกรรม
</EncodedLink>

// ลิงก์ปกติ
<NormalLink
  to="/list-activity-admin"
  params={{ page: 1 }}
>
  รายการกิจกรรม
</NormalLink>
```

### 4. การดึงพารามิเตอร์ที่เข้ารหัส

```typescript
import { useSecureParams } from "./components/SecureRoute";

function ActivityInfoComponent() {
  // ดึงพารามิเตอร์ที่เข้ารหัสจาก URL
  const params = useSecureParams();

  console.log('ID:', params.id);
  console.log('User ID:', params.userId);

  return (
    <div>
      <h1>ข้อมูลกิจกรรม ID: {params.id}</h1>
    </div>
  );
}
```

### 5. การใช้งาน Hook

```typescript
import { useSecureLink } from "./components/SecureLink";

function NavigationComponent() {
  const { createSecureLink, navigateToSecure } = useSecureLink();

  const handleNavigate = () => {
    // สร้าง URL ที่เข้ารหัส
    const secureUrl = createSecureLink("/activity-info-admin", {
      id: 123,
      userId: 456
    }, ProtectionLevel.ENCRYPTED);

    // ไปยัง URL ที่เข้ารหัส
    navigateToSecure("/activity-info-admin", {
      id: 123,
      userId: 456
    }, ProtectionLevel.ENCRYPTED);
  };

  return (
    <button onClick={handleNavigate}>
      ไปยังข้อมูลกิจกรรม
    </button>
  );
}
```

## 🔐 ระดับการป้องกัน

### 1. ไม่เข้ารหัส (NONE)

```typescript
// URL: /activity-info-admin?id=123
// ใช้สำหรับ: หน้าทั่วไปที่ไม่มีความสำคัญ
```

### 2. เข้ารหัสแบบง่าย (ENCODED)

```typescript
// URL: /create-activity-admin/eyJpZCI6MTIzLCJuYW1lIjoiYWN0aXZpdHkifQ==
// ใช้สำหรับ: ข้อมูลที่ไม่สำคัญมาก แต่ต้องการซ่อน
```

### 3. เข้ารหัสแบบเต็ม (ENCRYPTED)

```typescript
// URL: /update-activity-admin/U2FsdGVkX1+ABC123DEF456...
// ใช้สำหรับ: ข้อมูลสำคัญ เช่น token, ID, ข้อมูลส่วนตัว
```

## 🛡️ ความปลอดภัย

### การเข้ารหัสแบบเต็ม (ENCRYPTED)

- ใช้ AES-256-CBC encryption
- ต้องมี SECRET_KEY ใน environment variables
- ปลอดภัยสำหรับข้อมูลสำคัญ

### การเข้ารหัสแบบง่าย (ENCODED)

- ใช้ Base64 encoding
- ไม่ต้องการ secret key
- เหมาะสำหรับข้อมูลที่ไม่สำคัญมาก

## 📝 ตัวอย่างการใช้งานจริง

### 1. หน้าข้อมูลกิจกรรม (สำคัญ)

```typescript
// เข้ารหัสแบบเต็มเพราะมีข้อมูลสำคัญ
{
  path: "/activity-info-admin/:id",
  protectionLevel: ProtectionLevel.ENCRYPTED
}
```

### 2. หน้าสร้างกิจกรรม (ไม่สำคัญมาก)

```typescript
// เข้ารหัสแบบง่าย
{
  path: "/create-activity-admin",
  protectionLevel: ProtectionLevel.ENCODED
}
```

### 3. หน้ารายการกิจกรรม (หน้าหลัก)

```typescript
// ไม่เข้ารหัสเพราะเป็นหน้าหลัก
{
  path: "/list-activity-admin",
  protectionLevel: ProtectionLevel.NONE
}
```

## ⚠️ ข้อควรระวัง

1. **Secret Key**: ต้องตั้งค่า `VITE_ENCRYPTION_KEY` ใน environment variables
2. **URL Length**: URL ที่เข้ารหัสจะยาวขึ้น ระวังเรื่องความยาวของ URL
3. **Browser History**: URL ที่เข้ารหัสจะปรากฏใน browser history
4. **Performance**: การเข้ารหัส/ถอดรหัสใช้ CPU มากขึ้น

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย

1. **Error: "การเข้ารหัสล้มเหลว"**
   - ตรวจสอบ VITE_ENCRYPTION_KEY ใน .env
   - ตรวจสอบว่า crypto-js ติดตั้งแล้ว

2. **Error: "ไม่สามารถดึงพารามิเตอร์ได้"**
   - ตรวจสอบว่า URL ถูกต้อง
   - ตรวจสอบระดับการป้องกัน (protectionLevel)

3. **URL ไม่ทำงาน**
   - ตรวจสอบว่า SecureRoute ครอบคอมโพเนนต์แล้ว
   - ตรวจสอบว่า protectionLevel ถูกต้อง

## 📚 อ้างอิง

- [CryptoJS Documentation](https://cryptojs.gitbook.io/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)
