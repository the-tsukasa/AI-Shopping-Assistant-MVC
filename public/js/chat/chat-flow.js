/***********************************************
 * File: chat-flow.js
 * Desc: 聊天流程控制 (分支逻辑 / FAQ / 调用后端AI 等)
 ***********************************************/

// 流程控制变量
let pcSelectStep = 0;    
let aiRecommendStep = 0;

/**
 * 点击快捷按钮时调用
 */
function handleQuickAction(action) {
  addUserMessage(action);

  switch (action) {
    // ========== 初始 4 个按钮 ==========
    case "🎯 PCを選ぶ":
      pcSelectStep = 1;
      aiRecommendStep = 0;
      setTimeout(() => {
        addBotMessage("どのような用途でPCを使いますか？");
        updateButtons(["学習", "仕事", "ゲーム", "日常", "🏠 ホームへ戻る"]);
      }, 500);
      break;

    case "✨ AIおすすめ":
    case "🔁 別のおすすめを見る":
      aiRecommendStep = 1;
      pcSelectStep = 0;
      recommendProduct();  // 下面定义的函数
      updateButtons(["🔁 別のおすすめを見る", "🏠 ホームへ戻る"]);
      break;

    case "🔥 人気商品":
      pcSelectStep = 0;
      aiRecommendStep = 0;
      setTimeout(() => {
        addBotMessage("人気のあるカテゴリをお選びください。");
        updateButtons(["Macノート", "Windowsノート", "ゲーミングノート", "デスクトップ", "タブレット", "🏠 ホームへ戻る"]);
      }, 500);
      break;

    case "🚚 注文・配送":
      pcSelectStep = 0;
      aiRecommendStep = 0;
      setTimeout(() => {
        addBotMessage("注文履歴をご覧になりますか？ それとも配送状況を確認しますか？");
        updateButtons(["注文履歴を見る", "配送状況を確認", "🏠 ホームへ戻る"]);
      }, 500);
      break;

    // ========== PCを選ぶ 分步 ==========

    case "学習":
    case "仕事":
    case "ゲーム":
    case "日常":
      if (pcSelectStep === 1) {
        pcSelectStep = 2;
        setTimeout(() => {
          addBotMessage("どのタイプのPCをお探しですか？");
          updateButtons(["ノートPC", "デスクトップ", "タブレット", "🏠 ホームへ戻る"]);
        }, 500);
      }
      break;

    case "ノートPC":
    case "デスクトップ":
    case "タブレット":
      if (pcSelectStep === 2) {
        pcSelectStep = 3;
        setTimeout(() => {
          addBotMessage("ご予算はどのくらいですか？");
          updateButtons(["~10万円", "~20万円", "~30万円", "30万円以上", "🏠 ホームへ戻る"]);
        }, 500);
      }
      break;

    case "~10万円":
    case "~20万円":
    case "~30万円":
    case "30万円以上":
      if (pcSelectStep === 3) {
        pcSelectStep = 4;
        setTimeout(() => {
          addBotMessage("ブランドやOSの好みはありますか？");
          updateButtons(["Apple", "Windows系", "特になし", "🏠 ホームへ戻る"]);
        }, 500);
      }
      break;

    case "Apple":
    case "Windows系":
    case "特になし":
      if (pcSelectStep === 4) {
        pcSelectStep = 5;
        setTimeout(() => {
          const recommendationMessage = `
            ・MacBook Air 13.3 2020[ID: 11]<br>
            ・Lenovo LOQ RTX 4060 [ID: 19]<br>
            ・ROG Zephyrus [ID: 33]<br>
            ・MacBook Pro M4 Max [ID: 38]<br>
          `;
          addBotMessage("条件に合ったオススメはこちらです。（サンプル）");
          addBotMessage(recommendationMessage);

          // 自动提取ID并刷新搜索
          extractAndSearchIDs(recommendationMessage);
          updateButtons(["🏠 ホームへ戻る"]);
        }, 800);
      }
      break;

    // ========== 人気商品 (Macノート、Windowsノート等) ==========
    case "Macノート":
      handleProductRecommendation("Macノート", [
        "MacBook Pro 13.3 M1 8GB 256GB (2021)",
        "MacBook Pro 16.2 M4 Pro 48GB 512GB (2024)",
        "MacBook Air 15.3 M3 16GB 512GB (2024)"
      ]);
      break;

    case "Windowsノート":
      handleProductRecommendation("Windowsノート", [
        "HP Stream 14 (5万円)",
        "Dell XPS 13 (20万円)",
        "Lenovo IdeaPad (10万円)"
      ]);
      break;

    case "ゲーミングノート":
      handleProductRecommendation("ゲーミングノート", [
        "Acer Nitro 5 (12万円)",
        "MSI GF65 (18万円)",
        "ASUS ROG Zephyrus (30万円)"
      ]);
      break;

    case "デスクトップ": 
      handleProductRecommendation("デスクトップ", [
        "HP Pavilion (8万円)",
        "Dell Inspiron (12万円)",
        "iMac (25万円)"
      ]);
      break;

    case "タブレット":
      handleProductRecommendation("タブレット", [
        "Amazon Fire HD (1万円)",
        "iPad (5万円)",
        "iPad Pro (12万円)"
      ]);
      break;

    // ========== 订单/配送 ==========
    case "注文履歴を見る":
      setTimeout(() => {
        addBotMessage(`こちらが過去の注文履歴です。<br> 
          ・2025年02月05日 14:10 ご注文: #10001 MacBook Air<br>
          ・2025年01月25日 09:45 ご注文: #10002 Acer Nitro 5
        `);
        updateButtons(["🏠 ホームへ戻る"]);
      }, 500);
      break;

    case "配送状況を確認":
      setTimeout(() => {
        const statusList = [
          "準備中（千葉船橋倉庫）",
          "発送済み（黒猫営業所）",
          "配送中（渋谷郵便局から）",
          `配達完了（${getRandomDeliveredDays()}日前に配達済み）`
        ];
        const randomStatus = statusList[Math.floor(Math.random() * statusList.length)];
        addBotMessage(`🚚 現在の配送状況: <strong>${randomStatus}</strong> です。`);
        updateButtons(["🏠 ホームへ戻る"]);
      }, 500);
      break;

    // ========== 回到首页 ==========
    case "🏠 ホームへ戻る":
      pcSelectStep = 0;
      aiRecommendStep = 0;
      setTimeout(() => {
        addBotMessage("ホームに戻りました。何をお探しでしょうか？");
        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
        clearSearchBar();
      }, 500);
      break;

    case "🔄 最初からやり直す":
      pcSelectStep = 0;
      aiRecommendStep = 0;
      setTimeout(() => {
        addBotMessage("了解しました。改めてご案内します。");
        updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
      }, 500);
      break;

    default:
      // 未匹配情况
      addBotMessage("指定されたアクションを確認できませんでした。");
      updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
      break;
  }
}

