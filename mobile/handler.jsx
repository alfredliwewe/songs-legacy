const {useState, useEffect, useContext, createContext} = React;
const Main = createContext({});
const HomeContext = createContext({});
const {Switch,RadioGroup, FormControlLabel, Radio,EditText,createTheme,ThemeProvider,Tab,Tabs,Box,Dialog,DialogTitle,
    DialogContent,
    DialogContentText, Rating,
    DialogActions} = MaterialUI;

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

let theme = createTheme({
	palette: {
        //mode: themeName == "Dark" ? 'dark' : 'light',
		primary: {
			main: '#E95420',
		},
		secondary: {
			main: '#edf2ff',
		},
	},
});

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Welcome(){
    const [page, setPage] = useState("listen_now"); //listen_now
    const [playlist,setPlaylist] = useState([]);
    const [playIndex,setPlayIndex] = useState(-1);
    const [isPlaying,setIsPlaying] = useState(false);
    const [pressed,setPressed] = useState(false); //this is to prevent audio from playing on startup
    const [activeArtist,setActiveArtist] = useState({});
    const [activeList,setActiveList] = useState({});
    const [activeChart,setActiveChart] = useState({});
    const [open,setOpen] = useState({
        download:true
    })
    const [current,setCurrent] = useState({
        id:0,
        resampled_artwork:"logo.png",
        artist_data:{},
        color:"77,0,77"
    });
    const [duration,setDuration] = useState({
        current:0,
        total:0
    })

    useEffect(()=>{
        //check if its play song page

        let au = document.getElementById("audio");
        if(au != null){
            au.addEventListener("ended", function(){
                $('#nextButton').click();
            },false);
        }

        //get playlist from previous play
        $.post("web-handler.php", {getLastList:userObj.id}, function(response){
            try{
                let res = JSON.parse(response);

                if(res.status){
                    setPlaylist(res.playlist);
                    //setPlayIndex(res.playIndex);

                    setTimeout(()=>{
                        setPressed(true);
                    }, 4000);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }, []);

    useEffect(()=>{
        //
        if(playlist.length > 0){
            setPlayIndex(-1);
            setPlayIndex(0);

            //save this playlist
            if(pressed){
                $.post("web-handler.php", {savePlaylist:playlist.map(r=>r.song_id).join(","), user:userObj.id}, function(response){
                    Toast("Saving list - " + response);
                })
            }
            else{
                //Toast("Not pressed");
            }
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
            if(current != null){
                setCurrent(current)
                if(pressed){
                    if(current.mp3_url.indexOf("http") == -1 && current.website != "mdundo"){
                        audio.src= config.host+"/songs/"+current.mp3_url;
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
                            $.post("web-handler.php", {saveSongPlay:current.song_id,percent:100}, function(){
                                //
                            })
                            setPlayIndex(playIndex+1);
                        }
                        else{
                            setIsPlaying(false);
                        }
                    }

                    //set media session
                    try{
                        navigator.mediaSession.metadata = new MediaMetadata({
                            title: current.title,
                            artist: current.artist_data.name,
                            album: '',
                            artwork: [
                                { src: config.host+'artwork/'+current.resampled_artwork,   sizes: '96x96',   type: 'image/png' },
                                { src: current.artwork, sizes: '128x128', type: 'image/png' },
                            ]
                        });
            
                        navigator.mediaSession.setActionHandler('play', () => {
                            document.getElementById("audio").play();
                            navigator.mediaSession.playbackState = 'playing';
                        });
                        navigator.mediaSession.setActionHandler('pause', () => {
                            document.getElementById("audio").pause();
                            navigator.mediaSession.playbackState = 'paused';
                        });
                        navigator.mediaSession.setActionHandler('stop', () => { /* Code excerpted. */ });
                        navigator.mediaSession.setActionHandler('seekbackward', () => { /* Code excerpted. */ });
                        navigator.mediaSession.setActionHandler('seekforward', () => { /* Code excerpted. */ });
                        navigator.mediaSession.setActionHandler('seekto', () => { /* Code excerpted. */ });
                        navigator.mediaSession.setActionHandler('previoustrack', () => {
                            if(playIndex != 0){
                                //save audio played
                                $.post("web-handler.php", {saveSongPlay:current.song_id,percent:(audio.currentTime/audio.duration)*100}, function(){
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
                                $.post("web-handler.php", {saveSongPlay:current.song_id,percent:(audio.currentTime/audio.duration)*100}, function(){
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
                }
            }
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

    useEffect(() => {
        //update list active song
        if(current.song_id != undefined){
            $.post("web-handler.php", {updateListActive:current.song_id,user:userObj.id}, function(response){
                //Toast(response);
            })
        }
    }, [current]);

    return(
        <Main.Provider value={{page,setPage,playlist,setPlaylist,playIndex,setPlayIndex,current,setCurrent,duration,setDuration,isPlaying,setIsPlaying,activeArtist,setActiveArtist,activeList,setActiveList,activeChart,setActiveChart,pressed,setPressed}}>
            <ThemeProvider theme={theme}>
                {/*<TopBar />*/}
                <MainContent />
                <BottomPlayer />
                {first_launch && 
                <DownloadApp open={open.download}/>}
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
    const {page,setPage,
        activeChart,setActiveChart} = useContext(Main);

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
            <div>
                {charts.map((chart) => {
                    let artists = [];
                    chart.songs.map((song) => {
                        if(artists.length < 14){
                            artists.push(song.name);
                        }
                    });
                    return (<div>
                            <div className="w3-padding clearfix">
                                <font style={{color:"var(--orange-600)"}} className="bold font">{chart.name}</font>
                                <Chip label="Play All" sx={{ml:2}} onClick={e=>{
                                    //play all
                                    setPlaylist(chart.songs);
                                }} />
                            </div>
                            <div className="w3-row w3-hover-light-grey" onClick={e=>{
                                setActiveChart(chart);
                                setPage("chartDetails");
                            }}>
                                
                                <div className="w3-col" style={{width:"150px"}}>
                                    <div className="w3-padding-small">
                                        <img src={"uploads/"+chart.picture} width="100%" />
                                        
                                    </div>
                                </div>
                                <div className="w3-rest">
                                    <font className="block font">{chart.name}</font>
                                    <font className="block font w3-small w3-opacity">{artists.join(", ")}</font>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

function WelcomePage(){
    const [categories,setCategories] = useState([])
    const [adverts,setAdverts] = useState([])
    const [genres,setGenres] = useState([]);
    const [byCountries,setByCountries] = useState([]);
    const [firstAdvert,setFirstAdvert] = useState({});
    const [all,setAll] = useState({
        second:[],
        playlists:[]
    });
    const [open,setOpen] = useState({
        advert:false
    })
    const {playlist,setPlaylist,pressed,setPressed} = useContext(Main);
    const dummy = [
        {
            tag:"Trending",
            title:"Listen to beats wiz playlist",
            img:"images/eli.webp"
        },
        {
            tag:"Important",
            title:"Radio 2 Inspirations",
            img:"images/blog-single.jpg"
        },
        {
            tag:"Trending",
            title:"Exclusive from Alexious",
            img:"images/5.png"
        }
    ];

    const openTag = (event) => {
        var element = event.target;
        Toast($(element).text());
    }

    const getData = () => {
        //render categories
        $.get(`web-handler.php?getProductsHome=${userObj.id}&user=`+userObj.id, function(obj, status){
            //try{
                //var obj = JSON.parse(response);
                const categories = obj.categories;
                const adverts = obj.adverts;
                setAll(obj);
                //setByCountries(obj.second);
                //Toast(obj.second.length+" - as length");
                
                setCategories(categories);
                setAdverts(adverts);
                setGenres(obj.genres);
            /*}
            catch(E){
                alert(E.toString());
            }*/
        });
    }

    useEffect(()=>{
        getData();
    }, []);

    useEffect(()=>{
        if(adverts.length > 0){
            setFirstAdvert(adverts.filter(r=>r.isImage)[0]);
        }
    }, [adverts]);

    return (
        <HomeContext.Provider value={{byCountries,setByCountries}}>
            <div className="px-2 py-2">
                <Fab size="small" sx={{height:"32px",width:"33px",boxShadow:"none"}}>
                    <font className="w3-large">A</font>
                </Fab>
                <Chip color="success" sx={{ml:2,px:1}} label="Music"/>
                <Chip color="secondary" label="Gossip" sx={{ml:1,px:2}} />
                <Chip color="secondary" label="Advertise" onClick={e=>setOpen({...open, advert:true})} sx={{ml:1,px:2}} />
            </div>
            <Playlists rows={all.playlists} />

            {adverts.filter(r=>r.isImage).length > 0 && <>
                <div className="border p-2 bg-gray-100 rounded-lg m-2">
                    <div className="w3-row">
                        <div className="w3-col s9">
                            <font className="block w3-small w3-opacity bold">{firstAdvert.company}</font>
                            <font>{firstAdvert.title}</font>
                        </div>
                        <div className="w3-rest clearfix">
                            <Chip size="small" variant="outlined" className="float-right" label="Advert"/>
                        </div>
                    </div>
                    
                    <img src={"uploads/"+firstAdvert.file} width={"100%"} className="w3-round my-2"/>
                    <p>{firstAdvert.description}</p>
                    <div className="py-1 clearfix">
                        <Button variant="outlined" sx={{textTransform:"none",px:3}} className="w3-round-jumbo" onClick={e=>{
                            let a = document.createElement("a");
                            a.href = firstAdvert.link;
                            a.target = '_blank';
                            a.click();
                        }}>Visit Link</Button>
                        <Button variant="outlined" sx={{textTransform:"none",px:3}} color="success" className="w3-round-jumbo float-right" onClick={e=>{
                            let a = document.createElement("a");
                            a.href = `https://wa.me/${firstAdvert.phone}?text=I%20would%20like%20to%20advertise`;
                            a.target = '_blank';
                            a.click();
                        }}>
                            <i className="fab fa-whatsapp mr-2"/>
                            Ask
                        </Button>
                    </div>
                </div>
            </>}        
    
            <div id="songsTop" className="">
                <div className="w3-responsive scrollbar1">
                    <div className="w3-row pb-15 w3-hide">
                        {genres.filter((r,i) => i < 12).map((tag,id) => (
                            <Chip label={tag.name} key={id} size="small" variant="outlined" sx={{ml:1}} className="w3-text-black" onClick={openTag} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="w3-padding">
                {categories.map((category,index)=>(
                    <div key={index}>
                        <div className="pt-20 pb-10">
                            <font style={{fontFamily:'segoeBold'}} className="w3-xlarge w3-opacity">{category.category}</font>
                        </div>
                        <SongsDisplay categories={category.lists} adverts={adverts} />
                    </div>
                ))}
            </div>

            <Dialog open={open.advert} onClose={()=>setOpen({...open, advert:false})}>
                <div className="w3-padding-large">
                    <font className="w3-large block">Advertise</font>

                    <div className="my-3">
                        <div className="w3-round-large w3-light-grey w3-padding">
                            <font className="w3-opacity block mb-2">Amplify your brand with targeted web advertising. Reach your audience today!</font>
                            <font className="block">200 people would see your business today</font>
                            <div className="pt-1 pb-2">
                                <button onClick={e=>{
                                    let a = document.createElement("a");
                                    a.href = 'https://wa.me/+265985910913?text=I%20would%20like%20to%20advertise';
                                    a.target = '_blank';
                                    a.click();
                                }} className="bg-green-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full border-0 outline-none ml-2" id="revise">
                                    <i className="fab fa-whatsapp mr-2"/>
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="clearfix py-2">
                        <Button variant="contained" color="error" sx={{px:2}} className="w3-round-jumbo float-right" onClick={()=>setOpen({...open, advert:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </HomeContext.Provider>
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

function Settings(){
    const [open,setOpen]= useState({
        refresh:false,
        theme:false,
        accent:false,
        media:false,
        about:false
    });

    const [theme,setTheme] = useState(themeName);

    const changeMode = () => {
        if(theme == "Light"){
            //set dark

            $.get("web-handler.php?setTheme=light", function(res,s){
                $('#theme-changer').load("light.css");
            })
            //themeName = "Dark";
        }
        else{
            //set light

            $.get("web-handler.php?setTheme=dark", function(res,s){
                $('#theme-changer').load("dark.css");
            });
            //themeName = "Light";
        }
    }

    useEffect(()=>{
        //
        themeName = theme;
        changeMode();
    }, [theme]);

    return (
        <>
            <div className="w3-padding">
                <h2>Settings</h2>

                <div className="pt-20">
                    <font>Music Sources</font>
                    <div className="w3-padding rounded w3-light-grey">
                        <div className="w3-row">
                            <div className="w3-col s2 pt-10 w3-center">
                                <i className="fa fa-globe"/>
                            </div>
                            <div className="w3-col s10">
                                <font className="block">Music locations</font>
                                <Button className="alert-primary" startIcon={<i className="fa fa-folder-plus"/>} size="small">Add Location</Button>
                            </div>
                        </div>
                    </div>
                    <div className="w3-padding rounded w3-light-grey" style={{marginTop:"5px"}}>
                        <div className="w3-row" onClick={e=>{
                            setOpen({...open, refresh:!open.refresh});
                        }}>
                            <div className="w3-col s2 pt-10 w3-center">
                                <i className="fa fa-wrench"/>
                            </div>
                            <div className="w3-col s9">
                                <font className="block">Refresh Libraries</font>
                                <Button className="alert-primary" size="small" sx={{textTransform:"none",background:"rgba(0,0,0,.3)"}}>Refresh</Button>
                            </div>
                            <div className="w3-col s1 pt-10">
                                <i className="fa fa-angle-down"/>
                            </div>
                        </div>
                        {open.refresh ? <>
                            <hr />
                            <div className="w3-row" onClick={e=>{
                                setOpen({...open, refresh:true});
                            }}>
                                <div className="w3-col s2 pt-10 w3-center">
                                    &nbsp;
                                </div>
                                <div className="w3-col s9">
                                    <font className="block">If you are not seeing any media from your library locations, you can re-index your library now</font>
                                    <font className="block w3-text-brown">Manage System Indexing Settings</font>
                                </div>
                                <div className="w3-col s1 pt-10">
                                    
                                </div>
                            </div>
                        </>:""}
                    </div>
                </div>

                <div className="pt-20">
                    <font>Personalization</font>
                    <div className="w3-padding rounded w3-light-grey" style={{marginTop:"5px"}}>
                        <div className="w3-row" onClick={e=>{
                            setOpen({...open, theme:!open.theme});
                        }}>
                            <div className="w3-col s2 pt-10 w3-center">
                                <i className="fa fa-paint-brush"/>
                            </div>
                            <div className="w3-col s9">
                                <font className="block">App Theme</font>
                                <font>Light mode</font>
                            </div>
                            <div className="w3-col s1 pt-10">
                                <i className="fa fa-angle-down"/>
                            </div>
                        </div>
                        {open.theme ? <>
                            <hr />
                            <div className="w3-row">
                                <div className="w3-col s2 pt-10 w3-center">
                                    &nbsp;
                                </div>
                                <div className="w3-col s9">
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                        >
                                        <FormControlLabel value="female" checked={theme == "Light"} onChange={e=>setTheme(e.target.checked ? "Light":"Dark")} control={<Radio />} label="Light Mode" />
                                        <FormControlLabel value="male" checked={theme == "Dark"} onChange={e=>setTheme(e.target.checked ? "Dark":"Light")} control={<Radio />} label="Dark Mode" />
                                    </RadioGroup>
                                </div>
                                <div className="w3-col s1 pt-10">
                                    
                                </div>
                            </div>
                        </>:""}
                    </div>
                    <div className="w3-padding rounded w3-light-grey" style={{marginTop:"5px"}}>
                        <div className="w3-row" onClick={e=>{
                            setOpen({...open, accent:!open.accent});
                        }}>
                            <div className="w3-col s2 pt-10 w3-center">
                                <i className="fa fa-palette"/>
                            </div>
                            <div className="w3-col s9">
                                <font className="block">Accent Color</font>
                                <font>Blue</font>
                            </div>
                            <div className="w3-col s1 pt-10">
                                <i className="fa fa-angle-down"/>
                            </div>
                        </div>
                        {open.accent ? <>
                            <hr />
                            <div className="w3-row">
                                <div className="w3-col s2 pt-10 w3-center">
                                    &nbsp;
                                </div>
                                <div className="w3-col s9">
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="female"
                                        name="radio-buttons-group"
                                        >
                                        <FormControlLabel value="female" control={<Radio />} label="Blue" />
                                        <FormControlLabel value="male" control={<Radio />} label="Orange" />
                                        <FormControlLabel value="other" control={<Radio />} label="Green" />
                                    </RadioGroup>
                                </div>
                                <div className="w3-col s1 pt-10">
                                    
                                </div>
                            </div>
                        </>:""}
                    </div>
                </div>

                <div className="pt-20">
                    <font>Media Info</font>
                    <div className="w3-padding rounded w3-light-grey" style={{marginTop:"5px"}}>
                        <div className="w3-row" onClick={e=>{
                            setOpen({...open, media:!media.theme});
                        }}>
                            <div className="w3-col s2 pt-10 w3-center">
                                <i className="fa fa-globe"/>
                            </div>
                            <div className="w3-col s10">
                                <font className="block">Look up missing album art and artist art online</font>
                                On <Switch label="Sample" defaultChecked />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20">
                    <font>About</font>
                    <div className="w3-padding rounded w3-light-grey" style={{marginTop:"5px"}}>
                        <div className="w3-row" onClick={e=>{
                            setOpen({...open, about:!open.about});
                        }}>
                            <div className="w3-col s2 pt-10 w3-center">
                                <img src="images/wp.png" width={"17"}/>
                            </div>
                            <div className="w3-col s9">
                                <font className="block">Amuze Player</font>
                                <font>@2023 Rodz Tecknologez. All rights reserved</font>
                                <font className="block">Version 1.0</font>
                            </div>
                            <div className="w3-col s1 pt-10">
                                <i className="fa fa-angle-down"/>
                            </div>
                        </div>
                        {open.about ? <>
                            <hr />
                            <div className="w3-row" onClick={e=>{
                                setOpen({...open, refresh:true});
                            }}>
                                <div className="w3-col s2 pt-10 w3-center">
                                    &nbsp;
                                </div>
                                <div className="w3-col s9">
                                    <font className="block">If you are not seeing any media from your library locations, you can re-index your library now</font>
                                    <font className="block w3-text-brown">Manage System Indexing Settings</font>
                                </div>
                                <div className="w3-col s1 pt-10">
                                    
                                </div>
                            </div>
                        </>:""}
                    </div>
                </div>
                <Link href="#" sx={{display:"block",mt:2,mb:2}}>Help</Link>
                <Link href="#" sx={{display:"block"}}>Feedback</Link>
            </div>
        </>
    )
}

function Playlists(props){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist,setActiveList,activeList} = useContext(Main);
    return (
        <>
            <div className="w3-responsive scrollbar1">
                <div className="w3-row"> {/*style={{width:((window.innerWidth * props.rows.length)+10)+"px"}}*/}
                    {props.rows.map((row,index)=>(
                        <div className="w3-col s6 p-1" onClick={e=>{ /*style={{width:window.innerWidth+"px"}}*/
                            setActiveList(row);
                            setPage("listDetails")
                        }} key={row.id}>
                            <div className="rounded" style={{position:"relative"}}>
                                <img src={"uploads/"+row.picture} width={"100%"} className="rounded" />
                                <Chip label={"User made"} sx={{position:"absolute",top:"10px",left:"10px"}} size="small" color="secondary" />
                                <div className="w3-padding rounded-bottom" style={{background:"linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.9))",position:"absolute",bottom:"0",left:"0",width:"100%"}}>
                                    <font className="font-semibold w3-text-white">{row.name}</font>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

function SongsGroupDisplay(props){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist,pressed,setPressed} = useContext(Main);
    const {byCountries,setByCountries} = useContext(HomeContext);

    useEffect(()=>{
        //Toast(byCountries.length);
    }, [byCountries]);

    return (
        <>
            <div className="w3-responsive scrollbar1">
                <div className="w3-row" style={{width:((150*props.rows.length)+10)+"px"}}>
                    {byCountries.map((row,index)=>(
                        <div className="w3-col w3-hover-text-orange pointer songPlay" onClick={e=>{
                            //setplay list
                            setPressed(true);
                            setPlaylist(row.songs);
                        }} key={row.label} style={{width:"150px"}}>
                            <div className="w3-padding-small" style={{overflowX:"hidden"}}>
                                <img src={row.artwork} width="100%" />
                                <font className="block font no-wrap">{row.label}</font>
                                <font className="block font w3-small w3-opacity">{row.names}</font>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

function DownloadApp(props){
    const [open,setOpen] = useState(props.open);

    const saveDialogLaunch = (callback) => {
        $.post("web-handler.php", {saveDialogLaunch:"true"}, res=>{
            //do nothing
            callback();
        })
    }

    return (
        <>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <DialogTitle id="alert-dialog-title">
                    Download App
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        It is better in android application
                    </DialogContentText>
                    <div className="w3-center pt-20 pb-20">
                        <MaterialUI.Button color="primary" onClick={e=>{
                            saveDialogLaunch(()=>{
                                window.location = 'download/';
                            })
                        }} fullWidth size="large" startIcon={<i className="fab fa-android" />} variant="contained">Download</MaterialUI.Button>
                    </div>
                    <Button variant="contained" color="secondary" size="large" startIcon={<i className="fa fa-globe" />} fullWidth onClick={()=>{
                        saveDialogLaunch(()=>{
                            setOpen(false)
                        })
                    }}>
                        Continue Web
                    </Button>
                </DialogContent>
                <DialogActions>
                    
                </DialogActions>
            </Dialog>
        </>
    )
}