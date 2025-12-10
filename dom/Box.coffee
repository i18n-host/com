> -/dom/_.js > On Tag BODY

< =>
  dialog = Tag 'dialog'
  dialog.className = 'Box'

  On dialog,{
    close: =>
      BODY.removeChild dialog
      return
    cancel: (e) =>
      e.preventDefault()
      return
  }

  # 不能用 body.append , 不然 chrome bitwarden 会让验证码弹出层到下面
  BODY.prepend dialog

  setTimeout =>
    # 不这样 chrome 122 在 vite 开发模式下有时候会没法显示在顶部
    dialog.showModal()
    return

  dialog
