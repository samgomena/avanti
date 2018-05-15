/**
 * Theme JS
 */

'use strict';


/*** Navbar ***/

var Navbar = (function() {

	// Variables
	// =========

	var $navbar = 			$('.navbar');
	var $navbarLink = 		$('.nav-link[href^="#"]'); // anchor link
	var $navbarCollapse = 	$('.navbar-collapse');
	var $window = 			$(window);

	// Methods
	// =======

	function makeNavbarDark() {
		$navbar.removeClass('navbar-light').addClass('navbar-dark');
	}
	function makeNavbarLight() {
		$navbar.removeClass('navbar-dark').addClass('navbar-light');
	}
	function toggleNavbarClass() {
		var scrollTop = $window.scrollTop();

		if ( scrollTop > 5 ) {
			makeNavbarDark();
		} else {
			makeNavbarLight();
		}
	}

	// Events
	// ======

	// Toggle navbar class on document ready event
	toggleNavbarClass();

	// Window events
	$window.on({
		'scroll': function() {

			// Toggle navbar class on window scroll
			toggleNavbarClass();
		},
		'activate.bs.scrollspy': function() {

			// Navbar active link fix
			$navbarLink.filter('.active').focus();
		}
	});

	// Toggle navbar class on collapse
	$navbarCollapse.on({
		'show.bs.collapse': function() {
			makeNavbarDark();
		},
		'hidden.bs.collapse': function() {
			var scrollTop = $window.scrollTop();

			if (scrollTop == 0) { 
				makeNavbarLight();
			}
		}
	});

	// Collapse navbar on an anchor link click
	$navbarLink.on('click', function() {
		$navbarCollapse.collapse('hide');
	});

})();


/*** Menu ***/

var Menu = (function() {

	// Variables
	// =========

	var $menu = 		$('.section_menu__grid');
	var $menuNav = 		$('.section_menu__nav');
	var menuItem = 		'.section_menu__grid__item';

	// Methods
	// =======

	function initMenu() {
		$menu.each(function() {
			var $this = $(this);
			var menuId = $this.attr('id');
			var menuDefault = $menuNav.find('li.active > a[href="#' + menuId + '"]').data('filter');
			var grid = $this.isotope({
				itemSelector: menuItem,
				filter: menuDefault
			});

			// Init Isotope when all images loaded
			grid.imagesLoaded().progress( function() {
				grid.isotope('layout');
			});

		});
	};
	function filterItems(elem) {
		var targetMenu = $menu.filter( elem.attr('href') );
		var targetCategory = elem.data('filter');

		targetMenu.isotope({
			filter: targetCategory
		});
	};
	function toggleLinks(elem) {
		elem.parent('li').siblings('li').removeClass('active');
		elem.parent('li').addClass('active');
	}

	// Events
	// ======

	// Init menu
	if ( $menu.length ) {
		initMenu();
	}

	// Filter menu items on click
	$menuNav.on('click', 'li > a', function(e) {
		e.preventDefault();

		var $this = $(this);

		filterItems( $this );
		toggleLinks( $this );
	});

})();


/*** Events ***/

var Events = (function() {

	// Variables
	// =========

	var $events = 		$('.section_events__items');
	var $eventsItem = 	$('.section_events__item');
	var $eventsItemSm = $('.section_events__item__content_sm');
	var $eventsItemLg = $('.section_events__item__content_lg');

	// Methods
	// ==================

	function toggleItem(elem) {
		elem.closest($events).find($eventsItem).removeClass('active');
		elem.closest($eventsItem).addClass('active');
	}

	// Events
	// ======

	$eventsItemSm.on('click', function() {
		toggleItem( $(this) );
	});

})();


/*** Gallery ***/

var Gallery = (function() {

	// Variables
	// =========

	var $gallery =		$('.section_gallery__grid');
	var galleryItem = 	'.section_gallery__grid__item';

	// Methods
	// =======

	function initGallery() {
		$gallery.each(function() {
			var $this = $(this);
			var grid = $this.isotope({
				itemSelector: galleryItem
			});

			// Init Isotope when all images loaded
			grid.imagesLoaded().progress( function() {
				grid.isotope('layout');
			});
		});
	};

	// Events
	// ======

	if ( $gallery.length ) {
		initGallery();
	}

})();


/*** Newsletter ***/

