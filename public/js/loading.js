'use strict';

function GetServerID() {
  return $("body").data("server-id") || 0;
}

function SteamIDConvert(sid64) {
  var base = "7960265728";

  sid64 = sid64.substr(7);

  var subtract = 0;
  var lastIndex = base.length - 1;

  for (var i = 0; i < base.length; i++) {
    var value = sid64.charAt(lastIndex - i) - base.charAt(lastIndex - i);

    if (value < 0) {
      var index = lastIndex - i - 1;

      base = base.substr(0, index) + (Number(base.charAt(index)) + 1) + base.substr(index + 1);

      if (index) {
        value += 10;
      } else {
        break;
      }
    }

    subtract += value * Math.pow(10, i);
  }

  return "STEAM_0:" + (subtract % 2) + ":" + Math.floor(subtract / 2);
}

function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
  $('#steamid').text(steamid);
  $('#mapname').text(mapname);

  steamid = SteamIDConvert(steamid)

  $.getJSON('http://localhost:3000/api/servers/status/' + GetServerID(), function(data) {
    console.log(data);
    $('#players').text(data.players.length + '/' + data.maxplayers);
    $('#ip').text(data.dns);
  });

  $.getJSON('http://localhost:3000/api/player/'+steamid+'/fields/bananas', function(data) {
    $('#bananas').text(data.value);
  });

  $.getJSON('http://localhost:3000/api/player/'+steamid+'/fields/playtime', function(data) {
    $('#time').text(data.value);
  });
}
