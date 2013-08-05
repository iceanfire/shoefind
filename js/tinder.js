/**
 * requestAnimationFrame and cancel polyfill--NOT SURE WHAT THIS IS, BUT I THINK IT IMPROVES PERFORMANCE
 */
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
				window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() { callback(currTime + timeToCall); },
					timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());





var element = $('#slider');
var nextElement = $('.behind');

function destroyOld(){
	element.remove();
	$('.comingUp').attr('id','slider');
	element = $('#slider');
	element.hammer({drag_lock_to_axis:true}).on("release dragleft dragright swipeleft swiperight", handleHammer);
}

function buildNew(){
	
}


function animate(){
	element.removeClass('animateRock');
	element.addClass('animate');
}

function deAnimate(){
	element.removeClass('animate');
	element.addClass('animateRock');
}

function rotate(deg){
	element.css('-webkit-transform','rotate('+deg+'deg)');
}


function handleHammer(ev){
	//disable browser scrolling
	ev.gesture.preventDefault();
	picturePosition = 0;
	switch(ev.type){
		case 'dragright':
		case 'dragleft':
			//stick to the finger
			//if(element.css('left')!="auto")	{var picturePosition = parseInt(element.css('left').replace("px",""));}
			//else{ var picturePosition = 0; }
			
			$('.behind').removeClass('behind');

			//

			deAnimate();
			element.css('position','absolute');
			element.css('left',picturePosition+ev.gesture.deltaX);

			if(ev.gesture.deltaX<0){
				rotate('-10');
			}
			else{
				rotate('+10');
			}

			
			if(Math.abs(ev.gesture.deltaX)>(element.width()/2)){
				if(ev.gesture.deltaX<0){
					rotate('-20');
				}
				else{
					rotate('20');
				}
			}

			console.log(ev.gesture.deltaX);

			break;
		case 'swipeleft':
			animate()
			element.css('left','-1000px');
			ev.gesture.stopDetect();
			break;
		case 'swiperight':
			animate();
			element.css('left','1000px');
			ev.gesture.stopDetect();
			break;
		case 'release':
			animate();
			if(Math.abs(ev.gesture.deltaX)<(element.width()/2)){
				element.css('position','static');
				element.css('left','auto');
				rotate('0');
				$('.comingUp').addClass('behind');
			}
			else{
				
				if(ev.gesture.deltaX<0){
					element.css('left','-1000px');	
				}
				else{
					element.css('left','1000px');
				}
				destroyOld();
			}
			break;

	}
}

element.hammer({drag_lock_to_axis:true}).on("release dragleft dragright swipeleft swiperight", handleHammer);

