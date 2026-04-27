import { useState } from 'react';
import { Activity } from 'lucide-react';
import { useAppContext } from '../context/appContextValue';
import type { ActivityType, FeelingType, IntensityType } from '../data/mockData';

const ActivityLog = () => {
  const { addActivity } = useAppContext();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Running' as ActivityType,
    duration: 30,
    intensity: 'Medium' as IntensityType,
    feeling: 'Normal' as FeelingType,
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const savedOk = await addActivity({
      id: crypto.randomUUID(),
      ...formData,
      date: new Date(formData.date).toISOString(),
    });

    if (!savedOk) return;

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setFormData({
      ...formData,
      duration: 30,
      notes: '',
    });
  };

  return (
    <div className="page-shell animate-fade-in">
      <header className="page-header">
        <div className="page-icon"><Activity size={28} /></div>
        <div>
        <h1>Log Activity</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track your daily fitness sessions.</p>
        </div>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Activity Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
              >
                <option value="Walking">Walking</option>
                <option value="Running">Running</option>
                <option value="Gym">Gym</option>
                <option value="Yoga">Yoga</option>
                <option value="Cycling">Cycling</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                className="form-control"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) || 0 })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Intensity</label>
              <select
                className="form-control"
                value={formData.intensity}
                onChange={(e) => setFormData({ ...formData, intensity: e.target.value as IntensityType })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">How it felt</label>
              <select
                className="form-control"
                value={formData.feeling}
                onChange={(e) => setFormData({ ...formData, feeling: e.target.value as FeelingType })}
              >
                <option value="Easy">Easy</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="How did your workout go?"
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn-primary">Save Activity</button>
            {saved && <span style={{ color: 'var(--success)', fontWeight: 500 }}>Activity logged successfully.</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityLog;
