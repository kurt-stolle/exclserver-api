/// <reference path="../../typings/jquery/jquery.d.ts"/>
$(function(){
  var info = {
    servername: null,
    serverurl: null,
    mapname: null,
    maxplayers: null,
    steamid: null,
    gamemode: null
  };
  
  function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    $('map').text(mapname);
    $('p')
    
    info.servername = servername;
    info.serverurl = serverurl;
    info.mapname = mapname;
    info.maxplayers = maxplayers;
    info.steamid = steamid;
    info.gamemode = gamemode;
  }
});
