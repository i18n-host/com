> -/dom/_.js > On BODY Tag Div
  -/dom/Box.js

< xClose = (dialog)=>
  x = Tag 'a'
  x.className = 'X'

  dialog.prepend x

  On x, {
    click: =>
      dialog.close()
      return
  }

  dialog

< escClose = (dialog)=>
  On dialog,{
    close: On BODY,{
      keyup:(e)=>
        if 27 == e.keyCode
          {target:t} = e
          if ['INPUT','TEXTAREA'].includes t.tagName
            t.blur()
            return
          dialog.close()
        return
    }
  }
  dialog

< =>
  box = Box()
  box.append Div()
  xClose escClose box
