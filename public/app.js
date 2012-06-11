function out(message, type) {
  if(type === 'error') {
    var full_message = '[ERROR] ' + message;
    $('#error').append('<p>' + full_message + '</p>')
  } else if(type === 'info') {
    var full_message = '[INFO] ' + message;
    $('#location').append('<p>' + full_message + '</p>')
  }
  console.log(full_message)
}

function log(message) {
  out(message, 'info');
};

function err(message) {
  out(message, 'error')
}

function get_location() {
  var location;

  $.ajax({
    url: '/location',
    type: 'GET',
    success: function(msg) {
      location = jQuery.parseJSON(msg);
      log(msg);
    },
    error: function(xhr, ajaxOptions, thrownError){
      err(xhr.status);
      err(thrownError);
    }
  });

  return location;
}

$(function (){
  /**************************************/
  /* MAP STUFF                          */
  /**************************************/

  $('#map').width($(window).width());
  $('#map').height($(window).height());

  $(window).resize(function() {
    $('#map').width($(window).width());
    $('#map').height($(window).height());
  });

  var map = new L.Map('map');

  //var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  var osmUrl = 'http://{s}tile.cloudmade.com/4a9852ba82264eb9a16c531fd53e70ed/999/256/{z}/{x}/{y}.png',
  osmAttribution = 'leaflet/cloudmade',
  osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution, subdomains: ["a.", "b.", "c.", ""]});

  map.setView(new L.LatLng(51.338, 12.375), 13).addLayer(osm);

  $('.leaflet-control-container').css({position: 'absolute', top: $('#nav').outerHeight() + 'px'});

  /**************************************/
  /* LOCATION STUFF                     */
  /**************************************/

  $('#update').click(function(ev){
    ev.preventDefault();
    get_location();
  });

  //map.setView(new L.LatLng(location.latitude, location.longitude), 13).addLayer(osm);
});
