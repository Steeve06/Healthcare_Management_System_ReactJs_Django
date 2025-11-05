import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout role="patient">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Welcome, {user?.first_name || user?.username}!
        </h2>
        <p className="text-gray-400">
          Your patient dashboard is ready. Features coming soon...
        </p>
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
