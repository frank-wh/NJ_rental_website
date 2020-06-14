$(".phoneNumber").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next().next().focus();
    }
});
// .phoneNumber { width: 32px; margin: 4px; } CSS

$('button[type=submit]').on('click', function(event) {
    event.preventDefault();

    let hasError = false;
    $('#usernameError').hide();
    $('#passwordError').hide();
    $('#emailError').hide();
    $('#phoneNumberError').hide();
    $('#usersNewFormError').hide();

    // check username
    if(!$('#username').val()){
        hasError = true;
        $('#usernameError').html('Error: Please check that you\'ve entered an username');
        $('#usernameError').show();
    } 
    else if($('#username').val().length < 6){
        hasError = true;
        $('#usernameError').html('Error: Username must contain at least six characters!');
        $('#usernameError').show();
    } 
    else if($('#username').val().length > 16){
        hasError = true;
        $('#usernameError').html('Error: Username must contain no more than sixteen characters!');
        $('#usernameError').show();
    }

    // check password
    const passwordRegex = /^\w+$/;
    const passwordLowerCase = $('#password').val().toLowerCase();
    if(!$('#password').val() || !$('#password2').val() || $('#password').val() !== $('#password2').val()){
        hasError = true;
        $('#passwordError').html('Error: Please check that you\'ve entered and confirmed your password!');
        $('#passwordError').show();
    }
    else if($('#password').val() === $('#username').val()){
        hasError = true;
        $('#passwordError').html('Error: Please check that your password is different from your username!');
        $('#passwordError').show();
    }
    else if(!passwordRegex.test($('#password').val())){
        hasError = true;
        $('#passwordError').html('Error: Password must contain only letters, numbers and underscores!');
        $('#passwordError').show();
    } 
    else if($('#password').val().length < 6){
        hasError = true;
        $('#passwordError').html('Error: Password must contain at least six letters!');
        $('#passwordError').show();
    } 
    else if($('#password').val().length > 16){
        hasError = true;
        $('#passwordError').html('Error: Password must contain no more than sixteen letters!');
        $('#passwordError').show();
    } 
    else if($('#password').val() === passwordLowerCase){
        hasError = true;
        $('#passwordError').html('Error: Password must contain at least one uppercase letter (A-Z)!');
        $('#passwordError').show();
    }

    // check email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!$('#email').val()){
        hasError = true;
        $('#emailError').html('Error: Please check that you\'ve entered an email');
        $('#emailError').show();
    }
    else if(!emailRegex.test($('#email').val())){
        hasError = true;
        $('#emailError').html('Error: Please make sure you\'ve entered a valid email');
        $('#emailError').show();
    }

    // check phone number
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    let phoneArr = [];
    $('.phoneNumber').each(function(){
        phoneArr.push($(this).val());
    })
    $('#phoneNumber').val(phoneArr.join('-'));
    if($('#phoneNumber').val() === '--'){
        hasError = true;
        $('#phoneNumberError').html('Error: Please check that you\'ve entered a phone number');
        $('#phoneNumberError').show();
    }
    else if(!phoneRegex.test($('#phoneNumber').val())){
        hasError = true;
        $('#phoneNumberError').html('Error: Please make sure you\'ve entered a valid phone number');
        $('#phoneNumberError').show();
    }

    if(!hasError){
        $('#usersNewForm').submit();
    }
});