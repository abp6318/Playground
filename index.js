console.log("Running playground...");

// prompt/inform user to regen key: https://developer.riotgames.com/
// fetch top 5 players
// foreach player
	// display player name
	// display lp
	// from last 20 games
		// top 10 active traits played & average placement with each trait
		// average placement
		// # of wins
		// # of top 4s
		// # of bot 4s

/**

Prompt/flag for top x # of users
Prompt/flag for estimated start time (Epoch timestamp in seconds)
Prompt/flag for estimated end time (Epoch timestamp in seconds)

Need to consider clearing ./patch/ directory of contents, or maybe checking for existing folders

foreach puuid/
    continueLoop = true;
    startCounter = 0;
    while/ continueLoop == true/
        Get game (puuid; start=startCounter; count=1)
        fetch game
        if/ game's patch == specified patch/
            append full game data to (file=puuid) in (directory="./patch/date/)
            set start to true
        /else/
            if/ start == true/
                continueLoop = false;
        /
        startCounter += 1
        sleep for 1.5 seconds
    /
/


 */


const axios = require('axios').default;
const prompt = require('prompt-sync')();
const fs = require('fs');

const numberOfPlayers = 1;
const start = 0;
const count = 5;
let toOutfile = "";

let key = "";

if(process.argv.length == 2){
	key += prompt('Enter your Riot API key: ');
}else if(process.argv.length == 3){
	key += process.argv[2];
}

fs.truncate('./out.txt', 0, function(){console.log('Emptying out.txt content...')})

axios.get('https://na1.api.riotgames.com/tft/league/v1/challenger?api_key='+key)
	.then(function (response) {
		let entries = response.data.entries;
		entries = entries.sort((a, b) => parseFloat(b.leaguePoints) - parseFloat(a.leaguePoints));

		for (let index = 0; index < numberOfPlayers; index++) {
			axios.get("https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/"+entries[index].summonerName+"?api_key="+key)
				.then(function (response) {
					let puuid = response.data.puuid;
					axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/"+puuid+"/ids?start="+start+"&count="+count+"&api_key="+key)
						.then(function (response) {
							for (let i = 0; i < response.data.length; i++) {								
								setTimeout(function(i){
									console.log("Fetching matchId="+response.data[i]);
									axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/"+response.data[i]+"?api_key="+key)
										.then(function (response) {
											let gameInfo = response.data.info.participants;
											let res = gameInfo.filter(function(elem){ 
												if(elem.puuid == puuid) return elem;
											});
											// fs.appendFile('./out.txt', JSON.stringify(response.data.info) + "\n", err => {
											fs.appendFile('./out.txt', JSON.stringify(res) + "\n", err => {
												if (err) {
													console.error(err);
												}
											});
										})
										.catch(function (error) {
											console.log(error);
										})
								}, 1500 * i, i);
							}
						})
						.catch(function (error) {
							console.log(error);
						})
				})
				.catch(function (error) {
					console.log(error);
				})
		}
	})
	.catch(function (error) {
		console.log(error);
	});

// fs.writeFile('./out.txt', toOutfile, err => {
// 	if (err) {
// 		console.error(err);
// 	}
// });
