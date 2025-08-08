import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Button";

const ListActivityHistoryStudent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/assessment-student");
  };

  return (
    <div className="ml-50">
      <h1 className="font-pt-sans">listActivityHistoryStudent</h1>
      <Button className="bg-gradient-to-r from-red-500 via-blue-500 to-green-500" onClick={handleClick}>
        ปาเร่แบบประเมิน
      </Button>
    </div>
  );
};

export default ListActivityHistoryStudent;
