import jQuery from 'jquery'
import Util from './util'

const Lightbox = ((jQuery, Util, document) => {
  const NAME = 'lightbox'
  const VERSION = '0.0.1'

  const DATA_KEY = 'lightbox'
  const EVENT_KEY = `${DATA_KEY}.`
  const JQUERY_NO_CONFLICT = jQuery.fn[NAME]

  const Events = {
    'OPEN': `${EVENT_KEY}open`,
    'CLOSE': `${EVENT_KEY}close`
  }

  const Default = {
    attribute: 'light',
    padding: 0,
    delayShow: 250,
    delayHide: 250,
    delayStep: 250,
    onerror: "data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512' fill='%23c33' enable-background='new 0 0 512 512'%3E%3Cpath d='m256 96q44 0 80 21 37 21 58 58 21 37 21 80t-21 80q-21 37-58 58-37 21-80 21t-80-21q-37-21-58-58-21-37-21-80t21-80q21-37 58-58 37-21 80-21zm27 261v-40q0-3-2-5-2-2-5-2h-40q-3 0-5 2-2 2-2 5v40q0 3 2 5 2 2 5 2h40q3 0 5-2 2-2 2-5zm-0.4-72 4-130q0-3-2-4-2-2-5-2h-46q-3 0-5 2-2 1-2 4l4 130q0 2 2 4 2 2 5 2h39q3 0 5-2 2-2 2-4z'/%3E%3C/svg%3E"
  }

  class Lightbox {
    constructor (options) {
      this._options = jQuery.extend({}, Default, options)
      this._stack = {}
      // this._group = this._path = null
      Lightbox._init(this)
    }

    get _index () {
      return this._group && this._stack[this._group].indexOf(this._path)
    }

    _load (element) {
      if (!Util.getDataSet(element, DATA_KEY)) {
        const path = element.getAttribute('href') || element.dataset.href || element.getAttribute('src')
        if (path) {
          const group = (path[0] === '#') ? 'html' : Util.getDataSet(element, this._options.attribute)
          if (group && group !== 'html') {
            if (!this._stack[group]) {
              this._stack[group] = []
            }
            if (this._stack[group].indexOf(path) === -1) {
              this._stack[group].push(path)
            }
          }
          jQuery(element).click(event => {
            event.preventDefault()
            event.stopPropagation()
            this._path = path
            this._group = group
            if (this._group === 'html') {
              this._html()
            } else {
              this._draw()
            }
          })
          element.style.cursor = 'pointer'
        }
        Util.setDataSet(element, DATA_KEY, 'loaded')
      }
    }

    _html () {
      Lightbox._image.hide()
      Lightbox._next.hide()
      Lightbox._prev.hide()
      const element = jQuery(this._path)[0]
      if (element) {
        Lightbox._content.addClass(`${Lightbox._dataKey}-content--html`)
        Lightbox._modal
          .html(element.innerHTML)
          .show()
        this._show()
      }
    }

    _draw (step) {
      Lightbox._modal.hide()
      Lightbox._content.removeClass(`${Lightbox._dataKey}-content--html`)
      if (this._group && this._stack[this._group].length > 1) {
        Lightbox._next.show()
        Lightbox._prev.show()
      } else {
        Lightbox._next.hide()
        Lightbox._prev.hide()
      }
      const element = Lightbox._image[0]
      element.src = this._path
      if (element.complete) {
        this._show(step)
      } else {
        Lightbox._loading()
        element.onerror = () => {
          element.src = this._options.onerror
          if (this._group) {
            this._stack[this._group][this._index] = this._options.onerror
          }
        }
        element.onload = () => this._show(step)
      }
      Lightbox._image.show()
    }

    _show (step) {
      Lightbox._show(this._options.delayShow, step)
    }

    _hide (callback) {
      if (callback) {
        Lightbox._hide(this._options.delayStep, callback)
      } else {
        Lightbox._hide(this._options.delayHide)
      }
    }

    _step (next) {
      let index = this._index
      if (next) {
        if (index < this._stack[this._group].length - 1) {
          ++index
        } else {
          index = 0
        }
      } else {
        if (index > 0) {
          --index
        } else {
          index = this._stack[this._group].length - 1
        }
      }
      this._path = this._stack[this._group][index]
      this._hide(() => this._draw(true))
    }

    static on (event, handler) {
      document.addEventListener(Events[event.toUpperCase()], handler)
      return this
    }

    static _init (instance) {
      if (!this._overlay) {
        this._events = {}
        for (let event in Events) {
          this._events[event] = Util.newEvent(Events[event])
        }
        this._overlay = jQuery('<div>')
          .addClass(`${this._dataKey}-overlay`)
          .hide()
        this._content = jQuery('<div>')
          .addClass(`${this._dataKey}-content`)
          .click(event => event.stopPropagation())
        this._modal = jQuery('<div>')
          .addClass(`${this._dataKey}-modal`)
          .hide()
        this._image = jQuery('<img>')
          .addClass(`${this._dataKey}-image`)
          .hide()
        this._next = jQuery('<div>')
          .addClass(`${this._dataKey}-next`)
          .hide()
        this._prev = jQuery('<div>')
          .addClass(`${this._dataKey}-prev`)
          .hide()
        this._close = jQuery('<div>').addClass(`${this._dataKey}-close`)
        this._content
          .append(this._modal)
          .append(this._image)
          .append(this._next)
          .append(this._prev)
          .append(this._close)
        this._overlay.append(this._content)
        this._body = jQuery(document.body).append(this._overlay)
      }
      this._content.css({ padding: instance._options.padding ? `${instance._options.padding}px` : '' })
      this._overlay
        .off('click')
        .click(() => instance._hide())
      this._next
        .off('click')
        .click(() => instance._step(true))
      this._prev
        .off('click')
        .click(() => instance._step())
      this._close
        .off('click')
        .click(() => instance._hide())
      return instance
    }

    static _show (delay, step) {
      this._loading(true)
      if (step) {
        this._content.fadeIn(delay)
      } else {
        this._body.css({
          paddingRight: `${window.innerWidth - this._body.width()}px`,
          overflow: 'hidden'
        })
        this._overlay.fadeIn(delay)
        document.dispatchEvent(this._events.OPEN)
      }
    }

    static _hide (delay, callback) {
      if (callback) {
        this._content.fadeOut(delay, callback)
      } else {
        this._overlay.fadeOut(delay, () => {
          this._body.css({
            paddingRight: '',
            overflow: ''
          })
          document.dispatchEvent(this._events.CLOSE)
        })
      }
    }

    static _loading (done) {
      if (done) {
        this._overlay.removeClass(`${this._dataKey}-overlay--load`)
      } else {
        this._overlay.addClass(`${this._dataKey}-overlay--load`)
      }
    }

    static get _dataKey () {
      return Util.toDataKey(DATA_KEY)
    }

    static get version () {
      return VERSION
    }

    static get default () {
      return Default
    }

    static _jQuery () {
      const instance = new Lightbox(...arguments)
      return this.each(function () {
        instance._load(this)
      })
    }
  }

  jQuery.fn[NAME] = Lightbox._jQuery
  jQuery.fn[NAME].Constructor = Lightbox
  jQuery.fn[NAME].noConflict = function () {
    jQuery.fn[NAME] = JQUERY_NO_CONFLICT
    return Lightbox._jQuery
  }
  jQuery[NAME] = (...args) => jQuery(`[data-${Util.toDataKey(Default.attribute)}]`)[NAME](...args)

  return Lightbox
})(jQuery, Util, document)

export default Lightbox
