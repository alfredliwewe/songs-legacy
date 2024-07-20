const {Stack,Slider,Fab,Drawer,Alert} = MaterialUI;


function BottomPlayer(){
    const [value, setValue] = React.useState(0);
    const [anchor,setAnchor] = useState("left");
    const {playlist,setPlaylist,playIndex,setPlayIndex,current,setCurrent,duration,setDuration,isPlaying,setIsPlaying,page,setPage,setActiveArtist,activeArtist,token,setToken} = useContext(Main);

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
        playlist:false
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
        //save duration
        $.post("web-handler.php", {saveSongPlay:token,percent:(duration.current / duration.total * 100)}, (res)=>{
            //do nothing
        })
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
        $.post("web-handler.php", {saveSongPlay:token,percent:(duration.current / duration.total * 100)}, (res)=>{
            //do nothing
        })

        if(playIndex > 0){
            setPlayIndex(playIndex-1);
        }
    }

    useEffect(()=>{
        if(duration.total != 0){
            setValue(duration.current / duration.total * 100);
        }
    },[duration]);

    return (
        <>
            <div className="w3-bottom w3-padding shadow w3-white" style={{position:"fixed",borderTop:"1px solid black"}}>
                <div className="w3-row">
                    <div className="w3-col m3">
                        <div className="w3-row">
                            <div className="w3-col m2 w3-center">
                                <i className="fa fa-stream pointer w3-hover-text-blue" onClick={e=>setState({...state,playlist:true})} />
                            </div>
                            <div className="w3-col m3">
                                <img src={"artwork/"+current.resampled_artwork} className="rounded" width="45" />
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
                    <div className="w3-col m7">
                        <div className="w3-row">
                            <div className="w3-col m3">
                                <span style={{padding:"4px"}}>
                                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={previous} style={{display:"inline-block"}}>
                                        <i className="fa fa-random w3-small" style={{fontSize:"1.3rem"}} />
                                    </span>
                                </span>

                                <span style={{padding:"4px"}}>
                                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={previous} style={{display:"inline-block"}}>
                                        <i className="fa fa-step-backward w3-small" style={{fontSize:"1.3rem"}} />
                                    </span>
                                </span>

                                <img src={"images/"+(isPlaying?"pause.png":"play.png")} style={{width:"40px",height:"40px",cursor:"pointer"}} onClick={e=>{
                                    if(isPlaying){
                                        document.getElementById('audio').pause();
                                    }
                                    else{
                                        document.getElementById('audio').play();
                                    }
                                    setIsPlaying(!isPlaying);
                                }} />

                                <span style={{padding:"4px"}}>
                                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={next} style={{display:"inline-block"}}>
                                        <i className="fa fa-step-forward w3-small" style={{fontSize:"1.3rem"}} />
                                    </span>
                                </span>

                                <span style={{padding:"4px"}}>
                                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={next} style={{display:"inline-block"}}>
                                        <i className="fa fa-sync-alt w3-small" style={{fontSize:"1.3rem"}} />
                                    </span>
                                </span>
                            </div>
                            <div className="w3-col m8 w3-padding">
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <font>{formatTime(duration.current)}</font>
                                    <Slider aria-label="Volume" size="small" value={value} onChange={handleChange} />
                                    <font>{formatTime(duration.total)}</font>
                                </Stack>
                            </div>
                        </div>
                    </div>
                    <div className="w3-col m2 pr-10">
                        <div className="w3-row">
                            <div className="w3-col m3">
                                <Fab size="small" sx={{boxShadow:"none"}}>
                                    <i className="fa fa-arrow-down" style={{fontSize:"1.3rem"}} />
                                </Fab>
                            </div>
                            <div className="w3-col m9 w3-padding">
                                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                                    <i className="fa fa-volume-up" />
                                    <Slider aria-label="Volume" size="small" value={value} onChange={handleChange} />
                                </Stack>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Drawer
                anchor={anchor}
                open={state[anchor]}
                onClose={toggleDrawer(anchor, false)}
                className="w3-white"
                sx={{zIndex:28328}}
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

            <div className="shadow w3-white w3-border-blue w3-border rounded px-2 py-3" style={{position:"fixed",bottom:"70px",left:"30px",width:"350px",display:(state.playlist?"block":"none")}}>
                <div className="w3-padding">
                    <font>Title Name</font>
                </div>
                <div className="scrollbar1" style={{maxHeight:"350px",overflowY:"auto"}}>
                    {playlist.map((song,index) => (
                        <div className={"w3-row w3-hover-text-orange pointer "+(index==playIndex?"w3-text-orange":"")} onClick={e=>setPlayIndex(index)} key={song.song_id}>
                            <div className="w3-col m1"><font className="block w3-small w3-opacity">{index+1}</font></div>
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
                        <Alert severity="info" sx={{mt:2}}>No songs in the list</Alert>
                    </>:""}
                </div>
                <Button variant="contained" sx={{mt:2}} onClick={e=>setState({...state, playlist:false})} fullWidth color="secondary">Close</Button>
            </div>
        </>
    )
}