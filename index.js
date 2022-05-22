console.log("Running playground...");

// prompt/inform user to regen key: https://developer.riotgames.com/
// start loop
	// 1. user info
		// prompt for summoner name
		// get account
		// display rank + lp
		// display link to lolchess
		// display ...
	// 2. user last 20
		// prompt for summoner name
		// get last 20 games
		// display game IDs + placement + lp change
		// display average placement
		// display stem and leaf plot
	// 3. user last 1
	// ...







const axios = require('axios').default;

axios.get('https://na1.api.riotgames.com/tft/summoner/v1/summoners/by-name/Puttlemar?api_key='+KEY)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

