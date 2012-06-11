$(function (){
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

  $('.leaflet-control-zoom').css({position: 'absolute', top: $('#nav').outerHeight() + 'px'});

  //scaffolding google response object
  function location() {
    this.kind = "";
    this.timestampMs = 0;
    this.latitude = 0;
    this.longitude = 0;
    this.accuracy = 0;
  }

  function update_location() {
    console.log('updating!');
    $.ajax({
      url: '/location',
      type: 'GET',
      success: function(msg) {
        l = jQuery.parseJSON(msg);
        if(l.latitude != 0) {
          if(dev_mode) {
            var sign = 0;
            var size = 0.05
            if(Math.random() > 0.5) {
              sign = 1;
            } else {
              sign = -1;
            }
            l.latitude = l.latitude + (Math.random()*size*sign)
            l.longitude = l.longitude + (Math.random()*size*sign)
          }
          map.removeLayer(marker);
          marker = new L.Marker(new L.LatLng(l.latitude,l.longitude));
          map.addLayer(marker);
          map.panTo(new L.LatLng(l.latitude, l.longitude), 13); //.addLayer(osm);
        }
      },
      error: function(xhr, ajaxOptions, thrownError){
        console.error(xhr.status);
        console.error(thrownError);
      }
    });
  }

  function toggle_update() {
    if(update) {
      console.log('disabling updating')
      $('#update_status').css('color', 'red').text('OFF');
      clearInterval(update);
      update = null;
    } else {
      console.log('enabling updating')
      $('#update_status').css('color', 'green').text('ON');
      update = setInterval(update_location, 5000);
    }
  }

  function toggle_dev() {
    if(dev_mode) {
      console.log('disabling dev mode')
      $('#dev_status').css('color', 'red').text('OFF');
      dev_mode = false;
    } else {
      console.log('enabling dev mode')
      $('#dev_status').css('color', 'green').text('ON');
      dev_mode = true;
    }
  }

  var l = new location();
  var marker = new L.Marker(new L.LatLng(51.338, 12.375));
  var update = null; //setInterval(update_location, 5000);
  var dev_mode = false;

  $('#update').click(function(ev){
    ev.preventDefault();
    toggle_update();
  });

  $('#update_now').click(function(ev){
    ev.preventDefault();
    update_location();
  });

  $('#dev').click(function(ev){
    ev.preventDefault();
    toggle_dev();
  });
});
