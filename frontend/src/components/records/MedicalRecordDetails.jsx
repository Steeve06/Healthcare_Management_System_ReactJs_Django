import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Modal from "./Modal";
import MedicalRecordForm from "./MedicalRecordForm";
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
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchRecord();
    // eslint-disable-next-line
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
          onClick={() => setShowEditModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Edit className="h-5 w-5" />
          <span>Edit Record</span>
        </button>
      </div>

      {/* Patient, Doctor Info, Diagnosis, Vitals... */}
      {/* --- All your main medical record detail markup --- */}
      {/* ... same as before ... */}

      {/* Edit Modal with the prefilled MedicalRecordForm */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <MedicalRecordForm
          record={record}
          onSuccess={() => {
            setShowEditModal(false);
            fetchRecord(); // refresh on successful update
          }}
        />
      </Modal>
    </div>
  );
};

export default MedicalRecordDetails;
