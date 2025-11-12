import { useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

const BLOOD_GROUP_CHOICES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const GENDER_CHOICES = ["male", "female", "other"];

export default function PatientSignup() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relation: "",
    allergies: "",
    chronic_conditions: "",
    current_medications: "",
    password: "",
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
    } catch (error) {
      setMsg(
        "Signup failed. " + (error.response?.data?.email || "Invalid input.")
      );
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181f32]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#232c41] p-8 rounded-lg shadow-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Patient Signup
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="first_name"
            placeholder="First Name"
            required
            value={form.first_name}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="last_name"
            placeholder="Last Name"
            required
            value={form.last_name}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            type="date"
            name="date_of_birth"
            placeholder="Date of Birth"
            required
            value={form.date_of_birth}
            onChange={handleChange}
          />
          <select
            className="rounded p-3 bg-[#10182f] text-white"
            name="gender"
            required
            value={form.gender}
            onChange={handleChange}
          >
            <option value="" disabled>
              Gender
            </option>
            {GENDER_CHOICES.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="rounded p-3 bg-[#10182f] text-white"
            name="blood_group"
            required
            value={form.blood_group}
            onChange={handleChange}
          >
            <option value="" disabled>
              Blood Group
            </option>
            {BLOOD_GROUP_CHOICES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="phone"
            placeholder="Phone"
            required
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="address"
            placeholder="Address"
            required
            value={form.address}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="city"
            placeholder="City"
            required
            value={form.city}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="state"
            placeholder="State"
            required
            value={form.state}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="zip_code"
            placeholder="Zip Code"
            required
            value={form.zip_code}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="emergency_contact_name"
            placeholder="Emergency Contact Name"
            required
            value={form.emergency_contact_name}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="emergency_contact_phone"
            placeholder="Emergency Contact Phone"
            required
            value={form.emergency_contact_phone}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="emergency_contact_relation"
            placeholder="Emergency Contact Relation"
            required
            value={form.emergency_contact_relation}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="allergies"
            placeholder="Allergies (optional)"
            value={form.allergies}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="chronic_conditions"
            placeholder="Chronic Conditions (optional)"
            value={form.chronic_conditions}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="current_medications"
            placeholder="Current Medications (optional)"
            value={form.current_medications}
            onChange={handleChange}
          />
          <input
            className="rounded p-3 bg-[#10182f] text-white"
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-3 mt-8 font-semibold"
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
