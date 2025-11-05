import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { patientService } from "../../services/patientService";
import {
  ArrowLeft,
  Edit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  Droplet,
  AlertCircle,
  FileText,
  Clock,
  Activity,
} from "lucide-react";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);

      // Fetch patient details
      const patientResponse = await patientService.getPatient(id);
      setPatient(patientResponse.data);

      // Fetch patient appointments
      const appointmentsResponse = await patientService.getPatientAppointments(
        id
      );
      setAppointments(appointmentsResponse.data);

      // Fetch medical records
      const recordsResponse = await patientService.getPatientRecords(id);
      setMedicalRecords(recordsResponse.data);
    } catch (error) {
      console.error("Error fetching patient details:", error);
      alert("Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading patient details...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Patient not found</p>
        <button
          onClick={() => navigate("/dashboard/doctor/patients")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
      completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/dashboard/doctor/patients")}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-400" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white">
              {patient.full_name}
            </h2>
            <p className="text-gray-400">Patient ID: {patient.patient_id}</p>
          </div>
        </div>
        <button
          onClick={() => navigate(`/dashboard/doctor/patients/${id}/edit`)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Patient</span>
        </button>
      </div>

      {/* Patient Overview Card */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Basic Info */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Age / Gender</p>
              <p className="text-white font-semibold">
                {patient.age} years / {patient.gender}
              </p>
            </div>
          </div>

          {/* Blood Group */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Blood Group</p>
              <p className="text-white font-semibold">{patient.blood_group}</p>
            </div>
          </div>

          {/* Contact */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              <p className="text-white font-semibold">{patient.phone}</p>
            </div>
          </div>

          {/* Registration Date */}
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Registered</p>
              <p className="text-white font-semibold">
                {new Date(patient.registered_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "overview"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("medical")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "medical"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Medical History
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "appointments"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Appointments
          </button>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-700/30 rounded-lg p-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white">{patient.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white">{patient.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm mb-1 flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Address</span>
                    </p>
                    <p className="text-white">
                      {patient.address}, {patient.city}, {patient.state}{" "}
                      {patient.zip_code}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Emergency Contact</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-700/30 rounded-lg p-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white">
                      {patient.emergency_contact_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white">
                      {patient.emergency_contact_phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Relationship</p>
                    <p className="text-white">
                      {patient.emergency_contact_relation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Medical Information</span>
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">Allergies</p>
                    <p className="text-white">
                      {patient.allergies || "No known allergies"}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">
                      Chronic Conditions
                    </p>
                    <p className="text-white">
                      {patient.chronic_conditions ||
                        "No chronic conditions recorded"}
                    </p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4">
                    <p className="text-gray-400 text-sm mb-2">
                      Current Medications
                    </p>
                    <p className="text-white">
                      {patient.current_medications || "No current medications"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === "medical" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Medical Records
                </h3>
                <button
                  onClick={() =>
                    navigate(`/dashboard/doctor/patients/${id}/records/new`)
                  }
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Add Record
                </button>
              </div>

              {medicalRecords.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No medical records yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div
                      key={record.id}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold mb-1">
                            {record.diagnosis}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(record.visit_date).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </p>
                        </div>
                        <span className="text-xs text-gray-400">
                          Dr. {record.doctor_name}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Symptoms: </span>
                          <span className="text-white">{record.symptoms}</span>
                        </div>
                        {record.prescription && (
                          <div>
                            <span className="text-gray-400">
                              Prescription:{" "}
                            </span>
                            <span className="text-white">
                              {record.prescription}
                            </span>
                          </div>
                        )}
                        {record.notes && (
                          <div>
                            <span className="text-gray-400">Notes: </span>
                            <span className="text-white">{record.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Vitals */}
                      {(record.blood_pressure ||
                        record.temperature ||
                        record.heart_rate) && (
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <p className="text-gray-400 text-xs mb-2">Vitals</p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            {record.blood_pressure && (
                              <span className="text-gray-300">
                                BP:{" "}
                                <span className="text-white">
                                  {record.blood_pressure}
                                </span>
                              </span>
                            )}
                            {record.temperature && (
                              <span className="text-gray-300">
                                Temp:{" "}
                                <span className="text-white">
                                  {record.temperature}°F
                                </span>
                              </span>
                            )}
                            {record.heart_rate && (
                              <span className="text-gray-300">
                                HR:{" "}
                                <span className="text-white">
                                  {record.heart_rate} bpm
                                </span>
                              </span>
                            )}
                            {record.oxygen_saturation && (
                              <span className="text-gray-300">
                                SpO2:{" "}
                                <span className="text-white">
                                  {record.oxygen_saturation}%
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === "appointments" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Appointment History
                </h3>
                <button
                  onClick={() => navigate("/dashboard/doctor/appointments/new")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                >
                  Schedule Appointment
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No appointments scheduled</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/dashboard/doctor/appointments/${appointment.id}`
                        )
                      }
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-blue-500 font-semibold">
                          {appointment.appointment_time}
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {new Date(
                              appointment.appointment_date
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {appointment.appointment_type}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
