var request = require('request');

require('colors');
  
exports.action = function(data, callback){
	var kodi_api_url_mutesalon = 'http://IP:PORT/jsonrpc';
	var kodi_api_url_mutechambre = 'http://IP:PORT/jsonrpc';	
	
	var tblCommand = {
		filmtitre : function(){filmtitre(Config.modules.kodi.clients[room][data.action.value], callback, data.client, "Que veux tu voir comme film ?") },
		filmavoir : function(){filmavoir(Config.modules.kodi.clients[room][data.action.value], callback, data.client, "")},
		mutesalon : function(){doActionmutesalon(mute, kodi_api_url_mutesalon);},
		unmutesalon : function(){doActionmutesalon(unmute, kodi_api_url_mutesalon);},
		mutechambre : function(){doActionmutechambre(mute, kodi_api_url_mutechambre);},
		unmutechambre : function(){doActionmutechambre(unmute, kodi_api_url_mutechambre);},
		stop : function(){doActionvalue(stop, Config.modules.kodi.clients[room][data.action.value]);},
		serietitre : function(){serietitle(Config.modules.kodi.clients[room][data.action.value], callback, data.client, "Que veux tu voir comme série ?")}
	};
	var room = setClient(data);
	info("Kodi command:", data.action.command.yellow, "From:", data.client.yellow, "To:", room.yellow);
	tblCommand[data.action.command]();
	callback();
}


var setClient = function (data) {
	
	// client direct (la commande provient du client et est exécutée sur le client)
	var client = data.client;	
	// Client spécifique fixe (la commande ne provient pas du client et n'est pas exécutée sur le client et ne peut pas changer)
	if (data.action.room) 
		client = (data.action.room != 'current') ? data.action.room : (Avatar.currentRoom) ? Avatar.currentRoom : Config.default.client;
	// Client spécifique non fixe dans la commande HTTP (la commande ne provient pas du client et n'est pas exécutée sur le client et peut changer)
	if (data.action.setRoom) 
		client = data.action.setRoom;
	
	return client;
}

var json_film = { "jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": {}, "id": 1 }
var json_serie = {"jsonrpc": "2.0", "method": "VideoLibrary.GetTVShows", "params": {}, "id": 1}
var Play = { "jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 0, "play": true }, "id": 1 }
var stop = {"jsonrpc": "2.0", "method": "Player.Stop", "params": { "playerid": 1 }, "id": 1}
var playvideo = { "jsonrpc": "2.0", "method": "Player.PlayPause", "params": { "playerid": 1 }, "id": 1 }
var playserie = { "jsonrpc": "2.0", "method": "Player.Open", "params": { "item": { "file": "" }, "options": { "resume": true } }, "id": 3 }
var mute = {"jsonrpc":"2.0","method":"Application.SetMute","params":[true],"id":1}
var unmute = {"jsonrpc":"2.0","method":"Application.SetMute","params":[false],"id":1}
var unsetmovie = { "jsonrpc": "2.0", "method": "VideoLibrary.GetMovies", "params": { "filter": { "operator": "is", "field": "playcount", "value": "0" } }, "id": 1 }
var saison = { "jsonrpc": "2.0", "method": "VideoLibrary.GetSeasons", "params": { "tvshowid": 1, "properties": ["season", "thumbnail"] }, "id": 1 }
var episode = { "jsonrpc": "2.0", "method": "VideoLibrary.GetEpisodes", "params": { "tvshowid": 1, "season": 1, "properties": ["title", "firstaired", "playcount", "runtime", "season", "episode", "file", "streamdetails", "lastplayed", "uniqueid"], "limits": { "start": 0, "end": 25 }, "sort": { "order": "ascending", "method": "track", "ignorearticle": true } }, "id": 1 }	
		
var sendJSONRequest = function (url, reqJSON, callback) {
    var request = require('request');
    request({
        'uri': url,
        'method': 'POST',
        'timeout': 10000,
        'json': reqJSON
    },
        function (err, response, json) {
            if (err || response.statusCode != 200) {
				return callback(false);
            }
            callback(json);
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

var doActionvalue = function (req, value, callback, client, hook) {
	var kodi_api_url = value;
	info(kodi_api_url)
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

var doActionmutesalon = function (req, kodi_api_url_mutesalon, callback, client, hook) {
    sendJSONRequest(kodi_api_url_mutesalon, req, function (res) {
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

var doActionmutechambre = function (req, kodi_api_url_mutechambre, callback, client, hook) {
    sendJSONRequest(kodi_api_url_mutechambre, req, function (res) {
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
            setTimeout(function () { 
            sendJSONRequest(kodi_api_url, episode, function (res) {
                les_episodes = res.result.episodes
                asyncEpisode(les_episodes.shift(), function (reponse_episode) {
                    if (reponse_episode == false) { return syncSaison(les_saisons.shift(), reponse); }
                    else { return reponse(reponse_episode); }
                });
            }); },10000);
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

String.prototype.supm = function () {
    var TERM = [ "le film", "la série" ];
    var str = this;
    for (var i = 0; i < TERM.length; i++) {
        var reg = new RegExp('\\b' + TERM[i] + '\\b\\s?');
        str = str.replace(reg, "").replace(':', '').trim();
    }
    return str;
};

/* CONTROL MODE KODI BY ASKME */

var filmtitre = function (value, callback, client, tts) {
	
    Avatar.askme(tts, client,
        {
            "*": ""
        }, 0, function (answer, end) {

            /* LECTURE D'UN FILM SELON (TITRE) */


				var kodi_api_url = value;
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

var filmavoir = function (value, callback, client, tts) {
	var kodi_api_url = value;
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
	
var serietitle = function (value, callback, client, tts) {

    Avatar.askme(tts, client,
        {
            "*": ""
        }, 0, function (answer, end) {

            /* LECTURE D'UNE SERIE SELON (TITRE) */

				var kodi_api_url = value;
                var ask_serie = answer.supm().toLowerCase();           

                doAction(json_serie, kodi_api_url, callback, client, function (res) {
                    for (var i = 0; i < res.result.tvshows.length; i++) {
                        if (res.result.tvshows[i].label.toLowerCase() == ask_serie.toLowerCase()) {
                            label = res.result.tvshows[i].label;
                            tvshowid = res.result.tvshows[i].tvshowid;
							info(tvshowid);
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