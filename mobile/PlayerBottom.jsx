const {Stack,Slider,Fab,Drawer,Alert} = MaterialUI;


function BottomPlayer(){
    const [value, setValue] = React.useState(0);
    const [anchor,setAnchor] = useState("left");
    const {playlist,setPlaylist,playIndex,setPlayIndex,current,
        setCurrent,duration,setDuration,isPlaying,setIsPlaying,page,
        setPage,setActiveArtist,activeArtist,pressed,setPressed
    } = useContext(Main);

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });
    
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const next = () => {
        if(playIndex+1 < playlist.length){
            setPlayIndex(playIndex+1);
        }
    }

    const formatTime = (seconds) => {
        let minutes = Math.floor(seconds / 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
        seconds = Math.floor(seconds % 60);
        seconds = (seconds >= 10) ? seconds : "0" + seconds;
        return minutes + ":" + seconds;
    }

    const previous = () => {
        if(playIndex > 0){
            setPlayIndex(playIndex-1);
        }
    }

    useEffect(()=>{
        if(duration.total != 0){
            setValue(duration.current / duration.total * 100);
        }
    },[duration]);

    useEffect(()=>{
        //set height
        $('#main_content').css('padding-bottom', ($('#bottom_bar').height()+10)+"px");
    }, []);

    return (
        <>
            <div id="bottom_bar" className="w3-bottom" style={{position:"fixed",display:(page=="player"?"none":"block"),background:"linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.9))"}}>
                <div className="w3-padding rounded-lg m-1 shadow w3-text-white" style={{background:`rgb(${current.color})`}}>
                    <div className="w3-hide">
                        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                            <font className="w3-small">{formatTime(duration.current)}</font>
                            <Slider aria-label="Volume" size="small" value={value} onChange={handleChange} />
                            <font className="w3-small">{formatTime(duration.total)}</font>
                        </Stack>
                    </div>
                    <div className="w3-row">
                        <div className="w3-col s7">
                            <div className="w3-row">
                                <div className="w3-col m2 w3-center w3-hide">
                                    <i className="fa fa-stream pointer w3-hover-text-blue" onClick={e=>setState({...state,left:true})} />
                                </div>
                                <div className="w3-col s3">
                                    <img src={"artwork/"+current.resampled_artwork} onClick={e=>setPage("player")} className="rounded" width="90%" />
                                </div>
                                <div className="w3-rest pr-10">
                                    <font className="block" style={{whiteSpace: "nowrap"}}>{current.title}</font>
                                    <font className="w3-opacity pointer w3-text-hover-blue" onClick={e=>{
                                        setPage("artist_details");
                                        setActiveArtist(current.artist_data);
                                    }} style={{whiteSpace: "nowrap"}}>{current.artist_data.name}</font>
                                </div>
                            </div>
                        </div>
                        <div className="w3-col s5">
                            <Fab size="small" sx={{boxShadow:"none",display:"none"}} onClick={previous}>
                                <i className="fa fa-step-backward" style={{fontSize:"1.3rem"}} />
                            </Fab>
                            <span style={{padding:"4px"}}>
                                <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={previous} style={{display:"inline-block"}}>
                                    <i className="fa fa-step-backward w3-small" style={{fontSize:"1.3rem"}} />
                                </span>
                            </span>
                            {/*<Fab size="small" sx={{boxShadow:"none",ml:2}} onClick={e=>{
                                if(isPlaying){
                                    document.getElementById('audio').pause();
                                }
                                else{
                                    document.getElementById('audio').play();
                                }
                                setIsPlaying(!isPlaying);
                            }}>
                                <i className={"fa " +(isPlaying ? "fa-pause":"fa-play")} style={{fontSize:"1.3rem"}} />
                            </Fab>*/}
                            <img onClick={e=>{
                                setPressed(true);
                                if(isPlaying){
                                    document.getElementById('audio').pause();
                                }
                                else{
                                    document.getElementById('audio').play();
                                }
                                setIsPlaying(!isPlaying);
                            }} src={"images/"+(isPlaying?"pause.png":"play.png")} width={45}/>
                            <Fab size="small" sx={{boxShadow:"none", ml:2,display:"none"}} onClick={next}>
                                <i className="fa fa-step-forward" style={{fontSize:"1.3rem"}} />
                            </Fab>
                            <span style={{padding:"4px"}}>
                                <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={next} style={{display:"inline-block"}}>
                                    <i className="fa fa-step-forward w3-small" style={{fontSize:"1.3rem"}} />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <div className="w3-row w3-text-white" style={{background:"linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.9))"}}>
                        <div className={"w3-col s3 w3-center py-2 "+(page == "listen_now" ? "":"w3-opacity")} onClick={e=>setPage("listen_now")}>
                            <i className="fa fa-home w3-large"/>
                            <br />
                            Home
                        </div>
                        <div className={"w3-col s3 w3-center py-2 "+(page == "search" ? "":"w3-opacity")} onClick={e=>setPage("search")}>
                            <i className="fa fa-search w3-large"/>
                            <br />
                            Search
                        </div>
                        <div className={"w3-col s3 w3-center py-2 "+(page == "listen_now" ? "":"w3-opacity")} onClick={e=>setPage("library")}>
                            <i className="fa fa-list-ol w3-large"/>
                            <br />
                            Your Library
                        </div>
                        <div className={"w3-col s3 w3-center py-2 "+(page == "account" ? "":"w3-opacity")} onClick={e=>setPage("account")}>
                            <i className="far fa-user-circle w3-large"/>
                            <br />
                            Profile
                        </div>
                    </div>
                </div>
            </div>

            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                className="w3-white"
              >
                <div style={{width:"350px"}} className="w3-padding w3-white">
                    <h4>Playlist</h4>
                    {playlist.map((song,index) => (
                        <div className="w3-row w3-hover-text-orange pointer" onClick={e=>setPlayIndex(index)} key={song.song_id}>
                            <div className="w3-col m1"><font className="block">{index+1}</font>_</div>
                            <div className="w3-col m3">
                                <img src={"artwork/"+song.resampled_artwork} style={{background:"#eee"}} className="rounded" width="30" />
                            </div>
                            <div className="w3-col m8" style={{overflowX:"hidden", paddingRight:"3px"}}>
                                <font className="block font no-wrap">{song.title}</font>
                                <font className="block font w3-small w3-opacity no-wrap">{song.artist_data.name}</font>
                            </div>
                        </div>
                    ))}
                    {playlist.length == 0 ? <>
                        <Alert severity="info">No songs in the list</Alert>
                    </>:""}
                </div>
            </Drawer>
        </>
    )
}