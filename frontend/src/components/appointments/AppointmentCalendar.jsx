import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { appointmentService } from "../../services/appointmentService";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  List,
  Plus,
} from "lucide-react";

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getAppointments();
      setAppointments(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.appointment_date === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Appointment Calendar</h2>
        <div className="flex items-center space-x-3">
          {/* List View Button */}
          <button
            onClick={() => navigate("/dashboard/doctor/appointments")}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <List className="h-5 w-5" />
            <span>List View</span>
          </button>

          {/* Schedule Appointment Button */}
          <button
            onClick={() => navigate("/dashboard/doctor/appointments/new")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-400" />
          </button>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
            <h3 className="text-xl font-semibold text-white">{monthName}</h3>
          </div>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const dateAppointments = getAppointmentsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square p-2 rounded-lg border transition-all ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white"
                    : isToday
                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "bg-gray-700/30 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                }`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-lg font-semibold">{day}</span>
                  {dateAppointments.length > 0 && (
                    <span className="text-xs mt-1">
                      {dateAppointments.length} apt
                      {dateAppointments.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Date Appointments */}
        {selectedDate && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">
              Appointments on{" "}
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h4>
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-400">No appointments scheduled</p>
            ) : (
              <div className="space-y-2">
                {getAppointmentsForDate(selectedDate).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 bg-gray-700/50 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() =>
                      navigate(`/dashboard/doctor/appointments/${apt.id}`)
                    }
                  >
                    <div>
                      <p className="text-white font-medium">
                        {apt.patient_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {apt.appointment_time} - {apt.appointment_type}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        apt.status === "confirmed"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : apt.status === "scheduled"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : apt.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
