<template lang="pug">
include /input.pug

form(@&form @submit=submit class:d=!argee)
  //- 回车始终是点击它, 避免点击下面的按钮造成的注册/登录切换
  button(type="submit")
  +input("邮箱")#account(autocomplete: placeholder=" " required type="text")
  +input("{password}")#password(
    autocomplete="current-password"
    minlength="6"
    placeholder=" "
    required
    type="password"
  )
  b
    button(type="submit") 注册
    button(type="submit") 登录
  footer
    b
      input#uAuthAgree(checked&argee type="checkbox")
      label(for="uAuthAgree") 同意
      a 用户协议
    a 重设密码
</template>

<style lang="stylus">
form
	min-width 250px
	overflow hidden
	padding-top 0.5rem

	&>button
		left -9em
		position absolute

	&>b, &>u
		margin 0 1rem 1rem

	&>b
		display flex

		&>button
			flex 1
			white-space nowrap

			&:first-child
				margin-right 1rem

			:global(&.n)
				background none
				border-bottom 3px solid #e50
				box-shadow none
				box-sizing border-box
				color #e50
				flex 0
				padding 12px 0 15px
				white-space nowrap

				&:hover
					filter var(--hF)

	&>footer
		display flex
		justify-content space-between
		font-size 14px
		padding 1rem 0
		user-select none
		border-top 1px solid #eee
		color #999

		a
			cursor pointer

		&>a
			margin-right 1rem

		&>b
			font-weight 400
			display flex
			flex-direction row
			align-items center
			margin-left 1rem

			&>label
				margin 0 0.25rem

			&>a
				border-bottom 1px solid

	&.d
		&>b
			cursor not-allowed
			filter grayscale(1)
			opacity 0.5

			&>button
				pointer-events none

		&>footer>b
			&>input
				filter var(--hF)

			&>label
				color var(--hC)
</style>

<script lang="coffee">
> svelte > onMount
  -/dom/Focus.js
  -/dom/Err.js > Clear Submit
  -/srv.js > authSigninMail authSignupMail

local_account = localStorage.account

< account = local_account or ''

# signin or signup
< n = if local_account then 1 else 0

+ form, input_li

argee = true

N = 'n'

:$
  if n
    autocomplete = 'username'
    password = '密码'
  else
    autocomplete = 'off'
    password = '设置密码'

submit = Submit =>
  if not argee
    return
  console.log await (
    if n then authSigninMail else authSignupMail
  )(...input_li.map (i)=>i.value)
  return

:$
  if argee and form
    Focus form

onMount =>
  input_li = [...form.getElementsByTagName 'input'].slice(0,2)
  input_li[0].value = account
  button_li = [...form.getElementsByTagName 'button'].slice(1)
  for i from button_li
    i.onclick = (e)->
      Clear form
      for i,pos in button_li
        if i == @
          n = pos
          if i.classList.contains N
            e.preventDefault()
            i.classList.remove N
            if n == 0
              for i from input_li
                i.value = ''
        else
          i.classList.add N
        Focus form
      return
  button_li[(n+1)%2].classList.add N
  Focus form
  return
</script>
