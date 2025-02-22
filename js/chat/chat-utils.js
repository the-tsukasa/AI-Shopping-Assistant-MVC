/***********************************************
 * File: chat-utils.js
 * Desc: 通用工具函数 (搜索触发、提取ID、随机数等)
 ***********************************************/

/**
 * 从字符串中提取 [ID: 123] 格式的商品 ID，并自动搜索
 */
function extractAndSearchIDs(message) {
    const idPattern = /\[ID:\s*(\d+)\]/g;
    const ids = [];
    let match;
    while ((match = idPattern.exec(message)) !== null) {
      ids.push(match[1]);
    }
  
    if (ids.length > 0) {
      const searchBar = document.getElementById("search-bar");
      if (searchBar) {
        searchBar.value = `id: ${ids.join(", ")}`;
        triggerSearch(searchBar);
      }
    }
  }
  
  /**
   * 触发搜索事件
   */
  function triggerSearch(inputElement) {
    const event = new Event("input", {
      bubbles: true,
      cancelable: true,
    });
    inputElement.dispatchEvent(event);
  }
  
  /**
   * 清空搜索栏并刷新商品列表
   */
  function clearSearchBar() {
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
      searchBar.value = "";
      triggerSearch(searchBar); 
    }
  }
  
  /**
   * 实际搜索逻辑 (示例，可自行实现)
   */
  function searchProducts(searchText) {
    console.log(`検索実行中: ${searchText}`);
    // TODO: 这里可以加入实际的产品搜索逻辑
  }
  
  /**
   * 自动填入搜索栏并触发搜索
   * - 只提取商品名称，不包含括号后面的价格
   */
  function autoFillSearchBar(productName) {
    const searchBar = document.getElementById("search-bar");
    if (!searchBar) return;
  
    // 只保留括号前的文字，避免后面带价格时产生干扰
    const cleanName = productName.split(" (")[0];
    searchBar.value = cleanName;
  
    // 调用真正的搜索逻辑
    searchProducts(cleanName);
  }
  
  /**
   * 随机生成 1~5 的数字，用于「○日前に配達済み」等场景
   */
  function getRandomDeliveredDays() {
    return Math.floor(Math.random() * 5) + 1;
  }
  