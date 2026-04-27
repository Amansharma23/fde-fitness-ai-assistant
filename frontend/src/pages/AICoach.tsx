import { useMemo, useState } from 'react';
import { Activity as ActivityIcon, AlertTriangle, Brain, Info, Loader, ShieldAlert, Utensils } from 'lucide-react';
import { API_BASE } from '../config';
import { useAppContext } from '../context/appContextValue';

interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

interface AIReport {
  bmi_and_health_report: {
    status: string;
    target_difference: string;
    time_required: string;
  };
  weekly_diet_plan: {
    [key: string]: {
      veg: MealPlan;
      non_veg: MealPlan;
    };
  };
  general_tips: string[];
}

type DietView = 'both' | 'veg' | 'non_veg';

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const mealRows: { key: keyof MealPlan; label: string }[] = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
];

const readCachedReport = (key: string): AIReport | null => {
  const cached = sessionStorage.getItem(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as AIReport;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

const AICoach = () => {
  const { currentUser, profile, activities } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'tips' | 'bmi' | 'diet'>('tips');
  const [dietView, setDietView] = useState<DietView>('both');

  const reportCacheKey = `fitlife-ai-report:${currentUser}`;
  const [reportState, setReportState] = useState({ key: reportCacheKey, report: readCachedReport(reportCacheKey) });

  const report = reportState.report;

  const isSafe = useMemo(() => {
    if (typeof profile.age === 'number' && profile.age < 16) return false;
    const isExtremeWeightLoss = profile.goal === 'Lose Weight' && profile.weight && Number(profile.weight) < 50;
    return !isExtremeWeightLoss;
  }, [profile]);

  const currentBMI = useMemo(() => {
    if (profile.weight && profile.height) {
      const weightNum = Number(profile.weight);
      const heightNum = Number(profile.height) / 100;
      if (heightNum > 0) return (weightNum / (heightNum * heightNum)).toFixed(1);
    }
    return 'N/A';
  }, [profile.weight, profile.height]);

  const safeWeightRange = useMemo(() => {
    if (profile.height) {
      const heightNum = Number(profile.height) / 100;
      if (heightNum > 0) {
        const minWeight = (18.5 * heightNum * heightNum).toFixed(1);
        const maxWeight = (24.9 * heightNum * heightNum).toFixed(1);
        return `${minWeight}kg - ${maxWeight}kg`;
      }
    }
    return 'N/A';
  }, [profile.height]);

  if (reportState.key !== reportCacheKey) {
    setReportState({ key: reportCacheKey, report: readCachedReport(reportCacheKey) });
    return null;
  }

  const generateRecommendations = async () => {
    if (!isSafe) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/coach/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, activities }),
      });

      if (!response.ok) throw new Error('Failed to generate recommendations');

      const data = await response.json();
      const nextReport = data.recommendations || null;
      setReportState({ key: reportCacheKey, report: nextReport });
      if (nextReport) {
        sessionStorage.setItem(reportCacheKey, JSON.stringify(nextReport));
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while communicating with the AI Coach. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMealSection = (title: string, meal: MealPlan, color: string) => (
    <div className="meal-section">
      <h4 style={{ color }}>
        <span style={{ background: color }} />
        {title}
      </h4>
      {mealRows.map((row) => (
        <p key={row.key}>
          <strong>{row.label}:</strong> {meal[row.key]}
        </p>
      ))}
    </div>
  );

  return (
    <div className="page-shell wide animate-fade-in">
      <header className="page-header">
        <div className="page-icon">
          <Brain size={28} />
        </div>
        <div>
          <h1>AI Coach</h1>
          <p>Personalized fitness and health guidance based on your profile.</p>
        </div>
      </header>

      {!isSafe ? (
        <div className="card alert-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', color: 'var(--danger)' }}>
            <ShieldAlert size={28} />
            <h2 style={{ fontSize: '1.25rem' }}>Safety Guardrail Activated</h2>
          </div>
          <p style={{ lineHeight: '1.6' }}>
            Based on your profile, this assistant cannot provide personalized recommendations. Please consult a certified medical professional for guidance tailored to your needs.
          </p>
        </div>
      ) : (
        <div className="card report-card">
          <div className="report-toolbar">
            <div>
              <h2>Your Health & Fitness Report</h2>
              {report && <p>Cached for {currentUser}. Generate again to refresh it.</p>}
            </div>
            <button onClick={generateRecommendations} disabled={loading} className="btn-primary compact">
              {loading ? <Loader size={16} className="spin" /> : <Brain size={16} />}
              {loading ? 'Thinking...' : report ? 'Regenerate Report' : 'Generate Report'}
            </button>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {report ? (
            <div>
              <div className="tabs">
                <button onClick={() => setActiveTab('tips')} className={activeTab === 'tips' ? 'active' : ''}><ActivityIcon size={18} /> General Tips</button>
                <button onClick={() => setActiveTab('bmi')} className={activeTab === 'bmi' ? 'active' : ''}><Info size={18} /> BMI & Health</button>
                <button onClick={() => setActiveTab('diet')} className={activeTab === 'diet' ? 'active' : ''}><Utensils size={18} /> Diet Plan</button>
              </div>

              {activeTab === 'tips' && (
                <div className="tips-grid">
                  {report.general_tips.map((rec, i) => (
                    <div key={rec} className="tip-card">
                      <div>0{i + 1}</div>
                      <p>{rec}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'bmi' && (
                <div className="metric-grid">
                  <div><span>Current BMI</span><strong>{currentBMI}</strong></div>
                  <div><span>Safe Weight Range</span><strong>{safeWeightRange}</strong></div>
                  <div><span>AI Assessment</span><strong>{report.bmi_and_health_report.status}</strong></div>
                  <div><span>Target</span><strong>{report.bmi_and_health_report.target_difference}</strong></div>
                  <div><span>Estimated Time</span><strong>{report.bmi_and_health_report.time_required}</strong></div>
                </div>
              )}

              {activeTab === 'diet' && (
                <>
                  <div className="segmented-control" aria-label="Diet display mode">
                    <button onClick={() => setDietView('both')} className={dietView === 'both' ? 'active' : ''}>Both</button>
                    <button onClick={() => setDietView('veg')} className={dietView === 'veg' ? 'active' : ''}>Veg</button>
                    <button onClick={() => setDietView('non_veg')} className={dietView === 'non_veg' ? 'active' : ''}>Non Veg</button>
                  </div>
                  <div className="diet-grid">
                    {daysOfWeek.map((day) => {
                      const plan = report.weekly_diet_plan[day];
                      if (!plan) return null;
                      return (
                        <div key={day} className="diet-day">
                          <h3>{day}</h3>
                          {(dietView === 'both' || dietView === 'veg') && renderMealSection('Vegetarian', plan.veg, 'var(--success)')}
                          {(dietView === 'both' || dietView === 'non_veg') && renderMealSection('Non-Vegetarian', plan.non_veg, 'var(--danger)')}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="empty-state">
              {!loading && <p>Generate a comprehensive health, diet, and fitness report for the selected user.</p>}
            </div>
          )}
        </div>
      )}

      <div className="disclaimer">
        <AlertTriangle size={20} />
        <p><strong>Disclaimer:</strong> This assistant provides general wellness guidance only, not medical advice. Always consult a healthcare professional before major diet or exercise changes.</p>
      </div>
    </div>
  );
};

export default AICoach;
