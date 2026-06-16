/* ============================================================
   AGN PORTFOLIO — AI CHAT WIDGET
   Placeholder mode — AI integration coming soon
   ============================================================ */

const chatToggle   = document.getElementById('chat-toggle');
const chatWindow   = document.getElementById('chat-window');
const chatMessages = document.getElementById('chat-messages');
const chatInput    = document.getElementById('chat-input');
const chatSend     = document.getElementById('chat-send');

if (chatToggle && chatWindow) {

  // Open/close the chat window
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open') && chatInput) {
      chatInput.focus();
    }
  });

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    appendMessage(text, 'user');

    setTimeout(() => {
      appendMessage(
        '<strong>AI INTERFACE: OFFLINE</strong><br>' +
        'This system is currently in development.<br><br>' +
        'For direct inquiries, reach out at ' +
        '<a href="mailto:nicholson786@gmail.com" style="color:var(--blue);">nicholson786@gmail.com</a>.',
        'assistant'
      );
    }, 500);
  }

  chatSend  && chatSend.addEventListener('click', sendMessage);
  chatInput && chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
}