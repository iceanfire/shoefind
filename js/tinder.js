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





var element = null;
var productName = null;

//this is a sample data array that would go in
//DELETE BELOW
//=============================================
// var asosData = [['000',"£58.00", "http://images.asos-media.com/inv/media/1/4/3/9/2969341/black/image1xl.jpg", "/ASOS/ASOS-ANTICIPATE-Leather-Cut-Out-Ankle-Boots/Prod/pgeproduct.aspx?iid=2969341&cid=4172&sh=0&pge=0&pgesize=204&sort=-1&clr=Black"]];

// asosData.push(['001',"£55.00", "http://images.asos-media.com/inv/media/4/5/6/5/3005654/black/image1xl.jpg", "/ASOS/ASOS-AUCKLAND-Cut-Out-Ankle-Boots/Prod/pgeproduct.aspx?iid=3005654&cid=4172&sh=0&pge=0&pgesize=204&sort=-1&clr=Black"]);

// asosData.push(['002',"£65.00", "http://images.asos-media.com/inv/media/0/5/9/1/3271950/navysoftgreen/image1xl.jpg", "/Onitsuka-Tiger/Onitsuka-Tiger-Colorado-Eighty-Five-Trainers/Prod/pgeproduct.aspx?iid=3271950&cid=4172&sh=0&pge=0&pgesize=204&sort=-1&clr=Navy%2fsoft+green"
// ]);
////////////////////////////////////////////////

function initialize(data){
	//Setup page at bootup
	//the dataset will include:[ id (key), price, imagelink, productlink,name]
	var sliderHtml = '<div id="slider" class="imageBox animateRock"></div>';
	var behindHtml = '<div class="behind imageBox"></div>';
	var comingUpHtml = '<div class="behind comingUp imageBox"></div>';
	var productNameHtml = '<div class="productName animate">Product Name Goes Here - '+asosData[0][1]+' </div>';

	$('#pictureWrapper').html(sliderHtml);
	$('#homeContent').append(productNameHtml);
	$('#slider').css('background-image','url('+asosData[0][2]+')').hammer({drag_lock_to_axis:true}).on("release dragleft dragright swipeleft swiperight", handleHammer);
	
	

	for(var i=1; i<data.length; i++)
	{
		if(i==1){
			$('#pictureWrapper').append(comingUpHtml);

		}
		else{
			$('#pictureWrapper').append(behindHtml);
		}

	}

	$('.behind').each(function(index){
		arrayNum = index+1;
		var backgroundImg = "url('"+data[arrayNum][2]+"')";
		$(this).css('background-image',backgroundImg);
		$(this).css('background-color','red');
	})

	element = $('#slider');
	productName = $('.productName');
}

initialize(asosData);

function destroyOld(){
	element.remove();
	element.hammer().off("release dragleft dragright swipeleft swiperight");
	productName.empty();

	$('.comingUp').attr('id','slider');
	element = $('#slider');
	element.css('background-image',$('.imageBox').css('background-image'));

	$('.comingUp').removeClass('comingUp');
	$('.behind').first().addClass('comingUp')

	element.hammer({drag_lock_to_axis:true}).on("release dragleft dragright swipeleft swiperight", handleHammer);
	
	var randomItem = Math.floor(Math.random()*asosData.length) //this may have to change

	buildNew(asosData[randomItem]);
}

function buildNew(randomItem){
	var backgroundImg = "url('"+randomItem[2]+"')";
	newProduct = $('<div class="behind imageBox"></div>').css('background-image',backgroundImg);
	$('#pictureWrapper').append(newProduct);

	productName.append('Product Name Goes Here - '+randomItem[1]);

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
	//ev.gesture.preventDefault();
	picturePosition = 0;
	switch(ev.type){
		case 'dragright':
		case 'dragleft':
			//stick to the finger
			//if(element.css('left')!="auto")	{var picturePosition = parseInt(element.css('left').replace("px",""));}
			//else{ var picturePosition = 0; }
			
			$('.comingUp').removeClass('behind');

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

			console.log(ev.gesture.velocityX);

			break;
		case 'swipeleft':
			animate()
			element.css('left','-1000px');

		//	ev.gesture.stopDetect();
			break;
		case 'swiperight':
			animate();
			element.css('left','1000px');
		//	ev.gesture.stopDetect();
			break;
		case 'release':
			animate();
			if(Math.abs(ev.gesture.deltaX)<(element.width()/2)&&ev.gesture.velocityX<.2){

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


