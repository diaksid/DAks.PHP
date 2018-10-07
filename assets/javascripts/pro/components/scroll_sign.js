import jQuery from 'jquery'
import '../helpers/dataset'

const ScrollSign = (function (jQuery) {
  const NAME = 'scrollSign'
  const VERSION = '0.0.1'

  const DATA_KEY = 'scroll.sign'
  const EVENT_KEY = `${DATA_KEY}.`
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME]

  const Events = {
    'HIDE': `${EVENT_KEY}hide`,
    'SHOW': `${EVENT_KEY}show`
  }

  const Default = {
    breakpoint: 200,
    class: 'show'
  }

  const $document = jQuery(document)

  class ScrollSign {
    constructor (options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'number') {
        options = { breakpoint: options }
      }
      this._options = jQuery.extend({}, Default, options)
      this._callback = typeof callback === 'function' ? callback : null
    }

    _load (element) {
      const options = jQuery.extend({},
        this._options,
        jQuery.data.getSet(element, DATA_KEY, ...Object.keys(Default))
      )
      const breakpoint = jQuery.data.getSet(element, DATA_KEY)
      if (breakpoint) {
        options.breakpoint = breakpoint
      }
      const fn = () => {
        if (window.pageYOffset > parseInt(options.breakpoint)) {
          element.classList.add(options.class)
        } else {
          element.classList.remove(options.class)
        }
      }
      window.addEventListener('load', fn)
      window.addEventListener('scroll', fn)
      document.addEventListener(Events.HIDE, () => {
        element.style.display = 'none'
      })
      document.addEventListener(Events.SHOW, () => {
        element.style.display = ''
      })
    }

    static show () {
      return $document.trigger(jQuery.Event(Events.SHOW))
    }

    static hide () {
      return $document.trigger(jQuery.Event(Events.HIDE))
    }

    static get version () {
      return VERSION
    }

    static get default () {
      return Default
    }

    static _jQuery () {
      const instance = new ScrollSign(...arguments)
      return this.each(function () {
        instance._load(this)
      })
    }
  }

  jQuery.fn[NAME] = ScrollSign._jQuery
  jQuery.fn[NAME].Constructor = ScrollSign
  jQuery.fn[NAME].noConflict = function () {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT
    return ScrollSign._jQuery
  }
  jQuery[NAME] = (...args) => jQuery(`[data-${jQuery.data.toKey(DATA_KEY)}]`)[NAME](...args)

  return ScrollSign
})(jQuery)

export default ScrollSign