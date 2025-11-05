import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplet,
  AlertCircle,
  Edit2,
  Save,
  X,
  Activity,
} from "lucide-react";
import api from "../../services/api";

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/patients/", {
        params: { user: user.id },
      });
      const patientData = response.data.results?.[0] || response.data[0];

      if (patientData) {
        setProfile(patientData);
        setFormData(patientData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Only send fields that should be editable
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        blood_group: formData.blood_group,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        emergency_contact_name: formData.emergency_contact_name,
        emergency_contact_phone: formData.emergency_contact_phone,
        emergency_contact_relation: formData.emergency_contact_relation,
        allergies: formData.allergies,
        chronic_conditions: formData.chronic_conditions,
        current_medications: formData.current_medications,
      };

      console.log("Sending data:", updateData);

      // Use PATCH instead of PUT
      const response = await api.patch(`/patients/${profile.id}/`, updateData);
      setProfile(response.data);
      setFormData(response.data);
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Failed to update profile.\n\n";

      if (error.response?.data) {
        const errors = error.response.data;
        if (typeof errors === "object") {
          errorMessage += Object.entries(errors)
            .map(([field, messages]) => {
              const msg = Array.isArray(messages)
                ? messages.join(", ")
                : messages;
              return `• ${field}: ${msg}`;
            })
            .join("\n");
        } else {
          errorMessage += errors;
        }
      } else {
        errorMessage += "Please check your connection and try again.";
      }

      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };



  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="h-16 w-16 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Profile Not Found
        </h3>
        <p className="text-gray-400">
          Your patient profile hasn't been created yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">My Profile</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Edit2 className="h-5 w-5" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Save className="h-5 w-5" />
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-800 rounded-xl p-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold">
            {profile.first_name?.[0]}
            {profile.last_name?.[0]}
          </div>
          <div className="text-white">
            <h3 className="text-3xl font-bold mb-2">{profile.full_name}</h3>
            <div className="flex items-center space-x-4 text-blue-100">
              <span>Patient ID: {profile.patient_id}</span>
              <span>•</span>
              <span>{profile.age} years old</span>
              <span>•</span>
              <span className="px-2 py-1 bg-white/20 rounded font-semibold">
                {profile.blood_group}
              </span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-500" />
            <span>Basic Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date of Birth
              </label>
              {editing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {new Date(profile.date_of_birth).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gender
              </label>
              {editing ? (
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-white py-2 capitalize">{profile.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Blood Group
              </label>
              {editing ? (
                <select
                  name="blood_group"
                  value={formData.blood_group || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-white py-2">
                  <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-semibold">
                    {profile.blood_group}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Phone className="h-5 w-5 text-green-500" />
            <span>Contact Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.phone}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="h-4 w-4 inline mr-1" />
                Address
              </label>
              {editing ? (
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              {editing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State
              </label>
              {editing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Zip Code
              </label>
              {editing ? (
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">{profile.zip_code}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <span>Emergency Contact</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.emergency_contact_name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contact Phone
              </label>
              {editing ? (
                <input
                  type="tel"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.emergency_contact_phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Relationship
              </label>
              {editing ? (
                <input
                  type="text"
                  name="emergency_contact_relation"
                  value={formData.emergency_contact_relation || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.emergency_contact_relation}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="h-5 w-5 text-red-500" />
            <span>Medical Information</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Allergies
              </label>
              {editing ? (
                <textarea
                  name="allergies"
                  value={formData.allergies || ""}
                  onChange={handleChange}
                  rows="2"
                  placeholder="List any known allergies..."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.allergies || "No known allergies"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chronic Conditions
              </label>
              {editing ? (
                <textarea
                  name="chronic_conditions"
                  value={formData.chronic_conditions || ""}
                  onChange={handleChange}
                  rows="2"
                  placeholder="List any chronic medical conditions..."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.chronic_conditions ||
                    "No chronic conditions recorded"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Medications
              </label>
              {editing ? (
                <textarea
                  name="current_medications"
                  value={formData.current_medications || ""}
                  onChange={handleChange}
                  rows="2"
                  placeholder="List current medications..."
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-white py-2">
                  {profile.current_medications || "No current medications"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            <span>Account Information</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Registered Date</p>
              <p className="text-white">
                {new Date(profile.registered_date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Account Status</p>
              <p className="text-white">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.is_active
                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {profile.is_active ? "Active" : "Inactive"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientProfile;
