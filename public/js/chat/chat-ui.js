/***********************************************
 * File: chat-ui.js
 * Desc: 聊天窗口的UI操作 (添加消息、滚动到底、更新按钮)
 ***********************************************/

/**
 * 在聊天窗中添加一条用户消息
 */
function addUserMessage(message) {
    const chatBody = document.getElementById("chatBody");
    if (!chatBody) return;
  
    const userMessage = document.createElement("p");
    userMessage.className = "user-message";
    userMessage.innerHTML = `👤: ${message}`;
    chatBody.appendChild(userMessage);
  
    scrollToBottom();
  }
  
  /**
   * 在聊天窗中添加一条机器人消息
   * @returns {HTMLElement | null} 返回DOM元素，便于后续移除(比如"思考中...")
   */
  function addBotMessage(message) {
    const chatBody = document.getElementById("chatBody");
    if (!chatBody) return null;
  
    if (!message) {
      console.error("❌ addBotMessage 传入了空消息!");
      return null;
    }
  
    const botMessage = document.createElement("p");
    botMessage.className = "bot-message";
    botMessage.innerHTML = `🤖 Yobi: ${message}`;
    chatBody.appendChild(botMessage);
  
    scrollToBottom();
    return botMessage;
  }
  
  /**
   * 滚动到底部
   */
  function scrollToBottom() {
    const chatBody = document.getElementById("chatBody");
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
  
  /**
   * 更新可点击按钮区域
   */
  function updateButtons(options) {
    const quickButtons = document.getElementById("quickButtons");
    if (!quickButtons) return;
  
    quickButtons.innerHTML = "";
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.innerText = option;
      btn.onclick = () => handleQuickAction(option); // 来自 chat-flow.js
      quickButtons.appendChild(btn);
    });
  }
  