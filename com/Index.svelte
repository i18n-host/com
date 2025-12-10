<template lang="pug">
i-topbar
  a LOGO
  i-sign-btn
b
  b
    i-test
  p
    button(@click=captcha) box captcha
    button(@click=msg) toast error msg
    button(@click=auth) auth

  i-auth
  //-
    i-state(_="//api.u-01.eu.org")
</template>

<style lang="stylus">
:global(_)
	overflow hidden
	height 100dvh

	&>b
		font-weight 400
		overflow auto
		display flex
		flex-direction column

		&>p>button
			margin 1rem

		&>i-auth
			margin auto
</style>

<script lang="coffee">
> -/dom/Toast.js > Warn
  -/dom/Auth.js > signin
  -/srv.js > demoCaptcha userName
  svelte > onMount
  # -/com/state.js:
  -/dom/Topbar.js:
  -/com/signBtn.js:
  -/com/test.js:

onMount =>
  console.log '> userName',  await userName()
  return

auth = =>
  signin()
  return

msg = =>
  Warn 'error msg example'
  return

captcha = =>
  await demoCaptcha()
  return
</script>
