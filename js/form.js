$(document).ready(function(){
					//jQuery time
			var current_fs, next_fs, previous_fs; //fieldsets
			var left, opacity, scale; //fieldset properties which we will animate
			var animating; //flag to prevent quick multi-click glitches

			$(".next").click(function(){
				if(animating) return false;
				animating = true;
				
				current_fs = $(this).parents('.b-fieldset');
				console.log(current_fs.attr('class'))
				next_fs = current_fs.next();
				
				//activate next step on progressbar using the index of next_fs
				$(".b-anketa__progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
				
				//show the next fieldset
				next_fs.show(); 
				//hide the current fieldset with style
				current_fs.animate({opacity: 0}, {
					step: function(now, mx) {
						//as the opacity of current_fs reduces to 0 - stored in "now"
						//1. scale current_fs down to 80%
						scale = 1 - (1 - now) * 0.2;
						//2. bring next_fs from the right(50%)
						left = (now * 50)+"%";
						//3. increase opacity of next_fs to 1 as it moves in
						opacity = 1 - now;
						current_fs.css({
			        'transform': 'scale('+scale+')',
			        'position': 'absolute'
			      });
						next_fs.css({'left': left, 'opacity': opacity});
					}, 
					duration: 800, 
					complete: function(){
						current_fs.hide();
						animating = false;
					}, 
					//this comes from the custom easing plugin
					easing: 'easeInOutBack'
				});
			});

			$(".submit").click(function(){
				return false;
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
			    });
			});
			
			
	})