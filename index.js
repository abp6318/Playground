console.log("Running playground...");

const axios = require('axios').default;
const prompt = require('prompt-sync')();
const fs = require('fs');

const numberOfPlayers = 1;
const start = 0;
const count = 5;

let key = "";

if(process.argv.length == 2){
	key += prompt('Enter your Riot API key: ');
}else if(process.argv.length == 3){
	key += process.argv[2];
}

fs.truncate('./out.txt', 0, function(){console.log('Emptying out.txt content...')})

function mainFunc(){
	axios.get('https://na1.api.riotgames.com/tft/league/v1/challenger?api_key='+key)
		.then(function (response) {
			let entries = response.data.entries;
			entries = entries.sort((a, b) => parseFloat(b.leaguePoints) - parseFloat(a.leaguePoints));
			for (let index = 0; index < numberOfPlayers; index++) {
				axios.get("https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/"+entries[index].summonerName+"?api_key="+key)
					.then(async function (response) {
						let puuid = response.data.puuid;
						let continueLoop = true;
						let startCounter = 0;
						let startPatchCollection = false;
						for (let i = 0; continueLoop; i++) {
							console.log("i: "+i + "; continueLoop: " + continueLoop);
							
							Promise.resolve(axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/" + puuid + "/ids?start=" + startCounter + "&count=1&api_key=" + key)
								.then(function (response) {
									console.log("Fetching matchId=" + response.data[0]);
									startCounter += 1;
									return axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/" + response.data[0] + "?api_key=" + key)
										.then(function (response) {
											console.log("^--" + response.data.info.game_version);
											if (response.data.info.game_version.endsWith("<Releases/12.9>")) {
												startPatchCollection = true;
												let gameInfo = response.data.info.participants;
												let res = gameInfo.filter(function (elem) {
													if (elem.puuid == puuid)
														return elem;
												});
												fs.appendFile('./out.txt', JSON.stringify(res) + "\n", err => {
													if (err) {
														console.error(err);
														return false;
													}
												});
												return true;
											} else {
												return !(startPatchCollection == true);
											}
										})
										.catch(function (error) {
											console.log("ERROR: STATION 1");
											console.log(error);
										});
								})
								.catch(function (error) {
									console.log("ERROR: STATION 2");
									console.log(error);
								})
							).then(function(value){ continueLoop = value; });
							await sleep(1250);
							if(i>275) break;
						} // while loop
					})
					.catch(function (error) {
						console.log("ERROR: STATION 3");
						console.log(error);
					})
			}
		})
		.catch(function (error) {
			console.log("ERROR: STATION 4");
			console.log(error);
		});
}

mainFunc();


function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }
