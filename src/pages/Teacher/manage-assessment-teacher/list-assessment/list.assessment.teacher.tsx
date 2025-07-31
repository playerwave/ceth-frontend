import { useNavigate } from "react-router-dom";
const listAssessmentTeacher = () => {

  const navigate = useNavigate();
  return (
    <div className="ml-50">
      <h1 className="font-pt-sans"> editAssessment</h1>
      <button
        onClick={() => navigate("/create-assessment-teacher")}
        className=" px-3 py-2 text-sm bg-blue-800 text-white rounded-lg hover:bg-blue-900 gap-1 flex items-center justify-center min-w-[100px]"
      >
         <span >เพิ่มแบบประเมิน
          </span> 
         </button>

    </div>
  );
};

export default listAssessmentTeacher;
