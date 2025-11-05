import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard.jsx";
import NurseDashboard from "./pages/dashboards/NurseDashboard.jsx";
import PatientDashboard from "./pages/dashboards/PatientDashboard.jsx";
import PatientList from "./components/patients/PatientList.jsx";
import PatientForm from "./components/patients/PatientForm.jsx";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <div className="min-h-screen w-full">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Doctor Dashboard Routes */}
            <Route
              path="/dashboard/doctor"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctor/patients"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard>
                    <PatientList />
                  </DoctorDashboard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctor/patients/new"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard>
                    <PatientForm />
                  </DoctorDashboard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/doctor/patients/:id/edit"
              element={
                <ProtectedRoute allowedRoles={["doctor"]}>
                  <DoctorDashboard>
                    <PatientForm />
                  </DoctorDashboard>
                </ProtectedRoute>
              }
            />

            {/* Other role dashboards */}
            <Route
              path="/dashboard/nurse"
              element={
                <ProtectedRoute allowedRoles={["nurse"]}>
                  <NurseDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute allowedRoles={["patient"]}>
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
