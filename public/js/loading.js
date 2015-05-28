/// <reference path="../../typings/jquery/jquery.d.ts"/>
function GetServerID() {
  return $("body" ).data("server-id") || 15;
}

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  $('#steamid').text(steamid);
  $('#mapname').text(mapname);
  
  $.getJSON('http://localhost:3000/api/servers/status/' + GetServerID(), function(data) {
    console.log(data);
    $('#players').text(data.players.length + '/' + data.maxplayers);
    $('#ip').text(data.dns);
  });
      
  $.getJSON('http://localhost:3000/api/player/STEAM_0:1:40236125/fields/bananas', function(data) {
    $('#bananas').text(data.value);
  });
  
  $.getJSON('http://localhost:3000/api/player/STEAM_0:1:40236125/fields/playtime', function(data) {
    $('#time').text(data.value);
  });
}