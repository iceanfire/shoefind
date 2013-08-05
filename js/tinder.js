var element = $('#slider');

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
			element.css('opacity','.9');

			if(ev.gesture.deltaX<0){
				rotate('-10');
			}
			else{
				rotate('+10');
			}

			
			if(Math.abs(ev.gesture.deltaX)>(element.width()/2)){
				element.css('opacity','.5');
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
			break;
		case 'swiperight':
			animate();
			element.css('left','1000px');
			break;
		case 'release':
			animate();
			if(Math.abs(ev.gesture.deltaX)<(element.width()/2)){
				element.css('position','static');
				element.css('opacity','1');
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
			}
			break;

	}
}

element.hammer({drag_lock_to_axis:true}).on("release dragleft dragright swipeleft swiperight", handleHammer);

