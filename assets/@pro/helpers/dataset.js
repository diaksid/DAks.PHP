import jQuery from 'jquery'

const PROdata = {
  toKey (string, suffix) {
    if (suffix) {
      string += '.' + suffix
    }
    return string.toLowerCase().replace(/[._\s]+(.)?/g, (match, chr) => chr ? '-' + chr : '')
  },

  toSet (string, suffix) {
    if (suffix) {
      string += '.' + suffix
    }
    return string.toLowerCase().replace(/[._\-\s]+(.)?/g, (match, chr) => chr ? chr.toUpperCase() : '')
  },

  getSet (element, key, ...args) {
    if (args.length) {
      const data = {}
      args.forEach((arg) => {
        const value = element.dataset[this.toSet(key, arg)]
        if (typeof value !== 'undefined' && value !== null) {
          data[arg] = value
        }
      })
      return data
    } else {
      return element.dataset[this.toSet(key)]
    }
  },

  setSet (element, key, value) {
    return (element.dataset[this.toSet(key)] = value)
  }
}

jQuery.extend(jQuery.data, PROdata)

export default PROdata
