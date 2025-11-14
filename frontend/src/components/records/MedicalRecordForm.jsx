// src/components/appointments/MedicalRecordForm.jsx

import React, { useState, useEffect } from "react";
import api from "../../services/api";

export default function MedicalRecordForm({ patient, record, onSuccess }) {
  // Initialize form state, using 'record' if present (for editing), else empty for new record
  const [diagnosis, setDiagnosis] = useState(record?.diagnosis || "");
  const [symptoms, setSymptoms] = useState(record?.symptoms || "");
  const [notes, setNotes] = useState(record?.notes || "");
  const [prescription, setPrescription] = useState(record?.prescription || "");
  const [bloodPressure, setBloodPressure] = useState(
    record?.blood_pressure || ""
  );
  const [temperature, setTemperature] = useState(record?.temperature || "");
  const [heartRate, setHeartRate] = useState(record?.heart_rate || "");
  const [oxygenSaturation, setOxygenSaturation] = useState(
    record?.oxygen_saturation || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState(record?.visit_date || "");


  // Update state if record prop changes (for editing different records in the same modal)
  useEffect(() => {
    if (record) {
      setDiagnosis(record.diagnosis || "");
      setSymptoms(record.symptoms || "");
      setNotes(record.notes || "");
      setPrescription(record.prescription || "");
      setBloodPressure(record.blood_pressure || "");
      setTemperature(record.temperature || "");
      setHeartRate(record.heart_rate || "");
      setOxygenSaturation(record.oxygen_saturation || "");
    } else {
      setDiagnosis("");
      setSymptoms("");
      setNotes("");
      setPrescription("");
      setBloodPressure("");
      setTemperature("");
      setHeartRate("");
      setOxygenSaturation("");
    }
  }, [record]);

  const getPatientId = () => {
    if (record?.patient) {
      // Could be a number or an object
      return typeof record.patient === "object"
        ? record.patient.id
        : record.patient;
    }
    if (patient?.id) return patient.id;
    if (typeof patient === "number") return patient;
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const patientId = getPatientId();
      if (!patientId) throw new Error("Patient required");
      const data = {
        patient: patientId,
        visit_date: visitDate,
        diagnosis,
        symptoms,
        notes,
        prescription,
        blood_pressure: bloodPressure,
        temperature,
        heart_rate: heartRate,
        oxygen_saturation: oxygenSaturation,
      };
      if (record?.id) {
        await api.put(`/medical-records/${record.id}/`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/medical-records/", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setLoading(false);
      onSuccess?.();
    } catch (err) {
      setLoading(false);
      let msg = "Error saving record";
      if (err.response?.data) {
        msg += ": " + JSON.stringify(err.response.data);
      } else if (err.message) {
        msg += ": " + err.message;
      }
      setError(msg);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-gray-900 rounded-lg shadow-lg text-white space-y-5 max-w-lg w-full"
    >
      <h2 className="text-xl font-bold mb-2">
        {record ? "Edit Medical Record" : "Add Medical Record"}
      </h2>
      {error && <div className="text-red-400 mb-4">{error}</div>}

      <div>
        <label className="block font-semibold mb-1">Diagnosis</label>
        <input
          required
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Visit Date</label>
        <input
          required
          type="date"
          value={visitDate ? visitDate.substring(0, 10) : ""}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Symptoms</label>
        <input
          required
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">
          Prescription (optional)
        </label>
        <input
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      {/* Optional Vitals */}
      <div>
        <label className="block font-semibold mb-1">Blood Pressure</label>
        <input
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Temperature (°F)</label>
        <input
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Heart Rate (bpm)</label>
        <input
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">
          Oxygen Saturation (%)
        </label>
        <input
          value={oxygenSaturation}
          onChange={(e) => setOxygenSaturation(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      {/* Show patient info in add mode */}
      {patient && !record && (
        <div className="text-sm text-gray-400 mb-2">
          Adding record for: <strong>{patient.full_name}</strong> (ID:{" "}
          {patient.patient_id})
        </div>
      )}

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
        disabled={loading}
      >
        {loading
          ? record
            ? "Saving..."
            : "Creating..."
          : record
          ? "Update Record"
          : "Add Record"}
      </button>
    </form>
  );
}
