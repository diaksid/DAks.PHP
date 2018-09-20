import jQuery from 'jquery'
import Util from './util'

const ScrollTo = ((jQuery, Util) => {
  const NAME = 'scrollTo'
  const VERSION = '0.0.1'

  const DATA_KEY = 'scroll.to'
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME]

  const Default = {
    offset: 0,
    duration: 1000
  }

  class ScrollTo {
    constructor (options, callback) {
      [this._options, this._callback] = arguments
    }

    _load (element) {
      const selector = Util.getDataSet(element, DATA_KEY) || element.getAttribute('href')
      if (selector) {
        const options = jQuery.extend({},
          this._options,
          Util.getDataSet(element, DATA_KEY, ...Object.keys(Default))
        )
        const obj = jQuery(element).click(event => {
          event.preventDefault()
          event.stopPropagation()
          if (!obj.hasClass('active') && !obj.parent().hasClass('active')) {
            selector === '#'
              ? ScrollTo.top(options, this._callback)
              : ScrollTo.obj(selector, options, this._callback)
          }
        })
      } else {
        delete element.dataset[DATA_KEY]
      }
    }

    static top () {
      const [options, callback] = this._config(...arguments)
      this._scrolled.animate({
        scrollTop: parseInt(options.offset)
      }, parseInt(options.duration), callback)
      return this
    }

    static obj (selector, ...args) {
      const [options, callback] = this._config(...args)
      const obj = selector instanceof jQuery ? selector : jQuery(selector)
      this._scrolled.animate({
        scrollTop: obj.offset().top - parseInt(options.offset)
      }, parseInt(options.duration), callback)
      return this
    }

    static _config (options, callback) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      } else if (typeof options === 'number') {
        options = { offset: options }
      }
      return [
        jQuery.extend({}, Default, options),
        typeof callback === 'function' ? callback : null
      ]
    }

    static get _scrolled () {
      return jQuery('html:not(:animated), body:not(:animated)')
    }

    static get version () {
      return VERSION
    }

    static get default () {
      return Default
    }

    static _jQuery () {
      const instance = new ScrollTo(...arguments)
      return this.each(function () {
        instance._load(this)
      })
    }
  }

  jQuery.fn[NAME] = ScrollTo._jQuery
  jQuery.fn[NAME].Constructor = ScrollTo
  jQuery.fn[NAME].noConflict = function () {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT
    return ScrollTo._jQuery
  }
  jQuery[NAME] = (...args) => jQuery(`[data-${Util.toDataKey(DATA_KEY)}]`)[NAME](...args)

  return ScrollTo
})(jQuery, Util)

export default ScrollTo
