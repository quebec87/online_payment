let paymentState = "credit";
let resultData = {};


function paymentBtnClicked(ev) {
    ev.stopPropagation();
    let target = $(ev.currentTarget);
    $('.payment-btn').removeClass('active');
    target.addClass('active');
    if (target.hasClass('credit-btn')) {
        paymentState = "credit";
        $('.select-line').removeClass().addClass('select-line').addClass('credit-line');
        $('.payment-info-pane').removeClass('active');
        $('.credit-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
    if (target.hasClass('shop-btn')) {
        paymentState = "shop";
        $('.select-line').removeClass().addClass('select-line').addClass('shop-line');
        $('.payment-info-pane').removeClass('active');
        $('.shop-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
    if (target.hasClass('atm-btn')) {
        paymentState = "atm";
        $('.select-line').removeClass().addClass('select-line').addClass('atm-line');
        $('.payment-info-pane').removeClass('active');
        $('.atm-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
}

function caculateTotal() {
    var cacu_length = 0;
    var order_length = $('.side-pane .order li span').length;
    var extra_length = $('.side-pane .extra li span').length;

    if ($('.shop-pane').hasClass('active')) {
        $('.extra').addClass('show');
        cacu_length = order_length + extra_length;
    } else {
        $('.extra').removeClass('show');
        cacu_length = order_length;
    }

    let total = 0;
    for (var i = 0; i < cacu_length; i++) {
        var price = parseInt($($('.side-pane li span')[i]).html());
        total += price;
    }
    $('.total').html(total);
}

function inputFocused(ev) {
    ev.stopPropagation();
    let target = $(ev.currentTarget);
    target.removeClass('hint');
    switch (target.attr('id')) {
        case "cardno":
            if (target.val() == '0000-0000-0000-0000') {
                target.val('')
            }
            break;
        case "month":
            if (target.val() == "MM") {
                target.val('');
            }

            break;
        case "year":
            if (target.val() == "YYYY") {
                target.val('');
            }

            break;
        case "cvv":
            if (target.val() == "CVV") {
                target.val('');
            }
            break;
    }
}


function inputFocusedOut(ev) {
    ev.stopPropagation();
    let target = $(ev.currentTarget);
    switch (target.attr('id')) {
        case "cardno":
            if (target.val() == '') {
                target.val('0000-0000-0000-0000');
                target.addClass('hint');
            }
            break;
        case "month":
            if (target.val() == '') {
                target.val('MM');
                target.addClass('hint');
            }
            updateDateValidation();
            break;
        case "year":
            if (target.val() == '') {
                target.val('YYYY');
                target.addClass('hint');
            }
            updateDateValidation();
            break;
        case "cvv":
            if (target.val() == '') {
                target.val('CVV');
                target.addClass('hint');
            }
            break;
    }
}


function cardNumTweak(ev) {
    let target = $(ev.currentTarget);
    let foo = target.val().split("-").join(""); // remove hyphens
    if (foo.length > 0) {
        let cardType = getCardType(foo);
        if (cardType != "") {
            $('.cardicon').text(cardType);
            $('.cardicon').css('visibility', 'visible');
        } else {
            $('.cardicon').css('visibility', 'hidden');
        }
        foo = foo.match(new RegExp('.{1,4}', 'g')).join("-");
    }
    target.val(foo);
}


//https://gist.github.com/michaelkeevildown/9096cd3aac9029c4e6e05588448a8841
//https://gist.github.com/swapnilmishra/dec37ee5a820de6cbca5
function getCardType(cardNum) {
    // if (!luhnCheck(cardNum)) {
    //     return "";
    // }
    var payCardType = "";
    var regexMap = [{
        regEx: /^4/,
        // regEx: /^4[0-9]{12}(?:[0-9]{3})?/ig,
        cardType: "VISA"
    }, {
        // regEx: /^5[1-5][0-9]{14}/ig,
        regEx: /^5[1-5]/,
        cardType: "MASTERCARD"
    }, {
        regEx: /^3[47]/,
        // regEx: /^3[47][0-9]{13}/ig,
        cardType: "AMEX"
    }, {
        regEx: /^35/,
        // regEx: /^(?:2131|1800|35\d{3})\d{11}/ig,
        cardType: "JCB"
    }];
    for (var j = 0; j < regexMap.length; j++) {
        if (cardNum.match(regexMap[j].regEx)) {
            payCardType = regexMap[j].cardType;
            break;
        }
    }
    return payCardType;
}


function luhnCheck(cardNum) {
    // Luhn Check Code from https://gist.github.com/4075533
    // accept only digits, dashes or spaces
    var numericDashRegex = /^[\d\-\s]+$/
    if (!numericDashRegex.test(cardNum)) return false;

    // The Luhn Algorithm. It's so pretty.
    var nCheck = 0,
        nDigit = 0,
        bEven = false;
    var strippedField = cardNum.replace(/\D/g, "");

    for (var n = strippedField.length - 1; n >= 0; n--) {
        var cDigit = strippedField.charAt(n);
        nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck !== 0) && (nCheck % 10) == 0
}


function submitClicked(ev) {
    // $('.payment-info>.active>form').parsley();
    //$('.payment-info>.active>form').submit()

    $('.payment-info>.active>form').submit()
}

function initValidation() {
    window.Parsley.addValidator('cardno', {
        validateString: function(value) {
            var pass = luhnCheck(value);
            $('.cardicon').css('display', pass ? 'block' : 'none');
            return pass;
        },
        messages: {
            en: 'This is not a valid credit card number',
        }
    });
    setValidation();
}

function setValidation() {
    $('.payment-info>.active>form').parsley().destroy();
    $('.custom-error').html('');
    $('.payment-info>.active>form').parsley().on('form:validate', function(formInstance) {
            if ($('.payment-info>.active').hasClass('credit-pane')) {
                var ok = formInstance.isValid({
                    group: 'date',
                    force: true
                });

                $('.date-validationResult').html(ok ? '' : 'expiration date is valid').toggleClass('filled', !ok);
                var pass = formInstance.isValid();
                $('.form-item').css('margin-bottom', pass ? '20px' : '10px');
            }
            // if ($('.payment-info>.active').hasClass('shop-pane')) {
            //     console.log('shop pane');
            // }
            // if ($('.payment-info>.active').hasClass('atm-pane')) {
            //     console.log('atm pane');
            // }
            if (!ok)
                formInstance.validationResult = false;
        })
        .on('form:submit', function() {
            return false; // Don't submit form for this demo
        })
        .on('form:success', function() {
            // storeData();
            buildData();
            showResult();
            cleanup();
        })
}


function updateDateValidation() {
    var ok = $('.payment-info>.active>form').parsley().isValid({
        group: 'date',
        force: true
    });
    $('.date-validationResult').html(ok ? '' : 'expiration date is valid').toggleClass('filled', !ok);
}

function buildData() {
    var email = $('.payment-info-pane.active #email').val();
    $('.result-pane .result-email').html(email);
    switch (paymentState) {
        case "credit":
            var cardno = $('.payment-info-pane.active #cardno').val().toString();
            var last4 = cardno.substr(-4);
            var cardtypedata = $('#cardtype').html();
            $('.lastfour').html(last4 + "  " + cardtypedata);
            break;
        case "shop":
            var shopResult = $("input[name='shop']:checked").val();
            $('.result-shop').html(shopResult);
            break;
        case "atm":
            var shopResult = "(" + $("input[name='bank']:checked").val() + ")";
            $('.result-bank').html(shopResult);
            break;
    }
}

// function storeData() {
//     resultData = {};
//     switch (paymentState) {
//         case "credit":
//             for (var i = 0; i < $('.credit-pane input').length; i++) {
//                 var target = $($('.credit-pane input')[i])
//                 var inputid = target.attr('id').toString();
//                 var value = target.val();
//                 var myObj = {};
//                 myObj[inputid] = value;
//                 resultData = Object.assign(resultData, myObj);
//             }
//             var cardtypedata = $('#cardtype').html();
//             resultData = Object.assign(resultData, {
//                 'cardtype': cardtypedata
//             });
//             break;
//         case "shop":
//             var emailObj = {};
//             emailObj['email'] = $('.shop-pane #email').val();
//             resultData = Object.assign(resultData, emailObj);
//             var shopObj = {};
//             shopObj['shop'] = $("input[name='shop']:checked").val();
//             resultData = Object.assign(resultData, shopObj);
//             console.log(resultData + ".     " + resultData.shop);
//             break;
//         case "atm":
//             var emailObj = {};
//             emailObj['email'] = $('.shop-pane #email').val();
//             resultData = Object.assign(resultData, emailObj);
//             break;
//     }
// }

function showResult() {
    $('.result-info-pane').removeClass('active');
    switch (paymentState) {
        case 'credit':
            $('.credit-result').addClass('active');
            break;
        case 'shop':
            $('.shop-result').addClass('active');
            break;
        case "atm":
            $('.atm-result').addClass('active');
            break;
    }
    if (parseInt($(window).width(), 10) <= 719) {
        console.log('small. ');
        $('.mobile-submit').fadeOut(300); //.addClass('hide');
    }
    $('.side-pane').fadeOut(300);
    $('.payment-pane').fadeOut(300, function() {
        $('.result-pane').fadeIn(400);
        $('.thankyou-deco-pane').fadeIn(400);
        $('.success').delay(1500).fadeOut(100);
    });
}

function cleanup() {
    for (var i = 0; i < $('.payment-info-pane input').length; i++) {
        var target = $($('.payment-info-pane input')[i])
        var inputid = target.attr('id');
        switch (inputid) {
            case 'email':
                target.val('');
                break;
            case 'cardno':
                target.val('0000-0000-0000-0000');
                target.addClass('hint');
                break;
            case 'month':
                target.val('MM');
                target.addClass('hint');
                break;
            case 'year':
                target.val('YYYY');
                target.addClass('hint');
                break;
            case 'cvv':
                target.val('CVV');
                target.addClass('hint');
                break;
            case 'shop-familymart':
                target.prop('checked', true);
                break;
            case 'shop-7-11':
                target.prop('checked', false);
                break;
            case 'bank-yusan':
                target.prop('checked', true);
                break;
            case 'bank-tw':
                target.prop('checked', false);
                break;
            case 'bank-taishin':
                target.prop('checked', false);
                break;
        }
    }
    $('.cardicon').html('');
    $('.cardicon').css('visibility', 'hidden');
}

function backClicked() {
    $('.thankyou-deco-pane').fadeOut(300);
    $('.result-pane').fadeOut(300, function() {
        $('.payment-pane').fadeIn(400);
        $('.side-pane').fadeIn(400);
        if (parseInt($(window).width(), 10) <= 719) {
            $('.mobile-submit').fadeIn(400); // .removeClass('hide');
        }
    })
}

function printClicked() {
    window.print();
}

$(document).ready(function() {
    $('.payment-btn').on('click', paymentBtnClicked);
    $('input').on('focus', inputFocused);
    $('input').on('focusout', inputFocusedOut);
    $('#cardno').on('keyup', cardNumTweak);
    $('.submit-btn').on('click', submitClicked);
    $('.back-btn').on('click', backClicked);
    $('.print-btn').on('click', printClicked);
    initValidation();
})