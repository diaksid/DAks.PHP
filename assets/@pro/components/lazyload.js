import jQuery from 'jquery'
import '../helpers/dataset'

const PROlazyLoad = (function (window, document, jQuery) {
  const NAME = 'lazyload'
  const VERSION = '0.0.3'
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME]

  const DATA_KEY = 'lazyload'
  const EVENT_KEY = `${DATA_KEY}.`

  const Events = {
    'UPDATE': `${EVENT_KEY}update`,
    'RESET': `${EVENT_KEY}reset`,
    'APPEAR': `${EVENT_KEY}appear`
  }

  const Default = {
    attribute: 'lazy',
    scope: null,
    event: 'scroll',
    duration: 1000,
    delay: 250,
    threshold: 0,
    before: null,
    after: null,
    reset: '',
    mask: "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Cpath fill='%23aaa' d='m204 203q0 13-9 22t-22 9-22-9-9-22 9-22 22-9 22 9 9 22zm170 64v74h-234v-32l53-53 26 26 85-85zm16-117h-266q-2 0-4 1-1 1-1 4v202q0 2 1 4 1 1 4 1h266q2 0 4-1 1-1 1-4v-202q0-2-1-4-1-1-4-1zm26 5v202q0 11-8 19t-19 8h-266q-11 0-19-8t-8-19v-202q0-11 8-19t19-8h266q11 0 19 8t8 19z'/%3E%3C/svg%3E"
    // mask: "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ccc' fill-opacity='.2' height='100%' width='100%'/%3E%3C/svg%3E"
  }

  const $window = jQuery(window)
  const $document = jQuery(document)

  class PROlazyLoad {
    constructor (selector, options) {
      if (jQuery.isPlainObject(selector)) {
        options = selector
        selector = null
      }
      this._options = jQuery.extend({}, Default, options)
      this._select = jQuery(selector || `[data-${jQuery.data.toKey(this._options.attribute)}]`)
      if (this._select.length) {
        this._scope = this._options.scope && jQuery(this._options.scope)
        if (this._scope) {
          this._scope.on(this._options.event, this._update.bind(this))
        }
        $window.on('scroll', this._update.bind(this))
        $window.on('resize', this._update.bind(this))
        $document.on(Events.UPDATE, this._update.bind(this))
        $document.on(Events.RESET, this._reset.bind(this))
        if (this._options.reset) {
          $document.on(this._options.reset, this._reset.bind(this))
        }
        this._items = []
        this._select.each((i, el) => this._load(el))
      }
    }

    _load (element) {
      if (!jQuery.data.getSet(element, DATA_KEY)) {
        const item = new Lazy(element, this._options)
        item._appear()
        this._items.push(item)
      }
      return this
    }

    _update () {
      let counter = 0
      this._items.forEach(item => item._appear() || counter++)
      if (!counter) {
        if (this._scope) {
          this._scope.off(this._options.event, this._update)
        }
        $window.off('scroll', this._update)
        $window.off('resize', this._update)
        $document.off(Events.UPDATE, this._update.bind(this))
      }
      return this
    }

    _reset () {
      this._items.forEach(item => item._reset())
      this._items = []
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

    static update () {
      return $document.trigger(jQuery.Event(Events.UPDATE))
    }

    static reset () {
      return $document.trigger(jQuery.Event(Events.RESET))
    }

    static _jQuery () {
      (() => new PROlazyLoad(this, ...arguments))()
      return this
    }
  }

  class Lazy {
    constructor (element, options) {
      this._element = element
      this._obj = jQuery(this._element)
      // this._scope = scope
      this._options = options
      this._delay = this._element.dataset[`${this._options.attribute}Delay`] || this._options.delay
      this._duration = this._element.dataset[`${this._options.attribute}Duration`] || this._options.duration
      this._obj.on(Events.APPEAR, this._appear.bind(this))
    }

    _appear () {
      // let res = ['loading', 'loaded', 'error', 'reset'].indexOf(this._dataKey) >= 0
      let res = !!this._dataKey
      if (!res) {
        res = !this._above() && !this._below() && !this._right() && !this._left()
        if (res) {
          if (typeof this._options.before === 'function') {
            this._options.before.call(this._element)
          }
          this._loader()
          this._obj.off(Events.APPEAR, this._appear)
        }
      }
      return res
    }

    _loader () {
      const path = jQuery.data.getSet(this._element, this._options.attribute)
      this._dataKey = 'loading'
      if (this._options.mask) {
        if (this._element.tagName === 'IMG') {
          this._element.src = this._options.mask
        } else {
          this._element.style.backgroundImage = `url("${this._options.mask}")`
        }
      }
      const img = new Image()
      img.onload = () => {
        if (this._element.tagName === 'IMG') {
          this._element.src = path
        } else {
          this._element.style.backgroundImage = `url(${path})`
        }
        setTimeout(this._animate.bind(this), this._delay)
      }
      img.onerror = () => {
        this._dataKey = 'error'
      }
      img.src = path
      return this
    }

    _above () {
      /* inside scope, regardless of window
      const val = this._scope
        ? this._scope.offset().top
        : window.pageYOffset
      return val >= this._obj.outerHeight() + this._obj.offset().top + this._options.threshold
      */
      return window.pageYOffset >= this._obj.outerHeight() + this._obj.offset().top + this._options.threshold
    }

    _below () {
      /* inside scope, regardless of window
      const val = this._scope
        ? this._scope.innerHeight() + this._scope.offset().top
        : window.innerHeight + window.pageYOffset
      return val <= this._obj.offset().top - this._options.threshold
      */
      return window.innerHeight + window.pageYOffset <= this._obj.offset().top - this._options.threshold
    }

    _right () {
      /* inside scope, regardless of window
      const val = this._scope
        ? this._scope.innerWidth() + this._scope.offset().left
        : window.innerWidth + window.pageXOffset
      return val <= this._obj.offset().left - this._options.threshold
      */
      return window.innerWidth + window.pageXOffset <= this._obj.offset().left - this._options.threshold
    }

    _left () {
      /* inside scope, regardless of window
      const val = this._scope
        ? this._scope.offset().left
        : window.pageXOffset
      return val >= this._obj.outerWidth() + this._obj.offset().left + this._options.threshold
      */
      return window.pageXOffset >= this._obj.outerWidth() + this._obj.offset().left + this._options.threshold
    }

    _animate () {
      this._dataKey = 'loaded'
      this._obj
        .hide()
        .fadeIn(
          this._duration,
          () => typeof this._options.after === 'function' && this._options.after.call(this._element)
        )
      return this
    }

    _reset () {
      if (this._element.tagName === 'IMG') {
        this._element.src = this._options.mask
      } else {
        this._element.style.backgroundImage = `url("${this._options.mask}")`
      }
      this._dataKey = 'reset'
      // delete this
    }

    get _dataKey () {
      return jQuery.data.getSet(this._element, DATA_KEY)
    }

    set _dataKey (value) {
      return jQuery.data.setSet(this._element, DATA_KEY, value)
    }
  }

  // jQuery.LazyLoad = PROlazyLoad

  jQuery.fn[NAME] = PROlazyLoad._jQuery
  jQuery.fn[NAME].Constructor = PROlazyLoad
  jQuery.fn[NAME].noConflict = function () {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT
    return PROlazyLoad._jQuery
  }
  jQuery[NAME] = function () {
    (() => new PROlazyLoad(...arguments))()
    return this
  }

  return PROlazyLoad
})(window, document, jQuery)

export default PROlazyLoad
