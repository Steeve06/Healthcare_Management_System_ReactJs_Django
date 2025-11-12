import { useState } from "react";
import api from "../services/api";

export default function PatientSignup() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    try {
      await api.post("/accounts/signup/", form);
      setMsg("Signup successful! You can now log in.");
    } catch {
      setMsg("Signup failed. Email might be taken or invalid input.");
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-6 rounded-xl w-full max-w-md mx-auto mt-10"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Patient Signup</h2>
      <input
        className="w-full rounded p-2 bg-gray-900 text-white"
        name="first_name"
        placeholder="First Name"
        required
        value={form.first_name}
        onChange={handleChange}
      />
      <input
        className="w-full rounded p-2 bg-gray-900 text-white"
        name="last_name"
        placeholder="Last Name"
        required
        value={form.last_name}
        onChange={handleChange}
      />
      <input
        className="w-full rounded p-2 bg-gray-900 text-white"
        name="email"
        type="email"
        placeholder="Email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <input
        className="w-full rounded p-2 bg-gray-900 text-white"
        name="password"
        type="password"
        placeholder="Password"
        required
        value={form.password}
        onChange={handleChange}
      />
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2"
        disabled={saving}
      >
        {saving ? "Signing up..." : "Sign Up"}
      </button>
      {msg && (
        <div className="text-sm mt-2 text-center text-green-400">{msg}</div>
      )}
    </form>
  );
}
