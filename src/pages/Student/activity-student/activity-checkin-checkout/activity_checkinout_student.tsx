import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../../../../components/Card";
import Button from "../../../../components/Button";
import { useActivityStore } from "../../../../stores/Student/activity.store.student";

interface CheckInOutFormData {
  username: string;
  password: string;
}

export default function ActivityCheckInOutStudent() {
  const { id } = useParams();
  const [formData, setFormData] = useState<CheckInOutFormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ฟังก์ชันสำหรับกำหนด text ตาม activity_state
  const getActivityText = () => {
    if (!activity) return { title: "ลงทะเบียนเข้าร่วมกิจกรรม", button: "ลงทะเบียนเข้าร่วมกิจกรรม" };
    
    if (activity.activity_state === "Start Activity") {
      return {
        title: "ลงชื่อเข้าร่วมกิจกรรม",
        button: "ลงชื่อเข้าร่วมกิจกรรม"
      };
    } else if (activity.activity_state === "End Activity") {
      return {
        title: "ลงชื่อออกจากกิจกรรม",
        button: "ลงชื่อออกจากกิจกรรม"
      };
    } else {
      return {
        title: "ลงทะเบียนเข้าร่วมกิจกรรม",
        button: "ลงทะเบียนเข้าร่วมกิจกรรม"
      };
    }
  };

  const { fetchActivity, checkInOutActivity } = useActivityStore();

  // ดึงข้อมูลกิจกรรมเมื่อโหลดหน้า
  useEffect(() => {
    const loadActivity = async () => {
      if (id) {
        try {
          console.log("🔍 Loading activity data for ID:", id);
          const activityData = await fetchActivity(parseInt(id));
          setActivity(activityData);
          console.log("✅ Activity loaded:", activityData);
        } catch (error) {
          console.error("❌ Error loading activity:", error);
          setMessage({
            type: "error",
            text: "ไม่สามารถโหลดข้อมูลกิจกรรมได้"
          });
        } finally {
          setActivityLoading(false);
        }
      }
    };

    loadActivity();
  }, [id, fetchActivity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      console.log("Submitting form data:", formData);
      console.log("Activity ID:", id);
      
      if (!id) {
        throw new Error("ไม่พบรหัสกิจกรรม");
      }

      const result = await checkInOutActivity(parseInt(id), formData.username, formData.password);
      
      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "ลงทะเบียนเข้าร่วมกิจกรรมสำเร็จ!"
        });
        
        // Reset form
        setFormData({
          username: "",
          password: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "เกิดข้อผิดพลาดในการลงทะเบียน"
        });
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setMessage({
        type: "error",
        text: error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง"
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.username.trim() && 
                     formData.password.trim();

  if (activityLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูลกิจกรรม...</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto px-4">
          <Card>
            <div className="text-center">
              <p className="text-red-600">ไม่พบข้อมูลกิจกรรม</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {getActivityText().title}
            </h1>
            <p className="text-gray-600 mb-4">
              กรุณากรอกข้อมูลเพื่อ{getActivityText().title.toLowerCase()}
            </p>
            
            {/* ข้อมูลกิจกรรม */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h2 className="font-semibold text-blue-800 mb-2">
                {activity.activity_name}
              </h2>
              <p className="text-sm text-blue-700">
                กิจกรรม ID: {activity.activity_id}
              </p>
              {activity.event_format && (
                <p className="text-sm text-blue-700">
                  รูปแบบ: {activity.event_format}
                </p>
              )}
            </div>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === "success" 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              <p className="text-sm">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* รหัสนิสิต */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสนิสิต <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสนิสิต"
                maxLength={10}
              />
            </div>

            {/* รหัสผ่าน */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่าน"
              />
            </div>

            {/* ปุ่ม Submit */}
            <div className="pt-4 flex justify-center">
              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full max-w-xs"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังลงทะเบียน...
                  </span>
                ) : (
                  getActivityText().button
                )}
              </Button>
            </div>
          </form>

          {/* ข้อมูลเพิ่มเติม */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              หมายเหตุ:
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน</li>
              <li>• รหัสนิสิตต้องเป็นตัวเลข 8 หลัก</li>
              <li>• เมื่อกรอกข้อมูลและเช็คความถูกต้องแล้ว กดปุ่ม "ลงทะเบียนเข้าร่วมกิจกรรม"</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
