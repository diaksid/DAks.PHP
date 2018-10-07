import jQuery from 'jquery'

const PROdeactive = function (selector = '[data-base64]') {
  return jQuery(selector).click(event => {
    event.preventDefault()
    event.stopPropagation()
    return false
  })
}

jQuery.fn.deactive = function () {
  return PROdeactive(this, ...arguments)
}

jQuery.deactive = function () {
  PROdeactive(...arguments)
  return this
}

export default PROdeactive
