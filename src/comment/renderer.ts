const chatContainer = document.getElementById('chat-container');


let generateCommentDiv = (data: {user: string, message: string}) => {
  const { user, message } = data;
  const commentElement = document.createElement("div"); // 全体のdiv
  const userInfoElement = document.createElement("div"); // ユーザ情報表示div
  const messageElement = document.createElement("div"); // コメント本文div
  
  //ユーザ情報divの設定
  userInfoElement.className = "user-info-div";
  

  //コメント本文divの設定
  messageElement.className = "message-div";
  messageElement.innerText = message;


  commentElement.append(userInfoElement);
  commentElement.append(messageElement);
  return commentElement;
}

// get new comment from main process
if (chatContainer) {
  // 自動スクロール
  const scrollBottom = () => {
    const titleBarHeight = window.outerHeight - window.innerHeight;

    // ウィンドウ内でのスクロール可能領域を計算
    const visibleScrollHeight = chatContainer.scrollHeight - chatContainer.offsetHeight;
  
    // 調整後のスクロール位置を設定
    chatContainer.scrollTop = visibleScrollHeight + titleBarHeight;
  }

  window.electron.initialize(() => {
    scrollBottom();
  });

  window.electron.onNewComment((data: {user: string; message: string}) => {
    // 最新コメントを表示中かチェック
    let isScrollBottom = (container: HTMLElement) => {
      const threshold = 1;
      console.log(`scrollstatus: ${container.scrollHeight} = ${container.scrollTop} + ${container.offsetHeight}`);
      return container.scrollHeight == container.scrollTop + container.offsetHeight;
    }
    // コメント追加
    const appendComment = () => {
      const { user, message } = data;
      const commentElement = document.createElement("div");
      commentElement.className = "commentblock";
      commentElement.innerText = [
        `[${user}]`,
        `${message}`
      ].join('\n');
      chatContainer.appendChild(commentElement);
    }

    // 一番下までスクロールされていれば追加後も一番下までスクロールする
    if (isScrollBottom(chatContainer)) {
      appendComment();
      requestAnimationFrame(() => {
        scrollBottom();
      });
    }
    // 一番下までスクロールされていなければスクロールしない
    else {
      appendComment();
    }

  });
}
