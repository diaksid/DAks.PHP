import jQuery from 'jquery'
import './dataset'
import '../extends/deactive'

const NAME = 'w3c'
const DATA_KEY = jQuery.data.toKey(NAME)

const PROw3c = function (selector = `[data-${DATA_KEY}]`) {
  return jQuery(selector)
    .deactive()
    .click(() => window.open(
      `//validator.w3.org/nu/?doc=${encodeURIComponent(location.href)}&showsource=yes&showoutline=yes`,
      '_blank'
    ))
}

jQuery.fn[NAME] = function () {
  return PROw3c(this, ...arguments)
}

jQuery[NAME] = function () {
  PROw3c(...arguments)
  return this
}

export default PROw3c
