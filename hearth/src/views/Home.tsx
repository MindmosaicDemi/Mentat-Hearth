import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/schema';
import type { Concern } from '../db/schema';
import { useAppStore } from '../context/appStore';

export const Home = () => {
  const { setCurrentView } = useAppStore();
  const concerns = useLiveQuery(() => db.concerns.toArray());
  
  const groupedConcerns = concerns?.reduce((acc: Record<string, Concern[]>, concern: Concern) => {
    if (!acc[concern.cluster]) {
      acc[concern.cluster] = [];
    }
    acc[concern.cluster].push(concern);
    return acc;
  }, {} as Record<string, Concern[]>);

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Study Map</h1>
          <nav className="flex gap-4">
            <button
              onClick={() => setCurrentView('materials')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Materials
            </button>
            <button
              onClick={() => setCurrentView('challenges')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Challenges
            </button>
            <button
              onClick={() => setCurrentView('accomplishments')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Accomplishments
            </button>
          </nav>
        </header>

        {!concerns || concerns.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No concerns registered yet.</p>
            <button
              onClick={() => setCurrentView('welcome')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
            >
              Add Your First Concern
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Concern Clusters</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(groupedConcerns || {}).map(([cluster, clusterConcerns]) => (
                  <div key={cluster} className="bg-slate-800/50 rounded-lg p-6 backdrop-blur">
                    <h3 className="text-xl font-medium text-purple-400 mb-4">{cluster}</h3>
                    <ul className="space-y-3">
                      {(clusterConcerns as Concern[]).map((concern) => (
                        <li key={concern.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                          <span className="text-gray-300">{concern.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Strength: {concern.strength}</span>
                            <button
                              onClick={() => setCurrentView('resources')}
                              className="text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                            >
                              Do
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
              <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-white mb-4">Continue Reading</h3>
                <p className="text-gray-400 mb-4">Pick up where you left off in your materials.</p>
                <button
                  onClick={() => setCurrentView('reader')}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  Open Reader
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur">
                <h3 className="text-xl font-semibold text-white mb-4">Designed Experiences</h3>
                <p className="text-gray-400 mb-4">Engage with calibrated challenges to grow your capabilities.</p>
                <button
                  onClick={() => setCurrentView('challenges')}
                  className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                >
                  View Challenges
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
