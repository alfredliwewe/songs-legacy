
var audio;
var currentSongId;
var playId;
var bottomSlider;
var modalTime = false;

async function printThePlayer(play_list) {
    try{
		var firstSong = play_list[0];
		//firstSong.mp3_url = "http://localhost/songs/songs/phy.mp3";
		currentSongId = firstSong.id;

		let div = new Rodz.Div();
		div.setAttribute('id', 'react-bottom-player');
		document.body.appendChild(div.view);

		await new Promise((resolve) => {
			ReactDOM.render(<BottomPlayerLayout data={firstSong} />, div.view);
			Toast(firstSong.mp3_url);
			resolve();
		})
		
		bottomSlider = new MuiSlider("slider");
		bottomSlider.onDrop((event, value) => {
			var time = Math.floor(value/100 * audio.duration);
			audio.currentTime = time;
		})

		var rightCont = new Rodz.Div('rightCont');
		rightCont.css('height', (window.innerHeight - div.view.clientHeight - 1)+"px");
	}
	catch(E){
		alert(E.toString());
	}
}

function printReactError(id, msg){
	var alert_cont = new Rodz.Div(id);
	ReactDOM.render(<MaterialUI.Alert severity="error">{msg}</MaterialUI.Alert>, alert_cont.view);
}

function printReactSuccess(id, msg){
	var alert_cont = new Rodz.Div(id);
	ReactDOM.render(<MaterialUI.Alert severity="success">{msg}</MaterialUI.Alert>, alert_cont.view);
}

function showLogout(div2){
	var logout = (event) => {
		window.location = 'logout.php';
	}
	ReactDOM.render(<Chip avatar={<Avatar>L</Avatar>} label="Logout" className="pointer" onClick={logout} />, div2.view);
}

function showCurrentTime(){
	setTimeout(() => {
		try{
			let percent = Math.floor((audio.currentTime / audio.duration) * 100);
			var slider = new MuiSlider('slider');
			slider.setValue(percent);

			//show duration
			$('#player_duration').html(formatTime(audio.currentTime)+" - "+formatTime(audio.duration));

			if(modalTime){
				var topSlider = new MuiSlider("slider1");
				topSlider.setValue(percent);
				$('#currentTimeShow').html(formatTime(audio.currentTime))
				$('#durationTimeShow').html(formatTime(audio.duration))
			}
			showCurrentTime();
		}
		catch(E){
			showCurrentTime();
		}
	}, 1000);
}

function printLogintForm(){
	let div = new Rodz.Div('react-login');
	ReactDOM.render(<LoginForm />, div.view);
}

function showPlayList(event){
	var listContainer = new Rodz.Div();
	listContainer.addClasses(['border', 'w3-card-16']);
	var head = new Rodz.Div();
	head.addClasses(['w3-padding clearfix']);
	head.css({
		background:"#f1f1f1"
	})
	head.setText("PlayList");
	listContainer.addView(head);

	var close = new Rodz.Icon();
	close.addClasses(['w3-hover-text-red float-right fa fa-times pointer']);
	head.addView(close);

	var offset = $(event.target).offset();

	var maxZ = Math.max.apply(null, 
		$.map($('body *'), function(e,n) {
		  if ($(e).css('position') != 'static'){
			return parseInt($(e).css('z-index')) || 1;
		}
	}));

	var content1 = new Rodz.Div();
	content1.addClasses(['w3-white'])
	listContainer.addView(content1);
	listContainer.css({
		width:"280px",
		position:"fixed",
		left: (offset.left - 140)+"px",
		bottom: "40px",
		zIndex:maxZ+1
	})

	var rows = JSON.parse($('#play_list_store').html());

	ReactDOM.render(<div style={{maxHeight:"300px",overflowY:"auto"}}>
		{current_list.map((row) => (
			<div className="w3-padding w3-hover-light-grey song pointer" data={row.id} style={{width:"100%"}}>
				<font className="bold block roboto">{row.title}</font>
				<font className="block w3-small w3-opacity">{row.artist}</font>
			</div>
		))}
	</div>, content1.view);

	document.body.appendChild(listContainer.view);
	close.on('click', (event) => {
		ReactDOM.unmountComponentAtNode(content1.view);
		$(listContainer.view).remove();
	})
}

