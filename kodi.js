/* **********************************************************
 * Plugin kodi pour Avatar.IA
 * Permet de commander vocalement votre Media Center Kodi
 * Eddy TELLIER
 * Version : 1.2
 * Date Release : 23/08/2018
 ************************************************************
 */

 
exports.action = function (data, callback) {

    var config = Config.modules.kodi;
    var kodi_api_url = 'http://' + config.ip_kodi + ':' + config.port_kodi + '/jsonrpc';
	var kodi_api_url2 = 'http://' + config.ip_kodi2 + ':' + config.port_kodi2 + '/jsonrpc';
    var client = data.client;
 
    var tblCommand = {
		filmtitre: function () { filmtitle(kodi_api_url, callback, client, "Que veux tu voir comme film ?") },
		filmavoir: function () { filmavoir(kodi_api_url, callback, client, "") },
		mutesalon: function () {
            doAction(mute, kodi_api_url, callback, client);
        },
		unmutesalon: function () {
            doAction(unmute, kodi_api_url, callback, client);
        },
		mutechambre: function () {
            doAction(mute, kodi_api_url2, callback, client);
        },
		unmutechambre: function () {
            doAction(unmute, kodi_api_url2, callback, client);
        },
		stop: function () {
            doAction(stop, kodi_api_url, callback, client);
        },
		serietitre: function () { serietitle(kodi_api_url, callback, client, "Que veux tu voir comme série ?") }
    }

    info("Command Kodi : ", data.action.command.yellow, "From:", client.yellow);
    tblCommand[data.action.command]();
    callback();
}


// -------------------------------------------
//  QUERIES
//  Doc: https://kodi.wiki/view/JSON-RPC_API/v9
// -------------------------------------------

