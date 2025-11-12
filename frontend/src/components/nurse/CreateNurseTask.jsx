import { useEffect, useState } from "react";
import api from "../../services/api";
import { nurseTaskService } from "../../services/nurseTaskService";
import { useNavigate } from "react-router-dom";

const CreateNurseTask = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patient: "",
    title: "",
    scheduled_time: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/patients/assigned-to-me/").then((res) => {
      setPatients(res.data);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await nurseTaskService.createTask({
        ...form,
        completed: false,
      });
      alert("Task created!");
      navigate("/dashboard/nurse/tasks");
    } catch (err) {
      alert("Failed to create task.");
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading patients...</div>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Create Nurse Task</h2>
      <div>
        <label className="block text-gray-300 mb-1">Patient</label>
        <select
          name="patient"
          value={form.patient}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
        >
          <option value="">Select a patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.full_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Task Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
        />
      </div>
      <div>
        <label className="block text-gray-300 mb-1">Scheduled Time</label>
        <input
          type="time"
          name="scheduled_time"
          value={form.scheduled_time}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded text-white"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
      >
        {saving ? "Saving..." : "Create Task"}
      </button>
    </form>
  );
};
export default CreateNurseTask;
