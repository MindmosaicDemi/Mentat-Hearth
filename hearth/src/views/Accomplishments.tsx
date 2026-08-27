import { useAppStore } from '../context/appStore';

export const Accomplishments = () => {
  const { setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Accomplishments</h1>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            ← Back to Home
          </button>
        </header>

        <section className="bg-slate-800/50 rounded-lg p-8 backdrop-blur text-center">
          <p className="text-gray-300 text-lg mb-4">Ribbon Board - Coming soon</p>
          <p className="text-gray-500">
            Your verifiable record of accomplishments under stated conditions.
            No progress bars, no completion percentages — only proof of what you can do.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-700/50 rounded-lg p-4 opacity-50">
                <div className="h-16 w-16 mx-auto bg-slate-600 rounded-full mb-3"></div>
                <p className="text-gray-400 text-sm">Example accomplishment ribbon</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
