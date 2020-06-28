$('#userloginEmail').hide();
let isUsername = true;

$('#nameDiv').on('click', (event) => {
    event.preventDefault();
    isUsername = true;
    $('#loginErrorList').hide();
    $('#loginError').hide();
    $('#userloginEmail').hide();
    $('#userloginName').show();
    $('#nameDiv').toggleClass('active');
    $('#emailDiv').toggleClass('active');
});

$('#emailDiv').on('click', (event) => {
    event.preventDefault();
    isUsername = false;
    $('#loginErrorList').hide();
    $('#loginError').hide();
    $('#userloginName').hide();
    $('#userloginEmail').show();
    $('#emailDiv').toggleClass('active');
    $('#nameDiv').toggleClass('active');
});

$('button').on('click', (event) => {
    event.preventDefault();
    $('#loginErrorList').hide();
    $('#loginError').hide();
    if(isUsername) {
        if(!$('#name').val() || !$('#pword').val()){
            $('#loginError').html('Error: Please check that you\'ve entered username and password!');
            $('#loginError').show();
        }
        else{
            $('#usersLoginForm').submit();
        }
    }
    else {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!$('#email').val() || !$('#pword').val()){
            $('#loginError').html('Error: Please check that you\'ve entered email and password!');
            $('#loginError').show();
        }
        else if(!emailRegex.test($('#email').val())){
            $('#loginError').html('Error: Please check that you\'ve entered valid email');
            $('#loginError').show();
        }
        else{
            $('#usersLoginForm').submit();
        }
    }
});