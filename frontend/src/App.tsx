import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ActivityLog from './pages/ActivityLog';
import AICoach from './pages/AICoach';
import Progress from './pages/Progress';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/activity" element={<ActivityLog />} />
              <Route path="/coach" element={<AICoach />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
