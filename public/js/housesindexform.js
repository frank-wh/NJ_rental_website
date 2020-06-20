let houses = JSON.parse($('#allHouses').val());
let map;
let infoObj;
let prevMarker;
let prevLabel;

$('#searchSubmit').on('click', function(event) {
    event.preventDefault();
    $.ajax({
        url: $('#searchForm').attr('action'),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            sort: $('#sort').val(),
            roomType: $('#roomType').val(),
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
        
        const iconDefault = {
            url: '/public/img/icon.png',
            scaledSize: new google.maps.Size(50, 30), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        const labelDefault = {
            text: '$'+ houses[i].price +'',
            fontFamily: 'Open Sans',
            fontSize: '16px',
            color: 'white'
        };

        const iconEvent = {
            url: '/public/img/iconEvent.png',
            scaledSize: new google.maps.Size(50, 30),
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0) // anchor
        };
        const labelEvent = {
            text: '$'+ houses[i].price +'',
            fontFamily: 'Open Sans',
            fontSize: '16px',
            color: 'black' 
        }

        const marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: iconDefault,
            label: labelDefault,
            isClicked: false
        });

        let imageName = houses[i].images[0] ? '/houses/image/'+ houses[i].images[0] : '/public/img/image-not-found.png';

        const infoWindow = new google.maps.InfoWindow({
            content: '<div class="infoWindow"><a href="/houses/'+ houses[i]._id +'">' +
            '<div><img src='+ imageName +'></div>' +
            '<div><strong>'+ houses[i].address +'</strong></div>' +
            '<div>'+ houses[i].roomType +'</div>' +
            '<div>$'+ houses[i].price + ' / month</div>'
            +'</a></div>'
        });

        marker.addListener('mouseover', function() {
            if(!this.isClicked){
                marker.setIcon(iconEvent);
                marker.setLabel(labelEvent);
            }
        });

        marker.addListener('mouseout', function() {
            if(!this.isClicked){
                marker.setIcon(iconDefault);
                marker.setLabel(labelDefault);
            }
        });

        marker.addListener('click', function() {
            this.isClicked = true;
            
            if(infoObj !== undefined){
                if(prevMarker !== this) {
                    prevMarker.isClicked = false;
                    prevMarker.setIcon(iconDefault);
                    prevMarker.setLabel(prevLabel);
                }
                infoObj.close();
            }
            infoWindow.open(map, marker);

            infoObj = infoWindow;
            prevMarker = this;
            prevLabel = labelDefault;

            this.setIcon(iconEvent);
            this.setLabel(labelEvent);

            map.panTo(this.position);
        });

        infoWindow.addListener('closeclick', function() {
            marker.isClicked = false;
            marker.setIcon(iconDefault);
            marker.setLabel(labelDefault);
        });
    }
}