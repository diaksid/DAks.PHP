import jQuery from 'jquery'
import './dataset'

const NAME = 'w3c'
const DATA_KEY = jQuery.data.toKey(NAME)
const DATA_SET = jQuery.data.toSet(NAME)

const PRObase64 = function (selector = `[data-${DATA_KEY}]`) {
  return jQuery(selector)
    .filter(function () {
      return this.dataset && this.dataset[DATA_SET]
    })
    .each(function () {
      this.innerHTML += atob(this.dataset[DATA_SET])
    })
}

jQuery.fn[NAME] = function () {
  return PRObase64(this, ...arguments)
}

jQuery[NAME] = function () {
  PRObase64(...arguments)
  return this
}

export default PRObase64
