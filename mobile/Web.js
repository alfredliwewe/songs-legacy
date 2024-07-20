var Web = (function() {
	//var importedFunction = otherModule.importedFunction;

	function internalFunction() {
		// body...
	}

	function exportedFunction(){
		console.log("Hello guys");
	}

    async function getMyProducts(){
        return await new Promise(resolve => {
            $.get("handler.php?getMyProducts", function(response, status){
                try {
                    var rows = JSON.parse(response);

                    resolve(rows);
                } catch (error) {
                    alert(error.toString());
                }
            })
		});
    }

    async function getArtist(song_id){
        return await new Promise(resolve => {
            $.get("web-handler.php?getArtistFromSong="+song_id, function(response, status){
                //alert(response);
                try {
                    var rows = JSON.parse(response);

                    resolve(rows);
                } catch (error) {
                    alert(error.toString());
                }
            })
		});
    }

    async function getCharts(){
        return await new Promise(resolve => {
            $.get("web-handler.php?getCharts", function(response, status){
                //alert(response);
                try {
                    var rows = JSON.parse(response);

                    resolve(rows);
                } catch (error) {
                    alert(error.toString());
                }
            })
		});
    }

    async function saveSongPlayed(song_id){
        return await new Promise(resolve => {
            $.get("handler.php?saveSongPlayed="+song_id, function(response, status){
                try {
                    var rows = JSON.parse(response);

                    resolve(rows.playId);
                } catch (error) {
                    resolve(0)
                }
                resolve(response);
            })
        });
    }

	//exports assigned to global variable `myModule`

	return {
		exportedFunction:exportedFunction,
        getMyProducts,
        getArtist,
        saveSongPlayed,
        getCharts
	}
})();