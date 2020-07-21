$('#editCancel').hide();
$('#editDiv').hide();
$('#postDiv').hide();
let isEdit = false;

$('#editBtn').on('click', (event) => {
	event.preventDefault();
	$('#editCancel').show();
	$('#editAndPost').hide();
    isEdit = true;
	$('#usersingleinfo').fadeOut(400, () => {
		$('#editDiv').fadeIn();
	});
});

$('#postBtn').on('click', (event) => {
	event.preventDefault();
	$('#editCancel').show();
	$('#editAndPost').hide();
    isEdit = false;
	$('#usersingleinfo').fadeOut(400, () => {
        $('#postDiv').fadeIn();
	});
});

$('#editCancelBtn').on('click', (event) => {
	event.preventDefault();
	$('#editCancel').hide();
	$('#editAndPost').show();
    if (isEdit) {
        $('#editDiv').fadeOut(400, () => {
            $('#usersingleinfo').fadeIn();
        });
    }
    else {
        $('#postDiv').fadeOut(400, () => {
            $('#usersingleinfo').fadeIn();
        });
    }
});

$('.infoListForm').on('click', function(event) {
	event.preventDefault();
	const form = $(this);
	const formUrl = form.attr('action');
	form.toggleClass('toRemove');

	Swal.fire({
		title: 'Are you sure to delete?',
		text: "You won't be able to revert this!",
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#28a745',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Yes, delete it!'
	})
	.then((result) => {
		if (result.value) {
			$.ajax({
				url: formUrl,
				type: 'DELETE',
				success: () => {
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

$('.infoForm').on('click', function(event) {
	event.preventDefault();
	const form = $(this);
	const formUrl = form.attr('action');
	form.toggleClass('toRemove');
    $.ajax({
        url: formUrl,
        type: 'DELETE',
        success: () => {
            $('.toRemove').closest('li').fadeOut(500, function() {
                $(this).remove();
            });
        }
    });
});