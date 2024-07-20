# This is outline how to send request to this endpoint



## Register artist
Send a post request with these required fields

```json
{
	"name":"YourArtistName"
}
```
Other fields may include any of these 
```json
{
	"biography":"string",
	"photo":"string_url",
	"country":"string",
	"website":"string",
	"link":"string_url"
}
```



## Add song record
Send a post request with these required fields

```json
{
	"artist":"YourArtistName",
	"title":"string",
	"mp3_url":"string_url"
}
```
Other fields may include any of these 
```json
{
	"duration":"string",
	"artwork":"string_url",
	"genre":"string",
	"website":"string",
	"year":"string"
}