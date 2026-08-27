import { useState } from 'react';
import { useAppStore } from '../context/appStore';
import { db } from '../db/schema';
import type { Concern } from '../db/schema';

interface CurvePoint {
  at: string;
  feeling: string;
  note: string;
}

export const Welcome = () => {
  const { setOnboardingComplete, setCurrentView } = useAppStore();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [stakeNote, setStakeNote] = useState('');
  const [curve, setCurve] = useState<CurvePoint[]>([]);
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [currentFeeling, setCurrentFeeling] = useState('');
  const [currentAt, setCurrentAt] = useState('');
  const [currentNote, setCurrentNote] = useState('');
  const [newConcernLabel, setNewConcernLabel] = useState('');
  const [newConcernCluster, setNewConcernCluster] = useState('');

  const addCurvePoint = () => {
    if (currentAt && currentFeeling) {
      setCurve([...curve, { at: currentAt, feeling: currentFeeling, note: currentNote }]);
      setCurrentAt('');
      setCurrentFeeling('');
      setCurrentNote('');
    }
  };

  const removeCurvePoint = (index: number) => {
    setCurve(curve.filter((_, i) => i !== index));
  };

  const addConcern = () => {
    if (newConcernLabel && newConcernCluster) {
      const concern: Concern = {
        id: crypto.randomUUID(),
        label: newConcernLabel,
        cluster: newConcernCluster,
        strength: 3,
      };
      setConcerns([...concerns, concern]);
      setNewConcernLabel('');
      setNewConcernCluster('');
    }
  };

  const removeConcern = (id: string) => {
    setConcerns(concerns.filter(c => c.id !== id));
  };

  const handleComplete = async () => {
    if (!name || !subject || concerns.length === 0) {
      alert('Please fill in your name, subject, and at least one concern.');
      return;
    }

    try {
      await db.persons.add({
        id: undefined,
        name,
        subject,
        curve,
        stakeNote,
      });

      await db.concerns.bulkAdd(concerns);

      setOnboardingComplete(true);
      setCurrentView('home');
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      alert('Failed to save your information. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">Welcome to Hearth</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A grounded STEM learning companion that focuses on what matters to you.
            Learning is not knowledge transfer — it's the encoding of affective reactions to experiences.
          </p>
        </header>

        <section className="bg-slate-800/50 rounded-lg p-6 space-y-4 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">About You</h2>
          
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Subject / Course</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Physics, Chemistry, Mathematics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Personal Stakes</label>
              <textarea
                value={stakeNote}
                onChange={(e) => setStakeNote(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Why does this subject matter to you? What are your goals?"
                rows={3}
              />
            </div>
          </div>
        </section>

        <section className="bg-slate-800/50 rounded-lg p-6 space-y-4 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Map Your Emotional Journey</h2>
          <p className="text-gray-300">Chart how you currently feel about different aspects of your learning journey.</p>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">When / Topic</label>
              <input
                type="text"
                value={currentAt}
                onChange={(e) => setCurrentAt(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Before exams"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Feeling</label>
              <input
                type="text"
                value={currentFeeling}
                onChange={(e) => setCurrentFeeling(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Anxious, Excited"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Note</label>
              <input
                type="text"
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>
          </div>

          <button
            onClick={addCurvePoint}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Add Point
          </button>

          {curve.length > 0 && (
            <div className="space-y-2 mt-4">
              {curve.map((point, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                  <span className="text-gray-300">
                    <strong>{point.at}</strong>: {point.feeling} {point.note && `— ${point.note}`}
                  </span>
                  <button
                    onClick={() => removeCurvePoint(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-slate-800/50 rounded-lg p-6 space-y-4 backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Express Your Concerns</h2>
          <p className="text-gray-300">What specific things worry or excite you about this subject?</p>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">Concern</label>
              <input
                type="text"
                value={newConcernLabel}
                onChange={(e) => setNewConcernLabel(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Understanding thermodynamics equations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cluster</label>
              <input
                type="text"
                value={newConcernCluster}
                onChange={(e) => setNewConcernCluster(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Core Concepts"
              />
            </div>
          </div>

          <button
            onClick={addConcern}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
          >
            Add Concern
          </button>

          {concerns.length > 0 && (
            <div className="space-y-2 mt-4">
              {concerns.map((concern) => (
                <div key={concern.id} className="flex items-center justify-between bg-slate-700/50 p-3 rounded-md">
                  <span className="text-gray-300">
                    <strong>{concern.label}</strong> <span className="text-purple-400">({concern.cluster})</span>
                  </span>
                  <button
                    onClick={() => removeConcern(concern.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex justify-center pt-8">
          <button
            onClick={handleComplete}
            disabled={!name || !subject || concerns.length === 0}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
          >
            Begin Your Journey
          </button>
        </div>

        <footer className="text-center text-gray-400 text-sm pt-8">
          <p>All data stays on this device. No cloud sync. Ever.</p>
        </footer>
      </div>
    </div>
  );
};
