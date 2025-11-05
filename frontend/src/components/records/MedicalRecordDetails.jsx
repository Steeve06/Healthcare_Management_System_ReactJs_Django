import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  ArrowLeft,
  Calendar,
  User,
  Activity,
  Thermometer,
  Heart,
  Droplet,
  FileText,
  Edit,
} from "lucide-react";

const MedicalRecordDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/medical-records/${id}/`);
      setRecord(response.data);
    } catch (error) {
      console.error("Error fetching record:", error);
      alert("Failed to load medical record");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading record...</div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Record not found</p>
        <button
          onClick={() => navigate("/dashboard/doctor/records")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Back to Records
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard/doctor/records")}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-400" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">Medical Record</h2>
            <p className="text-gray-400">
              {new Date(record.visit_date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/doctor/records/${id}/edit`)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Record</span>
        </button>
      </div>

      {/* Patient & Doctor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Patient</p>
              <p className="text-white text-lg font-semibold">
                {record.patient_name}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Doctor</p>
              <p className="text-white text-lg font-semibold">
                Dr. {record.doctor_name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis & Symptoms */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          Diagnosis & Symptoms
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">Diagnosis</p>
            <p className="text-white text-lg">{record.diagnosis}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">Symptoms</p>
            <p className="text-white">{record.symptoms}</p>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Vital Signs</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {record.blood_pressure && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Activity className="h-8 w-8 text-red-400 mb-2" />
              <p className="text-gray-400 text-sm">Blood Pressure</p>
              <p className="text-white text-xl font-semibold">
                {record.blood_pressure}
              </p>
            </div>
          )}
          {record.temperature && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Thermometer className="h-8 w-8 text-orange-400 mb-2" />
              <p className="text-gray-400 text-sm">Temperature</p>
              <p className="text-white text-xl font-semibold">
                {record.temperature}°F
              </p>
            </div>
          )}
          {record.heart_rate && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Heart className="h-8 w-8 text-pink-400 mb-2" />
              <p className="text-gray-400 text-sm">Heart Rate</p>
              <p className="text-white text-xl font-semibold">
                {record.heart_rate} bpm
              </p>
            </div>
          )}
          {record.oxygen_saturation && (
            <div className="bg-gray-700/30 rounded-lg p-4">
              <Droplet className="h-8 w-8 text-blue-400 mb-2" />
              <p className="text-gray-400 text-sm">Oxygen Saturation</p>
              <p className="text-white text-xl font-semibold">
                {record.oxygen_saturation}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription */}
      {record.prescription && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Prescription
          </h3>
          <p className="text-white whitespace-pre-wrap">
            {record.prescription}
          </p>
        </div>
      )}

      {/* Lab Results */}
      {record.lab_results && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Lab Results</h3>
          <p className="text-white whitespace-pre-wrap">{record.lab_results}</p>
        </div>
      )}

      {/* Notes */}
      {record.notes && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <span>Additional Notes</span>
          </h3>
          <p className="text-white whitespace-pre-wrap">{record.notes}</p>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordDetails;
