$('button').on('click', (event) => {
    event.preventDefault();
    $('#loginErrorList').hide();
    $('#loginError').hide();
    if(!$('#name').val() || !$('#pword').val()){
        $('#loginError').html('Error: Please check that you\'ve entered your username and password!');
        $('#loginError').show();
    }
    else{
        $('#usersLoginForm').submit();
    }
});