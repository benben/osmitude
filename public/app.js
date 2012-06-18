var icon_size = 30;

function set_icon_size(size) {
  icon_size = size;
}

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

  var msg_shown = false;

  function update_location() {
    console.log('updating!');
    $.ajax({
      url: '/location',
      type: 'GET',
      success: function(msg) {
        l = jQuery.parseJSON(msg);
        //if user isn't using latitude
        if(msg === "") {
          if(!msg_shown) {
            alert('You are not using latitude with this google account. I will create a fake location. Please enable dev mode to see you moving around!');
            msg_shown = true;
          }
          l = new location();
          l.latitude = 51.338;
          l.longitude = 12.375;
        }
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

          var LeafIcon = L.Icon.extend({
            iconSize: new L.Point(icon_size, icon_size)
          });

          marker = new L.Marker(new L.LatLng(l.latitude,l.longitude), {icon: new LeafIcon('marker.png')});
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

  function toggle_hide() {
    elements_to_hide = ['.leaflet-control-zoom', '.leaflet-control-attribution', '#nav'];
    if (hidden) {
      $.each(elements_to_hide, function(index, value) {
        $(value).show();
      });
      hidden = false;
    } else {
      $.each(elements_to_hide, function(index, value) {
        $(value).hide();
      });
      hidden = true;
    }
  }

  var l = new location();
  var marker = new L.Marker(new L.LatLng(51.338, 12.375));
  if($('#update').length == 1) {
    update_location();
    var update = setInterval(update_location, 5000);
  }
  var dev_mode = false;
  var hidden = false;

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

  $('#hide').click(function(ev){
    ev.preventDefault();
    toggle_hide();
  });

  $(document).keypress(function(ev) {
    if (ev.which == 104) {
      ev.preventDefault();
      toggle_hide();
    }
  });
});
