> -/dom/_.js > DOC Tag BODY Div

`const _LI=0, _BOTTOM = 1`

pop = (Toast, msg, option={})->

  li = [...DOC.getElementsByTagName('dialog')]
  len = li.length
  + body
  if len > 0
    li.reverse()
    for i from li
      if i.open
        body = i
        break
  if not body
    body = BODY

  {timeout, body, close, html} = Object.assign(
    {
        timeout:9
        body
        close:1
    }
    option
  )

  li = Toast[_LI]

  elem = Div()
  elem.className = "animate fadeInLeft Toast"
  elem.style.marginBottom = Toast[_BOTTOM]+'px'
  inner = Div()
  if html
    inner.innerHTML = msg
  else
    inner.innerText = msg
  elem.appendChild inner
  if close
    close_i = Tag('i')
    close_i.className = 'x'
    elem.appendChild close_i
  # elem = $ """<div class="" style=>#{msg}</div>"""
  li.push elem
  body.appendChild elem
  Toast[_BOTTOM] += (14+elem.offsetHeight)
  elem.close = close_func = =>
    fadeout = "fadeOutLeft"
    {classList} = elem
    if classList.contains fadeout
      return
    classList.add fadeout
    setTimeout(
      =>
        li.splice li.indexOf(elem), 1
        body.removeChild elem
        offset = 0
        for i,pos in li
          i.style.marginBottom = offset+'px'
          offset += (14+i.offsetHeight)
        Toast[_BOTTOM] = offset
        return
      500
    )
    return
  if close
    close_i.onclick = close_func
  if timeout
    setTimeout(
      close_func
      timeout*1e3
    )
  return elem

TOAST = [
  # Toast li
  []
  # bottom
  0
]

export default Toast = (args...)->
  pop(TOAST,...args)

export Warn = (args...)=>
  elem = Toast(...args)
  elem.classList.add 'ERR'
  elem
