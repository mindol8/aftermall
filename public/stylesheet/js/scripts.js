/*!
    * Start Bootstrap - Agency v6.0.2 (https://startbootstrap.com/template-overviews/agency)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
    */
    (function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {
      
        //swiper side running
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 3,
            spaceBetween: 30,
            loop: true,
            //centeredSlides: true,
            autoplay: {
                delay: 1500,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

        $("#shop_now").off("click").on("click", function () {
            var theme = $("#theme").val();
            var thing = $("#thing").val();
            if (!theme) {
                Swal.fire({
                            icon: 'error',
                            title: 'Search Fail',
                            text: 'Please choose theme',

                        })
            } else if (!thing) {
                Swal.fire({
                            icon: 'error',
                            title: 'Search Fail',
                            text: 'Please insert subject',

                        })
            } else {
                $.ajax({
                    url: '/search',
                    type: 'post',
                    data: $('#search_form').serialize(),
                    success:function(data){
                        location.href="/shop";
                        //shop으로 보낼때, 받아온 정보도 보내야한다.아니면 해당 쿼리 내용을 세션에 저장해놓고 shop호출할때 세션 읽어야한다.
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Search Fail',
                            text: 'Wrong input',

                        })
                    }
                })
            }

        })

         // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
        if (
            location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
            location.hostname == this.hostname
        ) {
            var target = $(this.hash);
            target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
            if (target.length) {
                $("html, body").animate(
                    {
                        scrollTop: target.offset().top - 72,
                    },
                    1000,
                    "easeInOutExpo"
                );
                return false;
            }
        }
    });

    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 74,
    });
    
 
    // Collapse Navbar
    var navbarCollapse = function () {
        var windowwidth = $(window).width();
        if ($("#mainNav").offset().top > 100) {
            $("#mainNav").addClass("navbar-shrink");      
           
           
        } else {
            $("#mainNav").removeClass("navbar-shrink");        
                
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

    })

})(jQuery); // End of use strict
