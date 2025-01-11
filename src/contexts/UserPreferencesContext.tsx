import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  date?: string;
}

interface UserPreferences {
  theme: Theme;
  userName: string;
  favorites: string[];
  achievements: Achievement[];
  gameStats: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    bestStreak: number;
  };
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  updateUserName: (name: string) => void;
  toggleTheme: () => void;
  toggleFavorite: (feature: string) => void;
  isFavorite: (feature: string) => boolean;
  unlockAchievement: (id: string) => void;
  updateGameStats: (won: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'light',
  userName: '',
  favorites: [],
  achievements: [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your profile setup',
      unlocked: false
    },
    {
      id: 'game-master',
      name: 'Game Master',
      description: 'Win 5 games',
      unlocked: false
    },
    {
      id: 'daily-reader',
      name: 'Daily Reader',
      description: 'Read 7 days in a row',
      unlocked: false
    }
  ],
  gameStats: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0
  }
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

  const unlockAchievement = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement =>
        achievement.id === id
          ? { ...achievement, unlocked: true, date: new Date().toISOString() }
          : achievement
      ),
    }));
  };

  const updateGameStats = (won: boolean) => {
    setPreferences(prev => {
      const newStats = {
        gamesPlayed: prev.gameStats.gamesPlayed + 1,
        gamesWon: won ? prev.gameStats.gamesWon + 1 : prev.gameStats.gamesWon,
        currentStreak: won ? prev.gameStats.currentStreak + 1 : 0,
        bestStreak: won
          ? Math.max(prev.gameStats.currentStreak + 1, prev.gameStats.bestStreak)
          : prev.gameStats.bestStreak
      };

      // Check for Game Master achievement
      if (newStats.gamesWon === 5) {
        unlockAchievement('game-master');
      }

      return {
        ...prev,
        gameStats: newStats
      };
    });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        updateUserName,
        toggleTheme,
        toggleFavorite,
        isFavorite,
        unlockAchievement,
        updateGameStats,
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