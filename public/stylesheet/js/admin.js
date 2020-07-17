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
                    '<span class="input-group-text" >PARTS NUM</span></div>' +
                    '<input type="text" class="form-control" id="parts_number" aria-describedby="basic-addon1" readonly style="text-align:right"> </div>' +
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
                    '<span class="input-group-text" >MODEL</span></div>' +
                    '<input type="text" class="form-control" id="model_b" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >SUB MODEL</span></div>' +
                    '<input type="text" class="form-control" id="model_d" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >CAR MANUF</span></div>' +
                    '<input type="text" class="form-control" id="manuf_c" readonly style="text-align:right"></div>' +
                    '<div class="input-group mb-3">' +
                    '<div class="input-group-prepend">' +
                    '<span class="input-group-text" >ITEM MANUF</span></div>' +
                    '<input type="text" class="form-control" id="manuf_i" readonly style="text-align:right"></div>' +
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
                            '<span class="input-group-text" >PARTS NUM</span></div>' +
                            '<input type="text" class="form-control" id="addparts_number" ></div>' +
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
                            '<span class="input-group-text" >CATEGORY</span></div>' +
                            '<select name="category" class="custom-select" id="category">'+
                            '<option selected>Choose...</option>'+
                            '<optgroup label ="Accessories">'+
                            '<option value="accessories&seat">Seat</option>'+
                            '<option value="accessories&mirror">Mirror</option>'+
                            '<option value="accessories&pedal">Pedal</option>'+
                            '<option value="accessories&gear">Gear</option>'+
                            '<option value="accessories&steering wheel">Steering Wheel</option>'+
                            '<option value="accessories&cover">Cover</option>'+
                            '<option value="accessories&padr">Pad</option>'+
                            '<option value="accessories&holder">Cover</option>'+
                            '<option value="accessories&pocket">Pocket</option>'+
                            '<option value="accessories&handle">handle</option>'+
                            '<option value="accessories&etc">etc</option></optgroup>'+
                            '<optgroup label ="Body">'+
                            '<option value="body&panel">Panel</option>'+
                            '<option value="body&airbag">Airbag</option>'+
                            '<option value="body&dash board">Dash Board</option>'+
                            '<option value="body&door">Door</option>'+
                            '<option value="body&trunk">Trunk</option>'+
                            '<option value="body&bonnet">Bonnet</option>'+
                            '<option value="body&etc">etc</option></optgroup>'+
                            '<optgroup label ="Brake">'+
                            '<option value="brake&brake">Brake</option>'+
                            '<option value="brake&master cylinder">Master Cylinder</option>'+
                            '<option value="brake&etc">etc</option></optgroup>'+
                            '<optgroup label ="Electric Parts">'+
                            '<option value="eletric parts&control system">Control System</option>'+
                            '<option value="eletric parts&cooling system">Cooling System</option>'+
                            '<option value="eletric parts&lamp">Lamp</option>'+
                            '<option value="eletric parts&wiper">Wiper</option>'+
                            '<option value="eletric&etc">etc</option></optgroup>'+
                            '<optgroup label ="Power Generater Parts">'+
                            '<option value="power generater parts&engine">Engine</option>'+
                            '<option value="power generater parts&fuel system">Fuel System</option>'+
                            '<option value="power generater parts&start">Start</option>'+
                            '<option value="power generater parts&ignition system">Ignition System</option>'+
                            '<option value="power generater parts&exhaust">Exhaust</option>'+
                            '<option value="power generater parts&etc">etc</option></optgroup>'+
                            '<optgroup label ="Power Transfer Parts">'+
                            '<option value="power transfer parts&clutch">Clutch</option>'+
                            '<option value="power transfer parts&transmission">Transmission</option>'+
                            '<option value="power transfer parts&differental system">Differental System</option>'+
                            '<option value="power transfer parts&drive shaft">Drive Shaft</option>'+
                            '<option value="power transfer parts&wheel">Wheel</option>'+
                            '<option value="power transfer parts&etc">etc</option></optgroup>'+
                            '<optgroup label ="Steering Parts">'+
                            '<option value="steering parts&steering wheel">Steering Wheel</option>'+
                            '<option value="steering parts&steering column">Steering column</option>'+
                            '<option value="steering parts&steering gear">Steering Gear</option>'+
                            '<option value="steering parts&etc">etc</option></optgroup>'+
                            '<optgroup label ="Suspention Parts">'+
                            '<option value="suspention parts&shock absorber">Shock Absorber</option>'+
                            '<option value="suspention parts&etc">etc</option></optgroup>'+
                            '<optgroup label ="Tuning Parts">'+
                            '<option value="tuning parts&build up">Build Up</option>'+
                            '<option value="tuning parts&tune up">Tune Up</option>'+
                            '<option value="tuning parts&dress up">Dress Up</option>'+
                            '<option value="tuning parts&etc">etc</option></optgroup>'+
                            '<optgroup label ="Etc">'+
                            '<option value="etc&">etc</option></optgroup>'+
                            '</select></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >MODEL</span></div>' +
                            '<input type="text" class="form-control" id="addmodel_b" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >SUB MODEL</span></div>' +
                            '<input type="text" class="form-control" id="addmodel_d" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >CAR MANUF</span></div>' +
                            '<input type="text" class="form-control" id="addmanuf_c" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >ITEM MANUF</span></div>' +
                            '<input type="text" class="form-control" id="addmanuf_i" ></div>' +
                            '<div class="input-group mb-3">' +
                            '<div class="input-group-prepend">' +
                            '<span class="input-group-text" >DESC</span></div>' +
                            '<textarea class="form-control" id="adddesc" aria-label="With textarea"  style="resize:none"></textarea></div>'+
                           
                            '</div></form>',
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: "Add",
                        preConfirm: () => {
                            var category = $("#category").val().split('&');
                            var dataset={
                                modelb:$("#addmodel_b").val(),
                                manufc:$("#addmanuf_c").val(),
                                modeld:$("#addmodel_d").val(),
                                manufi:$("#addmanuf_i").val(),
                                item:$("#additem").val(),
                                parts_num:$("#addparts_number").val(),
                                price:$("#addprice").val(),
                                volume:$("#addvolume").val(),
                                mainc:category[0],
                                subc:category[1],
                                desc:$("#adddesc").val(),
                                                               
                            };
                            
                            $.ajax({
                                url: "/admin/item/add",
                                type: "post",
                                data: dataset,
                                success: function (data) {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Add',
                                        text: 'Pin: '+data
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
                            $("#parts_number").val(data.PARTS_NUM);
                            $("#price").val(data.PRICE);
                            $("#volume").val(data.VOLUME);
                            $("#main_category").val(data.MAIN_C);
                            $("#sub_category").val(data.SUB_C);
                            $("#desc").val(data.ITEM_DESC);
                            $("#model_b").val(data.BASE_M);
                            $("#manuf_c").val(data.CAR_M);
                            $("#model_d").val(data.DETAIL_M);
                            $("#manuf_i").val(data.ITEM_M);

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
                                                $("#parts_number").val("");
                                                $("#price").val("");
                                                $("#volume").val("");
                                                $("#main_category").val("");
                                                $("#sub_category").val("");
                                                $("#desc").val("");
                                                $("#model_b").val("");
                                                $("#manuf_c").val("");
                                                $("#model_d").val("");
                                                $("#manuf_i").val("");
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
                                    var partsnum = $("#parts_number");
                                    var pin = $("#pin");
                                    var price = $("#price");
                                    var volume = $("#volume");
                                    var mainc = $("#main_category");
                                    var subc = $("#sub_category");
                                    var desc = $("#desc");
                                    var modelb = $("#model_b");
                                    var manufc = $("#manuf_c");
                                    var modeld = $("#model_d");
                                    var manufi = $("#manuf_i");

                                    if (changeflag == false) {
                                        $("#setting").val("finish");
                                        $("#setting").css("background-color", "yellow");
                                        item.attr("readonly", false);
                                        partsnum.attr("readonly", false);
                                        price.attr("readonly", false);
                                        volume.attr("readonly", false);
                                        mainc.attr("readonly", false);
                                        subc.attr("readonly", false);
                                        desc.attr("readonly", false);
                                        modelb.attr("readonly",false);
                                        manufc.attr("readonly",false);
                                        modeld.attr("readonly",false);
                                        manufi.attr("readonly",false);
                                        changeflag = true;
                                    } else {
                                        var data = {
                                            item: item.val(),
                                            partsnum: partsnum.val(),
                                            pin:pin.val(),
                                            price: price.val(),
                                            volume: volume.val(),
                                            mainc: mainc.val(),
                                            subc: subc.val(),
                                            desc: desc.val(),
                                            modelb: modelb.val(),
                                            manufc: manufc.val(),
                                            modeld: modeld.val(),
                                            manufi: manufi.val()
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
                                                    partsnum.attr("readonly", true);
                                                    price.attr("readonly", true);
                                                    volume.attr("readonly", true);
                                                    mainc.attr("readonly", true);
                                                    subc.attr("readonly", true);
                                                    desc.attr("readonly", true);
                                                    modelb.attr("readonly",true);
                                                    manufc.attr("readonly",true);
                                                    modeld.attr("readonly",true);
                                                    manufi.attr("readonly",true);
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
