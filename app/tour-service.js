import angular from 'angular';

export default function uiTourService($controller, $q) {
    'ngInject';

    var service = {},
        tours = [];

    /**
     * If there is only one tour, returns the tour
     */
    service.getTour = function () {
        return tours[0];
    };

    /**
     * Return next active tour from tours array
     * if current tour status is OFF
    */
    service.getNextActiveTour = function () {
        var toursArrayLength = tours.length, i;

        if (toursArrayLength > 1) {
            for (i = 0; i < toursArrayLength; i = i + 1) {
                if (tours[i].getStatus === tours[0].Status.OFF &&
                    typeof tours[i + 1] &&
                    tours[i + 1].getStatus === tours[0].Status.ON) {
                    return tours[i + 1];
                }
            }
        }
        return false;
    };

    service.hasNextTour = function (name) {
        var tourIndex = tours.indexOf(name);

        if (typeof tours[tourIndex + 1] === 'undefined') {
            return false;
        }
        return true;
    };

    service.getNextTour = function (name) {
        if (service.hasNextTour(name)) {
            var tourIndex = tours.indexOf(name);

            return tours[tourIndex + 1];
        }
        return false;
    };

    /**
     * Look up a specific tour by name
     *
     * @param {string} name Name of tour
     */
    service.getTourByName = function (name) {
        return tours.filter(function (tour) {
            return tour.options.name === name;
        })[0];
    };

    /**
     * Finds the tour available to a specific element
     *
     * @param {jqLite | HTMLElement} element Element to use to look up tour
     * @returns {*}
     */
    service.getTourByElement = function (element) {
        return angular.element(element).controller('uiTour');
    };

    /**
     * Creates a tour that is not attached to a DOM element (experimental)
     *
     * @param {string} name Name of the tour (required)
     * @param {{}=} config Options to override defaults
     */
    service.createDetachedTour = function (name, config) {
        if (!name) {
            throw {
                name: 'ParameterMissingError',
                message: 'A unique tour name is required for creating a detached tour.'
            };
        }

        config = config || {};

        config.name = name;
        return $controller('uiTourController').init(config);
    };

    /**
     * Checks to see if there are any tours that are waiting.
     * Useful when checking if navigation is due to tour or browser
     *
     * @returns {boolean} if there is one or more waiting tours
     */
    service.isTourWaiting = function () {
        return tours.reduce((isWaiting, tour) => isWaiting || tour.getStatus() === tour.Status.WAITING, false);
    };

    /**
     * Ends all tours
     *
     * @returns {Promise} resolved once all tours have ended
     */
    service.endAllTours = function () {
        return $q.all(tours.map(tour => tour.end()));
    };

    /**
     * Used by uiTourController to register a tour
     *
     * @protected
     * @param tour
     */
    service._registerTour = function (tour) {
        tours.push(tour);
    };

    /**
     * Used by uiTourController to remove a destroyed tour from the registry
     *
     * @protected
     * @param tour
     */
    service._unregisterTour = function (tour) {
        tours.splice(tours.indexOf(tour), 1);
    };

    return service;

}
