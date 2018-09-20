const Util = (() => {
  const Util = {
    toDataKey (string, suffix) {
      if (suffix) {
        string += '.' + suffix
      }
      return string.toLowerCase().replace(/[._\s]+(.)?/g, (match, chr) => chr ? '-' + chr : '')
    },

    toDataSet (string, suffix) {
      if (suffix) {
        string += '.' + suffix
      }
      return string.toLowerCase().replace(/[._\-\s]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
    },

    getDataSet (element, key, ...args) {
      if (args.length) {
        const data = {}
        args.forEach((arg) => {
          const value = element.dataset[Util.toDataSet(key, arg)]
          if (typeof value !== 'undefined' && value !== null) {
            data[arg] = value
          }
        })
        return data
      } else {
        return element.dataset[Util.toDataSet(key)]
      }
    },

    setDataSet (element, key, value) {
      return (element.dataset[Util.toDataSet(key)] = value)
    },

    newEvent (name, bubble = false, cancelable = false) {
      let event
      if (typeof Event === 'function') {
        event = new Event(name, {
          bubble: bubble,
          cancelable: cancelable
        })
      } else {
        event = document.createEvent('Event')
        event.initEvent(name, bubble, cancelable)
      }
      return event
    }
  }

  return Util
})()

export default Util
