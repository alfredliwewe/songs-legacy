# Requests

## Add Artist
Send POST request to http://localhost/songs/endpoint/artists
```json
	{
		"name":"Alfred",
		"country":"Malawi",
		"photo":"",
		"biography":"",
		"link":"",
		"website":""
	}
```

You will receive JSON response 
```json
{"status":true,"message":"Added"}
```

## Add Song
Send POST request to http://localhost/songs/endpoint/songs
```json
	{
		"artist":"Alfred",
		"title":"Hello World",
		"artwork":"",
		"mp3_url":"https://github",
		"duration":"",
		"date_added":"",
		"genre":"",
		"year":"",
		"website":""
	}
```

You will receive JSON response 
```json
{"status":true,"message":"Added"}
```