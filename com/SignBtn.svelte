<template lang="pug">
a(href="/signUp") 注册
b
a(href="/signIn") 登录
</template>

<style lang="stylus">
:global(_)
	&>a
		margin-left 1rem
		color #888

	&>a:first-child
		margin-left 0
		margin-right 1rem

	&>b
		&:before
			content '/'
			color #aaa
			margin-top 3px
			font-size 13px
			display inline-block
			vertical-align 1px
			font-weight 400
</style>

<script lang="coffee">

</script>
