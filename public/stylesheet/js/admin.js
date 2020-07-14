/*!
    * Start Bootstrap - Agency v6.0.2 (https://startbootstrap.com/template-overviews/agency)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
    */
(function ($) {
    "use strict"; // Start of use strict
    $(document).ready(function () {
        var pageflag = false;
        if ($(window).width() < 976) {
            $("#resizemenu").html(
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/signin" id="account_ctrl">Signin</a></li>' +
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/cart">Cart</a></li>' +
                '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/management">Management</a></li>'
            );
        }

        //pageset btn 
        $("#pageset").off("click").on("click", function () {
            var setflag = false;
            var changeflag = false;
            if (pageflag == false) {
                //item
                pageflag = true;
                $("#pageset").val("User");
                $(".card-body").html(
                    '<form id="search_form">' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend" id="select_theme">' +
                    '<select class="custom-select" name="theme" id="theme">' +
                    '<option selected>Theme</option>' +
                    '<option value="pin">Pin</option>' +
                    '</select>' +
                    '</div>' +
                    '<input type="text" class="form-control" placeholder="search" name="search_thing" id="thing">' +
                    '<input type="button" value="search" class="btn btn-primary "id="search">' +
                    '</div>' +
                    '</div>' +
                    '</form>' +
                    '<div class="container" id="iteminfo" >' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >ITEM</span></div>' +
                    '<input type="text" class="form-control" id="item"  aria-describedby="basic-addon1" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >PIN</span></div>' +
                    '<input type="text" class="form-control" id="pin" aria-describedby="basic-addon1" readonly style="text-align:right"> </div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >PRICE</span></div>' +
                    '<input type="text" class="form-control" id="price"  aria-describedby="basic-addon1" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >VOLUME</span></div>' +
                    '<input type="text" class="form-control" id="volume" aria-describedby="basic-addon1" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >MAIN</span></div>' +
                    '<input type="text" class="form-control" id="main_category" aria-describedby="basic-addon1" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >SUB</span></div>' +
                    '<input type="text" class="form-control" id="sub_category" aria-describedby="basic-addon1" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >DESC</span></div>' +
                    '<textarea class="form-control" id="desc" aria-label="With textarea" readonly style="resize:none"></textarea></div>' +
                    '<div id="btnset" style="float:right">' +
                    '<input type="button" class="btn btn-success" id="add" value="Add">&nbsp;' +

                    '</div>' +
                    '</div>'
                );
                //add btn event
                $("#add").off("click").on("click", async function () {
                    const { value: itemset } = await Swal.fire({
                        title: 'Add Item',
                        html:
                            '<form id="addinput"><div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >ITEM</span></div>' +
                            '<input type="text" class="form-control" id="additem" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >PIN</span></div>' +
                            '<input type="text" class="form-control" id="addpin" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >PRICE</span></div>' +
                            '<input type="text" class="form-control" id="addprice"   ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >VOLUME</span></div>' +
                            '<input type="text" class="form-control" id="addvolume" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >MAIN</span></div>' +
                            '<input type="text" class="form-control" id="addmain_category"  ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >SUB</span></div>' +
                            '<input type="text" class="form-control" id="addsub_category" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >DESC</span></div>' +
                            '<textarea class="form-control" id="adddesc" aria-label="With textarea"  style="resize:none"></textarea></div></form>',
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Add",
                        preConfirm: () => {
                            var dataset={
                                item:$("#additem").val(),
                                pin:$("#addpin").val(),
                                price:$("#addprice").val(),
                                volume:$("#addvolume").val(),
                                mainc:$("#addmain_category").val(),
                                subc:$("#addsub_category").val(),
                                desc:$("#adddesc").val()
                                
                            };
                            
                            $.ajax({
                                url: "/admin/item/add",
                                type: "post",
                                data: dataset,
                                success: function () {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Add',
                                        text: 'Add item success'
                                    })
                                },
                                error: function () {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Add',
                                        text: 'Add item fail'
                                    })
                                }
                            })                        
                                
                            
                           
                        }
                    })
                  
                })

                //search btn event
                $("#search").off("click").on("click", function () {
                    $.ajax({
                        url: "/admin/item/search",
                        type: "post",
                        data: $("#search_form").serialize(),
                        success: function (data) {
                            console.log(data);
                            console.log(setflag);
                            $("#item").val(data.ITEM_NAME);
                            $("#pin").val(data.PIN);
                            $("#price").val(data.PRICE);
                            $("#volume").val(data.VOLUME);
                            $("#main_category").val(data.MAIN);
                            $("#sub_category").val(data.SUB);
                            $("#desc").val(data.ITEM_DESC);
                            if (setflag == false) {
                                $("#btnset").append(
                                    '<input type="button" class="btn btn-danger" id="delete" value="Delete">&nbsp;' +
                                    '<input type="button" class="btn btn-secondary" id="setting" value="Setting">');
                                setflag = true;
                                //delete btn event
                                $("#delete").off("click").on("click", function () {
                                    var pin = $("#pin").val();
                                    $.ajax({
                                        url: "/admin/item/delete",
                                        type: "post",
                                        data: { pin: pin },
                                        success: function (data) {
                                            console.log(data);
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Delete',
                                                text: 'Delete item success'
                                            }).then(() => {
                                                setflag = false;
                                                $("#delete").remove();
                                                $("#setting").remove();
                                                $("#thing").val("");
                                                $("#item").val("");
                                                $("#pin").val("");
                                                $("#price").val("");
                                                $("#volume").val("");
                                                $("#main_category").val("");
                                                $("#sub_category").val("");
                                                $("#desc").val("");

                                            })
                                        },
                                        error: function () {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Delete',
                                                text: 'Delete item fail'
                                            })
                                        }

                                    })

                                })

                                //setting btn event
                                $("#setting").off("click").on("click", function () {
                                    var item = $("#item");
                                    var pin = $("#pin");
                                    var price = $("#price");
                                    var volume = $("#volume");
                                    var mainc = $("#main_category");
                                    var subc = $("#sub_category");
                                    var desc = $("#desc");

                                    if (changeflag == false) {
                                        $("#setting").val("finish");
                                        $("#setting").css("background-color", "yellow");
                                        item.attr("readonly", false);
                                        pin.attr("readonly", false);
                                        price.attr("readonly", false);
                                        volume.attr("readonly", false);
                                        mainc.attr("readonly", false);
                                        subc.attr("readonly", false);
                                        desc.attr("readonly", false);
                                        changeflag = true;
                                    } else {
                                        var data = {
                                            item: item.val(),
                                            pin: pin.val(),
                                            price: price.val(),
                                            volume: volume.val(),
                                            mainc: mainc.val(),
                                            subc: subc.val(),
                                            desc: desc.val()
                                        };
                                        $.ajax({
                                            url: "/admin/item/setting",
                                            type: "post",
                                            data: data,
                                            success: function (data) {
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Setting',
                                                    text: 'Change item info success'
                                                }).then(() => {
                                                    $("#setting").val("setting");
                                                    $("#setting").css("background-color", "gray");
                                                    item.attr("readonly", true);
                                                    pin.attr("readonly", true);
                                                    price.attr("readonly", true);
                                                    volume.attr("readonly", true);
                                                    mainc.attr("readonly", true);
                                                    subc.attr("readonly", true);
                                                    desc.attr("readonly", true);
                                                    changeflag = false;
                                                })

                                            },
                                            error: function () {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Setting',
                                                    text: 'Setting item info fail'
                                                })
                                            }
                                        })
                                    }

                                })
                            }

                        },
                        error: function () {
                            Swal.fire({
                                icon: 'error',
                                title: 'Search',
                                text: 'Search item fail'
                            })
                        }
                    })

                })

            } else {
                pageflag = false;
                window.location.reload();
            }

        })

        if (pageflag == false) {
            //user
            $.ajax({
                url: "/admin/user",
                type: "post",
                success: function (data) {
                    var userdata = JSON.parse(data);
                    var length = userdata.length;
                    var authority;
                    $(".card-body").html('<table class="table"><tr><th scope="col">NO</th><th scope="col">ID</th><th scope="col">NAME</th> ' +
                        '<th scope="col">AUTHORITY</th><th scope="col">SETTING</th></tr>');
                    for (var i = 0; i < length; i++) {
                        if (userdata[i].TOKEN == 1) {
                            authority = 'admin';
                        } else {
                            authority = 'user';
                        }
                        $("tbody").append(
                            '<tr><th scope="row">' + (i + 1) + '</th>' +
                            '<td>' + userdata[i].USER_ID + '</td>' +
                            '<td>' + userdata[i].NAME + '</td>' +
                            '<td>' + authority + '</td>' +

                            '<td><input type=button class="btn btn-secondary" value="change"></td></tr>'
                        );
                    }
                    $(".card-body").append('</table>');

                },
                error: function () {

                }
            })
        }
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
                    '<li class="nav-item"><a class="nav-link js-scroll-trigger" href="/management">Management</a></li>'
                );
            } else {
                $("#resizemenu").html(
                    '<div class="dropdown"><a class="nav-link js-scroll-trigger dropdown-toggle" href="#"' +
                    'data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Account</a>' +
                    '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                    '<a class="dropdown-item" href="/signin" id="account_ctrl">Signin</a>' +
                    '<a class="dropdown-item" href="/cart">Cart</a>' +
                    '<a class="dropdown-item" href="/management">Management</a></div></div>'

                );
            }
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
