(function ($) {
    function bindEvents() {
        $('#storeDiv').find('a').on('click' ,function(event) {
            event.preventDefault();
            $.ajax({
                url: $(this).attr('href'),
                type: 'POST',
                success: function(res) {
                    $('#storeDiv').empty();
                    $('#storeDiv').append($(res));
                    bindEvents();
                }
            });
        });
    }

    $('#storehouse').on('click', function(event) {
        event.preventDefault();
        if($('#currentUser').html() === undefined){
            return Swal.fire({
                icon: 'error',
                title: 'Please sign in first',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        $.ajax({
            url: $(this).attr('href'),
            type: 'POST',
            success: function(res) {
                $('#storeDiv').empty();
                $('#storeDiv').append($(res));
                bindEvents();
            }
        });
    });

    $('#removestore').on('click', function(event) {
        event.preventDefault();
        if($('#currentUser').html() === undefined){
            return Swal.fire({
                icon: 'error',
                title: 'Please sign in first',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        $.ajax({
            url: $(this).attr('href'),
            type: 'POST',
            success: function(res) {
                $('#storeDiv').empty();
                $('#storeDiv').append($(res));
                bindEvents();
            }
        });
    });

    $('#deleteSubmit').on('click', function(event) {
        event.preventDefault();
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
                $('#housesingledelete').submit();
            }
        })
    });

    $('#commentSubmit').on('click', function(event) {
        event.preventDefault();
        if($('#currentUser').html() === undefined){
            return Swal.fire({
                icon: 'error',
                title: 'Please sign in first',
                showConfirmButton: false,
                timer: 1500,
            });
        }
        const text = $('#comment').val();
        $('#comment').val("");
        if(text){
            $.ajax({
                url: $('#commentForm').attr('action'),
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    houseId: $('#houseId').val(),
                    text: text
                })
            })
            .then(function (res) {
                $('#commentDiv').append($(res));
                $('#commentDiv').children().last().find('.userRemoveComment').submit(function(event) {
                    event.preventDefault();
                    $(this).addClass('toRemove');
                    $.ajax({
                        url: $(this).attr('action'),
                        type: 'DELETE',
                        success: function(res) {
                            $('.toRemove').closest('.row').fadeOut(500, function() {
                                $(this).remove();
                            });
                        }
                    });
                });
            });
        }
        else {
            return Swal.fire({
                icon: 'error',
                title: 'Please enter something to make a comment',
                showConfirmButton: false,
                timer: 1500,
            });
        }
    });
    
    $('.userRemoveComment').submit(function(event) {
        event.preventDefault();
        $(this).addClass('toRemove');
        $.ajax({
            url: $(this).attr('action'),
            type: 'DELETE',
            success: function(res) {
                $('.toRemove').closest('.row').fadeOut(500, function() {
                    $(this).remove();
                });
            }
        });
    });
})(window.jQuery);