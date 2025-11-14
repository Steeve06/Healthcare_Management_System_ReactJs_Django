import { useState, useEffect } from "react";
import api from "../../services/api";
import Modal from "./Modal";
import MedicalRecordForm from "./MedicalRecordForm";
import MedicalRecordDetails from "./MedicalRecordDetails"; // if you want details popup
// ...your icon imports...

const MedicalRecordsPage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [recordToUpdate, setRecordToUpdate] = useState(null);

  useEffect(() => {
    api
      .get("/patients/")
      .then((res) => setPatients(res.data.results || res.data));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white mb-6">Patients</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                {/* Optionally patient initials/avatar */}
                {/* <User className="h-5 w-5 text-white" /> */}
                <span className="text-white text-xl font-medium">
                  {patient.full_name[0]}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold">
                  {patient.full_name}
                </div>
                <div className="text-gray-400 text-sm">
                  {patient.patient_id}
                </div>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              <button
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                onClick={async () => {
                  const response = await api.get(
                    `/medical-records/?patient=${patient.id}`
                  );
                  const records = response.data.results || response.data;
                  const record = Array.isArray(records) ? records[0] : records;
                  setRecordToUpdate(record || null); // may be null if no record exists
                  setShowUpdatePopup(true);
                }}
              >
                Update Record
              </button>

              <button
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
                onClick={() => {
                  setSelectedPatient(patient);
                  setShowAddPopup(true);
                }}
              >
                Add Record
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---- MODALS ---- */}
      {/* View Record Modal */}
      <Modal
        open={!!selectedRecordId}
        onClose={() => setSelectedRecordId(null)}
      >
        {selectedRecordId && <MedicalRecordDetails id={selectedRecordId} />}
      </Modal>

      {/* Add Record Modal */}
      <Modal open={showAddPopup} onClose={() => setShowAddPopup(false)}>
        <MedicalRecordForm
          patient={selectedPatient}
          onSuccess={() => {
            setShowAddPopup(false);
            // option: refresh data
          }}
        />
      </Modal>
      <Modal open={showUpdatePopup} onClose={() => setShowUpdatePopup(false)}>
        {recordToUpdate ? (
          <MedicalRecordForm
            record={recordToUpdate}
            onSuccess={() => {
              setShowUpdatePopup(false);
              // Optionally refresh patients/records
            }}
          />
        ) : (
          <div className="p-8 text-center text-white">
            No record exists for this patient to update.
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicalRecordsPage;
