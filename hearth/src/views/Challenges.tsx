import { useState } from 'react';
import { useAppStore } from '../context/appStore';

export const Challenges = () => {
  const { setCurrentView } = useAppStore();
  const [selectedCondition, setSelectedCondition] = useState<'open-notes' | 'timed' | 'closed-book'>('open-notes');
  const [challengeRating, setChallengeRating] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Challenges</h1>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            ← Back to Home
          </button>
        </header>

        <section className="bg-slate-800/50 rounded-lg p-6 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white mb-4">Conditions Dial</h2>
          <p className="text-gray-400 mb-4">Select the challenge conditions:</p>
          
          <div className="flex gap-4 mb-6">
            {(['open-notes', 'timed', 'closed-book'] as const).map((condition) => (
              <button
                key={condition}
                onClick={() => setSelectedCondition(condition)}
                className={`px-6 py-3 rounded-md transition-colors ${
                  selectedCondition === condition
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h3 className="text-xl font-medium text-white mb-4">Available Challenges</h3>
            <p className="text-gray-400 mb-4">No challenges created yet. Import past papers or create experiences based on your concerns.</p>
          </div>
        </section>

        {challengeRating !== null && (
          <section className="bg-slate-800/50 rounded-lg p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white mb-4">Rate This Challenge</h2>
            <p className="text-gray-300 mb-4">How challenging was this?</p>
            
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setChallengeRating(rating)}
                  className={`w-12 h-12 rounded-full text-lg font-semibold transition-colors ${
                    challengeRating === rating
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            
            <p className="text-sm text-gray-500">
              1 = Very Easy, 5 = Very Challenging
            </p>
          </section>
        )}

        <footer className="text-center text-gray-500 text-sm pt-8">
          <p>Challenges are designed experiences calibrated to your concerns. No scores, no streaks — just capability evidence.</p>
        </footer>
      </div>
    </div>
  );
};
