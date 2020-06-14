let houses = JSON.parse($('#allHouses').val());
let map;
let infoObj;

$('#sortSubmit').on('click', function(event) {
    event.preventDefault();
    $.ajax({
        url: $('#sortForm').attr('action'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            sort: $('#sort').val()
        })
    })
    .then(function(res) {
        $('#housesDiv').empty();
        $('#housesDiv').append($(res));
    });
});

$('#searchSubmit').on('click', function(event) {
    event.preventDefault();
    $.ajax({
        url: $('#searchForm').attr('action'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            search: $('#search').val(),
            low: $('#low').val(),
            high: $('#high').val()
        })
    })
    .then(function(res) {
        $('#housesDiv').empty();
        $('#housesDiv').append($(res));
    }); 
});

function initMap() {
    map = new google.maps.Map(document.getElementById('houseIndexMap'), {
        zoom: 13,
        center: {lat: 40.724057, lng: -74.063644} // jersey city lat lng
    });

    for (let i = 0; i < houses.length; i++) {
        const latlng = {lat: houses[i].lat, lng: houses[i].lng};
        
        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: {
                url: '/public/img/icon.png',
                scaledSize: new google.maps.Size(50, 30), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(0, 0) // anchor
            },
            label: {
                text: '$'+ houses[i].price +'',
                fontFamily: 'Open Sans',
                // fontWeight: 'bold',
                fontSize: '16px',
                color: 'white'
            }
        });

        const infoWindow = new google.maps.InfoWindow({
            content: 
                houses[i].images[0]?
                    '<div class="infoWindow"><a href="/houses/'+ houses[i]._id +'">' +
                    '<div><img src="/houses/image/'+ houses[i].images[0] +'"></div>' +
                    '<div>'+ houses[i].address +'</div>' +
                    '<div>'+ houses[i].roomType +'</div>' +
                    '<div>$'+ houses[i].price + ' / month</div>'
                    +'</a></div>'
                :
                    '<div class="infoWindow"><a href="/houses/'+ houses[i]._id +'">'+
                    '<div>'+ houses[i].address +'</div>' +
                    '<div>'+ houses[i].roomType +'</div>' +
                    '<div>$'+ houses[i].price + ' / month</div>'
                    +'</a></div>'
        });

        marker.addListener('click', function() {
            if(infoObj !== undefined){
                infoObj.set('marker', null);
                infoObj.close();
                infoObj.length = 0;
            }
            infoWindow.open(map, marker);
            infoObj = infoWindow;
            map.panTo(this.position);
        });
    }
}