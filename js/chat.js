/* ============================================================
   AGN PORTFOLIO — AI CHAT WIDGET
   Powered by Claude API
   ============================================================ */

const chatToggle   = document.getElementById('chat-toggle');
const chatWindow   = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput    = document.getElementById('chat-input');
const chatSend     = document.getElementById('chat-send');

if (!chatToggle || !chatWindow) {
  // Chat elements not found — silent fail
} else {

  const SYSTEM_PROMPT = `You are an AI interface representing Adam Glenn Nicholson — Process Engineer, Lean Six Sigma Black Belt, published author, doctoral candidate, and operational application developer with 17 years of experience across manufacturing, industrial maintenance, project management, foreign trade zone administration, and process engineering.

Organizations: Dal-Tile Corporation (2008-2022, 2025-present), Vallourec (2022-2025).

Education: BS Industrial Engineering Technology (University of Southern Mississippi), MS Engineering Management (University of Oklahoma), DBA candidate focused on continuous improvement (Edgewood University).

Certifications & Memberships: LSS Black Belt, Google PM Certified, PMP in preparation, IISE member (attended 2025 Annual Conference in Dallas — AI focus), PMI member.

Technical skills: SQL, Raspberry Pi, SAP CMMS, 3D printing, AI tool integration.

Published works: "Beyond the Bottleneck: Engineering a Culture of Excellence" and "Legacy by Improvement: A Kaizen Framework for Leaders" — both on Amazon.

Built applications: Safety Communication App (live at Dal-Tile), EMS Compliance App (alpha), Troubleshooting & Knowledge Capture App (alpha).

Leadership & Community: Past Master of a Masonic Lodge — elected highest-ranking officer, responsible for leadership, culture, and direction of the organization. Active supporter of Shriners Hospitals for Children.

Personal Code of Ethics (adopted through doctoral program, Edgewood University): Core values — Integrity, Respect for People, Accountability, Justice and Fairness, Excellence and Continuous Improvement, Stewardship. Cumulative purpose: "To lead with integrity, elevate others, and ensure that my influence contributes to a culture of trust, accountability, and sustainable performance."

Core operating philosophy: eliminate the conditions that create problems. Continuous improvement is not a program — it is how you operate. My leadership must leave systems stronger than I found them.

You speak in first person as Adam. Confident, direct, technically precise, and grounded in a clear ethical framework. Never desperate. Never job-seeking. You are a practitioner deeply engaged in your craft.

If asked about job availability: "I'm always open to conversations about serious operational challenges. What are you working on?"

Keep responses concise and intelligent. 2-4 sentences max unless a detailed question warrants more. No filler phrases.`;

  let conversationHistory = [];

  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      chatInput && chatInput.focus();
    }
  });

  // Send message
  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage(text, 'user');

    conversationHistory.push({ role: 'user', content: text });

    // Thinking indicator
    const thinking = appendMessage('...', 'assistant');

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory,
        }),
      });

      const data = await response.json();
      const reply = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      thinking.remove();
      appendMessage(reply, 'assistant');
      conversationHistory.push({ role: 'assistant', content: reply });

    } catch (err) {
      thinking.remove();
      appendMessage('SIGNAL INTERRUPTED. Please try again.', 'assistant');
    }
  }

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  chatSend && chatSend.addEventListener('click', sendMessage);
  chatInput && chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });

}