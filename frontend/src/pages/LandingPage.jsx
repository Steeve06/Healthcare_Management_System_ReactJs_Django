import { useNavigate } from 'react-router-dom';
import { Activity, Users, Calendar, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    { 
      icon: Users, 
      title: 'Patient Management', 
      description: 'Comprehensive patient records and history' 
    },
    { 
      icon: Calendar, 
      title: 'Appointment System', 
      description: 'Efficient scheduling and reminders' 
    },
    { 
      icon: Activity, 
      title: 'Health Monitoring', 
      description: 'Track vitals and health metrics' 
    },
    { 
      icon: Shield, 
      title: 'Secure & Compliant', 
      description: 'HIPAA compliant data protection' 
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold text-white">HealthCare MS</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Modern Healthcare
            <span className="text-blue-500"> Management System</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Streamline your healthcare operations with our comprehensive management solution
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:transform hover:scale-105"
            >
              <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
