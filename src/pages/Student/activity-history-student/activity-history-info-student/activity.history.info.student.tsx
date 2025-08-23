// src/pages/Student/activity-student/activity-info/ActivityHistoryInfoStudent.tsx
import { useParams, useLocation } from "react-router-dom";

export default function ActivityHistoryInfoStudent() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation() as { state?: { activity?: unknown } };

  return (
    <div style={{ padding: 24 }}>
      <h1>activityHistoryInfoStudent</h1>
      <p>id: {id}</p>
      
      {location.state?.activity ? (
        <pre style={{ background: "#f3f4f6", padding: 12 }}>
          {JSON.stringify(location.state.activity, null, 2)}
        </pre>
      ) : null}
    </div>
  );
};
