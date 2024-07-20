const {useState, useEffect, useContext, createContext} = React;
const Main = createContext({});
let {Chip, Avatar, Link, Typography,ThemeProvider,createTheme} = MaterialUI;

let theme = createTheme({
	palette: {
        mode: 'dark',
		primary: {
			main: '#E95420',
		},
		secondary: {
			main: '#edf2ff',
		},
	},
});

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
    let div = document.getElementById('amuze-root');

    await new Promise(resolve => {
        ReactDOM.render(<Welcome />, div);
        resolve();
    });

    //alter heights and padding of components
}

function Welcome(){
    const [page, setPage] = useState("listen_now");
    const [playlist,setPlaylist] = useState([]);
    const [playIndex,setPlayIndex] = useState(-1);
    const [isPlaying,setIsPlaying] = useState(false);
    const [hasLogged,setHasLogged] = useState(hasLogged1);
    const [activeArtist,setActiveArtist] = useState({});
    const [current,setCurrent] = useState({
        id:0,
        resampled_artwork:"logo.png",
        artist_data:{}
    });
    const [duration,setDuration] = useState({
        current:0,
        total:0
    })
    const [token,setToken] = useState(0);

    useEffect(()=>{
        //check if its play song page

        let au = document.getElementById("audio");
        if(au != null){
            au.addEventListener("ended", function(){
                $('#nextButton').click();
            },false);
        }
        

        if(window.location.href.includes("play.php")){
            //launch the player
            let data = JSON.parse(str);
            launchPlayer(data, true);
        }
        else{
            //launch listen now
            //showHome();
            //paint listen now
            //$('#listen_now').addClass('active');
        }
    }, []);

    useEffect(()=>{
        //
        if(playlist.length > 0){
            setPlayIndex(-1);
            setPlayIndex(0);
        }
    }, [playlist]);

    useEffect(()=>{
        let audio = document.getElementById("audio");
        const interval = setInterval(() => {
            //
            setDuration({current:audio.currentTime, total:audio.duration});
        }, 1000);

        if(playIndex != -1){
            let current = playlist[playIndex];
            if(current.mp3_url.indexOf("http") == -1 && current.website != "mdundo"){
                audio.src= "https://amuzeemw.com/songs/"+current.mp3_url;
            }
            else{
                audio.src = current.website == "mdundo" ? "https://mdundo.com/stream/"+current.webid : current.mp3_url;
            }
            console.log("MP3 URL::"+current.mp3_url);
            audio.play();
            setIsPlaying(true);
            audio.onended = function(){
                if(playIndex+1 < playlist.length){
                    //save audio played
                    $.post("web-handler.php", {saveSongPlay:token,percent:100}, function(){
                        //
                    })
                    /*$.post("web-handler.php", {saveDuration:token,value:100}, (res)=>{
                        //do nothing
                    })*/
                    setPlayIndex(playIndex+1);
                }
                else{
                    setIsPlaying(false);
                }
            }

            //save song played
            $.post("web-handler.php", {getSongDetails:current.id,coordinates:"", user:userObj.id,user_type:"user"}, function(response){
                try{
                    let res = JSON.parse(response);
                    setToken(res.token);
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })

            //set media session
            try{
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: current.title,
                    artist: current.artist_data.name,
                    album: '',
                    artwork: [
                        { src: 'artwork/'+current.resampled_artwork,   sizes: '96x96',   type: 'image/png' },
                        { src: current.artwork, sizes: '128x128', type: 'image/png' },
                    ]
                });
    
                navigator.mediaSession.setActionHandler('play', () => {
                    document.getElementById("audio").play();
                    navigator.mediaSession.playbackState = 'playing';
                    setIsPlaying(true);
                });
                navigator.mediaSession.setActionHandler('pause', () => {
                    document.getElementById("audio").pause();
                    navigator.mediaSession.playbackState = 'paused';
                    setIsPlaying(false);
                });
                navigator.mediaSession.setActionHandler('stop', () => { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('seekbackward', () => { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('seekforward', () => { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('seekto', () => { /* Code excerpted. */ });
                navigator.mediaSession.setActionHandler('previoustrack', () => {
                    if(playIndex != 0){
                        //save audio played
                        $.post("web-handler.php", {saveSongPlay:token,percent:(audio.currentTime/audio.duration)*100}, function(){
                            //
                        })
                        setPlayIndex(playIndex-1);
                    }
                    else{
                        setIsPlaying(false);
                    }
                });
                navigator.mediaSession.setActionHandler('nexttrack', () => {
                    if(playIndex+1 < playlist.length){
                        //save audio played
                        $.post("web-handler.php", {saveSongPlay:token,percent:(audio.currentTime/audio.duration)*100}, function(){
                            //
                        })
                        setPlayIndex(playIndex+1);
                    }
                    else{
                        setIsPlaying(false);
                    }
                });
                //navigator.mediaSession.setActionHandler('skipad', () => { /* Code excerpted. */ });
                navigator.mediaSession.playbackState = 'playing';
            }
            catch(E){
                //
                console.log(E.toString());
            }
            setCurrent(current)
        }

        return ()=>{
            clearInterval(interval);
            try{
                audio.pause();
            }
            catch(E){
                alert(E.toString());
            }
        }
    }, [playIndex]);

    return(
        <Main.Provider value={{page,setPage,playlist,setPlaylist,playIndex,setPlayIndex,current,setCurrent,duration,setDuration,isPlaying,setIsPlaying,activeArtist,setActiveArtist,hasLogged,setHasLogged,token,setToken}}>
            <ThemeProvider theme={theme}>
                <TopBar />
                <MainContent />
                <BottomPlayer />
            </ThemeProvider>
        </Main.Provider>
    )
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

function Charts(){
    const [charts,setCharts] = useState([]);
    const {playlist,setPlaylist,playIndex,setPlayIndex} = useContext(Main);

    //print the charts
    const getCharts = () => {
        $.get("web-handler.php?getCharts", function(response, status){
            //alert(response);
            try {
                var charts = JSON.parse(response);
                setCharts(charts)
            }
            catch(E){
                alert(E.toString()+response);
            }
        });
    }

    useEffect(()=>{
        getCharts();
    }, []);

    return (
        <>
            <div className="pt-20 pb-10">
                <font style={{fontFamily:'segoeBold'}} className="w3-xlarge w3-opacity">Browse some trending charts</font>
            </div>
            <div>
                {charts.map((chart) => {
                    let artists = [];
                    let artwork = "icon.png";

                    chart.songs.map((row)=>{
                        if(artwork == "icon.png"){
                            artwork = row.resampled_artwork;
                        }

                        if(artists.length < 3){
                            if(!artists.includes(row.artist_data.name)){
                                artists.push(row.artist_data.name);
                            }
                        }
                    });

                    //let artwork = chart.songs[0].resampled_artwork;
                    //artwork = artwork == undefined ? "icon.png" : artwork;

                    return(
                        <>
                            <div className="w3-col w3-hover-text-orange pointer w3-hover-light-grey rounded" style={{width:"150px"}} onClick={e=>{
                                //play all
                                setPlaylist(chart.songs);
                            }}>
                                <div className="w3-padding-small">
                                    <img src={"uploads/"+chart.picture} className="rounded" width="100%" />
                                    <font className="block font">{chart.name}</font>
                                    <font className="block font w3-small w3-opacity">{artists.join(", ")+" and many more"}</font>
                                </div>
                            </div>
                        </>
                    )}
                )}
            </div>
        </>
    )
}

function WelcomePage(){
    const [steps, setSteps] = useState([1,2,3,4]);
    let tags = ["Mixes", "Music", "Live","African", "Dance-Pop", "Rhythm & Blues", "Rap", "Contemprary R&B"];
    const [rows,setRows] = useState([])
    const [categories,setCategories] = useState([])
    const [adverts,setAdverts] = useState([])
    const [genres,setGenres] = useState([]);
    const {playlist,setPlaylist} = useContext(Main);
    const [grand,setGrand] = useState({
        categories:[]
    });

    const getMonthly = () => {
        //render monthly tops
        $.get("web-handler.php?monthly", function(response, status){
            try{
                var rows = JSON.parse(response);
                setRows(rows);
            }
            catch(E){
                alert(E.toString()+response);
            }
        });
    }

    const openTag = (event) => {
        var element = event.target;
        Toast($(element).text());
    }

    const getData = () => {
        //render categories
        $.get("web-handler.php?getProductsHome=1&user="+userObj.id+"&type=visitor", function(obj, status){
            //try{
                //var obj = JSON.parse(response);
                if(obj != undefined){
                    setGrand({...grand, ...obj});
                    //const categories = obj.mega;
                    //const adverts = obj.adverts;
                    
                    //setCategories(obj.mega);
                    setAdverts(obj.adverts != undefined ? obj.adverts : []);
                    setGenres(obj.genres != undefined ? obj.genres : []);
                }
                else{
                    Toast("Can not parse response");
                }
            /*}
            catch(E){
                alert("Its here -- "+E.toString()+response);
            }*/
        });
    }

    useEffect(()=>{
        getMonthly();
        getData();
    }, []);

    const playAllMonthly = () => {
        setPlaylist(rows);
    }

    return (
        <div>
            <div id="monthlyTop">
                <div>
                    <font style={{color:"var(--orange-600)"}} className="ml-20 font">Monthly Top (20)</font> 
                    <Chip 
                        avatar={<Avatar><i className="fa fa-play"/></Avatar>} 
                        label="Play All" size="small" 
                        sx={{ml:2}} 
                        onClick={playAllMonthly}
                        color="primary" />
                    <div className="w3-row">
                        {steps.map((step,io) => {
                            let songs = rows.slice((step-1)*5, (step*5));
                            return (
                                <div className="w3-col m3" key={io}>
                                    <div className="w3-padding-small">
                                        <div className="w3-padding-small rounded light-grey" style={{background:"#f1f1f1"}}>
                                            {songs.map((song,i) => {
                                                //i += 1;
                                                return (
                                                    <div className="w3-row w3-hover-text-orange pointer" key={song.song_id}>
                                                        <div className="w3-col m1"><font className="block">{i+1 +((step-1)*5)}</font>_</div>
                                                        <div className="w3-col m3">
                                                            <img src={"artwork/"+song.resampled_artwork} style={{background:"#eee"}} className="rounded" width="30" />
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
                </div>
            </div>
            <div id="songsTop" className="pt-25">
                <div>
                    <div className="pb-15">
                        {genres.filter((r,i) => i < 12).map((tag,id) => (
                            <Chip label={tag.name} key={id} size="small" variant="outlined" style={{marginLeft:"8px"}} className="w3-text-black" onClick={openTag} />
                        ))}
                    </div>
                    {grand.categories.map((category)=>(
                        <>
                            <div className="pt-20 pb-10">
                                <font style={{fontFamily:'segoeBold'}} className="w3-xlarge w3-opacity">{category.category}</font>
                            </div>
                            <SongsDisplay categories={category.lists} adverts={adverts} />
                        </>
                    ))}
                </div>
            </div>
            <h1>&nbsp;</h1>
            <h1>&nbsp;</h1>
        </div>
    )
}

$(document).on('click', '.songPlay', function(event){
    //window.location = 'play.php?v='+$(this).attr('data');
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