/**
 * 手动输入消息时，调用此函数
 */
function sendMessage() {
  const userInput = document.getElementById("userInput");
  if (!userInput) return;

  const message = userInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  userInput.value = "";

  // 调用消息处理函数 (FAQ 匹配 / AI调用)
  handleUserInput(message);
}

/**
 * 核心：根据用户输入进行 FAQ 匹配，若匹配不到则调用后端 /api/chat
 */
async function handleUserInput(message) {
  // ========== 关键字匹配 (FAQ) ==========
  if (message.includes("おすすめ")) {
    const product = "Acer Nitro 5";
    addBotMessage(`おすすめの商品は、${product}やMacBook Airです！`);
    autoFillSearchBar(product);
    updateButtons(["🔄 他のおすすめを見る", "🏠 ホームへ戻る"]);
    return;
  }
  else if (message.includes("人気商品")) {
    addBotMessage("現在の人気商品はこちらです。MacBook Pro, ASUS ROG, Lenovo LOQなど！");
    return;
  }
  else if (message.includes("どれを選ぶべき")) {
    addBotMessage("用途に応じて最適な商品をおすすめします。学習用、仕事用、ゲーム用など用途を教えてください！");
    return;
  }
  else if (message.includes("おすすめのノートPC")) {
    addBotMessage("おすすめのノートPCは、MacBook Air、Lenovo ThinkPad、ASUS ZenBook です！");
    return;
  }
  else if (message.includes("ゲーミングPCのおすすめ")) {
    addBotMessage("ゲーミングPCには、ASUS ROG、Acer Predator、Alienwareがおすすめです！");
    return;
  }
  else if (message.includes("注文")) {
    addBotMessage("注文状況を確認します。注文番号を教えてください。");
    return;
  }
  else if (message.includes("配送")) {
    addBotMessage("配送状況を確認しています。少々お待ちください。");
    return;
  }
  else if (message.includes("支払い方法")) {
    addBotMessage("支払い方法は、クレジットカード、銀行振込、コンビニ払い、PayPayなどが利用可能です。");
    return;
  }
  else if (message.includes("返品")) {
    addBotMessage("返品は、商品到着後7日以内に手続きしてください。");
    return;
  }
  else if (message.includes("保証")) {
    addBotMessage("保証期間は商品によって異なります。通常は1年間のメーカー保証が付きます。");
    return;
  }
  else if (message.includes("アカウント作成")) {
    addBotMessage("アカウント作成は、登録ページから行えます。");
    return;
  }
  else if (message.includes("パスワードを忘れた")) {
    addBotMessage("パスワードを忘れた場合、パスワードリセットページから再設定してください。");
    return;
  }
  else if (message.includes("インターネットに接続できない")) {
    addBotMessage("ルーターの再起動をお試しください。");
    return;
  }
  else if (
    message.includes("こんにちは") || message.includes("こんばんは") || 
    message.includes("おはよう")  || message.includes("hello")      ||
    message.includes("hi")       || message.includes("你好")        ||
    message.includes("やあ")     || message.includes("よう！")       ||
    message.includes("久しぶり")  || message.includes("はじめまして")
  ) {
    addBotMessage("こんにちは！今日はどんなお手伝いができますか？");
    return;
  }
  else if (
    message.includes("ありがとう") || message.includes("感謝")        || 
    message.includes("Thank you") || message.includes("thanks")     ||
    message.includes("多谢")       || message.includes("ありがと")     ||
    message.includes("助かった")  || message.includes("Thanks a lot") ||
    message.includes("thank you very much") || message.includes("感謝します")
  ) {
    addBotMessage("どういたしまして！また何かあれば聞いてください。");
    return;
  }
  else if (
    message.includes("さようなら") || message.includes("バイバイ")   ||
    message.includes("goodbye")   || message.includes("bye")       ||
    message.includes("再见")       || message.includes("またね")     ||
    message.includes("じゃあね")   || message.includes("おやすみ")   ||
    message.includes("See you")   || message.includes("Take care")
  ) {
    addBotMessage("さようなら！またお会いしましょう。");
    return;
  }
  else if (
    message.includes("本当ですか") || message.includes("マジ？")    ||
    message.includes("真的吗")     || message.includes("Sure?")     ||
    message.includes("本気？")      || message.includes("本当に？")  ||
    message.includes("Are you sure") || message.includes("確かですか") ||
    message.includes("間違いない")   || message.includes("正しい？")
  ) {
    addBotMessage("はい、本当です。ご安心ください。");
    return;
  }
  else if (
    message.includes("お願いします")   || message.includes("助けて")      ||
    message.includes("お願いがある")   || message.includes("Help me")     ||
    message.includes("Could you please") || message.includes("ちょっと手伝って") ||
    message.includes("お願いできますか") || message.includes("頼む")          ||
    message.includes("Can you help")      || message.includes("Could you do me a favor")
  ) {
    addBotMessage("かしこまりました。すぐに対応いたします。");
    return;
  }
  
  // ========== 如果以上都没匹配到，则调用后端API (DeepSeek等) ==========
  const waitingMsg = addBotMessage("🤔 考え中...");
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error("API リクエスト失敗");

    const data = await response.json();
    if (waitingMsg && typeof waitingMsg.remove === "function") {
      waitingMsg.remove();
    }
    addBotMessage(data.reply);
  } catch (error) {
    if (waitingMsg && typeof waitingMsg.remove === "function") {
      waitingMsg.remove();
    }
    addBotMessage("⚠️ AIとの接続に失敗しました。もう一度お試しください。");
  }

  // 默认给出基础按钮菜单
  updateButtons(["🎯 PCを選ぶ", "✨ AIおすすめ", "🔥 人気商品", "🚚 注文・配送"]);
}