var Newsletter = (function() {

	// Variables
	// =========

	var $form = 			$('#mc-embedded-subscribe-form');
	var $formEmail = 		$('#mce-EMAIL');
	var $formClone = 		$('.section_newsletter__form_clone');
	var $formCloneEmail = 	$formClone.find('input[type="email"]');

	// Methods
	// =======

	function signup() {

		$.ajax({
			type: $form.attr('method'),
			url: $form.attr('action'),
			data: $form.serialize(),
			cache: false,
			dataType: 'json',
			contentType: "application/json; charset=utf-8",
			error: function(err) {
				$(document).trigger('touche.alert.show', ['danger', 'Could not connect to the registration server. Please try again later.']);
			},
			success: function(data) {

				if (data.result != "success") {
					var msg = data.msg;
						
					$(document).trigger('touche.alert.show', ['danger', msg]);
				} else {

					// Show a confirmation
					$(document).trigger('touche.alert.show', ['success', data.msg]);
					
					// Reset a form
					$form[0].reset();
				}
			}
		});
	}
	function signupImitation() {

		// Check if the original form exists on a page
		if ( $form ) {
			$form.submit();
		}
	}
	function copyInputContent() {

		// Check if the original form exists on a page
		if ( $formEmail.length ) {
			var content = $formCloneEmail.val();

			$formEmail.val(content);
		}
	}

	// Events
	// ======

	// Sign up to a Mailchimp newsletter campaign on form submit
	$form.on('submit', function(e) {
		e.preventDefault();

		signup();
	});

	// Imitate form submission on clone submit
	$formClone.on('submit', function(e) {
		e.preventDefault();

		signupImitation();
	});

	// Copy input content to the original form input field
	$formCloneEmail.on('keyup', function() {
		copyInputContent();
	});

})();


/*** Google Map ***/

var GoogleMap = (function() {

	// Variables
	// =========

	var $map = $('.section_map__map');

	// Methods
	// =======

	function init() {

		$map.each(function() {
			var $this = $(this);

			// Get map data
			var mapLat = 	$this.data('lat');
			var mapLng = 	$this.data('lng');
			var mapZoom = 	$this.data('zoom');
			var mapInfo = 	$this.data('info');

			// Get map styles
			var mapStyles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];

			// Create a map object
			var map = new google.maps.Map( $this[0], {
				center: {
					lat: mapLat,
					lng: mapLng
				},
				zoom: mapZoom,
				styles: mapStyles,
				mapTypeControlOptions: {
					mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map']
				},
				disableDefaultUI: false,
				scrollwheel: false
			});

			// Create a marker
			var marker = new google.maps.Marker({
				position: {
					lat: mapLat,
					lng: mapLng
				},
				map: map,
				visible: false
			});

			// Create an info window
			var infoWindow = new google.maps.InfoWindow({
				content: mapInfo,
				maxWidth: 300
			});
			infoWindow.open(map, marker);

			// Make marker visible on info window close event
			google.maps.event.addListener(infoWindow, 'closeclick', function() {
				marker.setVisible(true);
			});
		});

	}

	// Events
	// ======

	if ( $map.length ) {
		init();
	}

})();


/*** Current Date ***/

var CurrentDate = (function() {
	
	// Variables
	// =========

	var $dateContainer = $('#js-current-year');	

	// Methods
	// =======

	function appendDate() {
		var currentYear = new Date().getFullYear();

		$dateContainer.text(currentYear);
	}

	// Events
	// ======

	if ( $dateContainer.length ) {
		appendDate();
	}

})();


/*** Dishes ***/

var Dishes = (function() {

	// Variables
	// =========

	var $dishes = $('.section_dishes__carousel');

	// Methods
	// ========

	function init() {
		$dishes.each(function() {
			var $this = $(this);

			$this.flickity({
				cellAlign: 'left',
				setGallerySize: false,
				wrapAround: true,
				pageDots: false,
				imagesLoaded: true
			});
		});
	}

	// Events
	// =======

	if ( $dishes.length ) {
		init();
	}

})();


/*** Carousel ***/

var Carousel = (function() {

	// Variables
	// =========

	var $carousel = $('.section_carousel__slider');

	// Methods
	// =======

	function init() {
		$carousel.each(function() {
			var $this = $(this);

			$this.flickity({
				cellAlign: 'left',
				wrapAround: true,
				imagesLoaded: true
			});
		});
	}

	// Events
	// ======

	if ( $carousel.length ) {
		init();
	}

})();


/*** Testimonials ***/

var Testimonials = (function() {

	// Variables
	// =========

	var $testimonials = $('.section_testimonials__carousel');

	// Methods
	// =======

	function init() {
		$testimonials.each(function() {
			var $this = $(this);

			$this.flickity({
				cellAlign: 'left',
				wrapAround: true,
				imagesLoaded: true
			});
		});
	}

	// Events
	// ======

	if ( $testimonials.length ) {
		init();
	}

})();