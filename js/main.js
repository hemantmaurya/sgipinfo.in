(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();

    // Compose contact and grievance messages in WhatsApp.
    $('form[data-whatsapp-form]').on('submit', function (event) {
        event.preventDefault();
        var form = this;
        var formType = form.getAttribute('data-whatsapp-form');
        var name = form.querySelector('[name="name"]').value.trim();
        var email = form.querySelector('[name="email"]').value.trim();
        var subject = form.querySelector('[name="subject"]').value.trim();
        var message = form.querySelector('[name="message"]').value.trim();
        var whatsappMessage = [
            formType,
            '',
            'Name: ' + name,
            'Email: ' + email,
            'Subject: ' + subject,
            'Message: ' + message
        ].join('\n');
        window.open('https://wa.me/918005274144?text=' + encodeURIComponent(whatsappMessage), '_blank', 'noopener');
    });

    // Show both topper celebrations once the homepage and its images are loaded.
    var topperCelebration = document.getElementById('topperCelebration');
    var topperCelebrationImage = document.getElementById('topperCelebrationImage');
    if (topperCelebration) {
        var showTopperCelebration = function () {
            topperCelebration.classList.add('is-visible');
            window.setTimeout(function () {
                if (topperCelebrationImage) {
                    topperCelebrationImage.src = 'img/toppers2.jpeg';
                    topperCelebrationImage.alt = 'Celebrating student achievers';
                }
            }, 3000);
            window.setTimeout(function () {
                topperCelebration.classList.remove('is-visible');
            }, 8000);
        };

        if (document.readyState === 'complete') {
            showTopperCelebration();
        } else {
            window.addEventListener('load', showTopperCelebration, { once: true });
        }
    }
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').css('top', '0px');
        } else {
            $('.sticky-top').css('top', '-100px');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Header carousel
    $(".header-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ]
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    
})(jQuery);

