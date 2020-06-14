$('#editFormSubmit').on('click', function(event) {
    event.preventDefault();
    $('#editFormError').hide();

    if(!$('#editStatement').val() && !$('#editType').val() && !$('#editPrice').val()){
        $('#editFormError').html('Error: Please enter something before submission!');
        $('#editFormError').show();
        return;
    } 
    else {
        if($('#editPrice').val() && $('#editPrice').val() < 1){
            $('#editPrice').val(1);
        }
        else if($('#editPrice').val() > 9999){
            $('#editPrice').val(9999);
        }
        $('#housesEditForm').submit();
    }
});

$('#addImgFormSubmit').on('click', function(event) {
    event.preventDefault();
    $('#addImgError').hide();

    if(!$('#img').val()){
        $('#addImgError').html('Error: Please check that you\'ve choosen an image file!');
        $('#addImgError').show();
    }
    else{
        const arr = $('#img').val().split('.');
        if(arr[arr.length - 1] !== 'jpg' && arr[arr.length - 1] !== 'png'){
            $('#addImgError').html('Error: The file could only be image(jpg, jpeg, png) format!');
            $('#addImgError').show();
        }
        else{
            // ajax
            let fd = new FormData();
            let file = $('#img')[0].files[0];
            fd.append('image', file);
            $('#img').val("");
            $.ajax({
                url: $('#addImgForm').attr('action'),
                type: 'POST',
                contentType: false,
                processData: false,
                data: fd,
                success: function(res){
                    $('#imageDiv').append($(res));
                    $('#imageDiv').children().last().find('.removeImgForm').submit(function(event) {
                        event.preventDefault();
                        $(this).addClass('toRemove');
                        $.ajax({
                            url: $(this).attr('action'),
                            type: 'DELETE',
                            success: function(res) {
                                $('.toRemove').parent('div').fadeOut(500, function() {
                                    $(this).remove();
                                });
                            }
                        });
                    });
                }
            })
        }
    }
});

$('.removeImgForm').submit(function(event) {
    event.preventDefault();
    $(this).addClass('toRemove');
	$.ajax({
		url: $(this).attr('action'),
		type: 'DELETE',
		success: function(res) {
			$('.toRemove').parent('div').fadeOut(500, function() {
                $(this).remove();
            });
		}
	});
});