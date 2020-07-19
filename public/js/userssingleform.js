$('#editCancel').hide();
$('#editDiv').hide();

$('#editBtn').on('click', (event) => {
	event.preventDefault();
	$('#editCancel').show();
	$('#editAndPost').hide();

	$('#usersingleinfo').fadeOut(400, function() {
		$('#editDiv').fadeIn();
	});
});

$('#editCancelBtn').on('click', (event) => {
	event.preventDefault();
	$('#editCancel').hide();
	$('#editAndPost').show();

	$('#editDiv').fadeOut(400, function() {
		$('#usersingleinfo').fadeIn();
	});
});

$('.infoForm').on('click', function(event) {
	event.preventDefault();
	const form = $(this);
	const formUrl = form.attr('action');
	form.toggleClass('toRemove');

	Swal.fire({
		title: 'Are you sure to delete?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	})
	.then((result) => {
		if (result.value) {
			$.ajax({
				url: formUrl,
				type: 'DELETE',
				success: function(res) {
					$('.toRemove').closest('li').fadeOut(500, function() {
						$(this).remove();
					});
				}
			});
		} 
		else {
			form.toggleClass('toRemove');
		}
	})
});

/***************************** edit form *****************************/
$('.phoneNumber').keyup(function () {
    if (this.value.length == this.maxLength) {
        $(this).next().next().focus();
    }
});

$('#editSubmitBtn').on('click', (event) => {
    event.preventDefault();

    let hasError = false;
    $('#emptyError').hide();
    $('#passwordError').hide();
    $('#emailError').hide();
    $('#phoneError').hide();
    $('#editServerError').hide();

    let phoneArr = [];
    $('.phoneNumber').each(function() {
        phoneArr.push($(this).val());
    })
    $('#phoneNumber').val(phoneArr.join('-'));

    // check empty
    if (!$('#password').val() && !$('#email').val() && $('#phoneNumber').val() === "--") {
        hasError = true;
        $('#emptyError').html('Please enter something to edit your profile!');
        $('#emptyError').show();
    }

    // check password
    if ($('#password').val()) {
        const passwordRegex = /^\w+$/;
        const passwordLowerCase = $('#password').val().toLowerCase();
        if ($('#password').val() !== $('#password2').val()) {
            hasError = true;
            $('#passwordError').html('Please check that you\'ve entered and confirmed your password!');
            $('#passwordError').show();
        }
        else if ($('#password').val() === $('#username').val()) {
            hasError = true;
            $('#passwordError').html('Please check that your password is different from your username!');
            $('#passwordError').show();
        }
        else if (!passwordRegex.test($('#password').val())) {
            hasError = true;
            $('#passwordError').html('Password must contain only letters, numbers and underscores!');
            $('#passwordError').show();
        } 
        else if ($('#password').val().length < 6) {
            hasError = true;
            $('#passwordError').html('Password must contain at least six characters!');
            $('#passwordError').show();
        }
        else if ($('#password').val().length > 16) {
            hasError = true;
            $('#passwordError').html('Password must contain no more than sixteen letters!');
            $('#passwordError').show();
        } 
        else if ($('#password').val() === passwordLowerCase) {
            hasError = true;
            $('#passwordError').html('Password must contain at least one uppercase letter (A-Z)!');
            $('#passwordError').show();
        }
    }

    // check email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    if ($('#email').val() && !emailRegex.test($('#email').val())) {
        hasError = true;
        $('#emailError').html('Please make sure you\'ve entered a valid email');
        $('#emailError').show();
    }

    // check phone number
    const phoneRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if ($('#phoneNumber').val() === '--') {
        $('#phoneNumber').val('');
    }
    if ($('#phoneNumber').val() && !phoneRegex.test($('#phoneNumber').val())) {
        hasError = true;
        $('#phoneError').html('Please make sure you\'ve entered a valid phone number');
        $('#phoneError').show();
    }

    if(!hasError){
		$.ajax({
			url: $('#editForm').attr('action'),
			type: 'PUT',
			contentType: "application/json",
			data: JSON.stringify({
				password: $('#password').val(),
				email: $('#email').val(),
				phoneNumber: $('#phoneNumber').val()
			})
		})
		.done(function() {
			if ($('#email').val()) {
				$('#emailSpan').text($('#email').val());
				$('#email').val('');
			}
			else if ($('#phoneNumber').val()) {
				$('#phoneSpan').text($('#phoneNumber').val());
				$('#phoneNumberPart1').val('');
				$('#phoneNumberPart2').val('');
				$('#phoneNumberPart3').val('');
			}
			Swal.fire({
				icon: 'success',
				title: 'Your profile has been updated',
				showConfirmButton: false,
				timer: 1500
			})
		})
		.fail(function(jqXHR, textStatus, errorThrown) {
			$('#editServerError').html(jqXHR.responseText);
			$('#editServerError').show();
		});
    }
});