var json_film = { "jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": {}, "id": 1 }
var json_serie = {"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": {}, "id": 1}
var introspect = { "jsonrpc": "2.0", "method": "JSONRPC.Introspect", "params": { "filter": { "id": "AudioLibrary.GetSongs", "type": "method" } }, "id": 1 }
var Play = { "jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 0, "play": true }, "id": 1 }
var Pause = { "jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 0, "play": false }, "id": 1 }
var Stop = { "jsonrpc": "2.0", "method": "Input.ExecuteAction", "params": { "action": "stop" }, "id": 1 }
var audioPlayer = { "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "file"], "playerid": 0 }, "id": "AudioGetItem" }
var videoPlayer = { "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "file"], "playerid": 1 }, "id": "VideoGetItem" }
var status = { "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 }
var playvideo = { "jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 1 }, "id": 1 }
var Left = { "jsonrpc": "2.0", "method": "Input.Left", "params": {}, "id": 1 }
var Right = { "jsonrpc": "2.0", "method": "Input.Right", "params": {}, "id": 1 }
var Down = { "jsonrpc": "2.0", "method": "Input.Down", "params": {}, "id": 1 }
var Up = { "jsonrpc": "2.0", "method": "Input.Up", "params": {}, "id": 1 }
var Home = { "jsonrpc": "2.0", "method": "Input.Home", "params": {}, "id": 1 }
var Select = { "jsonrpc": "2.0", "method": "Input.Select", "params": {}, "id": 1 }
var Back = { "jsonrpc": "2.0", "method": "Input.Back", "params": {}, "id": 1 }
var Info = { "jsonrpc": "2.0", "method": "Input.Info", "params": {}, "id": 1 }
var ContextMenu = { "jsonrpc": "2.0", "method": "Input.ContextMenu", "params": {}, "id": 1 }
var ShowOSD = { "jsonrpc": "2.0", "method": "Input.ShowOSD", "params": {}, "id": 1 }
var VideoLibraryScan = { "jsonrpc": "2.0", "method": "VideoLibrary.Scan", "id": 1 }
var AudioLibraryScan = { "jsonrpc": "2.0", "method": "AudioLibrary.Scan", "id": 1 }
var Next = { "jsonrpc": "2.0", "method": "Input.ExecuteAction", "params": { "action": "skipnext" }, "id": 1 }
var Prev = { "jsonrpc": "2.0", "method": "Input.ExecuteAction", "params": { "action": "skipprevious" }, "id": 1 }
var genres = { "jsonrpc": "2.0", "method": "AudioLibrary.GetGenres", "params": { "properties": ["title"], "limits": { "start": 0, "end": 20 }, "sort": { "method": "label", "order": "ascending" } }, "id": "AudioLibrary.GetGenres" }
var albums = { "jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "properties": ["artist", "artistid", "albumlabel", "year", "thumbnail", "genre"], "limits": { "start": 0, "end": 20 }, "sort": { "method": "label", "order": "ascending" } }, "id": "AudioLibrary.GetAlbumsByGenre" }
var songs = { "jsonrpc": "2.0", "method": "AudioLibrary.GetSongs", "params": { "properties": ["title", "genre", "artist", "duration", "album", "track"], "limits": { "start": 0, "end": 25 }, "sort": { "order": "ascending", "method": "track", "ignorearticle": true } }, "id": "libSongs" }
var saison = { "jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": 1, "properties": ["season", "thumbnail"] }, "id": 1 }
var episode = { "jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "tvshowid": 1, "season": 1, "properties": ["title", "firstaired", "playcount", "runtime", "season", "episode", "file", "streamdetails", "lastplayed", "uniqueid"], "limits": { "start": 0, "end": 25 }, "sort": { "order": "ascending", "method": "track", "ignorearticle": true } }, "id": 1 }
var playlist = { "jsonrpc": "2.0", "method": "Playlist.GetItems", "params": { "properties": ["title", "album", "artist", "duration"], "playlistid": 0 }, "id": 1 }
var clearlist = { "jsonrpc": "2.0", "id": 0, "method": "Playlist.Clear", "params": { "playlistid": 0 } }
var addtolist = { "jsonrpc": "2.0", "id": 1, "method": "Playlist.Add", "params": { "playlistid": 0, "item": { "songid": 10 } } }
var runlist = { "jsonrpc": "2.0", "id": 2, "method": "Player.Open", "params": { "item": { "playlistid": 0 } } }
var shuffle_on = { "jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": 0, "shuffle": true }, "id": 1 }
var shuffle_off = { "jsonrpc": "2.0", "method": "Player.SetShuffle", "params": { "playerid": 0, "shuffle": false }, "id": 1 }
var getalbumsof = { "jsonrpc": "2.0", "method": "AudioLibrary.GetAlbums", "params": { "filter": { "operator": "is", "field": "artist", "value": "" } }, "id": 1 }
var playlistmusic = { "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file": "" }, "options": { "shuffled": true } }, "id": 1 }
var playlistvideo = { "jsonrpc": "2.0", "method": "GUI.ActivateWindow", "params": { "window": "video", "parameters": [] }, "id": 1 }
var playserie = { "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file": "" }, "options": { "resume": true } }, "id": 3 }
var radio = '{"jsonrpc":"2.0","method":"Player.Open","params":{"item":{"file":"plugin://plugin.audio.radio_de/station/radioid"}},"id":1}'
var unsetmovie = { "jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "filter": { "operator": "is", "field": "playcount", "value": "0" } }, "id": 1 }
var setsubtitle = { "jsonrpc": "2.0", "id": 1, "method": "Player.SetSubtitle", "params": { "playerid": 1, "subtitle": "" } }
var closekodi = { "jsonrpc": "2.0", "method": "Application.Quit", "id": "1" }
var mute = {"jsonrpc":"2.0","method":"Application.SetMute","params":[true],"id":1}
var unmute = {"jsonrpc":"2.0","method":"Application.SetMute","params":[false],"id":1}			
var sendJSONRequest = function (url, reqJSON, callback) {
    var request = require('request');
    request({
        'uri': url,
        'method': 'POST',
        'timeout': 3000,
        'json': reqJSON
    },
        function (err, response, json) {
            if (err || response.statusCode != 200) {
				return callback(false);
            }
            callback(json);
        });
}

/* STATUS KODI */

var status_kodi = function (kodi_api_url) {

    // STATUS MUSIQUE
    var reqjson = { "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 };
    sendJSONRequest(kodi_api_url, reqjson, function (result) {
        if (result.id == 1) {
            kodi.status.status_music.kodi = true;
        }
        if (result.result) {
            if (result.result.length > 0)
                if (result.result[0].playerid == 0) {
                    reqjson = { "jsonrpc": "2.0", "id": 1, "method": "Player.GetProperties", "params": { "playerid": 0, "properties": ["speed"] } };
                    sendJSONRequest(kodi_api_url, reqjson, function (result) {
                        if (result.result.speed != 0) {
                            kodi.status.status_music.player = 'play';
                        }
                        else {
                            kodi.status.status_music.player = 'pause';
                        }
                    });
                    var reqjson = { "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "duration", "file"], "playerid": 0 }, "id": "AudioGetItem" }
                    sendJSONRequest(kodi_api_url, reqjson, function (json) {
                        kodi.status.status_music = { 'kodi': true, 'player': "play", 'artist': json.result.item.artist[0], 'album': json.result.item.album, 'title': json.result.item.title, 'label': json.result.item.label, 'file': json.result.item.file };
                    });

                }
        }
        else {
            kodi.status.status_music.kodi = false;
        }
    });

    // STATUS VIDEO
    var rqjson = { "jsonrpc": "2.0", "method": "Player.GetActivePlayers", "id": 1 };
    sendJSONRequest(kodi_api_url, rqjson, function (result) {
        if (result.id == 1) {
            kodi.status.status_video.kodi = true;
        }
        if (result.result) {
            if (result.result.length > 0)
                if (result.result[0].playerid == 1) {
                    rqjson = { "jsonrpc": "2.0", "id": 1, "method": "Player.GetProperties", "params": { "playerid": 1, "properties": ["speed"] } };
                    sendJSONRequest(kodi_api_url, rqjson, function (result) {
                        if (result.result.speed != 0) {
                            kodi.status.status_video.player = 'play';
                        }
                        else {
                            kodi.status.status_video.player = 'pause';
                        }
                    });
                    var rqjson = { "jsonrpc": "2.0", "method": "Player.GetItem", "params": { "properties": ["title", "album", "artist", "season", "episode", "duration", "showtitle", "tvshowid", "file"], "playerid": 1 }, "id": "VideoGetItem" }
                    sendJSONRequest(kodi_api_url, rqjson, function (json) {
                        kodi.status.status_video = { 'kodi': true, 'player': "play", 'type': json.result.item.type, 'title': json.result.item.title, 'file': json.result.item.file, 'label': json.result.item.label, 'showtitle': json.result.item.showtitle, 'season': json.result.item.season, 'episode': json.result.item.episode };
                    });
                }
        }
        else {
            kodi.status.status_video.kodi = false;
        }
    });
}

var handleJSONResponse = function (res, callback, client) {
    if (!res) {
        return
    }
    if (res.error) {
        return
    }
    return true;
}


var doAction = function (req, kodi_api_url, callback, client, hook) {
    sendJSONRequest(kodi_api_url, req, function (res) {
        if (!handleJSONResponse(res, callback)) {
            return;
        }
        if (hook) {
            try {
                if (!hook(res)) {
                    return;
                }
            } catch (ex) {
            }
        }
        if (callback) { callback({}) };
    });
}

var doPlaylist = function (filter, kodi_api_url, callback, client) {
    songs.params['filter'] = filter;
    doAction(songs, kodi_api_url, callback, client, function (json) {
        if (!json.result.songs) {
            Avatar.speak("Je n'ai pas trouvé de résultats !", client, function () {
                Avatar.Speech.end(client);
                mode_control_kodi('', kodi_api_url, callback, client, ' ');
            });
            return false;
        }
        nbsong = json.result.songs.length;

        doAction(clearlist, kodi_api_url, function (resss) {
            json.result.songs.forEach(function (song) {
                addtolist.params.item.songid = song.songid;
                doAction(addtolist, kodi_api_url, function (resss) {
                    nbsong = nbsong - 1;
                    if (nbsong == 0)
                        doAction(runlist, kodi_api_url);
                });
            });
        });
        return true;
    });
}

var doPlaylistSerie = function (id, kodi_api_url, callback, client) {
    var asyncEpisode = function (l_episode, reponse) {
        if (l_episode) {
            if (l_episode.playcount == 0) { return reponse(l_episode); }
			
            return asyncEpisode(les_episodes.shift(), reponse);
        }
        else { 
			return reponse(false); }
    }
    var syncSaison = function (la_saison, reponse) {
        if (la_saison) {
            episode.params.season = parseInt(la_saison.season);

            sendJSONRequest(kodi_api_url, episode, function (res) {
                les_episodes = res.result.episodes
                asyncEpisode(les_episodes.shift(), function (reponse_episode) {
                    if (reponse_episode == false) { return syncSaison(les_saisons.shift(), reponse); }
                    else { return reponse(reponse_episode); }
                });
            });
        }
        else { 
			return reponse(false); }
    }
    saison.params.tvshowid = parseInt(id);
    episode.params.tvshowid = parseInt(id);

    sendJSONRequest(kodi_api_url, saison,  function (res) {
        les_saisons = res.result.seasons;
        syncSaison(les_saisons.shift(), function (reponse) {
            if (reponse == false) {
                Avatar.speak('Tous les épisodes ont été vu !', client, function () {
                    Avatar.Speech.end(client);
                    serietitle('', kodi_api_url, callback, client, ' ');
                });
            }
            else {

                playserie.params.item.file = reponse.file;
                doAction(playserie, kodi_api_url);
                Avatar.speak('lecture de l\'épisode ' + reponse.episode + ' de la saison ' + reponse.season + ".", client, function () {
                    Avatar.Speech.end(client);
                });
            }
        });

    });
}


/* CONTROL MODE KODI BY ASKME */

var filmtitle = function (kodi_api_url, callback, client, tts) {

    Avatar.askme(tts, client,
        {
            "*": ""
        }, 0, function (answer, end) {

            /* LECTURE D'UN FILM SELON (TITRE) */



                var valfilm = answer.supm().toLowerCase();         

                doAction(json_film, kodi_api_url, callback, client, function (res) {
                    for (var i = 0; i < res.result.movies.length; i++) {
                        if (res.result.movies[i].label.toLowerCase() == valfilm.toLowerCase()) {
                            var label = res.result.movies[i].label;
                            var movieid = res.result.movies[i].movieid;
                        }
                    }

                    var readmovie = { "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "movieid": movieid }, "options": { "resume": false } }, "id": 1 };

                    if (movieid) {
						Avatar.speak("Bon film.", client, function () {
							doAction(readmovie, kodi_api_url, callback, client);
                            end(client, true);
						});
                    }
                    else {
                        Avatar.speak("Je n'ai pas trouvé le film. Répète s'il te plait.", client, function () {
							return filmtitle(kodi_api_url, callback, client, ' ');
                        });
                    }

                });
   


			
        });

}


var filmavoir = function (kodi_api_url, callback, client, tts) {
	doAction(unsetmovie, kodi_api_url, callback, client, function (res) {
		var moviestosee = "";
            if (res.result.limits.total == 0) {
                Avatar.speak("Tu as déjà regardé tous les films.", client, function () {
                    Avatar.Speech.end(client);
                });
            }
			else {
                var moviestosee = "";
                for (var i = 0; i < Math.min(5, res.result.limits.total); i++) {
                    if (moviestosee != "") { moviestosee += '. '; }
                    moviestosee += res.result.movies[Math.floor((Math.random() * (res.result.limits.total - 1)))].label
                }
                Avatar.speak('Il y à ' + res.result.limits.total + ' films qui n\'ont pas encore été vues. dont : ' + moviestosee, client, function () {
					Avatar.Speech.end(client);
				});
            }
	});
}
	
var serietitle = function (kodi_api_url, callback, client, tts) {

    Avatar.askme(tts, client,
        {
            "*": ""
        }, 0, function (answer, end) {

            /* LECTURE D'UNE SERIE SELON (TITRE) */


                var ask_serie = answer.supm().toLowerCase();           

                doAction(json_serie, kodi_api_url, callback, client, function (res) {
                    for (var i = 0; i < res.result.tvshows.length; i++) {
                        if (res.result.tvshows[i].label.toLowerCase() == ask_serie.toLowerCase()) {
                            label = res.result.tvshows[i].label;
                            tvshowid = res.result.tvshows[i].tvshowid;
                        }
                    }

                    if (tvshowid) {
						Avatar.speak("Bonne série.", client, function () {
							doPlaylistSerie(tvshowid, kodi_api_url, callback, client);
						});
                    }
                    else {
                        Avatar.speak("Je n'ai pas trouvé la série.", client, function () {
							return serietitle(kodi_api_url, callback, client, ' ');
                        });
                    }

                });
   

        });

}

String.prototype.supm = function () {
    var TERM = [ "le film", "la série" ];
    var str = this;
    for (var i = 0; i < TERM.length; i++) {
        var reg = new RegExp('\\b' + TERM[i] + '\\b\\s?');
        str = str.replace(reg, "").replace(':', '').trim();
    }
    return str;
};
