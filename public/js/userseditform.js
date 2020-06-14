$(".phoneNumber").keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next().next().focus();
    }
});
// .phoneNumber { width: 32px; margin: 4px; } CSS

$('button[type=submit]').on('click', function(event) {
    event.preventDefault();

    let hasError = false;
    $('#userEditEmptyError').hide();
    $('#pwError').hide();
    $('#mailError').hide();
    $('#phoneNumError').hide();
    $('#userEditFormError').hide();

    let phoneArr = [];
    $('.phoneNumber').each(function(){
        phoneArr.push($(this).val());
    })
    $('#phoneNum').val(phoneArr.join('-'));

    // check empty
    if(!$('#pw').val() && !$('#mail').val() && $('#phoneNum').val() === "--"){
        hasError = true;
        $('#userEditEmptyError').html('Error: Please enter something to edit your profile!');
        $('#userEditEmptyError').show();
    }

    // check password
    if($('#pw').val()){
        const passwordRegex = /^\w+$/;
        const passwordLowerCase = $('#pw').val().toLowerCase();
        if($('#pw').val() !== $('#pw2').val()){
            hasError = true;
            $('#pwError').html('Error: Please check that you\'ve entered and confirmed your password!');
            $('#pwError').show();
        }
        else if($('#pw').val() === $('#username').val()){
            hasError = true;
            $('#pwError').html('Error: Please check that your password is different from your username!');
            $('#pwError').show();
        }
        else if(!passwordRegex.test($('#pw').val())){
            hasError = true;
            $('#pwError').html('Error: Password must contain only letters, numbers and underscores!');
            $('#pwError').show();
        } 
        else if($('#pw').val().length < 6){
            hasError = true;
            $('#pwError').html('Error: Password must contain at least six characters!');
            $('#pwError').show();
        }
        else if($('#pw').val().length > 16){
            hasError = true;
            $('#pwError').html('Error: Password must contain no more than sixteen letters!');
            $('#pwError').show();
        } 
        else if($('#pw').val() === passwordLowerCase){
            hasError = true;
            $('#pwError').html('Error: Password must contain at least one uppercase letter (A-Z)!');
            $('#pwError').show();
        }
    }

    // check email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if($('#mail').val() && !emailRegex.test($('#mail').val()) ) {
        hasError = true;
        $('#mailError').html('Error: Please make sure you\'ve entered a valid email');
        $('#mailError').show();
    }

    // check phone number
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if($('#phoneNum').val() === '--'){
        $('#phoneNum').val('');
    }
    if($('#phoneNum').val() && !phoneRegex.test($('#phoneNum').val())){
        hasError = true;
        $('#phoneNumError').html('Error: Please make sure you\'ve entered a valid phone number');
        $('#phoneNumError').show();
    }

    if(!hasError){
        $('#usersEditForm').submit();
    }
});