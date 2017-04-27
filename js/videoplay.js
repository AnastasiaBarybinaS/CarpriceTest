$(document).ready(function(){
	var plaly = true, stop;
  	function stopPlayer(){
				$('.b-banner__video').get(0).pause();
				$('.b-banner__play').removeClass("pause");
				plaly = true;
				setTimeout(function(){
					$('.b-banner__header').removeClass('fadeOutUp').addClass('fadeInDown');
					$('.b-banner__header').addClass("animated");
					$('.b-anketa .b-container').removeClass('inDown').addClass('inUp');
					$('.b-anketa .b-container').addClass("animated");
					$('.b-banner').removeClass('b-light');
					clearInterval(stop);
				},200)
			}

	function playVideo(){
		console.log("playlu");
		if (plaly){
			$('.b-banner__header').removeClass('fadeInDown').addClass('fadeOutUp');
			$('.b-banner__header').addClass("animated");
			$('.b-anketa .b-container').removeClass('inUp').addClass('inDown');
			$('.b-anketa .b-container').addClass("animated");
			setTimeout(function(){
				$('.b-banner__video').get(0).play();
				$('.b-banner__play').addClass("pause");
				$('.b-banner').addClass('b-light');
				plaly = false;
			},200)
			stop = setTimeout(function(){
				stopPlayer();
			},110000)
			
		} else {
			stopPlayer();
		}
	}
});
