import $ from 'jquery'

const emailMask = /[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?/i

class Mailer {
  constructor (selector) {
    this._form = document.querySelector(selector)
    this._action = this._form.getAttribute('action')
    this._email = this._form.email
    this._email.addEventListener('change', this._validate.bind(this))
    this._message = this._form.message
    this._message.addEventListener('change', this._validate.bind(this))
    this._submit = this._form.submit
    this._reset = this._form.reset
    this._check = this._form.check
    this._check.addEventListener('change', this._validate.bind(this))
    this._checked()
  }

  init (test = false) {
    this._form.addEventListener('submit', (event) => {
      if (this._validate(true)) {
        if (test) {
          alert(this._email.value)
        } else {
          $.ajax(this._action, {
            email: this._email.value,
            message: this._message.value
          })
        }
      }
      event.preventDefault()
      return false
    })
    return this
  }

  _checked () {
    this._email.disabled = this._message.disabled = !this._check.checked
    return this._check.checked
  }

  _validate (submit = false) {
    let check = emailMask.test(this._email.value)
    let valid = check
    this._email.className = this._email.className.replace(/\s+is-(in)?valid/, '')
    if (this._email.value !== '' || submit) {
      valid = emailMask.test(this._email.value)
      this._email.className += ` is-${check ? '' : 'in'}valid`
    }
    check = this._message.value.length >= 3 && this._message.value.length <= 256
    valid = valid && check
    this._message.className = this._message.className.replace(/\s+is-(in)?valid/, '')
    if (this._message.value !== '' || submit) {
      this._message.className += ` is-${check ? '' : 'in'}valid`
    }
    valid = this._checked() && valid
    this._check.className = this._check.className.replace(/\s+is-(in)?valid/, '')
    this._check.className += ` is-${this._check.checked ? '' : 'in'}valid`
    // this._submit.disabled = !valid
    return valid
  }
}

export default Mailer
