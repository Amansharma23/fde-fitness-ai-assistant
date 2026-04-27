import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAppContext } from '../context/appContextValue';

interface TooltipPayload {
  value: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--accent-primary)' }}>{payload[0].value} mins</p>
      </div>
    );
  }
  return null;
};

const Progress = () => {
  const { activities } = useAppContext();

  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toDateString();

      const dayActivities = activities.filter((activity) => new Date(activity.date).toDateString() === dateString);
      const totalDuration = dayActivities.reduce((acc, curr) => acc + curr.duration, 0);

      data.push({
        name: d.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: totalDuration,
      });
    }
    return data;
  }, [activities]);

  const activityBreakdown = useMemo(
    () =>
      Object.entries(
        activities.reduce((acc, curr) => {
          acc[curr.type] = (acc[curr.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      ),
    [activities],
  );

  return (
    <div className="page-shell wide animate-fade-in">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Progress & Trends</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Visualize your hard work and consistency over time.</p>
      </header>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Weekly Activity (Minutes)</h2>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-hover)' }} />
              <Bar dataKey="minutes" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Activity Breakdown</h2>
        {activities.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No activities logged yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {activityBreakdown.map(([type, count]) => (
              <div key={type} style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{type}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{count} sessions</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
