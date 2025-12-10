WAIT = 'Wait'

export default (
  el
  run
)=>
  c = el.classList
  c.add(WAIT)
  try
    return await run
  finally
    c.remove(WAIT)
  return

