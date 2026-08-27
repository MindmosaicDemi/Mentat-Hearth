import { create } from 'zustand';

interface AppState {
  currentView: 'welcome' | 'home' | 'materials' | 'reader' | 'resources' | 'challenges' | 'exams' | 'accomplishments' | 'checkins';
  setCurrentView: (view: AppState['currentView']) => void;
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: (completed: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'welcome',
  setCurrentView: (view) => set({ currentView: view }),
  hasCompletedOnboarding: false,
  setOnboardingComplete: (completed) => set({ hasCompletedOnboarding: completed }),
}));
