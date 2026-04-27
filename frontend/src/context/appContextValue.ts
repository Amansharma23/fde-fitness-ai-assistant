import { createContext, useContext } from 'react';
import type { Activity, UserProfile } from '../data/mockData';

export interface AppContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => Promise<boolean>;
  activities: Activity[];
  addActivity: (activity: Activity) => Promise<boolean>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  addUser: (userId: string, profile: UserProfile) => Promise<{ ok: boolean; error?: string }>;
  usersList: string[];
  setUsersList: (users: string[]) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
