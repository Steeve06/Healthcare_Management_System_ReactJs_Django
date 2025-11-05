import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FileText,
  Calendar,
  User,
  Activity,
  Thermometer,
  Heart,
  Droplet,
} from "lucide-react";
import api from "../../services/api";

const PatientRecords = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      // Get patient profile first
      const profileResponse = await api.get("/patients/", {
        params: { user: user.id },
      });
      const patientData =
        profileResponse.data.results?.[0] || profileResponse.data[0];

      if (!patientData) return;

      // Fetch medical records
      const response = await api.get(
        `/patients/${patientData.id}/medical_records/`
      );
      setRecords(response.data || []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">My Medical Records</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-400">
          Loading records...
        </div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No medical records yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {record.diagnosis}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(record.visit_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Dr. {record.doctor_name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Symptoms</p>
                  <p className="text-white">{record.symptoms}</p>
                </div>

                {record.prescription && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Prescription</p>
                    <p className="text-white">{record.prescription}</p>
                  </div>
                )}

                {record.notes && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Notes</p>
                    <p className="text-white">{record.notes}</p>
                  </div>
                )}

                {/* Vitals */}
                {(record.blood_pressure ||
                  record.temperature ||
                  record.heart_rate ||
                  record.oxygen_saturation) && (
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-3">Vital Signs</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {record.blood_pressure && (
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-red-400" />
                          <div>
                            <p className="text-xs text-gray-400">BP</p>
                            <p className="text-white font-medium">
                              {record.blood_pressure}
                            </p>
                          </div>
                        </div>
                      )}
                      {record.temperature && (
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-400" />
                          <div>
                            <p className="text-xs text-gray-400">Temp</p>
                            <p className="text-white font-medium">
                              {record.temperature}°F
                            </p>
                          </div>
                        </div>
                      )}
                      {record.heart_rate && (
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <div>
                            <p className="text-xs text-gray-400">HR</p>
                            <p className="text-white font-medium">
                              {record.heart_rate} bpm
                            </p>
                          </div>
                        </div>
                      )}
                      {record.oxygen_saturation && (
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-xs text-gray-400">SpO2</p>
                            <p className="text-white font-medium">
                              {record.oxygen_saturation}%
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
