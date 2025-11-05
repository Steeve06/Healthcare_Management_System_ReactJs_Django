import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FileText,
  Search,
  Plus,
  Calendar,
  User,
  Activity,
  Eye,
  Filter,
  Droplet,
  Thermometer,
  Heart,
} from "lucide-react";

const MedicalRecordsList = () => {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedPatient]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch medical records
      const params = {};
      if (selectedPatient !== "all") {
        params.patient = selectedPatient;
      }

      const recordsResponse = await api.get("/medical-records/", { params });
      setRecords(recordsResponse.data.results || recordsResponse.data);

      // Fetch patients for filter dropdown
      const patientsResponse = await api.get("/patients/");
      setPatients(patientsResponse.data.results || patientsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      record.patient_name?.toLowerCase().includes(query) ||
      record.diagnosis?.toLowerCase().includes(query) ||
      record.symptoms?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Medical Records</h2>
        <button
          onClick={() => navigate("/dashboard/doctor/records/new")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <span className="text-gray-400 font-medium">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient, diagnosis, or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Patient Filter */}
          <div>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.full_name} - {patient.patient_id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">
            Loading medical records...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No medical records found</p>
            <p className="text-sm">Start by adding a new medical record</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => navigate(`/dashboard/doctor/records/${record.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Patient Info */}
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {record.patient_name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Dr. {record.doctor_name}
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <span className="text-gray-400 text-sm">Diagnosis: </span>
                    <span className="text-white font-medium">
                      {record.diagnosis}
                    </span>
                  </div>

                  {/* Symptoms */}
                  <div className="mb-3">
                    <span className="text-gray-400 text-sm">Symptoms: </span>
                    <span className="text-white">{record.symptoms}</span>
                  </div>

                  {/* Prescription */}
                  {record.prescription && (
                    <div className="mb-3">
                      <span className="text-gray-400 text-sm">
                        Prescription:{" "}
                      </span>
                      <span className="text-white">{record.prescription}</span>
                    </div>
                  )}

                  {/* Vitals */}
                  {(record.blood_pressure ||
                    record.temperature ||
                    record.heart_rate) && (
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
                      {record.blood_pressure && (
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-red-400" />
                          <span className="text-gray-400 text-sm">BP:</span>
                          <span className="text-white font-medium">
                            {record.blood_pressure}
                          </span>
                        </div>
                      )}
                      {record.temperature && (
                        <div className="flex items-center space-x-2">
                          <Thermometer className="h-4 w-4 text-orange-400" />
                          <span className="text-gray-400 text-sm">Temp:</span>
                          <span className="text-white font-medium">
                            {record.temperature}°F
                          </span>
                        </div>
                      )}
                      {record.heart_rate && (
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-gray-400 text-sm">HR:</span>
                          <span className="text-white font-medium">
                            {record.heart_rate} bpm
                          </span>
                        </div>
                      )}
                      {record.oxygen_saturation && (
                        <div className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-400 text-sm">SpO2:</span>
                          <span className="text-white font-medium">
                            {record.oxygen_saturation}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Side - Date & Action */}
                <div className="flex flex-col items-end space-y-4 ml-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 text-gray-400 text-sm mb-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(record.visit_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(record.visit_date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/doctor/records/${record.id}`);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>

              {/* Notes Preview */}
              {record.notes && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-sm">Notes: </p>
                  <p className="text-white text-sm mt-1 line-clamp-2">
                    {record.notes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsList;
