import { useState } from "react";
import api from "../../services/api"; // Adjust this path if needed
import { Link } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-[#181f32]">
      {" "}
      {/* Match login background */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#232c41] p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Patient Signup
        </h2>
        <div className="space-y-4">
          <input
            className="w-full rounded-md p-3 bg-[#10182f] text-white placeholder-gray-400"
            name="first_name"
            placeholder="First Name"
            required
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-md p-3 bg-[#10182f] text-white placeholder-gray-400"
            name="last_name"
            placeholder="Last Name"
            required
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-md p-3 bg-[#10182f] text-white placeholder-gray-400"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-md p-3 bg-[#10182f] text-white placeholder-gray-400"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 mt-6 font-semibold transition"
          disabled={saving}
        >
          {saving ? "Signing up..." : "Sign Up"}
        </button>
        {msg && (
          <div className="text-sm mt-2 text-center text-green-400">{msg}</div>
        )}
        <div className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link className="text-blue-400 hover:underline" to="/login">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
