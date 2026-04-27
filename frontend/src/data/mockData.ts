export type GoalType = 'Lose Weight' | 'Build Strength' | 'Stay Active' | 'Improve Endurance';
export type ActivityLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type ActivityType = 'Walking' | 'Running' | 'Gym' | 'Yoga' | 'Cycling' | 'Custom';
export type IntensityType = 'Low' | 'Medium' | 'High';
export type FeelingType = 'Easy' | 'Normal' | 'Hard';

export interface UserProfile {
  name: string;
  age: number | '';
  height: number | '';
  weight: number | '';
  goal: GoalType;
  activityLevel: ActivityLevel;
}

export interface Activity {
  id: string;
  type: ActivityType;
  duration: number; // minutes
  intensity: IntensityType;
  feeling: FeelingType;
  notes: string;
  date: string; // ISO string
}

export const initialUserProfile: UserProfile = {
  name: 'Alex Johnson',
  age: 28,
  height: 175,
  weight: 70,
  goal: 'Stay Active',
  activityLevel: 'Intermediate',
};

// Generate some recent dates
const today = new Date();
const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today); threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'Running',
    duration: 30,
    intensity: 'Medium',
    feeling: 'Normal',
    notes: 'Morning jog around the park',
    date: today.toISOString(),
  },
  {
    id: '2',
    type: 'Yoga',
    duration: 45,
    intensity: 'Low',
    feeling: 'Easy',
    notes: 'Stretching and recovery',
    date: yesterday.toISOString(),
  },
  {
    id: '3',
    type: 'Gym',
    duration: 60,
    intensity: 'High',
    feeling: 'Hard',
    notes: 'Leg day!',
    date: twoDaysAgo.toISOString(),
  },
  {
    id: '4',
    type: 'Walking',
    duration: 20,
    intensity: 'Low',
    feeling: 'Easy',
    notes: 'Evening walk',
    date: threeDaysAgo.toISOString(),
  }
];
