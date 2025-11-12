import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { nurseTaskService } from "../../services/nurseTaskService";
import {
  Users,
  Calendar,
  Activity,
  Clock,
  FileText,
  BedDouble,
  ShieldCheck,
  HeartPulse,
} from "lucide-react";
import api from "../../services/api";

const NurseDashboard = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [nurseTasks, setNurseTasks] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const assignedBeds = 10;
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    if (!children) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Tasks (from nurseTaskService)
      const taskRes = await nurseTaskService.getNurseTasks();
      setNurseTasks(taskRes.data);

      // Assigned Patients
      const patRes = await api.get("/patients/assigned-to-me/");
      setAssignedPatients(patRes.data);

      // Today's Appointments
      const apptRes = await api.get("/appointments/nurse-today/");
      setTodayAppointments(apptRes.data);
    } catch (error) {
      console.error("Error fetching nurse dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (children) {
    return <DashboardLayout role="nurse">{children}</DashboardLayout>;
  }

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: assignedPatients.length,
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: todayAppointments.length,
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      icon: BedDouble,
      label: "Assigned Beds",
      value: assignedBeds,
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
    },
    {
      icon: ShieldCheck,
      label: "Scheduled Tasks",
      value: nurseTasks.length,
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="nurse">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="nurse">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-800 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, Nurse {user?.last_name || user?.username}!
          </h2>
          <p className="text-blue-100">
            You have {nurseTasks.length} tasks scheduled today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all"
            >
              <div className={`p-3 ${stat.bgColor} rounded-lg w-fit mb-4`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today Appointments */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span>Today's Appointments</span>
            </h3>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No appointments for today
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    onClick={() =>
                      navigate(
                        `/dashboard/nurse/appointments/${appointment.id}`
                      )
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-blue-500 font-semibold text-sm">
                        {appointment.appointment_time}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {appointment.patient_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {appointment.appointment_type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scheduled Tasks */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-purple-500" />
              <span>Scheduled Tasks</span>
            </h3>
            {nurseTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No tasks for today
              </div>
            ) : (
              <div className="space-y-3">
                {nurseTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{task.task}</p>
                      <p className="text-gray-400 text-sm">
                        {task.patient} •{" "}
                        <span className="text-blue-400">{task.time}</span>
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        await nurseTaskService.completeTask(task.id);
                        fetchDashboardData(); // refetch data to update UI
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs"
                    >
                      Mark as Done
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/dashboard/nurse/patients")}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Users className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                View Patients
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/nurse/appointments")}
              className="flex flex-col items-center space-y-2 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Calendar className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                View Appointments
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/nurse/schedule")}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Clock className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                My Schedule
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/nurse/tasks")}
              className="flex flex-col items-center space-y-2 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <ShieldCheck className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">Task List</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NurseDashboard;
