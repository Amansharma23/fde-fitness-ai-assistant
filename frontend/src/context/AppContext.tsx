import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { initialUserProfile } from '../data/mockData';
import type { UserProfile, Activity } from '../data/mockData';
import { API_BASE } from '../config';
import { AppContext } from './appContextValue';

interface ApiUser {
  id: string;
}

const emptyProfile: UserProfile = {
  name: '',
  age: '',
  height: '',
  weight: '',
  goal: 'Stay Active',
  activityLevel: 'Beginner',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<string>('admin');
  const [usersList, setUsersList] = useState<string[]>(['admin']);
  const [profile, setProfileState] = useState<UserProfile>(initialUserProfile);
  const [activities, setActivitiesState] = useState<Activity[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Fetch all users list initially
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/users`);
        if (res.ok) {
          const data = await res.json();
          const ids = (data as ApiUser[]).map((u) => u.id);
          // Ensure default users exist
          if (!ids.includes('admin')) ids.push('admin');
          setUsersList(Array.from(new Set(ids)));
        }
      } catch (err) {
        console.error("Failed to fetch all users", err);
      }
    };
    fetchAllUsers();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Fetch data on user change
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setProfileState(emptyProfile);
      setActivitiesState([]);

      try {
        const [profRes, actRes] = await Promise.all([
          fetch(`${API_BASE}/users/${currentUser}/profile`, { signal: controller.signal }),
          fetch(`${API_BASE}/users/${currentUser}/activities`, { signal: controller.signal }),
        ]);

        const profData = profRes.ok ? await profRes.json() : {};
        const actData = actRes.ok ? await actRes.json() : [];

        if (controller.signal.aborted) return;

        setProfileState(profData && Object.keys(profData).length > 0 ? profData as UserProfile : emptyProfile);
        setActivitiesState(actData as Activity[]);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch user data:", err);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [currentUser]);

  const setProfile = async (newProfile: UserProfile) => {
    const profilePayload = {
      ...newProfile,
      age: newProfile.age === '' ? null : newProfile.age,
      height: newProfile.height === '' ? null : newProfile.height,
      weight: newProfile.weight === '' ? null : newProfile.weight,
    };
    try {
        const res = await fetch(`${API_BASE}/users/${currentUser}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profilePayload)
        });
        if (!res.ok) throw new Error(`Profile update failed with ${res.status}`);
        setProfileState(newProfile);
        setUsersList((prev) => Array.from(new Set([...prev, currentUser])));
        return true;
    } catch(e) {
        console.error("Failed to update profile", e);
        return false;
    }
  };

  const addActivity = async (activity: Activity) => {
    setActivitiesState((prev) => [activity, ...prev]);
    try {
        const res = await fetch(`${API_BASE}/users/${currentUser}/activities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activity)
        });
        if (!res.ok) throw new Error(`Activity create failed with ${res.status}`);
        return true;
    } catch(e) {
        setActivitiesState((prev) => prev.filter((item) => item.id !== activity.id));
        console.error("Failed to add activity", e);
        return false;
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addUser = async (userId: string, newUserProfile: UserProfile) => {
    const normalizedId = userId.trim().toLowerCase();

    if (usersList.includes(normalizedId)) {
      return { ok: false, error: 'User ID already exists.' };
    }

    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: normalizedId,
          ...newUserProfile,
          age: newUserProfile.age === '' ? null : newUserProfile.age,
          height: newUserProfile.height === '' ? null : newUserProfile.height,
          weight: newUserProfile.weight === '' ? null : newUserProfile.weight,
        }),
      });

      if (res.status === 409) {
        return { ok: false, error: 'User ID already exists.' };
      }

      if (!res.ok) {
        return { ok: false, error: 'Unable to create user. Use only lowercase letters, numbers, and underscores.' };
      }

      setUsersList((prev) => Array.from(new Set([...prev, normalizedId])));
      selectUser(normalizedId);
      return { ok: true };
    } catch (e) {
      console.error('Failed to create user', e);
      return { ok: false, error: 'Unable to connect to the API.' };
    }
  };

  const selectUser = (user: string) => {
    setProfileState(emptyProfile);
    setActivitiesState([]);
    setCurrentUser(user);
  };

  return (
    <AppContext.Provider value={{ profile, setProfile, activities, addActivity, theme, toggleTheme, currentUser, setCurrentUser: selectUser, addUser, usersList, setUsersList }}>
      {children}
    </AppContext.Provider>
  );
};
