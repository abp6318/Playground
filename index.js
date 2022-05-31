console.log("Running playground...");

const axios = require('axios').default;
const prompt = require('prompt-sync')();
const fs = require('fs');
const sleepNumberMS = 2400;

// let numberOfPlayers = 2;
// let key = "";
// let patchNumber = "12.9";
// let date = Date.now();
// if(process.argv.length == 2){
// 	key += prompt('Enter your Riot API key: ');
// }else if(process.argv.length == 3){
// 	key += process.argv[2];
// }
let key = prompt('Enter your Riot API key: ');
let numberOfPlayers = prompt('Enter the number of players to scan (from top NA challenger): ');
let patchNumber = prompt('Enter the patch number you want to check: ');
let date = Date.now();

function mainFunc(){
	axios.get('https://na1.api.riotgames.com/tft/league/v1/challenger?api_key='+key)
		.then(async function (response) {
			let entries = response.data.entries;
			entries = entries.sort((a, b) => parseFloat(b.leaguePoints) - parseFloat(a.leaguePoints));
			for (let index = 0; index < numberOfPlayers; index++) {
				await sleep(sleepNumberMS); //entries[index].summonerName
				await axios.get("https://na1.api.riotgames.com/tft/summoner/v1/summoners/"+entries[index].summonerId+"?api_key="+key)
					.then(async function (response) {
						let puuid = response.data.puuid;
						let name = response.data.name.replace(/[^a-zA-Z ]/g, "?");
						let continueLoop = true;
						let startCounter = 0;
						let startPatchCollection = false;
						await sleep(sleepNumberMS);
						for (let i = 0; continueLoop; i++) {							
							Promise.resolve(axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/" + puuid + "/ids?start=" + startCounter + "&count=1&api_key=" + key)
								.then(function (response) {
									console.log("Fetching matchId=" + response.data[0] + " for name=" + name);
									startCounter += 1;
									return axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/" + response.data[0] + "?api_key=" + key)
										.then(function (response) {
											console.log("^--" + response.data.info.game_version);
											if (response.data.info.game_version.endsWith("<Releases/" + patchNumber + ">")) {
												startPatchCollection = true;
												let gameInfo = response.data.info.participants;
												let res = gameInfo.filter(function (elem) {
													if (elem.puuid == puuid)
														return elem;
												});
												let line = "\"" +name + "\",\"" + res[0].augments[0] + "\",\"" + res[0].augments[1] + "\",\"" + res[0].augments[2] + "\",\"" + res[0].placement + "\","
												fs.appendFile('./augments/patch' + patchNumber + "_top" + numberOfPlayers + "_date" + date + '.csv', line + "\n", err => {
													if (err) {
														console.error(err);
														return false;
													}
												});
												return true;
											} else {
												if(patchNumber + ">" < response.data.info.game_version.split("<Releases/")[1] + ">"){
													return false;
												}
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
							await sleep(sleepNumberMS);
							// if(i>275) break;
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
