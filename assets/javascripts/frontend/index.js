import $ from 'jquery'
import WOW from 'wowjs'
import * as PRO from '../pro'
import Mailer from './mailer'

(($, WOW, PRO) => {
  $.scrollSign()

  $(() => {
    const wow = new WOW({ live: false })
    wow.init()

    $.scrollTo()

    $('[data-submit]').on('click', function () {
      if (this.dataset.submit) {
        document.querySelector(this.dataset.submit).submit()
      } else {
        this.parentNode.submit()
      }
    })

    const $draver = $('.drawer')
    const $draverCheck = () => {
      $draver.find('.collapse.show').removeClass('show')
      $draver.find('[aria-expanded=true]').attr('aria-expanded', 'false')
    }
    $('.drawer__toggle').click(() => {
      $draver.toggleClass('drawer--mini')
      $draverCheck()
    })
    $draver.find('.dropdown-toggle').click(() => $draver.removeClass('drawer--mini'))

    $.lightbox()
    PRO.Lightbox
      .on('open', PRO.ScrollSign.hide)
      .on('close', PRO.ScrollSign.show)

    $('.modal')
      .on('show.bs.modal', PRO.ScrollSign.hide)
      .on('hidden.bs.modal', PRO.ScrollSign.show)

    const mailer = new Mailer('#modal-mail__form')
    mailer.init()
  })

  window.addEventListener('load', () => {
    $.lazyload()
    $(document.querySelectorAll('[data-carousel-lazy]')).lazyload('.carousel', 'slid.bs.carousel', {
      attribute: 'carousel-lazy'
    })
    $(document.body).scrollspy({
      target: '.drawer',
      offset: 200
    })
  })
})($, WOW, PRO)
