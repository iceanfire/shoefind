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

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

function initialize(data){
	//Setup page at bootup
	//the dataset will include:[ id (key), price, imagelink, productlink,name]
	//
	

	

	var randomItem = Math.floor(Math.random()*asosData.length);
	var numOfInitials = 15;
	
	var sliderHtml = '<div id="slider" class="imageBox animateRock" data-id="' + asosData[randomItem][0] + 
					 '" data-price="' + asosData[randomItem][1] +
					 '" data-image="' + asosData[randomItem][2] +
					 '" data-link="' + asosData[randomItem][3] +
					 '" data-name="' + asosData[randomItem][4] +
					 '"></div>';
	var behindHtml = '<div class="behind imageBox"></div>';
	var comingUpHtml = '<div class="behind comingUp imageBox"></div>';
	var productNameHtml = '<div class="productName animate">' + asosData[randomItem][4] + ' - £' + asosData[randomItem][1] + ' </div>';

	$('#pictureWrapper').html(sliderHtml);
	$('#homeContent').append(productNameHtml);
	$('#slider').css('background-image','url('+asosData[randomItem][2]+')').hammer({drag_lock_to_axis:true}).on("release dragleft dragright dragup", handleHammer);
	
	for(var i=1; i<numOfInitials; i++)
	{
		if(i==1){
			$('#pictureWrapper').append(comingUpHtml);
		}
		else{
			$('#pictureWrapper').append(behindHtml);
		}

	}

	$('.behind').each(function(index){
		randomItem = Math.floor(Math.random()*asosData.length);
		arrayNum = randomItem;
		//arrayNum = index+1;
		var backgroundImg = "url('"+data[arrayNum][2]+"')";
		$(this).css('background-image',backgroundImg);

		$(this).attr({
			"data-id": data[arrayNum][0],
			"data-price": data[arrayNum][1],
			"data-image": data[arrayNum][2],
			"data-link": data[arrayNum][3],
			"data-name": data[arrayNum][4]
		});

		//***************************************
		//$(this).css('background-color','grey');
	})

	element = $('#slider');
	productName = $('.productName');

	buildWishList();
	
	//Code behind showing the wish list
	$('#toggle-wishlist').click(function() {
		$( "#wishlist" ).panel( "open");
		//$('#wishlist').toggleClass("hidden");
	});

}

initialize(asosData);
initWishList();

function initWishList() {
	var wishList = $.parseJSON(localStorage.getItem("wishList"));
	if (wishList) {
		wishList = wishList.getUnique();
	} else {
		wishList = [];
	}
	localStorage.setItem("wishList", JSON.stringify(wishList)); //?why do we have to set it if it already exists? 
}

function removeWishListItem(dataId) {
	localStorage.removeItem(dataId);
	var wishList = $.parseJSON(localStorage.getItem("wishList"));
	if (wishList) {
		wishList.reduce(function(arr, id, index, myarr) { if (id != dataId) { arr.push(dataId) };return arr; }, []);
		localStorage.setItem("wishList", JSON.stringify(wishList));
	}
}

function showWishListItem(item) {
	var newDiv = $('<div/>', {
		"class": 		"wish-list-item",
		"data-id":  	item.dataId,
		"data-price":   item.price,
		"data-image":   item.image,
		"data-link":    item.link,
		"data-name":    item.name,
		"style": 		"background-image: url(" + item.image + ")"
	});
	var newWishListRow = $('<div class="wish-list-row" id="wish-list-row-' + item.dataId + '">' +
						 '<div class="remove">X</div>'+
						 '<a target="_blank" href="http://m.asos.com' + item.link + '"></a>' +
						 '</div>');

	newWishListRow.find('a').append(newDiv)
							.append('<span class="item-name">' + item.name + '</span>');
	newWishListRow.find('div.remove').click(function() {
		removeWishListItem(item.dataId);
		$("#wish-list-row-" + item.dataId).remove();
	})
	$('#wishlist').append(newWishListRow);
}

function buildWishList() {
	var wishList = localStorage.getItem("wishList");

	if (wishList) {
		wishList = $.parseJSON(wishList);

		$.each(wishList, function(i, wishListItemId) {
			var wishListItem = localStorage.getItem(wishListItemId);
			if (wishListItem) {
				showWishListItem($.parseJSON(wishListItem));
			};
		});
	};
}

