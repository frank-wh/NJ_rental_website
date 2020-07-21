$('#nextBtn').hide();
$('#backBtn').hide();
$('#nextDiv').hide();

$('#backBtn').on('click', () => {
    $('#address').prop('readonly', false);
    $('#nextBtn, #backBtn').fadeOut(400, () => {
        $('#checkBtn').fadeIn();
    });
    map = new google.maps.Map(document.getElementById('houseNewMap'), {
        zoom: 12,
        center: {lat: 40.728157, lng: -74.077644}
    });
});
$('#nextBtn').on('click', () => {
    $('#address').prop('readonly', true);
    $('#houseNewMap, #nextBtn, #backBtn').fadeOut(400, () => {
        $('#nextDiv').fadeIn();
    });
});
$('#backToAddrBtn').on('click', () => {
    $('#checkBtn').hide();
    $('#nextDiv').fadeOut(400, () => {
        $('#houseNewMap, #nextBtn, #backBtn').fadeIn();
	});
});

function initMap() {
    map = new google.maps.Map(document.getElementById('houseNewMap'), {
        zoom: 12,
        center: {lat: 40.728157, lng: -74.077644}
    });
    const geocoder = new google.maps.Geocoder();
    $('#checkBtn').on('click', () => {
        geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    if ($('#address').val() !== "") {
        geocoder.geocode({'address': $('#address').val()}, (results, status) => {
            if (status === 'OK') {
                latlng = results[0].geometry.location;
                if (latlng.lat() >= 40.77 || latlng.lat() <= 40.665 || latlng.lng() >= -74.025 || latlng.lng() <= -74.11) {
                    latlng = undefined;
                    return Swal.fire({
                        icon: 'warning',
                        title: 'Geocode was not successful for the following reason: Not in Jersey City area',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
                resultsMap.zoom = 18;
                resultsMap.setCenter(latlng);
                new google.maps.Marker({
                    map: resultsMap,
                    position: latlng
                });
                $('#address').prop('readonly', true);
                $('#checkBtn').fadeOut(400, () => {
                    $('#nextBtn, #backBtn').fadeIn();
                });
            } 
            else {
                return Swal.fire({
                    icon: 'warning',
                    title: 'Geocode was not successful for the following reason: ' + status,
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        });
    }
}

$('#postSubmitBtn').on('click', (event) => {
    event.preventDefault();
    $('#postFormError').hide();
    $('#postFormServerError').hide();
    if (latlng !== undefined) {
        $('#lat').val(latlng.lat());
        $('#lng').val(latlng.lng());
    }
    const arr = $('#image').val().split('.');
    if (!$('#statement').val() || !$('#type').val() || !$('#price').val() || !$('#image').val()) {
        $('#postFormError').html('Please make sure that every field is filled');
        $('#postFormError').show();
        return;
    }
    else if (arr[arr.length - 1] !== 'jpg' && arr[arr.length - 1] !== 'png') {
        $('#postFormError').html('The file could only be image (jpg, jpeg, png) format!');
        $('#postFormError').show();
        return;
    }
    if ($('#price').val() < 1) {
        $('#price').val(1);
    }
    else if ($('#price').val() > 9999) {
        $('#price').val(9999);
    }

    let formdata = new FormData();
    formdata.append('image', $('#image')[0].files[0]);
    formdata.append('address', $('#address').val());
    formdata.append('statement', $('#statement').val());
    formdata.append('lat', $('#lat').val());
    formdata.append('lng', $('#lng').val());
    formdata.append('roomType', $('#type').val());
    formdata.append('price', $('#price').val());
    $.ajax({
        url: $('#postForm').attr('action'),
        type: 'POST',
        contentType: false,
        processData: false,
        data: formdata
    })
    .done((res) => {
        window.location.href = res.redirectURL;
    })
    .fail((jqXHR, textStatus, errorThrown) => {
        $('#postFormServerError').html(jqXHR.responseText);
        $('#postFormServerError').show();
    });
});