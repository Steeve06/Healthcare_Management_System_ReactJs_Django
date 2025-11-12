import { useEffect, useState } from "react";
import api from "../../services/api";

const NurseAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/appointments/nurse-today/").then((res) => {
      setAppointments(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Today's Appointments</h2>
      {loading ? (
        <div className="py-8 text-gray-400">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="py-8 text-gray-400">No appointments today.</div>
      ) : (
        <ul className="space-y-2">
          {appointments.map((apt) => (
            <li key={apt.id} className="bg-gray-800 p-4 rounded-xl">
              <div className="flex justify-between">
                <span>
                  {apt.appointment_time} - {apt.patient_name}
                </span>
                <span className="text-gray-400">{apt.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default NurseAppointmentsList;
