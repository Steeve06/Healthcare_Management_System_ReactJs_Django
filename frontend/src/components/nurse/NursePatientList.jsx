import { useEffect, useState } from "react";
import api from "../../services/api";

const NursePatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/patients/assigned-to-me/").then((res) => {
      setPatients(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Assigned Patients</h2>
      {loading ? (
        <div className="py-8 text-gray-400">Loading...</div>
      ) : patients.length === 0 ? (
        <div className="py-8 text-gray-400">No assigned patients.</div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-gray-300 text-xs uppercase">
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Age</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-700">
                  <td className="p-4">{patient.patient_id}</td>
                  <td className="p-4">{patient.full_name}</td>
                  <td className="p-4">{patient.age}</td>
                  <td className="p-4">
                    {patient.is_active ? (
                      <span className="text-green-400">Active</span>
                    ) : (
                      <span className="text-red-400">Inactive</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default NursePatientsList;
