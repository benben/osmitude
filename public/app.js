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
  console.log(message);
  out(message, 'info');
};

var err = function(message) {
  out(message, 'error')
}

$(function (){
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
      },
      error: function(xhr, ajaxOptions, thrownError){
        err(xhr.status);
        err(thrownError);
      }
    });
  });
});
