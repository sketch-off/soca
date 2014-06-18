(function() {
  var $rb, baseURL, prettify, processResponse, request;

  $rb = $('#response-body');

  baseURL = 'https://api.sketch-off.com/api/v1';

  prettify = function(str) {
    return JSON.stringify(JSON.parse(str), null, 2);
  };

  $('#panel-input').keyup(function(e) {
    if (e.shiftKey) {
      if (e.keyCode === 13) {
        $('#btn-go').click();
      }
    } else if (e.ctrlKey) {
      if (e.keyCode === 71 || e.keyCode === 103) {
        $('#btn-token').click();
      }
    }
    return false;
  });

  $('#btn-token').click(function() {
    return bootbox.prompt('Enter a User ID: ', function(id) {
      console.log('requesting auth token for: ' + id);
      return $.getJSON(baseURL + '/backdoor/' + id, function(data) {
        return $('#auth-token').val(data);
      });
    });
  });

  $('#btn-go').click(function() {
    return request($('#request-line').val());
  });

  $('#base-url').change(function() {
    return baseURL = $(this).val() + '/api/v1';
  });

  request = function(text) {
    var url, verb, _ref;
    console.log('requesting: ' + text);
    _ref = text.split(' '), verb = _ref[0], url = _ref[1];
    if (url == null) {
      console.log('Assuming GET');
      url = verb;
      verb = 'GET';
    }
    url = baseURL + url + '?auth_token=' + $('#auth-token').val();
    return $.ajax(url, {
      type: verb,
      crossDomain: true,
      success: function(data, status, xhr) {
        return processResponse(xhr);
      },
      error: function(xhr, status, err) {
        return processResponse(xhr);
      }
    });
  };

  processResponse = function(xhr) {
    $('#collapse-input').collapse('hide');
    $('#response-header').text(xhr.getAllResponseHeaders());
    return $rb.text(prettify(xhr.responseText));
  };

}).call(this);
