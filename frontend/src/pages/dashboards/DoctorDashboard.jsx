import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import DashboardLayout from "./DashboardLayout";
import {
  Users,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import { patientService } from "../../services/patientService";
import { appointmentService } from "../../services/appointmentService";

const DoctorDashboard = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    completedToday: 0,
  });
  const [todayAppointmentsList, setTodayAppointmentsList] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);

  // HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    // Only fetch data if children is not provided (showing dashboard)
    if (!children) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [
        patientsResponse,
        todayApptsResponse,
        upcomingApptsResponse,
        allAppointmentsResponse,
      ] = await Promise.all([
        patientService.getPatients(),
        appointmentService.getTodayAppointments(),
        appointmentService.getUpcomingAppointments(),
        appointmentService.getAppointments({ status: "completed" }),
      ]);

      // Process patients data
      const patientsData =
        patientsResponse.data.results || patientsResponse.data;
      const totalPatients = Array.isArray(patientsData)
        ? patientsData.length
        : 0;

      // Get recent 5 patients
      const recentPatientsData = Array.isArray(patientsData)
        ? patientsData.slice(0, 5)
        : [];

      // Process today's appointments
      const todayAppointments =
        todayApptsResponse.data.results || todayApptsResponse.data;
      const todayCount = Array.isArray(todayAppointments)
        ? todayAppointments.length
        : 0;

      // Process upcoming appointments
      const upcomingAppointments =
        upcomingApptsResponse.data.results || upcomingApptsResponse.data;
      const upcomingCount = Array.isArray(upcomingAppointments)
        ? upcomingAppointments.length
        : 0;

      // Process completed appointments for today
      const allAppointments =
        allAppointmentsResponse.data.results || allAppointmentsResponse.data;
      const today = new Date().toISOString().split("T")[0];
      const completedTodayCount = Array.isArray(allAppointments)
        ? allAppointments.filter(
            (apt) =>
              apt.appointment_date === today && apt.status === "completed"
          ).length
        : 0;

      // Update state
      setDashboardData({
        totalPatients,
        todayAppointments: todayCount,
        upcomingAppointments: upcomingCount,
        completedToday: completedTodayCount,
      });

      setTodayAppointmentsList(
        Array.isArray(todayAppointments) ? todayAppointments.slice(0, 5) : []
      );
      setRecentPatients(recentPatientsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
      in_progress: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.scheduled;
  };

  // EARLY RETURN AFTER ALL HOOKS
  // If children are passed, render them instead of default dashboard
  if (children) {
    return <DashboardLayout role="doctor">{children}</DashboardLayout>;
  }

  const stats = [
    {
      icon: Users,
      label: "Total Patients",
      value: dashboardData.totalPatients.toString(),
      color: "blue",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      icon: Calendar,
      label: "Today's Appointments",
      value: dashboardData.todayAppointments.toString(),
      color: "green",
      bgColor: "bg-green-500/10",
      textColor: "text-green-500",
      trend: `${dashboardData.completedToday} completed`,
      trendUp: true,
    },
    {
      icon: Clock,
      label: "Upcoming Appointments",
      value: dashboardData.upcomingAppointments.toString(),
      color: "orange",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-500",
      trend: "Next 7 days",
      trendUp: null,
    },
    {
      icon: Activity,
      label: "Completed Today",
      value: dashboardData.completedToday.toString(),
      color: "purple",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-500",
      trend: `${
        dashboardData.todayAppointments - dashboardData.completedToday
      } pending`,
      trendUp: false,
    },
  ];

  if (loading) {
    return (
      <DashboardLayout role="doctor">
        <div className="flex items-center justify-center h-64">
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, Dr. {user?.last_name || user?.username}!
          </h2>
          <p className="text-blue-100">
            {dashboardData.todayAppointments > 0
              ? `You have ${dashboardData.todayAppointments} appointment${
                  dashboardData.todayAppointments > 1 ? "s" : ""
                } scheduled for today`
              : "No appointments scheduled for today"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer transform hover:scale-105"
              onClick={() => {
                if (stat.label === "Total Patients")
                  navigate("/dashboard/doctor/patients");
                if (stat.label.includes("Appointments"))
                  navigate("/dashboard/doctor/appointments");
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                {stat.trendUp !== null && (
                  <div
                    className={`flex items-center space-x-1 text-xs ${
                      stat.trendUp ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {stat.trendUp && <TrendingUp className="h-3 w-3" />}
                    <span>{stat.trend}</span>
                  </div>
                )}
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Today's Appointments</span>
              </h3>
              <button
                onClick={() => navigate("/dashboard/doctor/appointments")}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>

            {todayAppointmentsList.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No appointments for today
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointmentsList.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/dashboard/doctor/appointments/${appointment.id}`
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
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>Recent Patients</span>
              </h3>
              <button
                onClick={() => navigate("/dashboard/doctor/patients")}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                View All
              </button>
            </div>

            {recentPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No patients yet
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/doctor/patients/${patient.id}`)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                        {patient.first_name?.[0]}
                        {patient.last_name?.[0]}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {patient.full_name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {patient.age} years • {patient.blood_group}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {patient.patient_id}
                    </span>
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
              onClick={() => navigate("/dashboard/doctor/appointments/new")}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Calendar className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                Schedule Appointment
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/doctor/patients/new")}
              className="flex flex-col items-center space-y-2 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Users className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                Add Patient
              </span>
            </button>
            <button
              onClick={() =>
                navigate("/dashboard/doctor/appointments/calendar")
              }
              className="flex flex-col items-center space-y-2 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Calendar className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                View Calendar
              </span>
            </button>
            <button
              onClick={() => navigate("/dashboard/doctor/records")}
              className="flex flex-col items-center space-y-2 p-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
            >
              <FileText className="h-6 w-6 text-white" />
              <span className="text-white text-sm font-medium">
                Medical Records
              </span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
