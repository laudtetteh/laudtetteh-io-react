/*
 * UNUSED/LEGACY CODE FROM init.js
 * This file contains all commented-out or disabled functions and code blocks
 * from init.js. These are preserved for reference, debugging, or possible
 * future reactivation. If you need to restore a feature, copy it back to init.js.
 * You would also have to include triggers in init.js under both
 * jQuery(document).ready(function() {...} and
 * window.arlo_tm_init_all = function() {...}
 * Examples of triggers:
 * arlo_tm_modalbox();
 * arlo_tm_modalbox_news();
 * arlo_tm_modalbox_portfolio();
*/

// -----------------------------------------------------
// --------------------   MODALBOX    ------------------
// -----------------------------------------------------

// Let's disable the modal feature for now.
// function arlo_tm_modalbox(){
// 	"use strict";
	
// 	jQuery('.arlo_tm_all_wrap').prepend('<div class="arlo_tm_modalbox"><div class="box_inner"><div class="close"><a href="#"><i class="icon-cancel"></i></a></div><div class="description_wrap"></div></div></div>');
// }

// -------------------------------------------------
// -------------  MODALBOX NEWS  -------------------
// -------------------------------------------------

// function arlo_tm_modalbox_news(){
	
// 	"use strict";
	
// 	var modalBox		= jQuery('.arlo_tm_modalbox');
// 	var button			= jQuery('.arlo_tm_news .arlo_tm_full_link');
// 	var closePopup		= modalBox.find('.close');
	
// 	button.on('click',function(){
// 		var element 	= jQuery(this);
// 		var parent 		= element.closest('li');
// 		var content 	= parent.find('.news_hidden_details').html();
// 		var image		= parent.find('.image .main').data('img-url');
// 		var meta		= parent.find('.meta').html();
// 		var title		= parent.find('.title a').text();
// 		var date		= parent.find('.date').text();
// 		modalBox.addClass('opened');
// 		modalBox.find('.description_wrap').html(content);
// 		modalBox.find('.news_popup_informations').prepend('<div class="image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+image+'"></div></div>');
// 		modalBox.find('.news_popup_informations .image').append('<span class="date">'+date+'</span>');
// 		modalBox.find('.news_popup_informations .image').after('<div class="details_news"><div class="meta">'+meta+'</div><div class="title"><h3>'+title+'</h3></div></div>');
// 		arlo_tm_data_images();
// 		return false;
// 	});
// 	closePopup.on('click',function(){
// 		modalBox.removeClass('opened');
// 		modalBox.find('.description_wrap').html('');
// 		return false;
// 	});
// }

// -------------------------------------------------
// -------------  MODALBOX PORTFOLIO  --------------
// -------------------------------------------------

// function arlo_tm_modalbox_portfolio(){
	
// 	"use strict";
	
// 	var modalBox	= jQuery('.arlo_tm_modalbox');
// 	var button		= jQuery('.arlo_tm_portfolio .portfolio_popup');
	
// 	button.on('click',function(){
// 		var element 	= jQuery(this);
// 		var parent		= element.closest('.inner');
// 		var image		= parent.find('.abs_image').data('img-url');
// 		var details 	= parent.find('.hidden_content_portfolio').html();
// 		var title	 	= parent.find('.entry').data('title');
// 		var category	 	= parent.find('.entry').data('category');
		
// 		modalBox.addClass('opened');
// 		modalBox.find('.description_wrap').html(details);
// 		modalBox.find('.popup_details').prepend('<div class="top_image"><img src="img/thumbs/4-2.jpg" alt="" /><div class="main" data-img-url="'+image+'"></div></div>');
// 		modalBox.find('.popup_details .top_image').after('<div class="portfolio_main_title"><h3 class="title">'+title+'</h3><span class="category"><a href="#">'+category+'</a></span></div>');	
// 		arlo_tm_data_images();
// 		return false;
// 	});
// }


// -------------------------------------------------
// ----------------   TEXTETION  -------------------
// -------------------------------------------------

// $('.animateText').textition({
// 	speed: 1.2,
// 	animation: 'ease-out',
// 	map: {x: 200, y: 100, z: 0},
// 	autoplay: true,
// 	interval: 4
// });
