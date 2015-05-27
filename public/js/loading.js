/// <reference path="../../typings/jquery/jquery.d.ts"/>
$(function() {
  function GameDetails(servername, serverurl, mapname, maxplayers, steamid, gamemode) {
    $('#map').html(mapname);
    $('#maxplayers').html(maxplayers);
    $('#steamid').html(steamid);
  }

  function SetFilesTotal( total ) {}

  function DownloadingFile( fileName ) {}

  function SetStatusChanged( status ) {}

  function SetFilesNeeded( needed ) {}
});
