// app/generator/page.tsx
'use client';

import { useUser, RedirectToSignIn } from '@clerk/nextjs';
import { useState } from 'react';
import Link from 'next/link';

export default function GeneratorPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(user?.unsafeMetadata?.usageCount as number || 0);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const generateCopy = async () => {
    if (!prompt.trim()) return;

    if (usageCount >= 3) {
      setShowUpgrade(true);
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.copy || data.text || data.result || 'No copy returned.');
        setUsageCount(data.newUsageCount || usageCount + 1); // Update from server
      } else {
        alert(data.error || 'Failed to generate');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold">AI Copy Generator</h1>
            <p className="text-yellow-400 mt-2">
              Free uses remaining: <span className="font-semibold">{Math.max(0, 3 - usageCount)}</span>/3
            </p>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white">← Back to Home</Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-500 mb-3">Describe what you need</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write a high-converting product description for wireless earbuds..."
                className="w-full h-64 bg-zinc-900 border border-white/10 rounded-3xl p-6 text-lg focus:outline-none focus:border-yellow-400 resize-y"
              />
            </div>

            <button
              onClick={generateCopy}
              disabled={isLoading || !prompt.trim() || usageCount >= 3}
              className="w-full py-6 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 text-black font-bold text-2xl rounded-3xl transition-all"
            >
              {isLoading ? 'Generating with Claude...' : 'Generate Copy'}
            </button>
          </div>

          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 min-h-[420px]">
            <h3 className="text-gray-400 mb-4">Generated Copy</h3>
            {result ? (
              <div className="text-lg leading-relaxed whitespace-pre-wrap">{result}</div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-gray-500">
                Your AI copy will appear here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-6">
          <div className="bg-zinc-900 border border-yellow-400 rounded-3xl max-w-md w-full p-10 text-center">
            <h2 className="text-3xl font-bold mb-6">Free generations used up</h2>
            <p className="text-gray-400 mb-10">Upgrade to Pro for unlimited generations and more.</p>
            <Link
              href="/#pricing"
              className="block w-full py-5 bg-yellow-400 text-black font-bold text-xl rounded-3xl hover:bg-yellow-300"
            >
              Upgrade to Pro — $29/mo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}