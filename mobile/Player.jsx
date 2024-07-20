const { colors, CssBaseline, ThemeProvider, FormControl, FormHelperText, IconButton,  OutlinedInput, Typography, InputAdornment, Container, createTheme, Box, SvgIcon, Button, Link, MenuItem, TextField, Avatar, Chip,Slider,Switch, InputLabel} = MaterialUI;

function printPlayer(){
	$.get("handler.php?getFirstSong", function(response, status){
		try{
			var data = JSON.parse(response);

			ReactDOM.render(<PlayerLayout data={data} />, document.getElementById('react_player'));
		}
		catch(E){
			alert(E.toString());
		}
	})
}

function FAIcon(props){
	return (
		<i  className={"fa "+props.icon}></i>
	)
}

function PlayerLayout(props){
	const [data, setData] = React.useState(props.data);
	const [duration, setDuration] = React.useState(0);
	const [isPlaying, setIsPlaying] = React.useState(true);
	const [playIcon, setPlayIcon] = React.useState("fa-play");

	let audio = document.getElementById("audio");

	const refreshCurrentTime = () => {
		let currentTime = duration.currentTime;
		setDuration(currentTime/1000);
		setTimeout(refreshCurrentTime, 1000);
	}

	//refreshCurrentTime();

	const showNext = (event) => {

		var song_data = current_list[play_index + 1];
		var btn_element = _('nextButton');
		
		var offset = $(btn_element).offset();
		var width = $(btn_element).width();
		//Toast("Show Next"+offset.top);

		var maxZ = Math.max.apply(null, 
		    $.map($('body *'), function(e,n) {
		      if ($(e).css('position') != 'static'){
		        return parseInt($(e).css('z-index')) || 1;
		    }
		}));

		var div = new Rodz.Div();
		div.css({
			position:"absolute",
			left: (offset.left - 90)+"px",
			width:"180px",
			zIndex:maxZ+1
		})
		div.addClasses(['shadow', 'border', 'pops', 'w3-white']);

		var img = new Rodz.ImageView();
		img.setSource("../artwork/"+song_data.resampled_artwork);
		img.setAttribute("width", "100%");
		div.addView(img);

		var bt = new Rodz.Div();
		bt.addClasses(['w3-padding']);
		div.addView(bt);

		var label = new Rodz.Label();
		label.setText(song_data.title);
		label.addClasses(['block bold roboto']);
		bt.addView(label);

		var artist = new Rodz.Label();
		artist.setText(song_data.artist);
		artist.addClasses(['block w3-small w3-opacity']);
		bt.addView(artist);

		document.body.appendChild(div.view);
		Toast(div.view.clientHeight);
		div.css({
			top:(offset.top - div.view.clientHeight - 5)+"px",
			left:(offset.left + 10 + (width/2) - 90)+"px",
		})

		div.view.addEventListener('click', function(event){
			$(div.view).remove();
		})
	}

	const removePops = (event) => {
		$('.pops').remove();
	}

	const downloadFile = (event) => {
		//download file in a new window
		let a = document.createElement("a");
		a.setAttribute('target', '_blank');
		a.href = 'download.php?id='+props.data.id;
		a.click();
	}

	const playPause = (event) => {
		if(isPlaying){
			setPlayIcon("fa-pause");
			audio.pause();
			setIsPlaying(false);
		}
		else{
			setPlayIcon("fa-play");
			audio.play();
			setIsPlaying(true);
		}
	}

	return (
		<div className="w3-padding">
			<div className="img-container w3-center">
				<img src={data.artwork} className="rounded" width="300"/>
			</div>
			{/** Below is the media player */}
			<div className="player-container">
				<div className="clearfix">
					<font id="currentTimeShow">00:00</font>
					<font className="float-right" id="durationTimeShow">00:00</font>
				</div>
				<PrintMuiSlider id="slider1" />
				<br />
				<div className="player-bottom clearfix">
					<IconButton style={{outline:"none"}} onClick={(event) => {
						playerPrevious();
					}} aria-label="show 4 new mails" color="inherit">
						<FAIcon icon="fa fa-fast-backward" />
					</IconButton>
					<IconButton style={{outline:"none", marginLeft:"15px"}} onClick={playPause} aria-label="show 4 new mails" color="inherit">
						<FAIcon icon={"fa "+playIcon} />
					</IconButton>
					<IconButton id="nextButton" style={{outline:"none", marginLeft:"15px"}} onClick={(event) => {
						removePops(event);
						playerNext();
					}} onMouseEnter={event => {showNext(event)}}  onMouseLeave={removePops} color="inherit">
						<FAIcon icon="fa fa-fast-forward" />
					</IconButton>
					<font className="float-right">
						<IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
							<FAIcon icon="fa fa-file-download" />
						</IconButton>
						<IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
							<FAIcon icon="fa fa-heart" />
						</IconButton>
						<IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
							<FAIcon icon="fa fa-redo" />
						</IconButton>
						<IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
							<FAIcon icon="fa fa-cog" />
						</IconButton>
					</font>
				</div>
			</div>
			<div className="pt-20">
				<font className="w3-large block roboto">{data.title} {data.artist_data.name}</font>
			</div>
			<div className="pt-30" id="artist_profile">
			</div>
			<div id="song_comments"></div>
		</div>
	);
}