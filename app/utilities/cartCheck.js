import objectSearch from './objectSearch'

const cartCheck = (cart, item) => {
    for(var i = 0; i < cart.length; i++) {
      console.log(objectSearch(cart[i], 'doi')+":"+objectSearch(item, 'doi')+":"+((objectSearch(cart[i], 'doi') === objectSearch(item, 'doi'))))
      if (objectSearch(cart[i], 'doi') === objectSearch(item, 'doi')) {
        return true
      }
    }
    return false
}

export default cartCheck
