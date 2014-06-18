$rb = $('#response-body')

baseURL = 'https://api.sketch-off.com/api/v1'

prettify = (str) ->
    console.log str
    str = JSON.stringify JSON.parse(str), null, 4
    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    str.replace /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) ->
        cls = 'number'
        if /^"/.test(match)
            if /:$/.test(match)
                cls = 'key'
            else
                cls = 'string'
        else if /true|false/.test(match)
            cls = 'boolean'
        else
            cls = 'null'  if /null/.test(match)
        "<span class=\"" + cls + "\">" + match + "</span>"

$('#panel-input').keyup (e) ->
    if e.shiftKey
        if e.keyCode == 13
            $('#btn-go').click()
    else if e.ctrlKey
        if e.keyCode == 71 or e.keyCode == 103
            $('#btn-token').click()
    return false

$('#btn-token').click ->
    bootbox.prompt 'Enter a User ID: ', requestToken

requestToken = (id) ->
    console.log 'requesting auth token for: ' + id
    $.getJSON baseURL+'/backdoor/'+id, (data) ->
        $('#auth-token').val data

$('#btn-go').click ->
    request $('#request-line').val()

$('#base-url').change ->
    baseURL = $(this).val() + '/api/v1'
    requestToken(1)

request = (text) ->
    console.log 'requesting: ' + text
    [verb, url] = text.split ' '
    unless url?
        console.log 'Assuming GET'
        url = verb
        verb = 'GET'
    authToken = 'auth_token=' + $('#auth-token').val()
    con = '?'
    if url.indexOf('?') != -1
        con = '&'
    url = baseURL + url + con + authToken

    data = $('#request-body').val()
    console.log 'data: ' + data
    $.ajax
        url: url
        type: verb
        data: JSON.parse data
        success: (data, status, xhr) ->
            processResponse xhr
        error: (xhr, status, err) ->
            processResponse xhr

processResponse = (xhr) ->
    # console.log xhr
    $('#collapse-input').collapse 'hide'
    $('#response-header').text xhr.getAllResponseHeaders()
    $rb.html prettify xhr.responseText



