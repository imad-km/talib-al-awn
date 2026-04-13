import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const STORAGE_KEY = 'ta_my_profile';

const questions = {
  en: [
    { key: 'name', text: 'What is your full name?' },
    { key: 'email', text: 'What is your email?' },
    { key: 'phone', text: 'Your phone number?' },
    { key: 'university', text: 'Which university do you study at?' },
    { key: 'specialty', text: 'What is your specialty?' },
    { key: 'skills', text: 'List your skills (comma separated)' },
    { key: 'bio', text: 'Tell me about yourself briefly' },
  ],
  ar: [
    { key: 'name', text: 'ما هو اسمك الكامل؟' },
    { key: 'email', text: 'ما هو بريدك الإلكتروني؟' },
    { key: 'phone', text: 'ما هو رقم هاتفك؟' },
    { key: 'university', text: 'في أي جامعة تدرس؟' },
    { key: 'specialty', text: 'ما هي تخصصك؟' },
    { key: 'skills', text: 'سرد مهاراتك (مفصولة بفواصل)' },
    { key: 'bio', text: 'أخبرنا عن نفسك باختصار' },
  ]
};

const AICVBuilderPage = () => {
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [answers, setAnswers] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuestions = questions[lang] || questions.en;

  // Initialize chat messages when language changes
  useEffect(() => {
    setMessages([
      { 
        sender: 'ai', 
        text: lang === 'ar'
          ? "مرحبا 👋 أنا مساعد بناء السيرة الذاتية بالذكاء الاصطناعي. هيا نبني سيرتك الذاتية."
          : "Hey 👋 I'm your AI CV builder. Let's build your CV."
      },
      { sender: 'ai', text: currentQuestions[0].text }
    ]);
    setStep(0);
    setAnswers({});
    setInput('');
  }, [lang]);

  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#0f172a' : '#ffffff';
    document.body.style.transition = 'background-color 0.3s ease';
    return () => { document.body.style.backgroundColor = ''; };
  }, [darkMode]);

  const handleSend = () => {
    if (!input.trim()) return;

    const currentQ = currentQuestions[step];
    const newAnswers = { ...answers, [currentQ.key]: input };

    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    setAnswers(newAnswers);

    if (step + 1 < currentQuestions.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);
        setTimeout(() => {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { sender: 'ai', text: currentQuestions[step + 1].text }
          ]);
          setStep(prev => prev + 1);
        }, 600);
      }, 400);
    } else {
      generateCVWithGroq(newAnswers);
    }
  };

  const generateCVWithGroq = async (data) => {
    setIsGenerating(true);
    setMessages(prev => [
      ...prev,
      { sender: 'ai', text: lang === 'ar' ? 'جاري إنشاء سيرتك الذاتية باستخدام الذكاء الاصطناعي...' : 'Generating your professional CV with AI...' }
    ]);

    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      console.error("VITE_GROQ_API_KEY is missing in .env");
      fallbackToPlainCV(data);
      return;
    }

    // Strong system prompt for beautiful, clean, printable HTML CV
    const systemPrompt = `You are a world-class professional CV/Resume designer with excellent taste in typography and layout.

Create a **modern, elegant, clean, and highly professional** single-page CV in HTML + Tailwind CSS.

Design Guidelines (follow closely for premium look):
- Use a clean, minimalist yet sophisticated design with excellent whitespace and hierarchy.
- Main accent color: soft indigo/blue (e.g. indigo-600 or blue-600).
- Use elegant typography with good contrast.
- Include the Lato font family via Google Fonts for a professional feel.
- Header: Large name (first name bolder, last name lighter), contact row (email + phone) with subtle separator, short professional summary / "About Me".
- Sections: Use clear uppercase or nicely styled section titles with a thin bottom border or accent color.
- Education: Show university, specialty/field, and any relevant details in a clean two-column or card style.
- Skills: Display as modern, rounded badge-style tags (nice background, subtle hover if possible, but print-friendly).
- Overall layout: Centered container (max-width ~750px), A4-friendly margins, light background, excellent readability for printing.
- Make it look expensive and contemporary — avoid basic/default Tailwind look.

Technical Requirements:
- Start with proper <!DOCTYPE html><html> structure.
- Include Tailwind via CDN: <script src="https://cdn.tailwindcss.com"></script>
- Include Lato font: <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
- Add a small script to initialize Tailwind (with custom colors if needed).
- Make it fully self-contained.
- Optimize for PDF printing: avoid heavy shadows, ensure good contrast, use print-friendly sizes.

Language Handling:
- If the provided content contains Arabic, set dir="rtl", use appropriate text alignment, and ensure Arabic renders beautifully.
- Otherwise use LTR.

Output Format:
- Return **ONLY** the complete HTML code.
- Wrap the entire HTML inside \`\`\`html
... entire full HTML document here ...
\`\`\`
- Do not add any explanation, apology, or extra text before or after the code block.`;

    const userPrompt = `Generate a professional CV using this information:

Full Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
University: ${data.university}
Specialty: ${data.specialty}
About Me: ${data.bio}
Skills: ${data.skills}

Create a beautiful, modern, clean CV optimized for printing as PDF.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",   // or "llama-3.1-70b-versatile" – very good at HTML
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const result = await response.json();
      let htmlContent = result.choices?.[0]?.message?.content || '';

      // Extract HTML between ```html
      const match = htmlContent.match(/```html\s*([\s\S]*?)\s*```/);
      if (match && match[1]) {
        htmlContent = match[1].trim();
      } else if (htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html')) {
        // already raw HTML
      } else {
        throw new Error("Could not extract valid HTML");
      }

      // Save to localStorage
      const cvDataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
      const cvFileName = `${data.name.replace(/\s/g, '_')}_CV.html`;

      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const updatedProfile = {
        ...existing,
        ...data,
        skills: data.skills.split(',').map(s => s.trim()),
        cvUrl: cvDataUrl,
        cvName: cvFileName,
        cvHtml: htmlContent,   // optional: store raw HTML too
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

      setMessages(prev => [
        ...prev.slice(0, -1), // remove loading message
        { sender: 'ai', text: lang === 'ar' ? '✅ تم إنشاء سيرتك الذاتية بنجاح! جاري التوجيه...' : '✅ Your AI-generated CV is ready! Redirecting...' }
      ]);

      setTimeout(() => {
        navigate('/student/my-profile');
      }, 1200);

    } catch (error) {
      console.error("Groq API error:", error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { sender: 'ai', text: lang === 'ar' ? 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. جاري استخدام النسخة البسيطة...' : 'AI generation failed. Falling back to simple version...' }
      ]);
      fallbackToPlainCV(data);
    } finally {
      setIsGenerating(false);
    }
  };

  // Fallback if Groq fails or key is missing
  const fallbackToPlainCV = (data) => {
    const cvText = `${data.name}\n${data.email} | ${data.phone}\n----------------------------------------\nEDUCATION\n${data.university} - ${data.specialty}\n----------------------------------------\nABOUT ME\n${data.bio}\n----------------------------------------\nSKILLS\n${data.skills}`;
    const cvDataUrl = 'data:text/plain;charset=utf-8,' + encodeURIComponent(cvText);
    const cvFileName = `${data.name.replace(/\s/g, '_')}_CV.txt`;

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const updatedProfile = {
      ...existing,
      ...data,
      skills: data.skills.split(',').map(s => s.trim()),
      cvUrl: cvDataUrl,
      cvName: cvFileName,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

    setMessages(prev => [
      ...prev.slice(0, -1),
      { sender: 'ai', text: lang === 'ar' ? '✅ سيرتك الذاتية جاهزة! جاري التوجيه...' : '✅ Your CV is ready! Redirecting to your profile...' }
    ]);

    setTimeout(() => navigate('/student/my-profile'), 1500);
  };

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
    <div
      className="cv-builder-page"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: 20,
        background: theme.bg,
        minHeight: '100vh',
        color: theme.text,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Header - unchanged */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <button
          onClick={() => navigate('/student/my-profile')}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: `1px solid ${theme.border}`,
            background: theme.card,
            color: theme.text,
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14.5,
          }}
        >
          ← {t('Return') || (lang === 'ar' ? 'العودة' : 'Return to Profile')}
        </button>
        <h1 style={{ margin: 0, fontSize: 24 }}>🪄 {t('aiCvBuilder') || 'AI CV Builder'}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleLanguage} style={{ /* same as before */ }}>
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ /* same */ }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>

      {/* Chat Area - unchanged except loading indicator */}
      <div style={{
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 20,
        height: 460,
        overflowY: 'auto',
        marginBottom: 16,
        background: theme.card,
        boxShadow: darkMode ? 'none' : '0 4px 20px rgba(15,23,42,0.06)'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === 'user' ? (lang === 'ar' ? 'left' : 'right') : 'left', marginBottom: 12 }}>
            <span style={{
              display: 'inline-block',
              padding: '11px 16px',
              borderRadius: 14,
              background: m.sender === 'user'
                ? 'linear-gradient(135deg,#7c3aed,#4f46e5)'
                : theme.aiBubble,
              color: m.sender === 'user' ? '#fff' : theme.text,
              maxWidth: '78%',
              fontSize: 14,
              lineHeight: 1.55,
              border: m.sender === 'ai' ? `1px solid ${theme.border}` : 'none'
            }}>
              {m.text}
            </span>
          </div>
        ))}
        {isGenerating && (
          <div style={{ textAlign: 'left', marginBottom: 12 }}>
            <span style={{ padding: '11px 16px', borderRadius: 14, background: theme.aiBubble, color: theme.text }}>
              {lang === 'ar' ? '🤖 يفكر...' : '🤖 Thinking...'}
            </span>
          </div>
        )}
      </div>

      {/* Input Area - unchanged */}
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
          placeholder={t('typeYourAnswer') || (lang === 'ar' ? 'اكتب إجابتك...' : 'Type your answer...')}
          onKeyDown={e => e.key === 'Enter' && !isGenerating && handleSend()}
          disabled={isGenerating}
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: 15,
            padding: '12px 14px',
            background: 'transparent',
            color: theme.text
          }}
        />
        <button
          onClick={handleSend}
          disabled={isGenerating}
          style={{
            padding: '12px 22px',
            borderRadius: 10,
            border: 'none',
            background: isGenerating ? '#64748b' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            color: '#fff',
            fontWeight: 700,
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontSize: 15
          }}
        >
          {isGenerating ? (lang === 'ar' ? 'جاري الإنشاء...' : 'Generating...') : (t('send') || 'Send')}
        </button>
      </div>
    </div>
  );
};

export default AICVBuilderPage;
