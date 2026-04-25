'use client';

import { useState } from 'react';

export default function XAgent() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('post');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setOutput('');

    let prompt = '';
    if (mode === 'post') {
      prompt = `Write a short tweet about: ${input}`;
    } else if (mode === 'thread') {
      prompt = `Write a 3-tweet thread about: ${input}`;
    } else {
      prompt = `Write a short DM to an eBay seller about: ${input}`;
    }

    const res = await fetch('/api/x-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setOutput(data.text);
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', background: '#09090b', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ color: '#e8c97a' }}>X Agent</h1>
      
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <button onClick={() => setMode('post')} style={{ padding: '0.5rem 1rem', background: mode === 'post' ? '#e8c97a' : '#333', color: mode === 'post' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Post
        </button>
        <button onClick={() => setMode('thread')} style={{ padding: '0.5rem 1rem', background: mode === 'thread' ? '#e8c97a' : '#333', color: mode === 'thread' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Thread
        </button>
        <button onClick={() => setMode('dm')} style={{ padding: '0.5rem 1rem', background: mode === 'dm' ? '#e8c97a' : '#333', color: mode === 'dm' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          DM
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What do you want to post about?"
        style={{ width: '100%', padding: '1rem', background: '#1a1a1a', color: 'white', border: '1px solid #333', borderRadius: '8px', marginBottom: '1rem' }}
        rows={3}
      />

      <button onClick={generate} disabled={loading} style={{ background: '#e8c97a', color: 'black', padding: '0.5rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {output && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Output:</h2>
          <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>{output}</div>
          <button onClick={() => navigator.clipboard.writeText(output)} style={{ marginTop: '0.5rem', color: '#e8c97a', background: 'none', border: 'none', cursor: 'pointer' }}>
            Copy
          </button>
        </div>
      )}
    </div>
  );
}