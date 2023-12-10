import React, { useEffect, useRef } from 'react';
import markerAnimate from './markerAnimate'; // Adjust the path as needed
import waypoints from './waypoints.json';
const loadGoogleMapsScript = (callback) => {
    if (window.google && window.google.maps) {
        callback();
    } else if (!window.isGoogleMapsScriptLoading) {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB9iCP2O8w1BY8GAfsCaVKjHgdCVbfRvxM&libraries=geometry,places&callback=initMap';
        script.async = true;
        document.body.appendChild(script);
        window.isGoogleMapsScriptLoading = true;

        window.initMap = () => {
            window.isGoogleMapsScriptLoading = false;
            callback();
        };
    }
};

const GoogleMapComponent = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        loadGoogleMapsScript(() => {
            const google = window.google;
            const startLocation = new google.maps.LatLng(53.871963457471786, 10.689697265625);
            const mapOptions = {
                zoom: 4,
                center: startLocation
            };
            const map = new google.maps.Map(mapRef.current, mapOptions);

            const marker = new google.maps.Marker({
                position: startLocation,
                map: map
            });

            var waypoints = [
                { location: new google.maps.LatLng(53.5511, 9.9937), stopover: true },
                { location: new google.maps.LatLng(52.5200, 13.4050), stopover: true },
                // Add more waypoints as needed
            ];
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer = new google.maps.DirectionsRenderer({
                polylineOptions: {
                    strokeColor: "blue"
                }
            });
            directionsRenderer.setMap(map);

            var routePath = [];
            var currentPathIndex = 0;

            function generatePath(startLatLng, endLatLng) {
                var request = {
                    origin: startLatLng,
                    destination: endLatLng,
                    waypoints: waypoints,
                    optimizeWaypoints: false,
                    travelMode: 'DRIVING'
                };

                directionsService.route(request, function (result, status) {
                    if (status === 'OK') {
                        animateRoute(result);
                    }
                });
            }

            function animateRoute(result) {
                directionsRenderer.setDirections(result);
                routePath = [];
                var legs = result.routes[0].legs;
                for (var i = 0; i < legs.length; i++) {
                    var steps = legs[i].steps;
                    for (var j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        for (var k = 0; k < nextSegment.length; k++) {
                            routePath.push(nextSegment[k]);
                        }
                    }
                }
                currentPathIndex = 0;
            }

            function findNextPosition(currentPosition, distance) {
                var currentLatlng = new google.maps.LatLng(currentPosition.lat(), currentPosition.lng());
                for (var i = currentPathIndex; i < routePath.length; i++) {
                    var pathLatlng = new google.maps.LatLng(routePath[i].lat(), routePath[i].lng());
                    var accumulatedDistance = google.maps.geometry.spherical.computeDistanceBetween(currentLatlng, pathLatlng);

                    if (accumulatedDistance >= distance) {
                        currentPathIndex = i;
                        return routePath[i];
                    }
                }
                return null;
            }

            function moveMarkerToPosition(position) {
                var latlng = new google.maps.LatLng(position.lat(), position.lng());
                marker.setPosition(latlng);
            }

            function handleKeyPress(event) {
                if (event.keyCode === 39) { // Right arrow key
                    var nextPosition = findNextPosition(marker.getPosition(), 1000);
                    if (nextPosition) {
                        moveMarkerToPosition(nextPosition);
                    }
                }
            }

            document.addEventListener('keydown', handleKeyPress);

            // Start the path generation
            generatePath(startLocation, new google.maps.LatLng(52.355, 9.717));

            // Clean up event listener on unmount
            return () => {
                document.removeEventListener('keydown', handleKeyPress);
            };
        });
    }, []);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />;
};

export default GoogleMapComponent;