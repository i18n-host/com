import { On, S, Tag, DOC } from "-/dom/_.js"

TMPL = DOC.createElement("template")
TMPL.innerHTML = '<slot></slot>'

# 导航条的状态
H = 'H' # 隐藏中
D = 'D' # 显示
N = 'N' # 隐藏

S(
  "topbar"
  class extends HTMLElement
    constructor: ->
      super()
      @attachShadow({ mode: "open" })
      @shadowRoot.appendChild(TMPL.content.cloneNode(true))

    connectedCallback: ->
      min_hide_height = @offsetHeight + 30 # 避免收起来之后滚动条没有了
      {classList} = @
      body = @nextElementSibling
      console.log {body}
      pre_y = 0
      pre_diff = 0
      scrolltop = (scrollTop)=>
        if classList.contains H
          pre_y = scrollTop
          return
        if scrollTop != pre_y
          diff = scrollTop - pre_y

          if scrollTop and Math.abs(diff) < 20
            return

          pre_y = scrollTop

          add = remove = undefined

          if diff > 0 and pre_diff <= 0
            if scrollTop < min_hide_height
              return
            add = H
            remove = D
          else if diff < 0 and pre_diff > 0
            add = D
            remove = H
            classList.remove N

          if add
            classList.remove remove
            classList.add add
            setTimeout(
              =>
                if classList.contains H
                  classList.remove H
                  classList.add N
                return
              300
            )

          pre_diff = diff
        return


      scroll = =>
        scrolltop body.scrollTop
        return

      resize = new ResizeObserver scroll
      resize.observe(body)
      unmount = On(
        body
        {
          scroll
        }
      )
      scrolltop 0
      @unmount = =>
        unmount()
        resize.disconnect()
        return
      return

    disconnectedCallback: ->
      @unmount()
      return
)
