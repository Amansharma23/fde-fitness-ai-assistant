import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Edit, Save, ShieldAlert, X } from 'lucide-react';
import { API_BASE } from '../config';
import { useAppContext } from '../context/appContextValue';
import type { GoalType, UserProfile } from '../data/mockData';

interface UserData {
  id: string;
  profile: UserProfile;
}

const toProfilePayload = (profile: UserProfile) => ({
  ...profile,
  age: profile.age === '' ? null : profile.age,
  height: profile.height === '' ? null : profile.height,
  weight: profile.weight === '' ? null : profile.weight,
});

const AdminDashboard = () => {
  const { currentUser } = useAppContext();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState({ system_prompt: '', safety_guardrails: '' });
  const [savingSettings, setSavingSettings] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings', err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchUsers();
      void fetchSettings();
    });
  }, [fetchSettings, fetchUsers]);

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error(`Settings save failed with ${res.status}`);
      alert('Settings saved successfully.');
    } catch (err) {
      console.error('Error saving settings', err);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingId(user.id);
    setEditForm({ ...user.profile });
  };

  const handleSave = async (id: string) => {
    if (!editForm) return;
    try {
      const res = await fetch(`${API_BASE}/users/${id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toProfilePayload(editForm)),
      });
      if (!res.ok) throw new Error(`Profile save failed with ${res.status}`);
      setUsers(users.map((user) => (user.id === id ? { ...user, profile: editForm } : user)));
      setEditingId(null);
    } catch (err) {
      console.error('Error saving user', err);
    }
  };

  if (currentUser !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading users...</div>;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ padding: '12px', background: 'linear-gradient(135deg, var(--danger), var(--warning))', color: 'white', borderRadius: '12px' }}>
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>View and manage all user profiles across the platform.</p>
        </div>
      </header>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>User ID</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Age</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Weight</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Goal</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.id}</td>
                {editingId === user.id && editForm ? (
                  <>
                    <td style={{ padding: '12px' }}><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} style={{ width: '100px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '12px' }}><input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value === '' ? '' : Number(e.target.value) })} style={{ width: '60px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '12px' }}><input type="number" value={editForm.weight} onChange={(e) => setEditForm({ ...editForm, weight: e.target.value === '' ? '' : Number(e.target.value) })} style={{ width: '60px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px' }} /></td>
                    <td style={{ padding: '12px' }}>
                      <select value={editForm.goal} onChange={(e) => setEditForm({ ...editForm, goal: e.target.value as GoalType })} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px' }}>
                        <option value="Lose Weight">Lose Weight</option>
                        <option value="Build Strength">Build Strength</option>
                        <option value="Stay Active">Stay Active</option>
                        <option value="Improve Endurance">Improve Endurance</option>
                      </select>
                    </td>
                    <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleSave(user.id)} style={{ color: 'var(--success)', background: 'none', border: 'none', cursor: 'pointer' }}><Save size={20} /></button>
                      <button onClick={() => setEditingId(null)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: '12px' }}>{user.profile.name || '-'}</td>
                    <td style={{ padding: '12px' }}>{user.profile.age || '-'}</td>
                    <td style={{ padding: '12px' }}>{user.profile.weight || '-'}</td>
                    <td style={{ padding: '12px' }}>{user.profile.goal || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleEdit(user)} style={{ color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={20} /></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found.</div>}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={24} color="var(--warning)" />
          Global AI Settings
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>System Prompt</label>
            <textarea
              value={settings.system_prompt}
              onChange={(e) => setSettings({ ...settings, system_prompt: e.target.value })}
              style={{ width: '100%', minHeight: '120px', padding: '12px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>Safety Guardrails</label>
            <textarea
              value={settings.safety_guardrails}
              onChange={(e) => setSettings({ ...settings, safety_guardrails: e.target.value })}
              style={{ width: '100%', minHeight: '120px', padding: '12px', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', resize: 'vertical' }}
            />
          </div>

          <button
            onClick={saveSettings}
            disabled={savingSettings}
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: savingSettings ? 'not-allowed' : 'pointer', opacity: savingSettings ? 0.7 : 1 }}
          >
            <Save size={18} />
            {savingSettings ? 'Saving...' : 'Save AI Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
