import { Activity, Clock, Target, Zap } from 'lucide-react';
import { useAppContext } from '../context/appContextValue';

const Dashboard = () => {
  const { profile, activities } = useAppContext();

  const totalWorkouts = activities.length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyMinutes = activities
    .filter((activity) => new Date(activity.date) >= oneWeekAgo)
    .reduce((acc, curr) => acc + curr.duration, 0);

  const uniqueDays = new Set(
    activities
      .filter((activity) => new Date(activity.date) >= oneWeekAgo)
      .map((activity) => new Date(activity.date).toDateString()),
  ).size;
  const weeklyConsistency = Math.round((uniqueDays / 7) * 100);
  const firstName = profile.name.split(' ')[0] || 'there';

  return (
    <div className="page-shell wide animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Welcome back, <span className="gradient-text">{firstName}</span>!</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Here's your fitness overview for today.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'var(--accent-hover)', color: 'var(--accent-primary)', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Workouts</p>
            <h3>{totalWorkouts} sessions</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--success)', borderRadius: '12px' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Weekly Minutes</p>
            <h3>{weeklyMinutes} mins</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
            <Target size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Current Goal</p>
            <h3>{profile.goal}</h3>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px' }}>
            <Zap size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Consistency</p>
            <h3>{weeklyConsistency}%</h3>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Recent Activity</h2>
        {activities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No activities logged yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activities.slice(0, 5).map((activity) => (
              <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-hover)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {activity.type.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ marginBottom: '0.2rem' }}>{activity.type}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(activity.date).toLocaleDateString()} - {activity.duration} mins - {activity.intensity} Intensity
                    </p>
                  </div>
                </div>
                <div>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    {activity.feeling}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
