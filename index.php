<?php

// echo "Hello world";


//Initialize cURL.
$ch = curl_init();
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);



curl_setopt($ch, CURLOPT_URL, 'https://americas.api.riotgames.com/tft/match/v1/matches/NA1_4316583561?api_key=RGAPI-1469d7f5-412a-420c-a585-bc0304894b4f');

$data = curl_exec($ch);

echo "<script>console.log({$data})</script>";
// echo json_decode($data)->info;
echo $data->info;

echo "<br><br><br><br><br><br><br><br><br>";

curl_setopt($ch, CURLOPT_URL, 'https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/YXwvQ3w-q_4KQ16Zo5z-J97B_ZxrFVugu50cXIJwZ8WI9jmtf8GFlj339BKzObRhv-uv1_D-zzzPiQ/ids?start=0&count=20&api_key=RGAPI-1469d7f5-412a-420c-a585-bc0304894b4f');

$data2 = curl_exec($ch);
echo json_encode($data2);
curl_close($ch);


?>