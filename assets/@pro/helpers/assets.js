import jQuery from 'jquery'

const [PROstylesheet, PROscript] = (function (document, jQuery) {
  function pathCheck (path) {
    if (path.indexOf('//') === -1 && path[0] !== '/') {
      path = '/' + path
    }
    return path
  }

  const PROstylesheet = function (path, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = null
    }
    options = Object.assign({
      href: pathCheck(path),
      rel: 'stylesheet'
    }, options)
    const el = document.createElement('link')
    for (let key in options) {
      el.setAttribute(key, options[key])
    }
    if (typeof callback === 'function') {
      el.addEventListener('load', callback)
    }
    const fn = () => document.head.appendChild(el)
    if (window.opera === '[object Opera]') {
      jQuery(fn)
    } else {
      fn()
    }
  }

  const PROscript = function (path, options, callback) {
    if (typeof options === 'function') {
      callback = options
      options = null
    }
    options = Object.assign({
      src: pathCheck(path),
      async: true
    }, options)
    if (options.hasOwnProperty('async') && !options.async) {
      delete options.async
    }
    const el = document.createElement('script')
    for (let key in options) {
      el.setAttribute(key, options[key])
    }
    if (typeof callback === 'function') {
      el.addEventListener('load', callback)
    }
    const parent = window.Turbolinks ? 'head' : 'body'
    const fn = () => document[parent].appendChild(el)
    if (window.opera === '[object Opera]') {
      jQuery(fn)
    } else {
      fn()
    }
  }

  return [PROstylesheet, PROscript]
})(document, jQuery)

jQuery.stylesheet = function () {
  PROstylesheet(...arguments)
  return this
}

jQuery.script = function () {
  PROscript(...arguments)
  return this
}

export { PROstylesheet, PROscript }
