<template lang="pug">
h1 {tld}
</template>

<style lang="stylus">
h1
	background linear-gradient(0, #f30 0, #e58b38)
	background-clip text
	color transparent
	display flex
	font-family h
	font-size 38px
	font-variation-settings 'wght' 600, 'BEVL' 90
	justify-content center
	margin 0.75rem 1rem
	position relative
	user-select none
</style>

<script lang="coffee">
> -/dom/_.js > TLD

tld = TLD
</script>
