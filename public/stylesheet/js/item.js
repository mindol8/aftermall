/*!
    * Start Bootstrap - Agency v6.0.2 (https://startbootstrap.com/template-overviews/agency)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
    */
   (function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {

     
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
   
    //add cart
    $("#buy").off("click").on("click",()=>{
        var item_name = $("#item_name").val()
        
        $.ajax({
            url:"/item/cart",
            type:"post",
            data:$("#add_cart").serialize(),
            success:(data)=>{
                if(data === "GO SIGNIN"){
                    Swal.fire({
                        icon: 'error',
                        title: 'Sign in',
                        text: 'Sign in first!!'
                    })
                }else{
                    Swal.fire({
                        icon: 'success',
                        title: 'Add',
                        text: data+' is in the cart!!'
                    })
                }
               
            },
            error:()=>{
                Swal.fire({
                    icon: 'error',
                    title: 'Add',
                    text: 'Insert cart fail'
                })
            }
        })
    })

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



    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 5,
        loop: true,
        freeMode: true,
        loopedSlides: 3, //looped slides should be the same
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
    });
    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        loop: true,
        loopedSlides: 3, //looped slides should be the same
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs,
        },
    });

})(jQuery); // End of use strict
