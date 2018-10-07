import jQuery from 'jquery'
import './dataset'
import '../extends/deactive'

const NAME = 'w3c'
const DATA_KEY = jQuery.data.toKey(NAME)
const DATA_SET = jQuery.data.toSet(NAME)

const PROmailto = function (selector = `[data-${DATA_KEY}]`) {
  return jQuery(selector)
    .filter(function () {
      return this.dataset && this.dataset.hasOwnProperty(NAME)
    })
    .deactive()
    .each(function () {
      const mail = this.dataset && atob(this.dataset[DATA_SET])
      if (mail) {
        this.href = `mailto://${mail}`
        if (!this.dataset.hasOwnProperty(`${DATA_SET}Safe`)) {
          this.innerHTML += mail
        }
      } else {
        this.style.visibility = 'hidden'
      }
    })
}

jQuery.fn[NAME] = function () {
  return PROmailto(this, ...arguments)
}

jQuery[NAME] = function () {
  PROmailto(...arguments)
  return this
}

export default PROmailto
