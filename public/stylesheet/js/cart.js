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


    // Closes responsive menu when a scroll trigger link is clicked
    $(".js-scroll-trigger").click(function () {
        $(".navbar-collapse").collapse("hide");
    });

    // Activate scrollspy to add active class to navbar items on scroll
    $("body").scrollspy({
        target: "#mainNav",
        offset: 74,
    });
    
    $(window).resize(function() { 
        if($(window).width() <976) {
            $("#resizemenu").html(
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signout" id="account_ctrl">Signout</a></li>'+
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>'+
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/mangement">Management</a></li>'
            );
         }else{
            $("#resizemenu").html(
                '<div class="dropdown"><a class="nav-link js-scroll-trigger dropdown-toggle" href="#"'+
                'data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Account</a>'+
                '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
                '<a class="dropdown-item" href="/signout" id="account_ctrl">Signout</a>'+
                '<a class="dropdown-item" href="/cart">Cart</a>'+
                '<a class="dropdown-item" href="/management">Management</a></div></div>'

            );
         }  
     });

     if($(window).width() <976) {
        $("#resizemenu").html(
            '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signout" id="account_ctrl">Signout</a></li>'+
            '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>'+
            '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/management">Management</a></li>'
        );
     }
 
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

    $("#cart").off("click").on("click",()=>{
        $("#receipt").css("background-color","rgb(197, 208, 219)");
        $("#cart").css("background-color","white");
        $("#receipt_view").css("display","none");
        $("#table_view").css("display","block");
    })

    $("#receipt").off("click").on("click",()=>{
        $("#cart").css("background-color","rgb(197, 208, 219)");
        $("#receipt").css("background-color","white");
        $("#table_view").css("display","none");
        $("#receipt_view").css("display","block");
    })
})(jQuery); // End of use strict
