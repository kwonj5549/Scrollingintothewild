const markerAnimate = (google) => {
    if (!google || !google.maps) {
        throw new Error('Google Maps API is not available.');
    }

    google.maps.Marker.prototype.animateTo = function(newPosition, options) {
        let defaultOptions = {
            duration: 1000,
            easing: 'linear',
            complete: null,
            pan: null
        };

        options = options || {};

        // Complete missing options
        for (let key in defaultOptions) {
            if (defaultOptions.hasOwnProperty(key)) {
                options[key] = options[key] || defaultOptions[key];
            }
        }

        // Throw an exception if easing function doesn't exist


        // Validate the pan option
        if (options.pan !== null) {
            if (options.pan !== 'center' && options.pan !== 'inbounds') {
                throw new Error('Invalid option for pan. Use "center", "inbounds", or null.');
            }
        }

        // Ensure requestAnimationFrame is available
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

        // Save current position
        let startPositionLat = this.getPosition().lat();
        let startPositionLng = this.getPosition().lng();
        let newPositionLat = newPosition.lat();
        let newPositionLng = newPosition.lng();

        // Handle crossing the 180° meridian
        if (Math.abs(newPositionLng - startPositionLng) > 180) {
            if (newPositionLng > startPositionLng) {
                newPositionLng -= 360;
            } else {
                newPositionLng += 360;
            }
        }

        const animateStep = (marker, startTime) => {
            let elapsed = (new Date()).getTime() - startTime;
            let durationRatio = elapsed / options.duration;
            let easingDurationRatio = options.easing === 'linear';

            if (durationRatio < 1) {
                let deltaLat = startPositionLat + (newPositionLat - startPositionLat) * easingDurationRatio;
                let deltaLng = startPositionLng + (newPositionLng - startPositionLng) * easingDurationRatio;
                marker.setPosition(new google.maps.LatLng(deltaLat, deltaLng));

                if (window.requestAnimationFrame) {
                    marker.animationHandler = window.requestAnimationFrame(() => animateStep(marker, startTime));
                } else {
                    marker.animationHandler = setTimeout(() => animateStep(marker, startTime), 17);
                }
            } else {
                marker.setPosition(newPosition);
                if (typeof options.complete === 'function') {
                    options.complete();
                }
            }
        };

        // Stop any running animation
        if (window.cancelAnimationFrame) {
            window.cancelAnimationFrame(this.animationHandler);
        } else {
            clearTimeout(this.animationHandler);
        }

        animateStep(this, (new Date()).getTime());
    };
};

export default markerAnimate;