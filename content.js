// 这个文件可以用来监听页面变化或处理其他逻辑
console.log('微博评论点赞助手已加载'); 

// 可以添加 MutationObserver 来监听评论区的变化
const observer = new MutationObserver((mutations) => {
  const likeButtons = document.querySelectorAll('button.woo-like-main.IconList_likebox_23Rt_');
  console.log(`发现 ${likeButtons.length} 个点赞按钮`);
});

// 监听评论区的变化
const commentList = document.querySelector('.vue-recycle-scroller__item-wrapper');
if (commentList) {
  observer.observe(commentList, {
    childList: true,
    subtree: true
  });
} 

// 添加评论功能的状态监听
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getCommentStatus') {
    const commentInput = document.querySelector('.woo-box-flex.woo-box-alignCenter.Frame_wrap_3g67Q textarea');
    const sendButton = document.querySelector('button[type="submit"]');
    sendResponse({
      ready: !!(commentInput && sendButton)
    });
  }
}); 

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startReply") {
    console.log("开始回复操作");
    sendResponse({ status: "started" });
  }
}); 