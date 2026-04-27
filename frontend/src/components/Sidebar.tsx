import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Activity, Brain, LayoutDashboard, Moon, Plus, ShieldAlert, Sun, TrendingUp, User, X } from 'lucide-react';
import { useAppContext } from '../context/appContextValue';
import type { ActivityLevel, GoalType, UserProfile } from '../data/mockData';

const userIdPattern = /^[a-z0-9_]+$/;

const emptyNewUserProfile: UserProfile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  goal: 'Stay Active',
  activityLevel: 'Beginner',
};

const Sidebar = () => {
  const { theme, toggleTheme, currentUser, setCurrentUser, usersList, addUser } = useAppContext();
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newUserProfile, setNewUserProfile] = useState<UserProfile>(emptyNewUserProfile);
  const [addUserError, setAddUserError] = useState('');

  const navItems: { name: string; path: string; icon: ReactNode }[] = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Activity Log', path: '/activity', icon: <Activity size={20} /> },
    { name: 'AI Coach', path: '/coach', icon: <Brain size={20} /> },
    { name: 'Progress', path: '/progress', icon: <TrendingUp size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  ];

  if (currentUser === 'admin') {
    navItems.push({ name: 'Admin Dashboard', path: '/admin', icon: <ShieldAlert size={20} /> });
  }

  const normalizedUserId = newUserId.trim().toLowerCase();
  const canCreateUser =
    normalizedUserId.length >= 3 &&
    userIdPattern.test(normalizedUserId) &&
    newUserProfile.name.trim().length > 0 &&
    newUserProfile.age !== '' &&
    newUserProfile.height !== '' &&
    newUserProfile.weight !== '';

  const resetAddUserModal = () => {
    setNewUserId('');
    setNewUserProfile(emptyNewUserProfile);
    setAddUserError('');
    setIsAddingUser(false);
  };

  const handleAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setAddUserError('');

    if (!canCreateUser) {
      setAddUserError('Enter a unique user ID and complete all profile fields.');
      return;
    }

    const result = await addUser(normalizedUserId, newUserProfile);
    if (!result.ok) {
      setAddUserError(result.error || 'Unable to create user.');
      return;
    }

    resetAddUserModal();
  };

  return (
    <>
      <div className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', padding: '8px', borderRadius: '12px', color: 'white' }}>
            <Activity size={24} />
          </div>
          <h2 style={{ fontSize: '1.25rem', lineHeight: '1.2' }} className="gradient-text">FitLife AI</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-hover)' : 'transparent',
                fontWeight: isActive ? 700 : 600,
                transition: 'all 0.2s ease',
              })}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ padding: '0 16px 12px 16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Active user</label>
            <select
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                outline: 'none',
                marginBottom: '12px',
                fontWeight: 700,
              }}
            >
              {usersList.map((userId) => (
                <option key={userId} value={userId}>
                  {userId}
                </option>
              ))}
            </select>

            <button className="sidebar-add-button" onClick={() => setIsAddingUser(true)}>
              <Plus size={16} /> Add User
            </button>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {isAddingUser && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
            <div className="modal-header">
              <div>
                <h2 id="add-user-title">Add User</h2>
                <p>Create a user profile with a unique ID.</p>
              </div>
              <button type="button" onClick={resetAddUserModal} aria-label="Close add user modal"><X size={20} /></button>
            </div>

            <form onSubmit={handleAddUser}>
              <div className="modal-grid">
                <div className="form-group">
                  <label className="form-label">User ID</label>
                  <input
                    className="form-control"
                    value={newUserId}
                    onChange={(e) => setNewUserId(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                    placeholder="john_doe"
                    maxLength={40}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    value={newUserProfile.name}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, name: e.target.value })}
                    placeholder="John Doe"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={newUserProfile.age}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, age: Number(e.target.value) || '' })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={newUserProfile.height}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, height: Number(e.target.value) || '' })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={newUserProfile.weight}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, weight: Number(e.target.value) || '' })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fitness Goal</label>
                  <select
                    className="form-control"
                    value={newUserProfile.goal}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, goal: e.target.value as GoalType })}
                  >
                    <option value="Lose Weight">Lose Weight</option>
                    <option value="Build Strength">Build Strength</option>
                    <option value="Stay Active">Stay Active</option>
                    <option value="Improve Endurance">Improve Endurance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Activity Level</label>
                  <select
                    className="form-control"
                    value={newUserProfile.activityLevel}
                    onChange={(e) => setNewUserProfile({ ...newUserProfile, activityLevel: e.target.value as ActivityLevel })}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {addUserError && <div className="modal-error">{addUserError}</div>}

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={resetAddUserModal}>Cancel</button>
                <button type="submit" className="btn-primary compact" disabled={!canCreateUser}>Create User</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
};

export default Sidebar;
