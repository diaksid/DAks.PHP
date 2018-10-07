(function (PRO) {
  const PROinnerHeight = PRO.innerHeight

  const PROaligns = function (selector, context) {
    let val = 0
    return PRO(selector, context)
      .each(function () {
        this.style.height = ''
        const height = PROinnerHeight(this)
        if (height > val) {
          val = height
        }
      })
      .each(function () {
        this.style.height = `${val}px`
      })
  }

  PRO.aligns = function () {
    PROaligns(...arguments)
    return this
  }

  PRO.prototype.aligns = function (selector) {
    if (selector) {
      this.each(function () {
        PROaligns(selector, this)
      })
    } else {
      PROaligns(this)
    }
    return this
  }
})(PRO)
