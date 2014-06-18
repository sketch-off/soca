(function() {
  var $rb, baseURL, prettify, processResponse, request, requestToken;

  $rb = $('#response-body');

  $(document).ajaxSend(function(e, xhr, s) {
    console.log('-----------------------------------');
    console.log(e);
    return console.log(xhr);
  });

  baseURL = 'https://api.sketch-off.com/api/v1';

  prettify = function(str) {
    console.log(str);
    str = JSON.stringify(JSON.parse(str), null, 4);
    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
      var cls;
      cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else {
        if (/null/.test(match)) {
          cls = 'null';
        }
      }
      return "<span class=\"" + cls + "\">" + match + "</span>";
    });
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
    return bootbox.prompt('Enter a User ID: ', requestToken);
  });

  requestToken = function(id) {
    console.log('requesting auth token for: ' + id);
    return $.getJSON(baseURL + '/backdoor/' + id, function(data) {
      return $('#auth-token').val(data);
    });
  };

  $('#btn-go').click(function() {
    return request($('#request-line').val());
  });

  $('#base-url').change(function() {
    baseURL = $(this).val() + '/api/v1';
    return requestToken(1);
  });

  request = function(text) {
    var authToken, con, data, url, verb, _ref;
    console.log('requesting: ' + text);
    _ref = text.split(' '), verb = _ref[0], url = _ref[1];
    if (url == null) {
      console.log('Assuming GET');
      url = verb;
      verb = 'GET';
    }
    authToken = 'auth_token=' + $('#auth-token').val();
    con = '?';
    if (url.indexOf('?') !== -1) {
      con = '&';
    }
    url = baseURL + url + con + authToken;
    data = $('#request-body').val();
    console.log('data: ' + data);
    return $.ajax({
      url: url,
      type: verb,
      data: JSON.parse(data),
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
    return $rb.html(prettify(xhr.responseText));
  };

}).call(this);
