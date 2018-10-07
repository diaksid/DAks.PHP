import jQuery from 'jquery'
import '../helpers/dataset'
import '../extends/deactive'

const NAME = 'yandexMetrika'
const DATA_KEY = jQuery.data.toKey(NAME)
const DATA_SET = jQuery.data.toSet(NAME)

const PROyandexMetrika = function (selector = `[data-${DATA_KEY}]`) {
  return jQuery(selector)
    .filter(function () {
      return this.dataset && this.dataset[DATA_SET]
    })
    .deactive()
    .click(event => window.open(
      `//metrika.yandex.ru/dashboard?id=${event.target.dataset[DATA_SET]}`,
      '_blank'
    ))
}

jQuery.fn[NAME] = function () {
  return PROyandexMetrika(this, ...arguments)
}

jQuery[NAME] = function () {
  PROyandexMetrika(...arguments)
  return this
}

export default PROyandexMetrika
