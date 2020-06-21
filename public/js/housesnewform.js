let latlng;
let map;

$('#back').on('click', () => {
    $('#addrDiv').show();
    $('#judgeDiv').addClass('d-none');
    $('#nextDiv').addClass('d-none');
    map = new google.maps.Map(document.getElementById('houseNewMap'), {
        zoom: 12,
        center: {lat: 40.728157, lng: -74.077644} // jersey city lat lng
    });
});
$('#next').on('click', () => {
    $('#addrDiv').hide();
    $('#judgeDiv').addClass('d-none');
    $('#houseNewMap').hide();
    $('#nextDiv').removeClass('d-none');
});
$('#backToAddr').on('click', () => {
    $('#addrDiv').show();
    $('#judgeDiv').addClass('d-none');
    $('#houseNewMap').show();
    $('#nextDiv').addClass('d-none');
    map = new google.maps.Map(document.getElementById('houseNewMap'), {
        zoom: 12,
        center: {lat: 40.728157, lng: -74.077644} // jersey city lat lng
    });
});

function initMap() {
    map = new google.maps.Map(document.getElementById('houseNewMap'), {
        zoom: 12,
        center: {lat: 40.728157, lng: -74.077644} // jersey city lat lng
    });
    const geocoder = new google.maps.Geocoder();
    $('#check').on('click', () => {
        geocodeAddress(geocoder, map);
    });
}

function geocodeAddress(geocoder, resultsMap) {
    if($('#address').val() !== ""){
        geocoder.geocode({'address': $('#address').val()}, (results, status) => {
            if (status === 'OK') {
                latlng = results[0].geometry.location;
                if(latlng.lat()>=40.77 || latlng.lat()<=40.665 || latlng.lng() >=-74.025 || latlng.lng() <=-74.11){
                    latlng = undefined;
                    return alert('Geocode was not successful for the following reason: Not in Jersey City area');
                }
                resultsMap.zoom = 18;
                resultsMap.setCenter(latlng);
                new google.maps.Marker({
                    map: resultsMap,
                    position: latlng
                });
                $('#judgeDiv').removeClass('d-none');
                $('#addrDiv').hide();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}

$('button[type=submit]').on('click', (event) => {
    event.preventDefault();

    $('#houseNewFormSubmitError').hide();
    $('#houseNewFormError').hide();

    if(latlng !== undefined){
        $('#lat').val(latlng.lat());
        $('#lng').val(latlng.lng());
    }
    
    const arr = $('#image').val().split('.');
    if(!$('#statement').val() || !$('#type').val() || !$('#price').val() || !$('#image').val()){
        $('#houseNewFormSubmitError').html('Error: Please make sure that every field is filled and an image is choosen!');
        $('#houseNewFormSubmitError').show();
        return;
    }
    else if(arr[arr.length - 1] !== 'jpg' && arr[arr.length - 1] !== 'png'){
        $('#houseNewFormSubmitError').html('Error: The file could only be image (jpg, jpeg, png) format!');
        $('#houseNewFormSubmitError').show();
        return;
    }

    if($('#price').val() < 1){
        $('#price').val(1);
    }
    else if($('#price').val() > 9999){
        $('#price').val(9999);
    }
    $('#housesNewForm').submit();
});