/**
 * 刷新推荐逻辑（“他のおすすめを見る”）
 */
function handleRefreshRecommendation() {
  clearSearchBar();
  const newRecommendation = getRandomProduct();
  addBotMessage(`新しいおすすめの商品は、${newRecommendation} です！`);
  autoFillSearchBar(newRecommendation);
  updateButtons(["🔁 別のおすすめを見る", "🏠 ホームへ戻る"]);
}

/**
 * 随机推荐一款商品 (AIおすすめ)
 */
function recommendProduct() {
  addBotMessage("新しいおすすめの商品はこちらです：");
  const products = [
    { id: 32, name: "OMEN Transcend 14" },
    { id: 19, name: "Lenovo LOQ 15IRX9" },
    { id: 27, name: "ThinkPad X1" },
    { id: 33, name: "ASUS ROG Zephyrus" },
    { id: 31, name: "MacBook Pro 14.2 M4" }
  ];

  // 这里可做上次推荐的去重
  const randomItem = products[Math.floor(Math.random() * products.length)];
  addBotMessage(`🎯 <a href="./product-detail.html?id=${randomItem.id}" target="_blank">${randomItem.name}</a>`);

  // 模拟搜索联动
  const searchBar = document.getElementById("search-bar");
  if (!searchBar) return;
  searchBar.value = "";
  setTimeout(() => {
    searchBar.value = randomItem.name;
    let event = new Event("input", { bubbles: true });
    searchBar.dispatchEvent(event);

    setTimeout(() => {
      let enterEvent = new KeyboardEvent("keydown", { key: "Enter", keyCode: 13, bubbles: true });
      searchBar.dispatchEvent(enterEvent);
    }, 200);
  }, 200);
}

/**
 * 获取新的随机产品名称 (用于 "🔄 他のおすすめを見る")
 */
function getRandomProduct() {
  const products = [
    "OMEN Transcend 14",
    "Lenovo LOQ 15IRX9",
    "ThinkPad X1",
    "ASUS ROG Zephyrus",
    "MacBook Pro 14.2 M4"
  ];
  return products[Math.floor(Math.random() * products.length)];
}

/**
 * “人気商品”分类的推荐
 */
function handleProductRecommendation(category, products) {
  try {
    setTimeout(() => {
      addBotMessage(`人気の${category}はこちらです。`);
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      addBotMessage(`人気No.1: <strong>${randomProduct}</strong>`);

      setTimeout(() => {
        autoFillSearchBar(randomProduct);
      }, 800);

      updateButtons(["🏠 ホームへ戻る"]);
    }, 500);
  } catch (error) {
    console.error("handleProductRecommendation エラー:", error);
  }
}
