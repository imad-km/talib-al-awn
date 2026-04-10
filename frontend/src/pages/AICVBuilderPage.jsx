import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ta_my_profile';

const questions = [
  { key: 'name', text: 'What is your full name?' },
  { key: 'email', text: 'What is your email?' },
  { key: 'phone', text: 'Your phone number?' },
  { key: 'university', text: 'Which university do you study at?' },
  { key: 'specialty', text: 'What is your specialty?' },
  { key: 'skills', text: 'List your skills (comma separated)' },
  { key: 'bio', text: 'Tell me about yourself briefly' },
];

const AICVBuilderPage = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    setMessages([
      { sender: 'ai', text: "Hey 👋 I'm your AI CV builder. Let's build your CV." },
      { sender: 'ai', text: questions[0].text }
    ]);
  }, []);
    useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
    document.body.style.transition = 'background-color 0.3s ease';

    return () => {
        document.body.style.backgroundColor = '';
    };
    }, [darkMode]);
  const handleSend = () => {
    if (!input.trim()) return;

    const currentQ = questions[step];
    const newAnswers = { ...answers, [currentQ.key]: input };

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setAnswers(newAnswers);

    if (step + 1 < questions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);

        setTimeout(() => {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { sender: 'ai', text: questions[step + 1].text }
          ]);
          setStep(prev => prev + 1);
        }, 600);
      }, 400);
    } else {
      generateCV(newAnswers);
    }
  };

  const generateCV = (data) => {
    const cv = `
${data.name}
${data.email} | ${data.phone}

----------------------------------------

EDUCATION
${data.university} - ${data.specialty}

----------------------------------------

ABOUT ME
${data.bio}

----------------------------------------

SKILLS
${data.skills}
`;

    const blob = new Blob([cv], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

    const updatedProfile = {
      ...existing,
      ...data,
      skills: data.skills.split(',').map(s => s.trim()),
      cvUrl: url,
      cvName: `${data.name.replace(/\s/g, '_')}_CV.txt`,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

    setMessages(prev => [
      ...prev,
      { sender: 'ai', text: '✅ Your CV is ready! Redirecting...' }
    ]);

    setTimeout(() => {
      navigate('/profile');
      window.location.reload();
    }, 1500);
  };

  // 🎨 THEME COLORS
  const theme = {
    bg: darkMode ? '#0f172a' : '#ffffff',
    card: darkMode ? '#111827' : '#ffffff',
    border: darkMode ? '#1f2937' : '#e2e8f0',
    text: darkMode ? '#e5e7eb' : '#0f172a',
    subText: darkMode ? '#9ca3af' : '#64748b',
    aiBubble: darkMode ? '#1f2937' : '#ffffff',
    inputBg: darkMode ? '#111827' : '#ffffff',
  };

  return (
    <div style={{
      maxWidth: 700,
      margin: '0 auto',
      padding: 20,
      background: theme.bg,
      minHeight: '100vh',
      color: theme.text,
      transition: 'all 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h1>🪄 AI CV Builder</h1>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '8px 14px',
            borderRadius: 10,
            border: `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* Chat */}
      <div style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        height: 420,
        overflowY: 'auto',
        marginBottom: 14,
        background: theme.card,
        boxShadow: darkMode
          ? 'none'
          : '0 4px 20px rgba(15,23,42,0.06)'
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === 'user' ? 'right' : 'left',
              marginBottom: 10
            }}
          >
            <span style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: 14,
              background: m.sender === 'user'
                ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                : theme.aiBubble,
              color: m.sender === 'user' ? '#fff' : theme.text,
              maxWidth: '75%',
              fontSize: 13.5,
              lineHeight: 1.5,
              border: m.sender === 'ai'
                ? `1px solid ${theme.border}`
                : 'none'
            }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: 8,
        borderRadius: 14,
        background: theme.inputBg,
        border: `1px solid ${theme.border}`
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your answer..."
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 14,
            padding: '10px 12px',
            background: 'transparent',
            color: theme.text
          }}
        />

        <button
          onClick={handleSend}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AICVBuilderPage;
