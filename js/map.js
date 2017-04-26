$(function() {

    var $blockCities = $('#mapBlockCities');
    var $blockBranches = $('#mapBlockBranches');

    var $citiesForm = $('#mapCitiesForm');
    var $branchesForm = $('#mapBranchesForm');
    var $citiesList = $('#mapCitiesList');
    var $branchesList = $('#mapBranchesList');

    $('.js-back-to-cities').on('click', function() {
        $blockCities.fadeIn(200);
        $blockBranches.fadeOut(200);

        $citiesForm.show();
        $branchesForm.hide();
    });

    $('.js-load-city-map').on('click', function() {
        var cityId = $(this).data('cityId');

        $('.js-back-to-cities > span').text($(this).data('cityTitle'));

        $.ajax({
            url: '/local/components/linemedia.carsale/evaluate.main/ajax/fields/ajax.php',
            data: {
                action: 'get-branches',
                id: cityId
            }
        }).done(function(data) {
            if (data.success) {
                var $list = $branchesList;
                var ymap = document.getElementById('mapBranches').map;

                $list.html('');

                for (var i in data.result) {
                    var branch = data.result[i];
                    $list.append($('<div>')
                        .attr({
                            'class': 'search-list__item js-select-branch js-search-item',
                            'data-branch-id': branch.value,
                            'data-remote': branch.remote || 'n'
                        })
                        .text(branch.text + (branch.info ? ' (' + branch.info + ')' : ''))
                    );
                }

                $list.append($('<div>')
                    .attr({
                        'class': 'search-list__item js-search-no-results',
                        'style': 'display: none'
                    })
                    .text('Ничего не найдено')
                );

                $('#mapBranches').renderCustomYMap({
                    'center': data.city_center,
                    'points': data.result,
                    'balloonTemplate': 'branch.info',
                    'customControlsCssClass': 'container'
                });

                $blockCities.fadeOut(200);
                $blockBranches.fadeIn(200);

                $citiesForm.hide();
                $branchesForm.show();
            }
        });
    });

    $(document).on('ymap.render.complete', function(e, params) {
        var element = document.getElementById(params.id);

        if (!element || params.id !== 'mapBranches') {
            return false;
        }

        var map = element.map;
        var branchesPoints = element.branches;

        $branchesList.find('.js-select-branch').off('click').on('click', function(e) {
            e.preventDefault();

            var id = $(this).attr('data-branch-id');
            var branch = branchesPoints[id];
            var coords = branch.geometry.getCoordinates();

            map.panTo(coords);
            branch.balloon.open();
        });
    });

});
$(function() {
    $.fn.renderCustomYMap = function(config) {

        var _this = this.get(0);
        var params = $.extend({
            'type': 'points',
            'scrollZoom': false,
            'center': [58.603581, 49.667978],
            'points': [],
            'balloonTemplate': false,
            'customControlsCssClass': '',
            'customZoomControl': true
        }, config || {});

        if (_this.map) {
            _this.map.destroy();
        }
        $(_this).html('');

        var methods = {
            'getBalloonTemplate': function(template, point) {
                var templateHTML = '<div class="balloon">' +
                    '<div class="balloon__close js-close-balloon" data-map="#' + _this.id + '"></div>' +
                    '<div class="balloon__title">' + point.text + '</div>';

                switch (template) {
                    case 'select.branch':
                        templateHTML +=
                            '<div class="balloon__button">' +
                                '<a href="#" class="js-select-branch" data-branch-id="' + point.value + '">Выбрать</a>' +
                            '</div>';
                        break;

                    case 'branch.info':
                        templateHTML +=
                            '<div class="balloon__text">' + point.info + '</div>' +
                            '<div class="balloon__text">' + point.phone + '</div>';
                        break;

                    default:
                        break;
                }

                templateHTML += '<div class="balloon__pin js-close-balloon" data-map="#' + _this.id + '"></div>' +
                    '</div>';

                return templateHTML;
            },
            'buildCitiesMap': function() {
                var points = params.points;
                var center = [62.667978, 88.603581];

                var map = new ymaps.Map(_this.id, {
                    center: center,
                    zoom: 4
                });

                for (var i in points) {
                    var point = points[i];

                    if (point.coords.lat !== 0 && point.coords.lng !== 0) {
                        var branch = new ymaps.Placemark([point.coords.lat, point.coords.lng], {
                            iconContent: point.text
                        }, {
                            balloonLayout: ymaps.templateLayoutFactory.createClass(
                                '<div class="balloon">' +
                                '<div class="balloon__close js-close-balloon" data-map="#' + _this.id + '"></div>' +
                                '<div class="balloon__title">' + point.text + '</div>' +
                                '<div class="balloon__button">' +
                                '<a href="#" class="js-select-branch" data-branch-id="' + point.value + '">Выбрать</a>' +
                                '</div>' +
                                '<div class="balloon__pin js-close-balloon" data-map="#' + _this.id + '"></div>' +
                                '</div>'
                            ),
                            hideIconOnBalloonOpen: false,
                            iconLayout: 'default#imageWithContent',
                            iconImageHref: '/local/templates/main_2017/images/pointer_small.png',
                            iconImageSize: [18, 25]
                        });

                        map.geoObjects.add(branch);
                    }
                }

                methods.setMapOptions(map);

                ymaps.regions.load('RU', {
                    lang: 'ru'
                }).then(function (result) {
                    result.geoObjects.each(function(item) {
                    });

                    map.geoObjects.add(result.geoObjects);
                    result.geoObjects.options.set('fillColor', 'eceef3');
                    result.geoObjects.options.set('fillOpacity', '1');
                    result.geoObjects.options.set('hasHint', false);
                    result.geoObjects.options.set('hasBalloon', false);
                    result.geoObjects.options.set('strokeColor', 'ffffff');
                    result.geoObjects.options.set('strokeWidth', '1');

                    map.options.set('restrictMapArea', false)
                });

                _this.map = map;
            },
            'buildPointsMap': function() {
                var points = params.points;
                var center = params.points.length == 1 ? [points[0].coords.lat, points[0].coords.lng] : params.center;

                var map = new ymaps.Map(_this.id, {
                    center: center,
                    zoom: 10
                });

                var branches = {};

                for (var i in points) {
                    var point = points[i];

                    if (point.coords.lat !== 0 && point.coords.lng !== 0) {
                        var branch = new ymaps.Placemark([point.coords.lat, point.coords.lng], {
                            name: point.text
                        }, {
                            balloonLayout: ymaps.templateLayoutFactory.createClass(
                                methods.getBalloonTemplate(params.balloonTemplate, point)
                            ),
                            hideIconOnBalloonOpen: false,
                            iconLayout: 'default#image',
                            iconImageHref: '/local/templates/main_2017/images/pointer.png',
                            iconImageSize: [40, 50]
                        });

                        branch.events.add('click', function (e) {
                            map.panTo(e.get('coords'));
                        });

                        branches[point.value] = branch;
                        map.geoObjects.add(branch);
                    }
                }

                methods.setMapOptions(map);
                methods.renderCustomControls(map);

                _this.map = map;
                _this.branches = branches;

                $(document).trigger('ymap.render.complete', {
                    'id': _this.id
                })
            },
            'setMapOptions': function(map) {
                if (!params.scrollZoom) {
                    map.behaviors.disable('scrollZoom');
                }

                map.controls
                    .remove('mapTools')
                    .remove('miniMap')
                    .remove('scaleLine')
                    .remove('searchControl')
                    .remove('trafficControl')
                    .remove('typeSelector');
            },
            'renderCustomControls': function(map) {
                var $controls = $('<div>').addClass('ymap__controls ' + (params.customControlsCssClass || ''));

                if (params.customZoomControl) {
                    var $zoom = $('<div>').addClass('ymap__control ymap__control--zoom');

                    var $zoomIn = $('<div>')
                        .addClass('ymap__zoom ymap__zoom--in')
                        .append('<i></i>')
                        .on('click', function(e) {
                            e.preventDefault();
                            if (map.getZoom() < 19) {
                                map.setZoom(map.getZoom() + 1);
                            }
                        });

                    var $zoomOut = $('<div>')
                        .addClass('ymap__zoom ymap__zoom--out')
                        .append('<i></i>')
                        .on('click', function(e) {
                            e.preventDefault();
                            if (map.getZoom() > 3) {
                                map.setZoom(map.getZoom() - 1);
                            }
                        });

                    $zoom.append($zoomIn, $zoomOut);

                    $controls.append($zoom);
                }

                $(_this).append($controls);
            },
            'init': function() {
                if ($(_this).length < 1) {
                    return false;
                }

                switch (params.type) {
                    case 'cities':
                        window.initYmaps(methods.buildCitiesMap);
                        break;
                    case 'points':
                    default:
                        window.initYmaps(methods.buildPointsMap);
                        break;
                }

                $(_this).attr('data-map-type', params.type);
            }
        };

        return methods.init.apply(_this);
    }
});

$(document).on('click', '.js-close-balloon', function(e) {
    var map = $($(this).data('map')).get(0).map;
    map.balloon.close();
});

$(function() {

    $(document).on('click', '.js-select-city', function(e) {
        e.preventDefault();

        var cityId = $(this).data('cityId');
        var cityPhone = $(this).data('cityPhone');
        var cityName = $(this).text();

        $.cookie('city_id', cityId, {
            path: '/'
        });

        $(document).trigger('city.changed', {
            'id': cityId,
            'phone': cityPhone,
            'name': cityName
        });
    });

    $(document).on('city.changed', function(e, params) {
        if (params) {
            var $locationBlock = $('#location');
            var $currentCity = $locationBlock.find('.js-current-city');
            var $locationCities = $locationBlock.find('.js-select-city');
            var $currentCityInList = $locationBlock.find('.js-select-city[data-city-id=' + params.id + ']');

            $currentCity.text(params.name);
            $locationCities.removeClass('js-selected');
            $currentCityInList.addClass('js-selected');

            $('#modalLocation').modal('hide');
        }
    })

});