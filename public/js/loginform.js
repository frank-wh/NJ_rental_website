window.onload = function() {
    if (localStorage.getItem('hasUser')) {
        Swal.fire({
            icon: 'success',
            title: 'Welcome, ' + $('#currentUser').html(),
            showConfirmButton: false,
            timer: 1500
        })
        localStorage.removeItem('hasUser');
    }
};

$('#signUpDiv').hide();

$('#signInDivButton').on('click', (event) => {
    event.preventDefault();
    $('#signInServerError').hide();
    $('#signInClientError').hide();
    $('#signUpNameError').hide();
    $('#signUpPasswordError').hide();
    $('#signUpEmailError').hide();
    $('#signUpPhoneError').hide();
    $('#signUpServerError').hide();

    $('#signUpDiv').hide();
    $('#signInDiv').show();

    $('#signInDivButton').toggleClass('active');
    $('#signUpDivButton').toggleClass('active');
});

$('#signUpDivButton').on('click', (event) => {
    event.preventDefault();
    $('#signInServerError').hide();
    $('#signInClientError').hide();
    $('#signUpNameError').hide();
    $('#signUpPasswordError').hide();
    $('#signUpEmailError').hide();
    $('#signUpPhoneError').hide();
    $('#signUpServerError').hide();

    $('#signInDiv').hide();
    $('#signUpDiv').show();

    $('#signUpDivButton').toggleClass('active');
    $('#signInDivButton').toggleClass('active');
});

/***************************** sign in form *****************************/
$('#signInButton').on('click', (event) => {
    event.preventDefault();
    $('#signInServerError').hide();
    $('#signInClientError').hide();
    
    if (!$('#signInInfo').val() || !$('#signInPassword').val()) {
        $('#signInClientError').html('Please check that you\'ve entered username/email and password!');
        $('#signInClientError').show();
    }
    else {
        $.ajax({
            url: $('#signInForm').attr('action'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                loginInfo: $('#signInInfo').val(),
                password: $('#signInPassword').val()
            })
        })
        .done(() => {
            localStorage.setItem('hasUser', 'success');
            location.reload();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
			$('#signInServerError').html(jqXHR.responseText);
			$('#signInServerError').show();
		});
    }
});

/***************************** sign up form *****************************/
$(".signUpPhone").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next().next().focus();
    }
});

$('#signUpButton').on('click', (event) => {
    event.preventDefault();

    let hasError = false;
    $('#signUpNameError').hide();
    $('#signUpPasswordError').hide();
    $('#signUpEmailError').hide();
    $('#signUpPhoneError').hide();
    $('#signUpServerError').hide();

    // check username
    if (!$('#signUpName').val()) {
        hasError = true;
        $('#signUpNameError').html('Please check that you\'ve entered an username');
        $('#signUpNameError').show();
    } 
    else if ($('#signUpName').val().length < 6) {
        hasError = true;
        $('#signUpNameError').html('Username must contain at least six characters!');
        $('#signUpNameError').show();
    } 
    else if ($('#signUpName').val().length > 16) {
        hasError = true;
        $('#signUpNameError').html('Username must contain no more than sixteen characters!');
        $('#signUpNameError').show();
    }

    // check password
    const passwordRegex = /^\w+$/;
    const passwordLowerCase = $('#signUpPassword').val().toLowerCase();
    if (!$('#signUpPassword').val() || !$('#signUpPassword2').val() || $('#signUpPassword').val() !== $('#signUpPassword2').val()) {
        hasError = true;
        $('#signUpPasswordError').html('Please check that you\'ve entered and confirmed your password!');
        $('#signUpPasswordError').show();
    }
    else if ($('#signUpPassword').val() === $('#signUpName').val()) {
        hasError = true;
        $('#signUpPasswordError').html('Please check that your password is different from your username!');
        $('#signUpPasswordError').show();
    }
    else if (!passwordRegex.test($('#signUpPassword').val())) {
        hasError = true;
        $('#signUpPasswordError').html('Password must contain only letters, numbers and underscores!');
        $('#signUpPasswordError').show();
    } 
    else if ($('#signUpPassword').val().length < 6) {
        hasError = true;
        $('#signUpPasswordError').html('Password must contain at least six letters!');
        $('#signUpPasswordError').show();
    } 
    else if ($('#signUpPassword').val().length > 16) {
        hasError = true;
        $('#signUpPasswordError').html('Password must contain no more than sixteen letters!');
        $('#signUpPasswordError').show();
    } 
    else if ($('#signUpPassword').val() === passwordLowerCase) {
        hasError = true;
        $('#signUpPasswordError').html('Password must contain at least one uppercase letter (A-Z)!');
        $('#signUpPasswordError').show();
    }

    // check email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!$('#signUpEmail').val()) {
        hasError = true;
        $('#signUpEmailError').html('Please check that you\'ve entered an email');
        $('#signUpEmailError').show();
    }
    else if (!emailRegex.test($('#signUpEmail').val())) {
        hasError = true;
        $('#signUpEmailError').html('Please make sure you\'ve entered a valid email');
        $('#signUpEmailError').show();
    }

    // check phone number
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    let phoneArr = [];
    $('.signUpPhone').each(function() {
        phoneArr.push($(this).val());
    })
    $('#signUpPhoneNumber').val(phoneArr.join('-'));
    if ($('#signUpPhoneNumber').val() === '--') {
        hasError = true;
        $('#signUpPhoneError').html('Please check that you\'ve entered a phone number');
        $('#signUpPhoneError').show();
    }
    else if (!phoneRegex.test($('#signUpPhoneNumber').val())) {
        hasError = true;
        $('#signUpPhoneError').html('Please make sure you\'ve entered a valid phone number');
        $('#signUpPhoneError').show();
    }

    if (!hasError) {
        $.ajax({
            url: $('#signUpForm').attr('action'),
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#signUpName').val(),
                password: $('#signUpPassword').val(),
                email: $('#signUpEmail').val(),
                phoneNumber: $('#signUpPhoneNumber').val()
            })
        })
        .done(() => {
            localStorage.setItem('hasUser', 'success');
            location.reload();
        })
        .fail((jqXHR, textStatus, errorThrown) => {
			$('#signUpServerError').html(jqXHR.responseText);
			$('#signUpServerError').show();
		});
    }
});