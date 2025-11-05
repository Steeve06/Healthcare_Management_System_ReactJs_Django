import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { Users, Calendar, FileText, Activity } from "lucide-react";

const DoctorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: Users, label: "Total Patients", value: "248", color: "blue" },
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: "12",
      color: "green",
    },
    { icon: FileText, label: "Pending Reports", value: "5", color: "orange" },
    { icon: Activity, label: "Active Cases", value: "18", color: "purple" },
  ];

  const upcomingAppointments = [
    { time: "09:00 AM", patient: "John Doe", type: "Consultation" },
    { time: "10:30 AM", patient: "Jane Smith", type: "Follow-up" },
    { time: "02:00 PM", patient: "Mike Johnson", type: "Check-up" },
  ];

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, Dr. {user?.last_name || user?.username}!
          </h2>
          <p className="text-blue-100">
            You have 12 appointments scheduled for today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${stat.color}-500/10 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Today's Appointments
          </h3>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-blue-500 font-semibold">
                    {appointment.time}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {appointment.patient}
                    </p>
                    <p className="text-gray-400 text-sm">{appointment.type}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
