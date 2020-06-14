$('form').submit(function(event) {
	event.preventDefault();
	$(this).addClass('toRemove');
	$.ajax({
		url: $(this).attr('action'),
		type: 'DELETE',
		success: function(res) {
			$('.toRemove').closest('li').fadeOut(500, function() {
				$(this).remove();
			});
		}
	});
});