function playerNext(){
	play_index += 1;
	if(play_index < current_list.length){
		modalSongClick(current_list[play_index].id);
	}
}

function playerPrevious(){
	play_index -= 1;
	if(play_index >= 0){
		modalSongClick(current_list[play_index].id);
	}
}

function playCompleted(){
	//save compled and click next

	//save progress of the previous song
	if(currentSongId != null && playId != null){
		var percent = 100;

		$.post("handler.php", {playId:playId, SaveDuration:percent}, (res,s)=>{});
	}

	playerNext();
}

async function clickedPlayer(firstSong) {

	//save progress of the previous song
	if(currentSongId != null && playId != null){
		var percent = Math.floor(audio.currentTime/audio.duration * 100);

		$.post("handler.php", {playId:playId, SaveDuration:percent}, (res,s)=>{});
	}
	//firstSong.mp3_url = "http://localhost/songs/songs/phy.mp3";

	Web.saveSongPlayed(firstSong.id).then((id) => {
		playId = id;
	})

	let div = new Rodz.Div('react-bottom-player');

	try{
		ReactDOM.unmountComponentAtNode(div.view);
	}catch(E){alert(E.toString())}

	Toast(firstSong.mp3_url);

	ReactDOM.render(<BottomPlayerLayout data={firstSong} />, div.view);
}

$(document).ready(function(event){
	audio = document.getElementById("audio");

	audio.addEventListener("ended", function(event){
        playCompleted();
    })
})

