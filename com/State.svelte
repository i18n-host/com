<template lang="pug">
+if err_li
  b
    b.t
      +if timer
        i {timer}
        | 秒后刷新
        +else
          | 刷新中
          b.Wait
    b.E
      //- err without name
      +if err_li[0].length
        i
          +each err_li[0] as [kind,ts,expire,msg]
            b
              | {kind}
              +if expire
                b 监控挂了({ts})
                +else
                  +if msg
                    b {msg}
                  b.ts 持续 {ts}
      //- err has name
      +if err_li[1].length
        +each err_li[1] as [kind,li]
          i
            h2 {kind}
            +each li as [name,ts,expire,msg]
              b
                | {name}
                +if expire
                  b 监控挂了({ts})
                  +else
                    +if msg
                      b {msg}
                    b.ts 持续 {ts}
    b
      +if ok_li[0].length
        i
          +each ok_li[0] as [kind,ts]
            b
              | {kind}
              +if ts
                b {ts}前
      +if ok_li[1].length
        +each ok_li[1] as [kind,li]
          i
            h2 {kind}
            +each li as [name,ts,msg]
              b
                | {name}
                +if Array.isArray(msg)
                  +each msg as i
                    b {i}
                  +elif msg
                    b {msg}
                +if ts
                  b {ts}前

  +else
    b.Wait
</template>

<style lang="stylus">
:global(_)
	flex 1
	display flex
	flex-direction column
	font-variation-settings 'wght' 500
	height 100%
	align-items center
	justify-content center

b
	&>b
		display flex
		flex-direction column

		&.Wait
			width 100%
			height 96px
			background-size 96px

		&>i
			line-height 32px
			font-style normal
			flex-wrap wrap
			display flex
			align-items center
			margin-top 6px

			&>h2, &>b
				display flex
				margin 0 16px 10px 0
				padding 2px 12px
				font-size 16px
				border-radius 16px
				box-shadow 0 0 3px inset rgba(0, 0, 0, 0.3)

			&>h2
				background linear-gradient(#fff, #fcfcfc 50%, #f3f3f3)
				border 2px solid #eee

			&>b
				margin-top 1px
				background #080
				color #fff

				&>b
					background #0000004d
					border-radius 9px
					align-self center
					margin-left 6px
					padding 3px 9px
					font-size 14px
					font-weight 600
					line-height 1.4
					display inline-flex
					margin-top 1px

					&.ts
						background transparent
						font-weight 600

		&.E
			&>i
				&>h2
					border-color #e00

				&>b
					border-color #c00
					background #e00

	&>b.t
		margin-bottom 10px
		align-self flex-start
		color #000
		background linear-gradient(#fff, #fcfcfc 50%, #f3f3f3)
		border-color #999
		padding 0 14px 0 8px
		font-family c
		font-size 14px
		display inline-flex
		border 1px solid #ccc
		flex-direction row
		padding 3px 12px 2px
		border-radius 10px

		&>b.Wait
			display inline-block
			width 16px
			height 16px
			margin-left 6px
			opacity 1
			align-self center

			&:before
				background-size 16px

		&>i
			font-style normal
			display inline-block
			text-align center
			width 22px
			margin 0 0 0 -3px
			line-height inherit
</style>

<script lang="coffee">
> svelte > onMount
  -/lib/req.js > fJson
  -/lib/nowts.js

< _

+ err_li,ok_li,now,ctrl

timer = 60

refresh = =>
  if ctrl
    ctrl.abort()
  ctrl = new AbortController()
  t = await fJson(
    _
    {
      signal: ctrl.signal
    }
  )
  now = nowts()
  [
    err_li
    ok_li
  ] = t.map sort

  ctrl = undefined

  for [kind, li] from ok_li[1]
    if kind == 'mysql'
      for i from li
        t = JSON.parse i[2]
        t[0] = '主 '+t[0]
        i[2] = t
  return

interval = setInterval(
  =>
    if not timer
      return
    if --timer > 0
      return
    try
      await refresh()
    finally
      timer = 60
    return
  1000
)

onMount =>
  refresh()
  =>
    clearInterval interval
    return

cmp = (a, b)=>
  a[0].localeCompare b[0]

h = (li, n)=>
  m = Math.floor (now - li[n])/60
  if m > 0
    if m<99
      m = "#{m}分钟"
    else
      m = Math.floor(m/60)
      if m<99
        m = "#{m}小时"
      else
        m = Math.floor(m/24)
        m = "#{m}天"
  else
    m = 0
  li[n] = m
  return

sort = (li)=>
  kind_no_name = []
  kind_with_name = []

  for [kind, t] from li
    for li from t
      h li,1
    if t.length == 1
      t0 = t[0]
      if not t0[0]
        kind_no_name.push [
          kind
          ...t0.slice(1)
        ]
        continue
    t.sort cmp
    kind_with_name.push [kind, t]

  kind_with_name.sort cmp

  r = [
    kind_no_name
    kind_with_name
  ]

  r.map (i)=>
    i.sort cmp
    i
</script>
