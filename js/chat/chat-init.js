/***********************************************
 * File: chat-init.js
 * Desc: 聊天初始化 (加载 chat.html + 首次对话/按钮设置)
 ***********************************************/
//  聊天窗口的开关逻辑
function toggleChat() {
    const chatModal = document.getElementById("chatModal");
    chatModal.style.display = (chatModal.style.display === "block") ? "none" : "block";
}
document.addEventListener("DOMContentLoaded", () => {
    const chatContainer = document.getElementById("chat-container");
    if (!chatContainer) {
      console.error("❌ chat-container 要素が見つかりません。");
      return;
    }
  
    // 动态加载 chat.html (如果不需要动态加载, 可以直接在HTML中写死)
    fetch("components/chat.html")
      .then(response => response.text())
      .then(html => {
        // 将聊天组件插入到 chatContainer 容器
        chatContainer.innerHTML = html;
  
        // 绑定输入框的回车事件 → 调用 chat-flow.js 里的 sendMessage()
        const userInput = document.getElementById("userInput");
        if (userInput) {
          userInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
              event.preventDefault(); 
              sendMessage(); 
            }
          });
        }
  
        // ========== 初始化欢迎提示和按钮 ==========
        setTimeout(() => {
          addBotMessage("やあ！今日はどんな商品が気になりますか？");
          updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
        }, 500);
  
        // ========== 点击事件监听，用于"🔄 他のおすすめを見る"等 ==========
        document.addEventListener("click", (event) => {
          if (event.target.innerText === "🔄 他のおすすめを見る") {
            handleRefreshRecommendation();
          }
        });
      })
      .catch(error => {
        console.error("チャットコンポーネントの読み込みエラー:", error);
      });
  });
  