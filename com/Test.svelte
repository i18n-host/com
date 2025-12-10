<template lang="pug">
button(@click=click) TEST
</template>

<style lang="stylus">
</style>

<script lang="coffee">
> -/srv.js > authTest

click = =>
  await authTest(
    ...(
      await import('-/dom/FINGER.js')
    ).default
  )
  return
</script>
