function paymentBtnClicked(ev) {
    ev.stopPropagation();
    let target = $(ev.currentTarget);
    $('.payment-btn').removeClass('active');
    target.addClass('active');
    if (target.hasClass('credit-btn')) {
        $('.select-line').removeClass().addClass('select-line').addClass('credit-line');
        $('.payment-info-pane').removeClass('active');
        $('.credit-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
    if (target.hasClass('shop-btn')) {
        $('.select-line').removeClass().addClass('select-line').addClass('shop-line');
        $('.payment-info-pane').removeClass('active');
        $('.shop-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
    if (target.hasClass('atm-btn')) {
        $('.select-line').removeClass().addClass('select-line').addClass('atm-line');
        $('.payment-info-pane').removeClass('active');
        $('.atm-pane').addClass('active');
        setValidation();
        caculateTotal();
        return;
    }
}

function caculateTotal() {
    var cacu_length = $('.side-pane li span').length
    if ($('.shop-pane').hasClass('active')) {
        $('.extra').addClass('show')
    } else {
        $('.extra').removeClass('show');
        var extraLength = $('.extra li span').length;
        cacu_length = cacu_length - extraLength;
    }

    let total = 0;
    for (var i = 0; i < cacu_length; i++) {
        var price = parseInt($($('.side-pane li span')[i]).html());
        console.log(price);
        total += price;
        console.log(total);
    }
    $('.total').html(total);
}

function inputFocused(ev) {
    ev.stopPropagation();
    let target = $(ev.currentTarget);
    target.removeClass('hint');
    switch (target.attr('id')) {
        case "cardno1":
        case "cardno2":
        case "cardno3":
        case "cardno4":
            if (target.val() == '0000') {
                target.val('');
            }
            break;
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
        case "cardno1":
        case "cardno2":
        case "cardno3":
        case "cardno4":
            if (target.val() == '') {
                target.val('0000');
                target.addClass('hint');
            }
            break;
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
        case "shop-familymart":
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

    if (!luhnCheck(cardNum)) {
        return "";
    }
    var payCardType = "";
    var regexMap = [{
        regEx: /^4[0-9]{12}(?:[0-9]{3})?/ig,
        cardType: "VISA"
    }, {
        regEx: /^5[1-5][0-9]{14}/ig,
        cardType: "MASTERCARD"
    }, {
        regEx: /^3[47][0-9]{13}/ig,
        cardType: "AMEX"
    }, {
        regEx: /^(?:2131|1800|35\d{3})\d{11}/ig,
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
    console.log('submit');
    // $('.payment-info>.active>form').parsley();
    //$('.payment-info>.active>form').submit()

    $('.payment-info>.active>form').submit()
}

function initValidation() {
    window.Parsley.addValidator('cardno', {
        validateString: function(value) {
            return luhnCheck(value);
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
            console.log('credit pane');
            var ok = formInstance.isValid({
                group: 'date',
                force: true
            });
            $('.date-validationResult').html(ok ? '' : 'expiration date is valid').toggleClass('filled', !ok);
            var pass = formInstance.isValid();
            $('.form-item').css('margin-bottom', pass ? '20px' : '10px');
            $('.cardicon').css('display', pass ? 'block' : 'none');
        }
        // if ($('.payment-info>.active').hasClass('shop-pane')) {
        //     console.log('shop pane');
        // }
        // if ($('.payment-info>.active').hasClass('atm-pane')) {
        //     console.log('atm pane');
        // }
        if (!ok)
            formInstance.validationResult = false;
    });
    $('.payment-info>.active>form').parsley().on('form:success', function() {
        alert('pass');
    })
}


function updateDateValidation() {
    var ok = $('.payment-info>.active>form').parsley().isValid({
        group: 'date',
        force: true
    });
    $('.date-validationResult').html(ok ? '' : 'expiration date is valid').toggleClass('filled', !ok);
}

$(document).ready(function() {
    $('.payment-btn').on('click', paymentBtnClicked);
    $('input').on('focus', inputFocused);
    $('input').on('focusout', inputFocusedOut);
    $('#cardno').on('keyup', cardNumTweak);
    $('.submit-btn').on('click', submitClicked);
    initValidation();
})