import { useNavigate } from "react-router-dom";
import Card from "../../../../../components/Card";

interface StatisticCardProps {
  activityId?: string | number;
}

export default function StatisticCard({ activityId }: StatisticCardProps) {
  const navigate = useNavigate();

  const handleNavigateToStatistic = () => {
    if (activityId) {
      console.log("🔍 StatisticCard: Navigating to statistic page with activityId:", activityId);
      navigate(`/statistic-activity-teacher/${activityId}`);
    } else {
      console.warn("No activityId provided for statistic navigation");
    }
  };

  return (
    <Card className="w-full h-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
      <div 
        className="flex items-center justify-center p-6 h-full"
        onClick={handleNavigateToStatistic}
      >
        <div className="text-center">
          <div className="mb-3">
            <svg 
              className="w-12 h-12 mx-auto text-blue-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            ดูสรุปผลกิจกรรม
          </h3>
          <p className="text-sm text-gray-600">
            คลิกเพื่อดูรายละเอียดและสถิติของกิจกรรมนี้
          </p>
        </div>
      </div>
    </Card>
  );
}
