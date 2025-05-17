import { Link } from "react-router-dom";

const sidebar_admin = () => {
  const handleNotInthisSprint = () => {
    alert("Use Case นี้จะถถูกพัฒนาใน Sprint อื่นๆ ขออภัยในความไม่สะดวก");
  };

  return (
    <div className="w-240px h-screen bg-[3A3F44] text-white p-4">
      <div className="space-y-2">
        <Link to="/">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            หน้าหลัก
          </button>
        </Link>
        <Link to="/main-stu">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            หน้าหลักนิสิต
          </button>
        </Link>
        <Link to="/list-activity-admin">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            กิจกรรมสหกิจ
          </button>
        </Link>
        <Link to="/List-activity-student">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            กิจกรรมนิสิต
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            แบบประเมิน
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            รายชื่อนิสิต
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            จัดการเกียรติบัตร
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            setting
          </button>
        </Link>
        <Link to="/" onClick={handleNotInthisSprint}>
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            logout
          </button>
        </Link>
        <Link to="/crud-test">
          <button className="w-full p-2 bg-blue-500 hover:bg-blue-700 rounded">
            CRUD Example
          </button>
        </Link>
      </div>
    </div>
  );
};

export default sidebar_admin;
