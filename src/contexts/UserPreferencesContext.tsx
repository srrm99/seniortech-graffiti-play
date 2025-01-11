import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UserPreferences {
  theme: Theme;
  userName: string;
  favorites: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateUserName: (name: string) => void;
  toggleTheme: () => void;
  toggleFavorite: (feature: string) => void;
  isFavorite: (feature: string) => boolean;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  userName: '',
  favorites: [],
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences]);

  const updateUserName = (name: string) => {
    setPreferences(prev => ({ ...prev, userName: name }));
  };

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const toggleFavorite = (feature: string) => {
    setPreferences(prev => ({
      ...prev,
      favorites: prev.favorites.includes(feature)
        ? prev.favorites.filter(f => f !== feature)
        : [...prev.favorites, feature],
    }));
  };

  const isFavorite = (feature: string) => preferences.favorites.includes(feature);

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateUserName,
        toggleTheme,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};