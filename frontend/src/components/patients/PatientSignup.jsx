import React, { useState } from "react";
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
        "Signup failed. " + (error.response?.data?.detail || "Invalid input.")
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
            name="first_name"
            placeholder="First Name"
            required
            value={form.first_name}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            required
            value={form.last_name}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="date_of_birth"
            type="date"
            required
            value={form.date_of_birth}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <select
            name="gender"
            required
            value={form.gender}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          >
            <option value="" disabled>
              Gender
            </option>
            {GENDER_CHOICES.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <select
            name="blood_group"
            required
            value={form.blood_group}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
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
            name="email"
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="phone"
            placeholder="Phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="address"
            placeholder="Address"
            required
            value={form.address}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="city"
            placeholder="City"
            required
            value={form.city}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="state"
            placeholder="State"
            required
            value={form.state}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="zip_code"
            placeholder="Zip Code"
            required
            value={form.zip_code}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="emergency_contact_name"
            placeholder="Emergency Contact Name"
            required
            value={form.emergency_contact_name}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="emergency_contact_phone"
            placeholder="Emergency Contact Phone"
            required
            value={form.emergency_contact_phone}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="emergency_contact_relation"
            placeholder="Emergency Contact Relation"
            required
            value={form.emergency_contact_relation}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="allergies"
            placeholder="Allergies (optional)"
            value={form.allergies}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="chronic_conditions"
            placeholder="Chronic Conditions (optional)"
            value={form.chronic_conditions}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="current_medications"
            placeholder="Current Medications (optional)"
            value={form.current_medications}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={handleChange}
            className="rounded p-3 bg-[#10182f] text-white"
          />
        </div>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-3 mt-8 font-semibold"
          disabled={saving}
        >
          {saving ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-sm mt-2 text-center text-green-400">{msg}</div>
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
