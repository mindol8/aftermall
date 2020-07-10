(function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {
        var overlapId = false;
        var EffectivenessPw = false;
        //check pw
        //length>8 //num + upper case + lower case + Special Characters //no blank //no id //no korean
        $("#checkpassword").off("click").on("click", function () {
            var pw = $("#userPw").val();
            var id = $("#userId").val();
            var c_p = $("#checkPw").val();

            var check_attr = {
                pw: pw,
                id: id,
                c_p: c_p,
            }

            $.ajax({
                url: "/signup/effectiveness",
                type: "post",
                data: check_attr,
                success: function (data) {
                    if (data === "errortype1") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'Password must be at least 8 characters long and must contain all numbers/case letters/special characters.',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype2") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use same letter 4 times',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype3") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use id in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype4") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use blank in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype5") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You can not use korean in to password',

                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);
                        })
                    } else if (data === "errortype6") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'You have to insert same password',
                        }).then(function () {
                            EffectivenessPw = false;
                            console.log(EffectivenessPw);

                        })
                    }
                    else if (data === "errortype0") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Effectiveness Check',
                            text: "You can use this password!!",
                        }).then(function () {
                            EffectivenessPw = true;
                            console.log(EffectivenessPw);

                        })

                    }
                },
                error: function () {

                }
            })


        })
        //check overlap user ID
        $("#checkId").off("click").on("click", function () {
            var userid = $("#userId").val();
           if (userid != "") {
                $.ajax({
                    url: '/signup/overlap',
                    type: 'post',
                    data: $("#userId").serialize(),
                    success: function (data) {
                        console.log(data);
                        if (data == "ok") {
                            Swal.fire({
                                icon: 'success',
                                title: 'Overlap Check',
                                text: "You can use this Id!!",
                            }).then(function () {
                                overlapId = true;
                                console.log(overlapId);
                            })
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Fail',
                                text: 'You can not use this Id!!',
                            }).then(function () {
                                overlapId = false;
                                console.log(overlapId);
                            })
                        }
                    }

                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'Please insert your Id',
                })
            }

        })

        //send sign up data to server
        $("#confirm").off("click").on("click", function () {
            var id = $("#userId").val();
            var pw = $("#userPw").val();
            var name = $("#userName").val();
            console.log(name);
            var email = $("#userEmail").val();
            var phone = $("#userPhone").val();
            var zipcode =$("#userZipcode").val();
            var address = $("#userAddress").val();
            //check id is not null
            if (!id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your Id'
                })
            }
            //check id overlap
            else if (overlapId == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check Id'
                })
            }
            //check password is not null
            else if (!pw) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your Password'
                })
            }
            else if (EffectivenessPw == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to check Password Effectiveness'
                })
            }
            //check name is not null                   
            else if (!name) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your name'
                })
            }
            //check email is not null
            else if (!email) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your email'
                })
            }
            //check phone number is not null
            else if (!phone) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your phone number'
                })
            }
            //check phone number is not a number
            else if (isNaN(phone)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Fail',
                    text: 'You have to insert your phone number only number'
                })
            }
            //finish all test
            else {
                $.ajax({
                    url: '/signup/confirm',
                    type: 'post',
                    data: $('form').serialize(),
                    success: function (data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Sign up',
                            text: 'Thanks for join us ' + data + "!!!",
                        }).then(() => {
                            location.href = "/signin";
                        })
                    },
                    error: function () {
                        Swal.fire({
                            icon: 'error',
                            title: 'Fail',
                            text: 'Sign up Fail!',

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
    
    $(window).resize(function() { 
        if($(window).width() <976) {
            $("#resizemenu").html(
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signin" id="account_ctrl">Signin</a></li>'+
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>'
                
            );
         }else{
            $("#resizemenu").html(
                '<div class="dropdown"><a class="nav-link js-scroll-trigger dropdown-toggle" href="#"'+
                'data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Account</a>'+
                '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
                '<a class="dropdown-item" href="/signin" id="account_ctrl">Signin</a>'+
                '<a class="dropdown-item" href="/cart">Cart</a>'
                
            );
         }  
     });

     if($(window).width() <976) {
        $("#resizemenu").html(
            '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signin" id="account_ctrl">Signin</a></li>'+
            '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>'           
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
   
})(jQuery); // End of use strict
