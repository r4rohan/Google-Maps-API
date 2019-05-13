var map, infoWindow;

function createMap() {
    var options = {
        center: { lat: 40.7128, lng: 74.0060 },
        zoom: 12
    };

    map = new google.maps.Map(document.getElementById('map'), options);
    
    //getting current location
    infoWindow = new google.maps.InfoWindow;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            var position = {
                lat: p.coords.latitude,
                lng: p.coords.longitude
            };
            infoWindow.setPosition(position);
            infoWindow.setContent('Your Location!');
            infoWindow.open(map);
        }, function () {
            handleLocationError('Geolocation service failed', map.center());
        })
    } else {
        handleLocationError('No Geolocation available', map.center());
    }


    //searching of places
    var input = document.getElementById('search');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    //listener for places changed
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if(places.length === 0)
        return;

        markers.forEach(function (m) { m.setMap(null); });
        markers = [];

        //bounce objects, which is coordinate boundary of map
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function (p) {
            if(!p.geometry)
                return;

                //pushing a marker to marker array
                markers.push(new google.maps.Marker({
                    map: map,
                    title: p.name,
                    position: p.geometry.location
                })); 

                if(p.geometry.viewport)
                    bounds.union(p.geometry.viewport);
                else
                    bounds.extend(p.geometry.location);
        });
        map.fitBounds(bounds);
    });
}

function handleLocationError(content, position) {
    infoWindow.setPosition(position);
    infoWindow.setContent(content);
    infoWindow.open(map);
}