function addToWishList() {
	var id = element.attr('data-id');

	// Already in Wish List?
	var item = $.parseJSON(localStorage.getItem(id))
	if (item) {
		if (item.inWishlist) {

			return false
		}
	} else {
		item = {
			dataId: id,
			price: element.attr('data-price'),
			image: element.attr('data-image'),
			link: element.attr('data-link'),
			name: element.attr('data-name')
		};
	}

	item.inWishList = true;

	if (!localStorage.getItem(id)) {
		localStorage.setItem(id, JSON.stringify(item));
		showWishListItem(item);

		var wishList = undefined;
		if (wishList = localStorage.getItem("wishList")) {
			wishList = $.parseJSON(wishList);
			wishList.push(id);
		} else {
			wishList = [id];
		}

		localStorage.setItem("wishList", JSON.stringify(wishList));
	}

	sendEvent('shoe', 'like', 'price', parseInt(element.attr('data-price')));

}

function destroyOld(){
	element.hammer().off("release dragleft dragright");
	element.remove();
	productName.empty();

	$('.comingUp').attr('id','slider');

	element = $('#slider');

	//$('.comingUp').removeClass('behind'); //this makes sure that the 'behind' class is removed.
	$('.comingUp').removeClass('comingUp');
	console.log('removed comingUp');
	$('.behind').first().addClass('comingUp')
	console.log('added comingUp to the right class');

	element.hammer({drag_lock_to_axis:true}).on("release dragleft dragright dragup", handleHammer);
	
	var randomItem = Math.floor(Math.random()*asosData.length) //this may have to change
	//element.css('background-image','url(' + asosData[randomItem][2] + ')'); -- to be deleted. 
	buildNew(asosData[randomItem]);
}

function buildNew(randomItem){
	var backgroundImg = "url('"+randomItem[2]+"')";
	newProduct = $('<div class="behind imageBox"></div>').css('background-image', backgroundImg);

	newProduct.attr({
		"data-id": randomItem[0],
		"data-price": randomItem[1],
		"data-image": randomItem[2],
		"data-link": randomItem[3],
		"data-name": randomItem[4]
	});
	//newProduct = $('<div class="behind imageBox"></div>').css('background-color', 'grey');
	$('#pictureWrapper').append(newProduct);

	productName.append(randomItem[4] + ' - £' + randomItem[1]);

	console.log('built new one'+randomItem[2]);
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
	element.css('-webkit-transform','rotate(' + deg + 'deg)');
}


function handleHammer(ev){
	//disable browser scrolling
	ev.gesture.preventDefault();
	picturePosition = 0;
	if(parseInt($('#slider').css('margin-left').replace('px',''))!=0)
	{
		picMargin = parseInt($('#slider').css('margin-left').replace('px',''));
	}
	switch(ev.type){
		case 'dragup':
			$('.comingUp').removeClass('behind');
			deAnimate();
			element.css('top',90+ev.gesture.deltaY);
			element.css('position','absolute');
		case 'dragright':
		case 'dragleft':
			//stick to the finger
			
			$('.comingUp').removeClass('behind');
			deAnimate();
			element.css('left',picturePosition+ev.gesture.deltaX+picMargin);
			element.css('position','absolute');
			console.log('picMargin:'+picMargin+'  deltaX: '+ev.gesture.deltaX+'  picturePosition:'+picturePosition);

			$('.action').css('z-index',1)	

			if(ev.gesture.deltaX<0){
				rotate('-10');
				$('#thumbDown').css('opacity',1)
				$('#thumbUp').css('opacity',0)
			}
			else{
				rotate('+10');
				$('#thumbUp').css('opacity',1)
				$('#thumbDown').css('opacity',0)
			}

			
			if(Math.abs(ev.gesture.deltaX)>(element.width()/2)){
				if(ev.gesture.deltaX<0){
					rotate('-20');
					$('#thumbDown').css('opacity',1)
				}
				else{
					rotate('20');
					$('#thumbUp').css('opacity',1)
				}
			}

			//console.log(ev.gesture.velocityX);

			break;
		case 'swipeleft':
			animate();
			element.css('left','-1000px');

		//	ev.gesture.stopDetect();
			break;
		case 'swiperight':
			animate();
			element.css('left','1000px');
		//	ev.gesture.stopDetect();
			break;
		case 'release':
			console.log('release');
			animate();

			if(Math.abs(ev.gesture.deltaX)>=Math.abs(ev.gesture.deltaY)){
				console.log('x-axis');
			}
			else{
				console.log('y-axis');
			}


			if(Math.abs(ev.gesture.deltaX)<(element.width()/2)&&ev.gesture.velocityX<.2){

				element.css('position','static');
				element.css('top','auto');
				element.css('left','auto');
				rotate('0');
				$('.comingUp').addClass('behind');
			}
			else{
				
				if(ev.gesture.deltaX<0){
					element.css('left','-1000px');
					sendEvent('shoe', 'dislike', 'price', parseInt(element.attr('data-price')));
				}
				else{
					element.css('left','1000px');
					addToWishList();
				}
				destroyOld();
			}
			$('#thumbUp').css('opacity',0)
			$('#thumbDown').css('opacity',0)
			$('.action').css('z-index',-1)
			
			break;

	}
}

