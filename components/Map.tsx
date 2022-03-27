// var GoogleMap = (function () {
//   // Variables
//   // =========

//   var $map = $(".section_map__map");

//   // Methods
//   // =======

//   function init() {
//     $map.each(function () {
//       var $this = $(this);

//       // Get map data
//       var mapLat = $this.data("lat");
//       var mapLng = $this.data("lng");
//       var mapZoom = $this.data("zoom");
//       var mapInfo = $this.data("info");

//       // Get map styles
//       var mapStyles = [
//         {
//           featureType: "water",
//           elementType: "geometry",
//           stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
//         },
//         {
//           featureType: "landscape",
//           elementType: "geometry",
//           stylers: [{ color: "#f5f5f5" }, { lightness: 20 }],
//         },
//         {
//           featureType: "road.highway",
//           elementType: "geometry.fill",
//           stylers: [{ color: "#ffffff" }, { lightness: 17 }],
//         },
//         {
//           featureType: "road.highway",
//           elementType: "geometry.stroke",
//           stylers: [{ color: "#ffffff" }, { lightness: 29 }, { weight: 0.2 }],
//         },
//         {
//           featureType: "road.arterial",
//           elementType: "geometry",
//           stylers: [{ color: "#ffffff" }, { lightness: 18 }],
//         },
//         {
//           featureType: "road.local",
//           elementType: "geometry",
//           stylers: [{ color: "#ffffff" }, { lightness: 16 }],
//         },
//         {
//           featureType: "poi",
//           elementType: "geometry",
//           stylers: [{ color: "#f5f5f5" }, { lightness: 21 }],
//         },
//         {
//           featureType: "poi.park",
//           elementType: "geometry",
//           stylers: [{ color: "#dedede" }, { lightness: 21 }],
//         },
//         {
//           elementType: "labels.text.stroke",
//           stylers: [
//             { visibility: "on" },
//             { color: "#ffffff" },
//             { lightness: 16 },
//           ],
//         },
//         {
//           elementType: "labels.text.fill",
//           stylers: [
//             { saturation: 36 },
//             { color: "#333333" },
//             { lightness: 40 },
//           ],
//         },
//         { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
//         {
//           featureType: "transit",
//           elementType: "geometry",
//           stylers: [{ color: "#f2f2f2" }, { lightness: 19 }],
//         },
//         {
//           featureType: "administrative",
//           elementType: "geometry.fill",
//           stylers: [{ color: "#fefefe" }, { lightness: 20 }],
//         },
//         {
//           featureType: "administrative",
//           elementType: "geometry.stroke",
//           stylers: [{ color: "#fefefe" }, { lightness: 17 }, { weight: 1.2 }],
//         },
//       ];

//       // Create a map object
//       var map = new google.maps.Map($this[0], {
//         center: {
//           lat: mapLat,
//           lng: mapLng,
//         },
//         zoom: mapZoom,
//         styles: mapStyles,
//         mapTypeControlOptions: {
//           mapTypeIds: [
//             "roadmap",
//             "satellite",
//             "hybrid",
//             "terrain",
//             "styled_map",
//           ],
//         },
//         disableDefaultUI: false,
//         scrollwheel: false,
//       });

//       // Create a marker
//       var marker = new google.maps.Marker({
//         position: {
//           lat: mapLat,
//           lng: mapLng,
//         },
//         map: map,
//         visible: false,
//       });

//       // Create an info window
//       var infoWindow = new google.maps.InfoWindow({
//         content: mapInfo,
//         maxWidth: 300,
//       });
//       infoWindow.open(map, marker);

//       // Make marker visible on info window close event
//       google.maps.event.addListener(infoWindow, "closeclick", function () {
//         marker.setVisible(true);
//       });
//     });
//   }

//   // Events
//   // ======

//   if ($map.length) {
//     init();
//   }
// })();

export default function Map() {}
