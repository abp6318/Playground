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


const axios = require('axios').default;
const prompt = require('prompt-sync')();
const fs = require('fs');

const numberOfPlayers = 2;
const start = 0;
const count = 1;
let toOutfile = "";

let key = "";

if(process.argv.length == 2){
	key += prompt('Enter your Riot API key: ');
}else if(process.argv.length == 3){
	key += process.argv[2];
}

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
							response.data.forEach(matchId => {
								axios.get("https://americas.api.riotgames.com/tft/match/v1/matches/"+matchId+"?api_key="+key)
									.then(function (response) {
										console.log(response.data);	
										// toOutfile += JSON.stringify(response.data);
										fs.appendFile('./out.txt', JSON.stringify(response.data), err => {
											if (err) {
												console.error(err);
											}
										});
									})
									.catch(function (error) {
										console.log(error);
									})
							});
							
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
