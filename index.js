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
const numberOfPlayers = 1;

let key = "";

if(process.argv.length == 2){
	key += prompt('Enter your Riot API key: ');
}else if(process.argv.length == 3){
	key += process.argv[2];
}

// let entries = getTopPlayers();

// console.log(entries);

// for (let index = 0; index < numberOfPlayers; index++) {
// 	console.log(getSummoner(entries[index].summonerName));
// }




const makeRequest = async () => { 
    try {
    const response = await axios.get('https://na1.api.riotgames.com/tft/league/v1/challenger?api_key='+key)
		.then(function (response) {
			let e = response.data.entries;
			e = e.sort((a, b) => parseFloat(b.leaguePoints) - parseFloat(a.leaguePoints));
			// return e;
		})
		.catch(function (error) {
			console.log(error);
		});
    if (response.status === 200) { // response - object, eg { status: 200, message: 'OK' }
      console.log('success stuff');
     return true;
    }
    return false;
   } catch (err) {
     console.error(err)
     return false;
   }
}

console.log(makeRequest);




// returns array of all challenger players in descending order
async function getTopPlayers(){
	console.log("Getting top players...");
	return new Promise((resolve, reject) => {
		axios.get('https://na1.api.riotgames.com/tft/league/v1/challenger?api_key='+key)
		.then(function (response) {
			let e = response.data.entries;
			e = e.sort((a, b) => parseFloat(b.leaguePoints) - parseFloat(a.leaguePoints));
			return e;
		})
		.catch(function (error) {
			console.log(error);
		})
	})
}

// returns puuid
function getSummoner(summonerName, res){
	console.log("Getting summoner "+summonerName);
	axios.get("https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/"+summonerName+"?api_key="+key)
	.then(function (response) {
		return response.data.puuid;
	})
	.catch(function (error) {
		console.log(error);
	})
}