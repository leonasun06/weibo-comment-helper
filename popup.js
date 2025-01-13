document.getElementById('likeButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: autoLikeComments
  });
});

document.getElementById('commentButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: autoPostComments
  });
});

document.getElementById('replyButton').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: autoAddReplies,
    world: "MAIN"
  });
});

function autoLikeComments() {
  // 获取评论区的点赞按钮
  const likeButtons = document.querySelectorAll('button.woo-like-main.IconList_likebox_23Rt_');
  let count = 0;
  
  function clickNextButton() {
    if (count < 20 && count < likeButtons.length) {  // 修改这里：从2改为20
      const button = likeButtons[count];
      const likeIcon = button.querySelector('.woo-like-icon use');
      
      if (likeIcon && !likeIcon.getAttribute('xlink:href').includes('liked')) {
        button.click();
        console.log(`已点赞第 ${count + 1} 条评论`);
      }
      count++;
      // 添加短暂延时,避免同时点击
      setTimeout(clickNextButton, 500);
    } else {
      console.log('点赞完成');
    }
  }
  
  if (likeButtons.length > 0) {
    clickNextButton();
  } else {
    console.log('没有找到可以点赞的评论');
  }
}

function autoPostComments() {
  // 获取前25条评论的内容
  const comments = [];
  const commentElements = document.querySelectorAll('.con1 .text > span:last-child');
  
  // 收集前25条不同的评论内容
  for (let i = 0; i < commentElements.length && comments.length < 25; i++) {  // 修改这里：从5改为25
    const commentText = commentElements[i].textContent.trim();
    if (commentText && !comments.includes(commentText)) {
      comments.push(commentText);
    }
  }

  if (comments.length === 0) {
    console.log('没有找到可用的评论内容');
    return;
  }

  console.log(`已收集 ${comments.length} 条评论内容:`, comments);

  let commentCount = 0;
  let currentIndex = 0;

  function postAndLikeComment() {
    if (commentCount >= 25) {
      console.log('评论发送完成');
      return;
    }

    const commentInput = document.querySelector('.Form_input_3JT2Q');
    const sendButton = document.querySelector('.Composer_btn_2XFOD');

    if (!commentInput || !sendButton) {
      console.log('未找到评论输入框或发送按钮');
      return;
    }

    // 模拟输入评论
    const comment = comments[currentIndex];
    commentInput.value = comment;
    
    // 触发输入事件
    commentInput.dispatchEvent(new Event('input', { bubbles: true }));

    // 等待输入事件处理完成
    setTimeout(() => {
      // 移除禁用状态
      sendButton.disabled = false;
      sendButton.removeAttribute('disabled');
      sendButton.classList.remove('disabled');
      
      // 发送评论
      sendButton.click();
      console.log(`已发送第 ${commentCount + 1} 条评论: ${comment}`);

      // 等待评论出现并点赞
      setTimeout(() => {
        // 使用与点赞功能相同的选择器
        const likeButtons = document.querySelectorAll('button.woo-like-main.IconList_likebox_23Rt_');
        if (likeButtons.length > 0) {
          const latestLikeButton = likeButtons[0];
          const likeIcon = latestLikeButton.querySelector('.woo-like-icon use');
          
          if (likeIcon && !likeIcon.getAttribute('xlink:href').includes('liked')) {
            latestLikeButton.click();
            console.log(`已给第 ${commentCount + 1} 条评论点赞`);
          }
        }

        commentCount++;
        currentIndex = (currentIndex + 1) % comments.length;

        // 继续下一条评论
        setTimeout(postAndLikeComment, 5000);
      }, 2000); // 等待2秒让评论显示出来
    }, 500);
  }

  postAndLikeComment();
}

function autoAddReplies() {
  // 获取前25条评论的内容
  const comments = [];
  const commentElements = document.querySelectorAll('.con1 .text > span:last-child');
  
  // 收集不同的评论内容
  for (let i = 0; i < commentElements.length && comments.length < 25; i++) {
    const commentText = commentElements[i].textContent.trim();
    if (commentText && !comments.includes(commentText)) {
      comments.push(commentText);
    }
  }

  if (comments.length === 0) {
    console.log('没有找到可用的评论内容');
    return;
  }

  console.log(`已收集 ${comments.length} 条评论内容:`, comments);

  // 等待用户点击某条评论的回复按钮
  function waitForReplyClick() {
    const replyButtons = document.querySelectorAll('.woo-box-flex.woo-box-alignCenter.woo-box-justifyCenter .woo-font.woo-font--comment');
    
    console.log(`找到 ${replyButtons.length} 个回复按钮`);

    replyButtons.forEach((button, index) => {
      button.addEventListener('click', function replyHandler(e) {
        replyButtons.forEach(btn => btn.removeEventListener('click', replyHandler));
        
        console.log(`点击了第 ${index + 1} 个回复按钮`);
        
        const checkInterval = setInterval(() => {
          // 首先找到回复弹出层
          const replyLayer = document.querySelector('.wbpro-layer');
          console.log('寻找回复弹出层...', replyLayer ? '找到' : '未找到');
          
          if (replyLayer) {
            // 在弹出层中找到输入框和回复按钮
            const replyInput = replyLayer.querySelector('textarea.Form_input_3JT2Q');
            const sendButton = replyLayer.querySelector('button.Composer_btn_2XFOD');
            
            console.log('检查输入框和按钮:', {
              hasInput: !!replyInput,
              hasButton: !!sendButton,
              buttonText: sendButton?.querySelector('.woo-button-content')?.textContent
            });

            if (replyInput && sendButton) {
              clearInterval(checkInterval);
              let replyCount = 0;
              
              function postNextReply() {
                if (replyCount >= 25) {
                  console.log('回复发送完成');
                  return;
                }

                // 使用取模运算确保不会超出数组范围
                const reply = comments[replyCount % comments.length];
                console.log(`准备发送第 ${replyCount + 1} 条回复，使用第 ${(replyCount % comments.length) + 1} 条评论内容: ${reply}`);
                
                replyInput.value = reply;
                replyInput.style.height = '48px';
                
                // 触发所有必要的事件
                ['input', 'change', 'focus', 'keyup', 'keydown'].forEach(eventType => {
                  replyInput.dispatchEvent(new Event(eventType, { bubbles: true }));
                });

                setTimeout(() => {
                  // 移除禁用状态
                  sendButton.disabled = false;
                  sendButton.removeAttribute('disabled');
                  sendButton.classList.remove('disabled');
                  
                  const buttonText = sendButton.querySelector('.woo-button-content');
                  console.log('按钮文本:', buttonText?.textContent);
                  
                  if (buttonText && buttonText.textContent === '回复') {
                    sendButton.click();
                    console.log(`已发送第 ${replyCount + 1} 条回复: ${reply}`);

                    replyCount++;
                    if (replyCount < 25) {
                      setTimeout(postNextReply, 5000);
                    }
                  } else {
                    console.log('未找到正确的回复按钮');
                  }
                }, 1000);
              }

              postNextReply();
            }
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          console.log('等待回复框超时，请重试');
        }, 10000);
      });
    });
  }

  console.log('请点击任意评论的回复按钮');
  waitForReplyClick();
} 