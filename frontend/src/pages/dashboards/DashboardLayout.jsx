import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Activity,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const DashboardLayout = ({ children, role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = {
    admin: [
      { icon: Users, label: "Users", path: "/dashboard/admin/users" },
      { icon: Activity, label: "Overview", path: "/dashboard/admin" },
      { icon: FileText, label: "Reports", path: "/dashboard/admin/reports" },
      { icon: Settings, label: "Settings", path: "/dashboard/admin/settings" },
    ],
    doctor: [
      { icon: Activity, label: "Dashboard", path: "/dashboard/doctor" },
      { icon: Users, label: "Patients", path: "/dashboard/doctor/patients" },
      {
        icon: Calendar,
        label: "Appointments",
        path: "/dashboard/doctor/appointments",
      },
      { icon: FileText, label: "Records", path: "/dashboard/doctor/records" },
    ],
    nurse: [
      { icon: Activity, label: "Dashboard", path: "/dashboard/nurse" },
      { icon: Users, label: "Patients", path: "/dashboard/nurse/patients" },
      { icon: Calendar, label: "Schedule", path: "/dashboard/nurse/schedule" },
    ],
    receptionist: [
      { icon: Activity, label: "Dashboard", path: "/dashboard/receptionist" },
      {
        icon: Calendar,
        label: "Appointments",
        path: "/dashboard/receptionist/appointments",
      },
      {
        icon: Users,
        label: "Patients",
        path: "/dashboard/receptionist/patients",
      },
    ],
    patient: [
      { icon: Activity, label: "Dashboard", path: "/dashboard/patient" },
      {
        icon: Calendar,
        label: "My Appointments",
        path: "/dashboard/patient/appointments",
      },
      {
        icon: FileText,
        label: "Medical Records",
        path: "/dashboard/patient/records",
      },
    ],
  };

  const currentMenuItems = menuItems[role] || [];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-gray-800 border-r border-gray-700 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">HMS</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5 text-gray-400" />
            ) : (
              <Menu className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {currentMenuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
              {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase()}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-xs text-gray-400 capitalize">{role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white capitalize">
              {role} Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-900">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
