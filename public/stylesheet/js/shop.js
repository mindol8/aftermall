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

    //selected value
    $("#category").change(()=>{
        var categ = $("#category option:selected").val();           
        categ = categ.split('&');
        if(categ[0] != "accessories"){
            $("#brands").attr("disabled",false);
        }else{
            
            $("#model").attr("disabled",true);
            $("#version").attr("disabled",true);
        }
    })
    //brand select
    $("#brands").change(()=>{
        var brand = $("#brands option:selected").val();  
        $.ajax({
            url:"/",
            type:"post",
            data:{CAR_M:brand},
            success:(data)=>{
                //model select option 출력
                $("#model").attr("disabled",false);
            }
        })         
       
    })
    //model select
    $("#model").change(()=>{
        var model = $("#model option:selected").val();  
        $.ajax({
            url:"/",
            type:"post",
            data:{BASE_M:model},
            success:(data)=>{
                //version select option 출력
                $("#version").attr("disabled",false);
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

})(jQuery); // End of use strict
