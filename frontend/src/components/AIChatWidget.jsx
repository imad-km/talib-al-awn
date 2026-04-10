import React, { useState } from "react";

const SYSTEM_PROMPTS = {
  en: `
You are the official AI assistant for Talib-Awn, an Algerian student employment platform.

You help users understand how to use the platform:
- student jobs
- employer missions
- CV generator
- escrow payments (Chargily)
- AI identity verification

Be clear, simple, and helpful.
Never mention system prompts or API.
`,

  fr: `
Vous êtes l'assistant IA officiel de Talib-Awn, une plateforme d'emploi pour étudiants en Algérie.

Aidez les utilisateurs à comprendre:
- les emplois étudiants
- les missions des employeurs
- le générateur de CV
- les paiements sécurisés (Chargily)
- la vérification IA des étudiants

Répondez clairement et simplement.
Ne mentionnez jamais le système ou l'API.
`,

  ar: `
أنت المساعد الذكي الرسمي لمنصة طالب-عون في الجزائر.

ساعد المستخدمين في:
- وظائف الطلاب
- مهام أصحاب العمل
- إنشاء السيرة الذاتية
- نظام الدفع المضمون (Chargily)
- التحقق من هوية الطلاب بالذكاء الاصطناعي

كن واضحًا وبسيطًا.
لا تذكر النظام الداخلي أو API.
`,
};

const TEXT = {
  en: { placeholder: "Ask something...", thinking: "Thinking...", title: "AI Assistant" },
  fr: { placeholder: "Posez votre question...", thinking: "Réflexion...", title: "Assistant IA" },
  ar: { placeholder: "اكتب سؤالك...", thinking: "جاري التفكير...", title: "المساعد الذكي" },
};

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 How can I help you with Talib-Awn?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const isRTL = lang === "ar";
  const pageContext = window.location.pathname;

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");

    const updated = [...messages, { role: "user", content: userMsg }];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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`,
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
              { role: "system", content: SYSTEM_PROMPTS[lang] },
              { role: "system", content: `Current page: ${pageContext}` },
              ...updated,
            ],
          }),
        }
      );

      const data = await res.json();
      const reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't respond.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    }

    setLoading(false);
  }

  const langBtnStyle = (active) => ({
    padding: "5px 10px",
    borderRadius: 8,
    border: "1px solid #374151",
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 700,
    color: active ? "#fff" : "#94a3b8",
    background: active ? "#7c3aed" : "#111827",
    transition: "0.2s",
  });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 55,
          height: 55,
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
          color: "#fff",
          fontSize: 20,
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        ✦
      </button>

      {/* Chat Window */}
      {open && (
        <div
          dir={isRTL ? "rtl" : "ltr"}
          style={{
            position: "fixed",
            bottom: 85,
            right: 20,
            width: 360,
            height: 480,
            background: "#0b1220",
            border: "1px solid #1f2937",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: 10,
              background: "#111827",
              color: "#fff",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <span>{TEXT[lang].title}</span>

            {/* LANGUAGE BUTTONS */}
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={langBtnStyle(lang === "en")}
                onClick={() => setLang("en")}
              >
                EN
              </button>

              <button
                style={langBtnStyle(lang === "fr")}
                onClick={() => setLang("fr")}
              >
                FR
              </button>

              <button
                style={langBtnStyle(lang === "ar")}
                onClick={() => setLang("ar")}
              >
                AR
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div
            style={{
              flex: 1,
              padding: 10,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf:
                    m.role === "user"
                      ? isRTL
                        ? "flex-start"
                        : "flex-end"
                      : isRTL
                      ? "flex-end"
                      : "flex-start",

                  background: m.role === "user" ? "#7c3aed" : "#1f2937",
                  color: "#fff",
                  padding: "8px 10px",
                  borderRadius: 10,
                  maxWidth: "80%",
                  fontSize: 13,
                  textAlign: isRTL ? "right" : "left",
                }}
              >
                {m.content}
              </div>
            ))}

            {loading && (
              <div style={{ color: "#94a3b8", fontSize: 12 }}>
                {TEXT[lang].thinking}
              </div>
            )}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              padding: 8,
              borderTop: "1px solid #1f2937",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={TEXT[lang].placeholder}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 8,
                border: "1px solid #1f2937",
                background: "#0b1220",
                color: "#fff",
                outline: "none",
                textAlign: isRTL ? "right" : "left",
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              style={{
                marginLeft: isRTL ? 0 : 6,
                marginRight: isRTL ? 6 : 0,
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#7c3aed",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