function RodzPlayer (){
	this.bar = new Rodz.Div();
	this.ivContainer = new Rodz.Div();
	this.iv = new Rodz.ImageView();
	this.titleContainer = new Rodz.Div();
	this.title = new Rodz.Label();
	this.artist = new Rodz.Label();
	this.div = null;
	this.progress = null;
	this.isPlaying = false;
	this.playBtn = new Rodz.Span();
	audio = document.getElementById("audio");

	
	this.bar.setWidth(window.innerWidth);
	this.bar.setAttribute('id', 'bottom_player')
    this.bar.addClasses(['w3-white', 'w3-border-top', 'w3-row']);
    this.bar.css('position', 'fixed').css('bottom', '0').css('right', '0').css('z-index', '20');


    this.ivContainer.addClasses(['w3-col', 'w3-padding-small']);
    this.ivContainer.setWidth(60);
    this.bar.addView(this.ivContainer);

    //iv.setSource("artwork/"+firstSong.resampled_artwork);
    this.iv.setWidth(40);
    this.iv.addClasses(['rounded', 'pointer', 'w3-hover-opacity']);
    this.ivContainer.addView(this.iv);
    this.iv.view.addEventListener('click', function(event) {
    	showModalPlayer();
    })

    this.titleContainer.addClasses(['w3-col', 'm3', 'w3-padding']);
    this.bar.addView(this.titleContainer);

    this.title.addClasses(['roboto', 'block']);
    //this.title.setText(firstSong.title);
    this.titleContainer.addView(this.title);

    this.titleContainer.addView(this.artist);


    //lets do the hustle
    this.cols = new Rodz.Div();
	this.cols.setAttribute({
		class:"w3-col m6 w3-padding"
	});
	this.bar.addView(this.cols);

	this.shadow = new Rodz.Div();
	this.cols.addView(this.shadow);
	this.shadow.setAttributes({
		class:"w3-row"
	});


	/* 
		PLAY BUTTON CONTENT
	*/
	this.playCont = new Rodz.Div();
	this.playCont.addClasses(['w3-col s1 w3-padding-top']);
	this.shadow.addView(this.playCont);

	this.playBtn = new Rodz.Span();
	this.playCont.addView(this.playBtn);
	this.playBtn.setAttributes({
		class:"rounded w3-hover-blue w3-padding pointer",
		id:"playBtn"
	});
	this.playBtn.onClick(function() {
		//this.play();
	})

	this.playIcon = new Rodz.Icon();
	this.playBtn.addView(this.playIcon);
	this.playIcon.addClasses(['fa fa-play w3-large']);
	///////////////////////////////////////////////////////////////////////////// -> END PLAY BUTTON


	/*
		PROGRESS BAR CONTENT
	*/
	this.progress_container = new Rodz.Div();
	this.progress_container.addClasses(['w3-col s8 w3-row']);
	this.shadow.addView(this.progress_container);

	this.bar_content = new Rodz.Div();
	this.bar_content.setAttributes({
		class:"w3-col m10",
		id:"bar_content"
	});
	this.progress_container.addView(this.bar_content);

	this.progress = new Rodz.ProgressIndicator();
	this.progress.addClasses(['mt-10']);
	this.progress.setHeight(8);
	this.progress.setCorners(4);
	this.progress.setValue(20);
	this.progress.setAttribute('id', 'player_progress');
	this.bar_content.addView(this.progress);

	this.timeContainer = new Rodz.Div();
	this.timeContainer.addClasses(['w3-col m2 w3-padding']);
	this.progress_container.addView(this.timeContainer);

	this.time = new Rodz.Label();
	this.time.setAttributes({
		id:"player_duration"
	});
	this.time.setText("03:12");
	this.timeContainer.addView(this.time);
	///////////////////////////////////////////////////////////////////////// -> END PROGRESS CONTAINER



	/*
		VOLUME CONTAINER
	*/
	this.volumeContainer = new Rodz.Div();
	this.volumeContainer.addClasses(['w3-col s2 w3-row']);
	this.shadow.addView(this.volumeContainer);

	this.volumeContainer.view.innerHTML = '<div class="w3-col m3"><div class="w3-padding"><i class="fa fa-volume-off w3-large"></i>            </div></div><div class="w3-col m9"><input type="range" name="volume" id="volume" style="width:100%"></div>';
	////////////////////////////////////////////////////////////////// -> END VOLUME



	/*
		SETTINGS
	*/
	this.setting_container = new Rodz.Div();
	this.setting_container.addClasses(['w3-col s1 w3-padding']);
	this.shadow.addView(this.setting_container);

	this.setting_icon = new Rodz.Icon();
	this.setting_icon.addClasses(['fa fa-cog w3-large']);
	this.setting_container.addView(this.setting_icon);

	this.attach = function() {
		document.body.appendChild(this.bar.view);
	}

	this.setTitle = function(text) {
		this.title.setText(text);
	}

	this.setArtist = function(text) {
		this.artist.setText(text);
	}

	this.setImage =function(resource) {
		this.iv.setSource(resource)
	}

	this.setSource = function(resource) {
		audio.src = resource;

		//update the duration
		//Toast(audio.duration);
		//$('#player_duration').html(formatTime(audio.duration))
	}

	this.play = function() {
		audio.play();
		this.isPlaying = true;
	}

	this.pause = function() {
		audio.pause();
		this.isPlaying = false;
	}
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

function formatTime(time) {
	time = time+"";

	var time1 = time.toHHMMSS();

	var chars = time1.split(":");

	return chars[1]+":"+chars[2];
}

$(document).on('click', '#playBtn', function(event) {
	var icon = this.getElementsByTagName('i')[0];
	if ($(icon).hasClass('fa-play')) {
		$(icon).removeClass('fa-play').addClass('fa-pause');
		audio.play();
		canPlay = true;
		loading();
	}
	else{
		$(icon).removeClass('fa-pause').addClass('fa-play');
		audio.pause();
		canPlay = false;
	}
})

function loading(){
	if (canPlay) {
		//$('#playerRanger').val(wavesurfer.getCurrentTime());
		var progress = new ProgressIndicator('player_progress');
		var percent = audio.currentTime / audio.duration * 100;
		progress.setValue(percent);
		$('#player_duration').html(formatTime(audio.duration))

		setTimeout(loading, 1000);
	}
}

async function showModalPlayer(data) {
	Toast("yeah")
	modalTime = true;
	$('#bottom_player').hide();

	var modal = new Rodz.Div();
	modal.addClasses(['w3-modal']);

	var modalContent = new Rodz.Div();
	modalContent.setAttribute('id', 'modalContent3');
	modalContent.addClasses(['w3-modal-content', 'shadow', 'w3-round-large', 'w3-white', 'w3-padding-large']);
	modalContent.css('width', '80%').css('height', 'calc(100% - 60px)').css('overflow-y','hidden');
	modal.addView(modalContent);

	document.body.appendChild(modal.view);
	modal.css('display', 'block').css('z-index', '21').css('padding-top', '30px');

	//inflate the design
	$(modalContent.view).load('views/popupplayer.php', async function() {
		//resize the content panels
		let top_bar_modal = new Rodz.Div('top_bar_modal');
		let modalDisplay = new Rodz.Div('modalDisplay');
		modalDisplay.css({
			height:($(modalContent.view).outerHeight() - top_bar_modal.view.clientHeight - 10)+"px",
			overflowY:"auto"
		})
		//done -- print the default songs
		await new Promise((resolve) => {
			ReactDOM.render(<PlayerLayout data={data} />, document.getElementById('firstSongPlay'));
			resolve();
		});
		
		{Web.getArtist(data.id).then((artist) => {

			ReactDOM.render(<div className="w3-row">
				<div className="w3-col m1 clearfix">
					<img src="images/pro_file.png" width="60" style={{borderRadius:"50%"}} className="float-right" />
				</div>
				<div className="w3-col m10 w3-padding">
					<div className="pl-30">
						<Link href={"artist.php?id="+artist.id}  className="block bold w3-large roboto">{artist.name}</Link>
						<font className="block w3-opacity">{artist.name}</font>
					</div>
				</div>
			</div>, document.getElementById('artist_profile'));
		})}

		$.post("handler.php", {getRelated:data.id, type:""}, (response2, status) => {
			try{
				let rows = JSON.parse(response2);

				ReactDOM.render(<div>
					{rows.map((row) => (
						<MobileView row={row} />
					))}
				</div>, document.getElementById('relatedPlay'));
			}
			catch(E){
				alert(E.toString()+response2);
			}
		})
	})
}

function closeModalPlayer(argument) {
	$('.w3-modal').remove();
	$('#bottom_player').show();
	modalTime = false;
}

var searchModalAvailable = false;
function searchModal(event) {
	var element = event.target;
	if (element.value.length == 0) {
		//remove
		$('.sma').remove();
		searchModalAvailable = false;
	}
	else{
		//check if available
		if (!searchModalAvailable) {
			var offset = $(element).offset();

			var parent = new Rodz.Div('playerModalContainer');

			var content = new Rodz.Div();
			content.addClasses(['w3-white', 'border', 'sma']);
			content.css('position', 'fixed').css('left', offset.left+'px').css('top', (offset.top+element.clientHeight+2)+"px");
			content.css('width', element.clientWidth+"px").css('min-height','100px').css('max-height','450px').css('overflow-y', 'auto');
			content.setAttribute('id', 'sma');
			parent.addView(content);
			searchModalAvailable = true;

			//show search results
		}
		else{
			var content = new Rodz.Div('sma');
		}

		$.get("handler.php?searchModal="+element.value, function(response, status){
			console.log(response);
			try{
				var rows = JSON.parse(response);
				content.removeAllViews();

				if (rows.length > 0) {
					//show results
					var row_cont = function(row) {
						var div = new Rodz.Div();
						div.addClasses(['w3-padding', 'pointer', 'w3-hover-light-grey', 'playMusic']);
						if (row.type == "malawi") {
							div.setAttribute('data', row.song_id);
						}
						else{
							div.setAttribute('data', row.id);
						}
						div.setAttribute('type', row.type);

						var text = new Rodz.Label();
						text.setText(row.title);
						div.addView(text);
						return div;
					}
					for(var row of rows){
						content.addView(row_cont(row));
					}
				}
				else{
					var empty = new Rodz.Label();
					empty.addClasses(['block', 'w3-margin', 'text-secondary']);
					empty.setText("No results found");
				}
			}
			catch(E){
				alert(E.toString()+response);
			}
		})
	}
			
}

var modalProgress;

var modalSongClick = (id) => {
	for(var i = 0; i < current_list.length; i++){
		if (id == current_list[i].id) {
			play_index = i;
		}
	}

	$.get("handler.php?getSong="+id, async function(response, status) {
		try{
			var firstSong = JSON.parse(response);

			if (firstSong != null) {
				clickedPlayer(firstSong);
				let data = firstSong;

				try{
					ReactDOM.unmountComponentAtNode(document.getElementById('artist_profile'));
					ReactDOM.unmountComponentAtNode(document.getElementById('firstSongPlay'));
					ReactDOM.unmountComponentAtNode(document.getElementById('relatedPlay'));
					
				}catch(E){
					alert(E.toString());
				}

				//done -- print the default songs
				await new Promise((resolve) => {
					ReactDOM.render(<PlayerLayout data={data} />, document.getElementById('firstSongPlay'));
					resolve();
				});
				
				{Web.getArtist(data.id).then((artist) => {
		
					ReactDOM.render(<div className="w3-row">
						<div className="w3-col m1 clearfix">
							<img src="images/pro_file.png" width="60" style={{borderRadius:"50%"}} className="float-right" />
						</div>
						<div className="w3-col m10 w3-padding">
							<div className="pl-30">
								<Link href={"artist.php?id="+artist.id}  className="block bold w3-large roboto">{artist.name}</Link>
								<font className="block w3-opacity">{artist.name}</font>
							</div>
						</div>
					</div>, document.getElementById('artist_profile'));
				})}

				$.post("handler.php", {getRelated:data.id, type:"single"}, function(response1, status){
					try{
						var rows = JSON.parse(response1);

						ReactDOM.render(<div>
							{rows.map((row) => (
								<MobileView row={row} />
							))}
						</div>, document.getElementById('relatedPlay'));
					}
					catch(E){
						alert(E.toString()+response1);
					}
				})
			}
			else{
				Toast("Error");
			}
		}
		catch(E){
			alert(E.toString()+response);
		}
	})
}

$(document).on('click', '.playMusic', function(event) {
	var id = $(this).attr('data');
	var type = $(this).attr('type');

	$('.sma').remove();

	modalSongClick(id);
});

$(document).on('click', '.playMusic1', function(event) {
	var id = $(this).attr('data');
	var type = $(this).attr('type');
	//Toast(type);

	//Toast(id);
	$('.sma').remove();
	searchModalAvailable = false;
	$('#modal_search_input').val($(this).text());

	$.post("handler.php", {viewSong:id, type:type}, function(response, status) {
		try{
			var data = JSON.parse(response);

			var modalDisplay = new Rodz.Div('modalDisplay');
			modalDisplay.removeAllViews();
			var left = new Rodz.Div();
			var right= new Rodz.Div();
			modalDisplay.addAll(left, right);
			left.addClasses(['w3-col m7 w3-padding']);
			right.addClasses(['w3-col m5 w3-padding']);

			var ivContainer = new Rodz.Div();
			left.addView(ivContainer);
			ivContainer.addClasses(['w3-center', 'pt-30', 'pb-15']);

			var iv = new Rodz.ImageView();
			iv.setSource(data.artwork);
			ivContainer.addView(iv);
			iv.setAttribute('width', '50%');
			iv.addClasses(['rounded']);

			var progress_container = new Rodz.Div();
			left.addView(progress_container);

			modalProgress = new Rodz.ProgressIndicator();
			modalProgress.setAttribute('id', 'player_progress_modal');
			progress_container.addView(modalProgress);

			var bottom = new Rodz.Div();
			bottom.addClasses(['pt-15']);
			left.addView(bottom);

			var playCont = new Rodz.Span();
			var nextCont = new Rodz.Span();
			var volumeCont = new Rodz.Span();
			var volumeSliderCont = new Rodz.Span();
			bottom.addAll(playCont, nextCont, volumeCont, volumeSliderCont);

			var play = new Rodz.Icon();
			play.addClasses(['fa-play','w3-large','pointer', 'w3-hover-text-blue'])
			playCont.addView(play);
			playCont.addClasses(['pl-10','pr-10'])

			var next = new Rodz.Icon();
			next.addClasses(['fa-step-forward','w3-large','pointer', 'w3-hover-text-blue'])
			nextCont.addView(next);
			nextCont.addClasses(['pl-10','pr-10'])

			var volume = new Rodz.Icon();
			volume.addClasses(['fa-volume-down','w3-large'])
			volumeCont.addView(volume);
			volumeCont.addClasses(['pl-10','pr-10']);

			volumeSliderCont.setWidth(90);
			volumeSliderCont.css('width', '90px');
			var volumeSlider = new Rodz.ProgressIndicator();
			volumeSlider.setWidth(100);
			volumeSlider.setValue(80);
			//volumeSlider.setWidth(90);
			volumeSliderCont.addView(volumeSlider);

			//audio2 = document.createElement("audio");
			audio.src = data.mp3_url;
			audio.play();
			startLoadingModal();
			/*audio.addEventListener("ended",function() {
		        Toast("has ended");
		    }); */


		    //showArtist and related songs
		    right.setAttribute('id', 'rightContModal')
		    showRelatedModal(right, id, type);
		}
		catch(E){
			alert(E.toString()+response);
		}
	})
});


function startLoadingModal() {
	//$('#playerRanger').val(wavesurfer.getCurrentTime());
	var progress1 = new Rodz.ProgressIndicator('player_progress_modal');
	var percent = audio.currentTime / audio.duration * 100;
	progress1.setValue(percent);
	//$('#player_duration').html(formatTime(audio.duration))
	if (audio.currentTime != audio.duration) {
		setTimeout(startLoadingModal, 1000);
	}
}

function showRelatedModal(right, id, type) {
	$.post("handler.php", {getRelated:id, type:type}, function(response, status) {
		right.setHeight($('#modalContent3').height() - $('#top_bar_modal').height());
		right.css('overflow-y', 'auto');
		right.removeAllViews();
		try{
			var rows = JSON.parse(response);

			for(var row of rows){
				right.addView(mobileView(row));
			}
		}
		catch(E){
			alert(E.toString()+response);
		}
	})
}

function mobileView(row) {
	var song = new Rodz.Div();
	song.addClasses(['w3-row', 'playMusic', 'mb-10']);
	song.setAttribute('data', row.id);
	song.setAttribute('type', 'malawi');

	var left = new Rodz.Div();
	left.addClasses(['w3-col', 's3', 'w3-center']);
	song.addView(left);

	var iv = new Rodz.ImageView();
	iv.setAttribute('src', row.artwork);
	iv.setAttribute('width', '80%');
	iv.addClasses(['rounded']);
	left.addView(iv);

	var right = new Rodz.Div();
	right.addClasses(['w3-col', 's9']);
	song.addView(right);

	var content = new Rodz.Label();
	content.setText(row.title);
	content.addClasses(['block']);
	right.addView(content);

	var artist = new Rodz.Label();
	if (row.featured.length > 1) {
		artist.setText(row.name+" ft "+row.featured);
	}
	else{
		artist.setText(row.name);
	}
	artist.addClasses(['bold', 'block']);
	right.addView(artist);

	var hr = new Rodz.Hr();
	right.addView(hr);

	return song;
}