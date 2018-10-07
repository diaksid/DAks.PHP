import jQuery from 'jquery'
import WOW from 'wowjs'
import Mailer from './mailer'

((jQuery, WOW) => {
  jQuery.scrollSign()

  jQuery(() => {
    const wow = new WOW({ live: false })
    wow.init()

    jQuery.scrollTo()

    jQuery('[data-submit]').on('click', function () {
      if (this.dataset.submit) {
        document.querySelector(this.dataset.submit).submit()
      } else {
        this.parentNode.submit()
      }
    })

    const $draver = jQuery('.drawer')
    const draverCheck = () => {
      $draver.find('.collapse.show').removeClass('show')
      $draver.find('[aria-expanded=true]').attr('aria-expanded', 'false')
    }
    $draver.find('.dropdown-toggle').click(() => $draver.removeClass('drawer--mini'))
    jQuery('.drawer__toggle').click(() => {
      $draver.toggleClass('drawer--mini')
      draverCheck()
    })
    jQuery('header, main, footer, section').click(() => {
      $draver.addClass('drawer--mini')
      draverCheck()
    })

    jQuery.lightbox()
    /*
    PRO.Lightbox
      .on('open', PRO.ScrollSign.hide)
      .on('close', PRO.ScrollSign.show)

    jQuery('.modal')
      .on('show.bs.modal', PRO.ScrollSign.hide)
      .on('hidden.bs.modal', PRO.ScrollSign.show)
    */
    const mailer = new Mailer('#modal-mail__form')
    mailer.init()
  })

  window.addEventListener('load', () => {
    jQuery.lazyload()
    jQuery(document.querySelectorAll('[data-carousel-lazy]')).lazyload('.carousel', 'slid.bs.carousel', {
      attribute: 'carousel-lazy'
    })
    jQuery(document.body).scrollspy({
      target: '.drawer',
      offset: 200
    })
  })
})(jQuery, WOW)
