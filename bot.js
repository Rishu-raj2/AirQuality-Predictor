/**
 * bot.js — AirInsight AI Chat Assistant
 * Handles the floating chatbot widget: toggle, message sending, and rendering.
 */

// ─── DOM References ───────────────────────────────────────────────────────────
const chatInput   = document.getElementById("userInput");
const sendButton  = document.getElementById("enterIcon");
const chatWindow  = document.getElementById("chat-messages");
const botWidget   = document.querySelector(".ai-bot");
const botToggle   = document.getElementById("bot-img");

// ─── Chat Widget Toggle ───────────────────────────────────────────────────────

botToggle.addEventListener("click", () => {
  const isHidden = botWidget.style.display === "none" || botWidget.style.display === "";
  botWidget.style.display = isHidden ? "block" : "none";
});

// ─── Message Rendering ────────────────────────────────────────────────────────

/**
 * Append a message bubble to the chat window.
 * @param {string} text — The message text to display
 * @param {"human"|"ai"|"error"} type — Controls bubble styling
 */
function appendMessage(text, type) {
  const bubble = document.createElement("div");
  bubble.classList.add("message-element", type);
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  // Auto-scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/** Show a temporary "AI is thinking..." indicator */
function showTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.classList.add("message-element", "ai", "typing-indicator");
  indicator.id = "typing-indicator";
  indicator.textContent = "AI is thinking…";
  chatWindow.appendChild(indicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/** Remove the typing indicator once the response arrives */
function removeTypingIndicator() {
  const indicator = document.getElementById("typing-indicator");
  if (indicator) indicator.remove();
}

// ─── Send Message ─────────────────────────────────────────────────────────────

/** Read input, send to the /assistance endpoint, and render the response. */
async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Render user bubble and clear input immediately
  appendMessage(`You: ${userText}`, "human");
  chatInput.value = "";

  showTypingIndicator();

  try {
    const response = await fetch("/assistance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    const data = await response.json();
    removeTypingIndicator();

    if (!response.ok) {
      appendMessage(`Error: ${data.error || "Something went wrong."}`, "error");
      return;
    }

    appendMessage(`AI: ${data.text}`, "ai");
  } catch (err) {
    removeTypingIndicator();
    appendMessage("Error: Could not reach the server. Please try again.", "error");
    console.error("Chat error:", err);
  }
}

// ─── Event Listeners ──────────────────────────────────────────────────────────

sendButton.addEventListener("click", sendMessage);

// Allow sending with Enter key (Shift+Enter for new line)
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
