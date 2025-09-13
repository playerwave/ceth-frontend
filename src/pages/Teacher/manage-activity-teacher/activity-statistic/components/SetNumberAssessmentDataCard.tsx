import { useState } from "react";
import CustomCard from "../../../../../components/Card";
import PieChart from "../../../../../components/Charts/PieChart";

interface AssessmentQuestion {
  question: string;
  most: number;
  much: number;
  medium: number;
  less: number;
  least: number;
  average: number;
}

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface AssessmentTopicCardProps {
  topicTitle: string;
  questions: AssessmentQuestion[];
  pieData: PieChartData[];
  totalRespondents: number;
}

export default function AssessmentTopicCard({ 
  topicTitle, 
  questions, 
  pieData, 
  totalRespondents 
}: AssessmentTopicCardProps) {
  const [showChart, setShowChart] = useState(false);
  return (
    <CustomCard
      className="w-full
                max-w-[90vw]         
                sm:max-w-[600px]     
                md:max-w-[700px]     
                lg:max-w-[100%]
                p-4 sm:p-6 relative
                mx-0 self-start
                shadow-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">
          {topicTitle}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChart(false)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              !showChart 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            หัวข้อ
          </button>
          <button
            onClick={() => setShowChart(true)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              showChart 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            กราฟ
          </button>
        </div>
      </div>
      
      <div className={'overflow-y-auto'}>
        {showChart ? (
          <PieChart 
            data={pieData}
            height={250}
            outerRadius={90}
            showLegend={true}
            legendPosition="right"
            totalText={`จากผู้ทำแบบประเมินทั้งหมด ${totalRespondents} คน`}
          />
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm table-fixed min-w-[600px]">
              <thead>
                <tr className="text-left text-[#A0AEC0]">
                  <th className="p-2 w-[300px]">คำถาม</th>
                  <th className="p-2 text-center w-[80px]">มากที่สุด</th>
                  <th className="p-2 text-center w-[60px]">มาก</th>
                  <th className="p-2 text-center w-[80px]">ปานกลาง</th>
                  <th className="p-2 text-center w-[60px]">น้อย</th>
                  <th className="p-2 text-center w-[80px]">น้อยที่สุด</th>
                  <th className="p-2 text-right w-[80px]">ค่าเฉลี่ย</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-2 w-[300px] break-words">{item.question}</td>
                    <td className="p-2 text-center w-[80px]">{item.most}</td>
                    <td className="p-2 text-center w-[60px]">{item.much}</td>
                    <td className="p-2 text-center w-[80px]">{item.medium}</td>
                    <td className="p-2 text-center w-[60px]">{item.less}</td>
                    <td className="p-2 text-center w-[80px]">{item.least}</td>
                    <td className="p-2 text-right w-[80px] font-semibold">
                      {item.average.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomCard>
  );
}
