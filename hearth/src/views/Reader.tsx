import { useAppStore } from '../context/appStore';

export const Reader = () => {
  const { setCurrentView } = useAppStore();

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Sequential Reader</h1>
          <button
            onClick={() => setCurrentView('home')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors"
          >
            ← Back to Home
          </button>
        </header>

        <section className="bg-slate-800/50 rounded-lg p-8 backdrop-blur text-center">
          <p className="text-gray-300 text-lg mb-4">Reader view - Coming soon</p>
          <p className="text-gray-500">
            This will display your imported textbook content with chapter navigation,
            prediction prompts, and linked resources.
          </p>
        </section>
      </div>
    </div>
  );
};
