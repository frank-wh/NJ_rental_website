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
            return alert("please sign in first");
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
            return alert("please sign in first");
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

    $('#commentSubmit').on('click', function(event) {
        event.preventDefault();
        if($('#currentUser').html() === undefined){
            return alert("please sign in first");
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
            alert("please enter something to make a comment");
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