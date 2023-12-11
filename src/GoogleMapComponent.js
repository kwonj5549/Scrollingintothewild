import React, { useEffect, useRef } from 'react';
import markerAnimate from './markerAnimate'; // Adjust the path as needed
import waypoints from './waypoints.json';

var routePath = [];
var currentPathIndex = 0;

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
const GoogleMapComponent = ({miles}) => {
    const markerRef = useRef(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const previousMilesRef = useRef(0);
    useEffect(() => {
        loadGoogleMapsScript(() => {
            const google = window.google;

            const firstWaypoint = waypoints[0];
            const startLocation = new google.maps.LatLng(firstWaypoint.lat, firstWaypoint.lng);

            const mapOptions = {
                zoom: 5,
                center: startLocation,
                disableDefaultUI: true, // Disables all default UI controls
                zoomControl: false, // Hides zoom controls
                mapTypeControl: false, // Hides map type controls
                scaleControl: false, // Hides scale control
                streetViewControl: false, // Hides the street view control
                rotateControl: false, // Hides the rotate control
                fullscreenControl: false,
                scrollwheel: false,
            };
            const map = new google.maps.Map(mapRef.current, mapOptions);
            const marker = new google.maps.Marker({
                position: startLocation,
                map: map
            });

            mapInstanceRef.current = map;



            function generatePath() {
                const googleWaypoints = waypoints.map(wp => new google.maps.LatLng(wp.lat, wp.lng));
                routePath = googleWaypoints;
                const path = new google.maps.Polyline({
                    path: googleWaypoints,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                path.setMap(map);
            }

            generatePath();

            markerRef.current = marker;
        });
    }, []);

    useEffect(() => {
        const google = window.google;
        const marker = markerRef.current;
        const map = mapInstanceRef.current
        if (!marker) return;

        // Calculate the difference in miles
        const milesDifference = miles - previousMilesRef.current;
        console.log(milesDifference)
        previousMilesRef.current = miles; // Update the previous miles

        function moveMarkerToPosition(position) {
            const latlng = new google.maps.LatLng(position.lat(), position.lng());
            marker.setPosition(latlng);
            map.setCenter(latlng);
        }
        function findNextPosition(currentPosition, distance) {
            const google = window.google;
            let currentLatlng = new google.maps.LatLng(currentPosition.lat(), currentPosition.lng());

            let accumulatedDistance = 0;
            let nextIndex = distance >= 0 ? currentPathIndex : currentPathIndex - 1;
            let direction = distance >= 0 ? 1 : -1;  // 1 for forward, -1 for backward

            while (distance !== 0 && nextIndex >= 0 && nextIndex < routePath.length) {
                const nextLatlng = new google.maps.LatLng(routePath[nextIndex].lat(), routePath[nextIndex].lng());
                const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(currentLatlng, nextLatlng);

                if (Math.abs(distance) <= segmentDistance + accumulatedDistance) {
                    // Found the segment where the marker should move
                    const remainingDistance = Math.abs(distance) - accumulatedDistance;
                    const fraction = remainingDistance / segmentDistance;
                    currentPathIndex = direction === 1 ? nextIndex : nextIndex + 1;
                    return interpolate(currentLatlng, nextLatlng, fraction);
                }

                accumulatedDistance += segmentDistance;
                currentLatlng = nextLatlng;
                nextIndex += direction;
            }

            return null; // Return null if the position cannot be found
        }

        function interpolate(start, end, fraction) {
            const lat = start.lat() + (end.lat() - start.lat()) * fraction;
            const lng = start.lng() + (end.lng() - start.lng()) * fraction;
            return new google.maps.LatLng(lat, lng);
        }


        const milesToMeters = (miles) => {
            return miles * 1609.34;
        }
        const nextPosition = findNextPosition(marker.getPosition(), milesToMeters(milesDifference));
        if(nextPosition){
            moveMarkerToPosition(nextPosition);
        }
    }, [miles]);

    return <div className='googlemap' ref={mapRef} />;
};

export default GoogleMapComponent;