import { useAppStore } from './context/appStore';
import { Welcome } from './views/Welcome';
import { Home } from './views/Home';
import { Materials } from './views/Materials';
import { Reader } from './views/Reader';
import { Resources } from './views/Resources';
import { Challenges } from './views/Challenges';
import { Accomplishments } from './views/Accomplishments';
import { Checkins } from './views/Checkins';

function App() {
  const { currentView, hasCompletedOnboarding } = useAppStore();

  // If user hasn't completed onboarding, show Welcome screen
  if (!hasCompletedOnboarding) {
    return <Welcome />;
  }

  // Route based on current view
  switch (currentView) {
    case 'welcome':
      return <Welcome />;
    case 'home':
      return <Home />;
    case 'materials':
      return <Materials />;
    case 'reader':
      return <Reader />;
    case 'resources':
      return <Resources />;
    case 'challenges':
      return <Challenges />;
    case 'exams':
      return (
        <div className="min-h-screen bg-slate-900 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Exam Campaigns</h1>
            <p className="text-gray-400">Exam planning view - Coming soon</p>
          </div>
        </div>
      );
    case 'accomplishments':
      return <Accomplishments />;
    case 'checkins':
      return <Checkins />;
    default:
      return <Home />;
  }
}

export default App;
