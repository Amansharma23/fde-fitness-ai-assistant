import { useState } from 'react';
import { UserRound } from 'lucide-react';
import { useAppContext } from '../context/appContextValue';
import type { ActivityLevel, GoalType, UserProfile } from '../data/mockData';

interface ProfileFormProps {
  initialProfile: UserProfile;
  profileKey: string;
  onSave: (profile: UserProfile) => Promise<boolean>;
}

const ProfileForm = ({ initialProfile, profileKey, onSave }: ProfileFormProps) => {
  const [formState, setFormState] = useState({ key: profileKey, data: initialProfile });
  const [saved, setSaved] = useState(false);

  if (formState.key !== profileKey) {
    setFormState({ key: profileKey, data: initialProfile });
    return null;
  }

  const formData = formState.data;
  const setFormData = (data: UserProfile) => setFormState({ key: profileKey, data });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedOk = await onSave(formData);
    if (!savedOk) return;

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Age</label>
          <input
            type="number"
            className="form-control"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || '' })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Height (cm)</label>
          <input
            type="number"
            className="form-control"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || '' })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Weight (kg)</label>
          <input
            type="number"
            className="form-control"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || '' })}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Fitness Goal</label>
          <select
            className="form-control"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as GoalType })}
          >
            <option value="Lose Weight">Lose Weight</option>
            <option value="Build Strength">Build Strength</option>
            <option value="Stay Active">Stay Active</option>
            <option value="Improve Endurance">Improve Endurance</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Current Activity Level</label>
          <select
            className="form-control"
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button type="submit" className="btn-primary">Save Profile</button>
        {saved && <span style={{ color: 'var(--success)', fontWeight: 500 }}>Profile updated successfully.</span>}
      </div>
    </form>
  );
};

const Profile = () => {
  const { currentUser, profile, setProfile } = useAppContext();
  const profileKey = `${currentUser}-${profile.name}-${profile.age}-${profile.height}-${profile.weight}-${profile.goal}-${profile.activityLevel}`;

  return (
    <div className="page-shell animate-fade-in">
      <header className="page-header">
        <div className="page-icon"><UserRound size={28} /></div>
        <div>
        <h1>Your Profile</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Update your personal details and fitness goals.</p>
        </div>
      </header>

      <div className="card">
        <ProfileForm initialProfile={profile} profileKey={profileKey} onSave={setProfile} />
      </div>
    </div>
  );
};

export default Profile;
