
(function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {

        //send sign in data to server      
        $("#userPw").keypress(function(e) { 

            if (e.keyCode == 13){
                var userid = $("#userId").val();
            var userpw = $("#userPw").val();
            //alert(userid+"  "+userpw);
            if (userid != null && userpw != null) {
                $.ajax({
                    url: '/signin/confirm',
                    type: 'post',
                    data: $('form').serialize(),
                    success: function (data) {
                        if (data === "signin fail:wrong Id#") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Wrong ID',
                                text: 'Sign in Fail!',

                            })

                        } else if (data === "signin fail:wrong password$") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Wrong Password',
                                text: 'Sign in Fail!',

                            })

                        } else if(data === "signin fail:check Email first@"){
                            Swal.fire({
                                icon: 'error',
                                title: 'Not checking Email',
                                text: 'Sign in Fail!',

                            })
                        }else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sign in',
                                text: 'Welcome ' + data + "!!!",
                            }).then(() => {
                                location.href = "/";
                            })

                        }

                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'Sign in Fail!',

                        })
                    }
                })
            }
        
            }    
        });
                
        
        $("#confirm").off("click").on("click", function () {
            var userid = $("#userId").val();
            var userpw = $("#userPw").val();
            //alert(userid+"  "+userpw);
            if (userid != null && userpw != null) {
                $.ajax({
                    url: '/signin/confirm',
                    type: 'post',
                    data: $('form').serialize(),
                    success: function (data) {
                        if (data === "signin fail:wrong Id#") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Wrong ID',
                                text: 'Sign in Fail!',

                            })

                        } else if (data === "signin fail:wrong password$") {
                            Swal.fire({
                                icon: 'error',
                                title: 'Wrong Password',
                                text: 'Sign in Fail!',

                            })

                        } else if(data === "signin fail:check Email first@"){
                            Swal.fire({
                                icon: 'error',
                                title: 'Not checking Email',
                                text: 'Sign in Fail!',

                            })
                        }else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Sign in',
                                text: 'Welcome ' + data + "!!!",
                            }).then(() => {
                                location.href = "/";
                            })

                        }

                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'Sign in Fail!',

                        })
                    }
                })
            }
        }
        );


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

        $(window).resize(function () {
            if ($(window).width() < 976) {
                $("#resizemenu").html(
                    '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signin" id="account_ctrl">Signin</a></li>' +
                    '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>' +
                    '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="management">Management</a></li>'
                );
                $("#signup_box").css("margin-left","5%");
                $("#signup_box").css("margin-right","5%");
                $("#signup_box").css("width","90%");

                $(".brand_logo").css("margin-left","20%");
                $(".brand_logo").css("margin-right","20%");
                $(".brand_logo").css("width","60%");
            } else {
                $("#resizemenu").html(
                    '<div class="dropdown"><a class="nav-link js-scroll-trigger dropdown-toggle" href="#"' +
                    'data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Account</a>' +
                    '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                    '<a class="dropdown-item" href="/signin" id="account_ctrl">Signin</a>' +
                    '<a class="dropdown-item" href="/cart">Cart</a>' +
                    '<a class="dropdown-item" href="/management">Management</a></div></div>'

                );
                $("#signup_box").css("margin-left","30%");
                $("#signup_box").css("margin-right","30%");
                $("#signup_box").css("width","40%");

                $(".brand_logo").css("margin-left","40%");
                $(".brand_logo").css("margin-right","40%");
                $(".brand_logo").css("width","20%");
            }
        });

        if ($(window).width() < 976) {
            $("#resizemenu").html(
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signin" id="account_ctrl">Signin</a></li>' +
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>' +
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/management">Management</a></li>'
            );
            $("#signup_box").css("margin-left","5%");
            $("#signup_box").css("margin-right","5%");
            $("#signup_box").css("width","90%");

            $(".brand_logo").css("margin-left","20%");
            $(".brand_logo").css("margin-right","20%");
            $(".brand_logo").css("width","60%");
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


})(jQuery); // End of use strict