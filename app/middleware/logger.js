export default store => next => action => {
  try {
    throw new Error('callstack')
  } catch (ex) {
    console.log(action, ex.stack.substr(ex.stack.indexOf('\n', 20)))
  }
  return next(action)
}
