import jQuery from 'jquery'
import '../helpers/dataset'
import '../helpers/assets'

const PROymap = (function (window, jQuery) {
  const NAME = 'yandexMap'
  const VERSION = '0.0.1'

  const DATA_KEY = 'yandex.map'
  // const EVENT_KEY = `${DATA_KEY}.`
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME]

  const Default = {
    selector: '.c-ymap',
    zoom: 14,
    type: 'yandex#map',
    behaviors: ['default'],
    controls: ['default'],
    preset: 'islands#redDotIcon'
  }

  class PROymap {
    constructor (selector, options) {
      if (jQuery.isPlainObject(selector)) {
        options = selector
        selector = null
      }
      this._options = jQuery.extend({}, Default, options)
      this._select = jQuery(selector || `[data-${jQuery.data.toKey(this._options.attribute)}]`)
      if (this._select.length) {
        this._select.each((i, el) => this._load(el))
      }
    }

    _load (element) {
      if (!jQuery.data.getSet(element, DATA_KEY)) {
        const fn = () => ymaps.ready(() => this._ymap(element))
        if (window.ymaps) {
          fn()
        } else {
          jQuery.script(`//api-maps.yandex.ru/2.1/?lang=${this.options.locale || 'ru_RU'}`, fn)
        }
        jQuery.data.setSet(element, DATA_KEY, 'loaded')
      }
      return this
    }

    _ymap (el) {
      const fn = (name, separator = ' ') => {
        const data = el.dataset[name]
        if (data === '') {
          return []
        } else if (data && separator) {
          return data.split(separator)
        } else {
          return data || this.options[name]
        }
      }
      const fz = () => {
        let value = parseInt(el.dataset.zoom || this.options.zoom)
        switch (true) {
          case window.innerWidth >= 768:
            value += 2
            break
          case window.innerWidth >= 480:
            value += 1
        }
        return value
      }
      if (!el.querySelector('ymaps')) {
        const map = new ymaps.Map(el, {
          type: fn('type'),
          center: fn('center'),
          zoom: fz(),
          behaviors: fn('behaviors'),
          controls: fn('controls')
        })
        map.geoObjects.add(new ymaps.Placemark(fn('placemark'), {
          iconContent: null,
          balloonContent: `<h6>${fn('name', null)}</h6><div>${fn('info', null)}</div>`
        }, {
          preset: fn('preset'),
          draggable: false,
          hideIconOnBalloonOpen: false
        }))
        el.addEventListener('resize', () => {
          if (map.container) {
            map.container.fitToViewport()
          }
        })
      }
    }

    static get name () {
      return NAME
    }

    static get version () {
      return VERSION
    }

    static get default () {
      return Default
    }

    static _jQuery () {
      (() => new PROymap(this, ...arguments))()
      return this
    }
  }

  // jQuery.Ymaps = PROymap

  jQuery.fn[NAME] = PROymap._jQuery
  jQuery.fn[NAME].Constructor = PROymap
  jQuery.fn[NAME].noConflict = function () {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT
    return PROymap._jQuery
  }
  jQuery[NAME] = function () {
    (() => new PROymap(...arguments))()
    return this
  }

  return PROymap
})(window, jQuery)

export default PROymap
