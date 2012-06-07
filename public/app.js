var out = function(message, type) {
  if(type === 'error') {
    var full_message = '[ERROR] ' + message;
    $('#error').append('<p>' + full_message + '</p>')
  } else if(type === 'info') {
    var full_message = '[INFO] ' + message;
    $('#location').append('<p>' + full_message + '</p>')
  }
  console.log(full_message)
}

var log = function(message) {
  out(message, 'info');
};

var err = function(message) {
  out(message, 'error')
}

$(function (){
  /**************************************/
  /* MAP STUFF                          */
  /**************************************/

  $("#map").width($(window).width());
  $("#map").height($(window).height() - $("#map").offset().top);

  $(window).resize(function() {
    $("#map").width($(window).width());
    $("#map").height($(window).height() - $("#map").offset().top);
  });

  var map = new L.Map('map');

  //var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  var osmUrl = 'http://{s}tile.cloudmade.com/4a9852ba82264eb9a16c531fd53e70ed/999/256/{z}/{x}/{y}.png',
  osmAttribution = 'leaflet/cloudmade',
  osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution, subdomains: ["a.", "b.", "c.", ""]});

  map.setView(new L.LatLng(51.338, 12.375), 13).addLayer(osm);

  $('#update').click(function(ev){
    ev.preventDefault();
    log("clicked!");
    $.ajax({
      url: '/location',
      type: 'GET',
      //data: 'access_token='+$('#access_token').text(), // or $('#myform').serializeArray()
      success: function(msg) {
        var location = jQuery.parseJSON(msg);
        console.log(location);
        log(msg);
        map.setView(new L.LatLng(location.latitude, location.longitude), 13).addLayer(osm);
      },
      error: function(xhr, ajaxOptions, thrownError){
        err(xhr.status);
        err(thrownError);
      }
    });
  });
});
