let mySentComments = [];
let current_list = [];
var play_index = -1;

$(document).ready((event) => {
    //remove the loading

    setTimeout(()=>{
        $('#loading-start').remove();
    }, 2000);

    renderSystem()
})

async function renderSystem(){
    var div = new Rodz.Div('amuze-root');

    await new Promise(resolve => {
        ReactDOM.render(<div>
            <TopBar />
            <MainContent />
        </div>, div.view);
        resolve();
    });

    //check if its play song page

    let au = document.getElementById("audio");
    au.addEventListener("ended", function(){
        $('#nextButton').click();
    },false);

    if(window.location.href.includes("play.php")){
        //launch the player
        let data = JSON.parse(str);
        launchPlayer(data, true);
    }
    else{
        //launch listen now
        showHome();
        //paint listen now
        $('#listen_now').addClass('active');
    }

    //alter heights and padding of components
}

function FAIcon(props){
    return (
        <i className={"fa "+props.icon} />
    )
}

$(document).on('click', '.topButtons button', function(event) {
    var button = event.target;
    $('.topButtons button').removeClass('active');
    $(this).addClass("active");
    switch($(this).attr("id")){
        case "charts":
            showCharts();
            break;

        case "listen_now":
            showHome();
            break;
    }
})

function showCharts(){
    var mainContent = new Rodz.Div('main-content');

    try{
        ReactDOM.unmountComponentAtNode(mainContent.view);
    }catch(E){alert(E.toString())}

    //print the charts
    $.get("web-handler.php?getCharts", function(response, status){
        //alert(response);
        try {
            var charts = JSON.parse(response);
            ReactDOM.render(<div>
                {charts.map((chart) => (
                    <div>
                        <div className="w3-padding clearfix">
                            <font style={{color:"var(--orange-600)"}} className="bold font">{chart.name}</font>
                            <Link className="float-right" href="https://mui.com/">
                                See all
                            </Link>
                        </div>
                        <div className="w3-row">
                            {chart.songs.map((song) => (
                                <div className="w3-col" style={{width:"150px"}}>
                                    <div className="w3-padding-small">
                                        <img src={"../artwork/"+song.resampled_artwork} width="100%" />
                                        <font className="block font">{song.title}</font>
                                        <font className="block font w3-small w3-opacity">{song.name}</font>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>, mainContent.view);
        }
        catch(E){
            alert(E.toString()+response);
        }
    })
}

async function showHome(){
    var mainContent = new Rodz.Div('main-content');

    try{
        ReactDOM.unmountComponentAtNode(mainContent.view);
    }catch(E){alert(E.toString())}

    await new Promise(resolve => {
        ReactDOM.render(<div>
            <div id="monthlyTop"></div>
            <div id="songsTop" className="pt-25"></div>
        </div>, mainContent.view);
        resolve();
    });

    //render monthly tops
    $.get("web-handler.php?monthly", function(response, status){
        try{
            var rows = JSON.parse(response);
            let steps = [1,2,3,4];
            let i = 0;

            ReactDOM.render(<div>
                <font style={{color:"var(--orange-600)"}} className="ml-20 font">Monthly Top (20)</font>
                <div className="w3-row">
                    {steps.map(step => {
                        let songs = rows.slice((step-1)*5, (step*5));
                        return (
                            <div className="w3-col m3">
                                <div className="w3-padding-small">
                                    <div className="w3-padding-small rounded light-grey" style={{background:"#f1f1f1"}}>
                                        {songs.map(song => {
                                            i += 1;
                                            return (
                                                <div className="w3-row w3-hover-text-orange pointer">
                                                    <div className="w3-col m1"><font className="block">{i}</font>_</div>
                                                    <div className="w3-col m3">
                                                        <img src={"../artwork/"+song.resampled_artwork} className="rounded" width="30" />
                                                    </div>
                                                    <div className="w3-col m8" style={{overflowX:"hidden", paddingRight:"3px"}}>
                                                        <font className="block font no-wrap">{song.title}</font>
                                                        <font className="block font w3-small w3-opacity no-wrap">{song.artist_data.name}</font>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>, _('monthlyTop'));
        }
        catch(E){
            alert(E.toString());
        }
    });

    //render categories
    $.get("web-handler.php?getProductsHome=1&user="+user_id, function(response, status){
        try{
            var obj = JSON.parse(response);
            const categories = obj.mega;
            const adverts = obj.adverts;
            let tags = ["Mixes", "Music", "Live","African", "Dance-Pop", "Rhythm & Blues", "Rap", "Contemprary R&B"];

            const openTag = (event) => {
                var element = event.target;
                Toast($(element).text());
            }
            //
            ReactDOM.render(<div>
                <div>
                    {tags.map(tag => (
                        <Chip label={tag} size="small" style={{marginLeft:"8px"}} className="w3-text-black" onClick={openTag} />
                    ))}
                </div>
                <SongsDisplay categories={categories} adverts={adverts} />
            </div>, _('songsTop'));
        }
        catch(E){
            alert(E.toString()+response);
        }
    })
}

$(document).on('click', '.songPlay', function(event){
    window.location = 'play.php?v='+$(this).attr('data');
});

function printReactError(id, msg){
	var alert_cont = new Rodz.Div(id);
	ReactDOM.render(<MaterialUI.Alert severity="error">{msg}</MaterialUI.Alert>, alert_cont.view);
}

function printReactSuccess(id, msg){
	var alert_cont = new Rodz.Div(id);
	ReactDOM.render(<MaterialUI.Alert severity="success">{msg}</MaterialUI.Alert>, alert_cont.view);
}

function launchPlayer(data, related){
    var content = new Rodz.Div('main-content');
    //play the song
    let aud = document.getElementById("audio");
    aud.src = data.mp3_url;
    aud.play();
    //inflate the design
	$(content.view).load('../views/flatplayer.php', async function() {
		//resize the content panels
		let top_bar_modal = new Rodz.Div('top_bar_modal');
		let modalDisplay = new Rodz.Div('modalDisplay');
        let comments_container = new Rodz.Div('song_comments');
		/*modalDisplay.css({
			height:($(modalContent.view).outerHeight() - top_bar_modal.view.clientHeight - 10)+"px",
			overflowY:"auto"
		}) */
		//done -- print the default songs
        
        let tags = ["Mixes", "Music", "Live","African", "Dance-Pop", "Rhythm & Blues", "Rap", "Contemprary R&B"];
        const openTag = (event) => {
            var element = event.target;
            Toast($(element).text());
        }

		await new Promise((resolve) => {
			ReactDOM.render(<div>
                <div id="tags">
                    <font className="font w3-text-black">Tags:</font>
                    {data.tags.map(tag => (
                        <Chip label={tag.name} size="small" className="w3-text-black" style={{marginLeft:"8px"}} onClick={openTag} />
                    ))}
                </div>
                <PlayerLayout data={data} />
            </div>, document.getElementById('firstSongPlay'));
			resolve();
		});
		
		{Web.getArtist(data.id).then((artist) => {

			ReactDOM.render(<div className="w3-row">
				<div className="w3-col m1 clearfix">
					<img src="../images/pro_file.png" width="60" style={{borderRadius:"50%"}} className="float-right" />
				</div>
				<div className="w3-col m10 w3-padding">
					<div className="pl-30">
						<Link href={"artist.php?id="+artist.id}  className="block bold w3-large roboto">{artist.name}</Link>
						<font className="block w3-opacity">{artist.name}</font>
					</div>
				</div>
			</div>, document.getElementById('artist_profile'));
		})}

        if(related){
            $.post("web-handler.php", {getRelated:data.id, type:""}, (response2, status) => {
                try{
                    let rows = JSON.parse(response2);

                    ReactDOM.render(<div>
                        <MobileView row={data} />
                        {rows.map((row) => (
                            <MobileView row={row} />
                        ))}
                    </div>, document.getElementById('relatedPlay'));

                    current_list = rows;
                }
                catch(E){
                    alert(E.toString()+response2);
                }
            });
        }
        else{
            //Render the old list
            ReactDOM.render(<div>
                {current_list.map((row) => (
                    <MobileView row={row} />
                ))}
            </div>, document.getElementById('relatedPlay'));


            //tint the current song play
            $('.mobileView').removeClass('w3-light-grey');
            $('#mySong'+current_list[play_index].id).addClass('w3-light-grey')
        }

        //read comments
        $.post("web-handler.php", {getComments:data.id, page:1}, function(response, status){
            try{
                let comments = JSON.parse(response);

                ReactDOM.render(<div>
                    <div className="pb-15">
                        {hasLogged?<ComposeComment song={data.id} />:<MaterialUI.Alert severity="error">Login and be able to place a comment</MaterialUI.Alert>}
                    </div>
                    <div id="sentComments"></div>
                    {comments.map(comment => {
                        return (
                            <CommentView comment={comment} song={data.id} />
                        )
                    })}
                </div>, comments_container.view);
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
	})
}

$(document).on('click', '.mobileView', function(e) {
	var targetEl = e.target;
	var rippleDiv = targetEl.querySelector('.mui-ripple-primary');

	rippleDiv = document.createElement('span');
	rippleDiv.classList.add('mui-ripple-primary');
	rippleDiv.style.width = rippleDiv.style.height = Math.max(targetEl.offsetWidth, targetEl.offsetHeight) + 'px';
	targetEl.appendChild(rippleDiv);

	rippleDiv.style.left = (e.offsetX - rippleDiv.offsetWidth / 2) + 'px';
	rippleDiv.style.top = (e.offsetY - rippleDiv.offsetHeight / 2) + 'px';
	rippleDiv.classList.add('mui-ripple-primary');
	setTimeout(function() {
		rippleDiv.parentElement.removeChild(rippleDiv);
	}, 600);
});

function playerNext(){
	play_index += 1;
	if(play_index < current_list.length){
		//modalSongClick(current_list[play_index].id);
        let data = current_list[play_index];
        launchPlayer(data, false);
        history.pushState("Hello", "Title", "play.php?v="+data.id);
        document.title = data.title+" "+data.artist_data.name;
	}
}

function playerPrevious(){
	play_index -= 1;
	if(play_index >= 0){
		modalSongClick(current_list[play_index].id);
	}
}