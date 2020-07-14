$('form').submit(function(event) {
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
	}).then((result) => {
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
		} else {
			form.toggleClass('toRemove');
		}
	})
});