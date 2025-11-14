// src/components/appointments/AppointmentDetails.jsx

import React, { useEffect, useState } from "react";

export default function AppointmentDetails({ appointmentId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!appointmentId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      setDetails(null);
      return;
    }
    fetch(`http://127.0.0.1:8000/api/appointments/${appointmentId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDetails(data && data.id ? data : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [appointmentId]);

  if (loading) return <div className="p-8 text-lg">Loading...</div>;

  if (!details)
    return (
      <div className="p-8 text-red-400 text-lg">
        No Appointment Details Found
      </div>
    );

  return (
    <div className="max-w-lg mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        Appointment Details
      </h2>
      <div className="space-y-4">
        <div>
          <span className="font-semibold text-blue-400">ID:</span> {details.id}
        </div>
        <div>
          <span className="font-semibold text-blue-400">Patient:</span>{" "}
          {details.patient_name}
        </div>
        <div>
          <span className="font-semibold text-blue-400">Date:</span>{" "}
          {details.appointment_date || <span className="text-gray-400">N/A</span>}
        </div>
        <div>
          <span className="font-semibold text-blue-400">Status:</span>{" "}
          {details.status || <span className="text-gray-400">N/A</span>}
        </div>
        
      </div>
    </div>
  );
}
