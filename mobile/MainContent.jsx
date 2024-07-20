function MainContent(){
    const {page,setPage} = useContext(Main);

    return (
        <div id="main_content">
            {page == "listen_now" ? <WelcomePage />:
            page == "charts" ? <Charts /> :
            page == "artist_details" ? <ArtistDetails /> :
            page == "search" ? <SearchPage /> :
            page == "settings" ? <Settings /> :
            page == "player" ? <PlayerPage /> :
            page == "account" ? <Account /> :
            page == "login" ? <Login /> :
            page == "listDetails" ? <ListDetails /> :
            page == "chartDetails" ? <ChartDetails /> :
            page == "browse" ? <Browse /> :
            <>{page}</>}
        </div>
    )
}

function WelcomePage1(){
    return <>
        <h1>Hello there</h1>
    </>
}

function ArtistDetails(){
    const {page,setPage,activeArtist,setActiveArtist,playlist,setPlaylist,playIndex,setPlayIndex} = useContext(Main);
    const [songs,setSongs] = useState([]);

    const getSongs = () => {
        $.get("web-handler.php", {getAllSongs:activeArtist.id,user:userObj.id}, function(response){
            try{
                let res = JSON.parse(response);
                setSongs(res);
            }
            catch(E){
                Toast(E.toString()+response);
            }
        })
    }

    const addFav = () => {
        $.post("web-handler.php", {addFav:activeArtist.id, type:"artist",user:userObj.id}, res=>{
            //do nothing
            Toast(res)
        })
    }

    const addSongFav = (song_id) => {
        $.post("web-handler.php", {addFav:song_id, type:"song",user:userObj.id}, res=>{
            //do nothing
            Toast(res)
        })
    }

    useEffect(()=>{
        getSongs();
        addFav();
    }, [activeArtist]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const artistPhoto = (url) => {
        if(url.indexOf("http") != -1){
            return url;
        }
        else{
            return "uploads/artists/"+url;
        }
    }

    return <>
        <GoBack onClick={e=>setPage("listen_now")}/>
        <div className="">
            <div className="w3-padding w3-round-large w3-light-grey">
                <div className="w3-row">
                    <div className="w3-col m4">
                        <img src={artistPhoto(activeArtist.photo)} width={"100%"} className="w3-round-large"/>
                    </div>
                    <div className="w3-col m8">
                        <div className="padding">
                            <font className="w3-large block">{activeArtist.name}</font>
                            <font className="block pt-10 w3-small">1 Album <i className="fa fa-circle w3-tiny"/> {songs.length} Songs <i className="fa fa-circle w3-tiny"/> 1 min 30 seconds </font>
                            <font className="block">Artist - {activeArtist.name}</font>
                            <div className="pt-20">
                                <Button startIcon={<i className="fa fa-play"/>} onClick={e=>setPlaylist(songs)} variant="contained" style={{textTransform:"none"}}>Play all</Button>
                                <Button startIcon={<i className="fa fa-random"/>} onClick={e=>{
                                    setPlaylist(shuffleArray(songs));
                                }} variant="contained" sx={{textTransform:"none",ml:3}}></Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="pt-20">
            <div className="w3-row">
                <div className="w3-rest">
                    {songs.map((row,index)=>(
                        <div className="w3-row w3-round w3-hover-light-grey block pointer w3-hover-light-grey" onClick={e=>{
                            //setplay list
                            setPlaylist(songs);
                            addSongFav(row.song_id);
                            
                            setTimeout(()=>{
                                setPlayIndex(index);
                            }, 500);
                        }} style={{padding:"6px 16px",marginBottom:"3px"}}>
                            <div className="w3-col s2">
                                <img src={"artwork/"+(row.resampled_artwork==""?"icon.png":row.resampled_artwork)} className="rounded-0" width={"90%"}/>
                            </div>
                            <div className="w3-col s8 pr-10" style={{whiteSpace: "nowrap",overflow:"hidden"}}>
                                <font style={{paddingLeft:"4px"}} className="w3-opacity">{row.title}</font>
                                <font className="block">{activeArtist.name}</font>
                            </div>
                            <div className="w3-col s2 pt-10">
                                <img src="images/play_defaultl_icon.png" width={"24"}/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>
}

function SearchPage(){
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);
    const {page,setPage,activeArtist,setActiveArtist,playlist,setPlaylist,} = useContext(Main);
    const types = ["all", "music", "artists","charts","playlists"];
    const [previousSearch, setPreviousSearch] = useState([]);

    const [value, setValue] = React.useState(0);
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(()=>{
        let container = new Rodz.Div('topSearchResults');
        if(search.length > 0){
            //
            $.post("web-handler.php", {searchModal:search,type:types[value]}, function(response, status){
                //console.log(response);
                try{
                    var rows = JSON.parse(response);
                    setResults(rows);
                }
                catch(E){
                    alert(E.toString()+response);
                }
            });
            container.css('display','block')
        }
        else{
            setResults([]);
            container = new Rodz.Div('topSearchResults');
            container.css('display','none')
        }
    },[search,value]);

    const getSearchHistory = () => {
        $.post("web-handler.php", {getSearchHistory:userObj.id}, res=>setPreviousSearch(res));
    }

    const addSongFav = (song_id) => {
        $.post("web-handler.php", {addFav:song_id, type:"song",user:userObj.id}, res=>{
            //do nothing
            Toast(res)
        })
    }

    const saveSearch = (data,type) => {
        $.post("web-handler.php", {saveSearch:userObj.id, type, ref:data}, res=>{
            //do nothing
            Toast(res);
        })
    }

    useEffect(()=>{
        getSearchHistory();
    }, []);

    return (
        <>
            <div className="w3-padding-small">
                <font className="block w3-large">Search</font>

                <TextField label="Search song, artist" size="small" sx={{mt:2,mb:2}} fullWidth value={search} onChange={e=>setSearch(e.target.value)} />
                <div className="w3-responsive">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="All" {...a11yProps(0)} style={{textTransform:"none"}} size="small" />
                            <Tab label="Music" {...a11yProps(1)} style={{textTransform:"none"}} size="small" />
                            <Tab label="Artists" {...a11yProps(2)} style={{textTransform:"none"}} size="small" />
                            <Tab label="Charts" {...a11yProps(3)} style={{textTransform:"none"}} size="small" />
                            <Tab label="Playlists" {...a11yProps(4)} style={{textTransform:"none"}} size="small" />
                        </Tabs>
                    </Box>
                </div>

                {results.length > 0 ? <div>
                    {results.map((row,index)=>(
                        <>{row.type == "song" ? <div className="w3-padding pointer w3-hover-light-grey playMusic rounded w3-text-black" onClick={e=>{
                            setPlaylist([row]);
                            setResults([]);
                            //save result
                            saveSearch(row.song_id,"song");

                            //add fav
                            addSongFav(row.song_id);
                        }} style={{textAlign:"left",alignContent:"left"}}>
                            <font className="block">{row.title}</font>
                            <font className="w3-tiny w3-opacity">{row.name}</font>
                        </div>:

                        row.type == "artist" ? <>
                            <div className="w3-padding pointer w3-hover-light-grey playMusic rounded w3-text-black" onClick={e=>{
                                setPage("artist_details")
                                setActiveArtist(row);
                                setResults([]);
                                saveSearch(row.id,"artist");
                            }} style={{textAlign:"left",alignContent:"left"}}>
                                <font className="block">{row.name}</font>
                                <font className="w3-small w3-opacity">Artist</font>
                            </div>
                        </>:
                        ""}</>
                        
                    ))}
                </div>:
                (search.length > 0 ? <Alert severity="warning">No matches found</Alert>:<>
                    <font className="p-3 mt-2 w3-large">
                        Previous Searches
                    </font>
                    {previousSearch.map((row,index)=>(
                        <div className="w3-row my-1" onClick={e=>{
                            if(row.type == "artist"){
                                setPage("artist_details")
                                setActiveArtist(row.data);
                                //setResults([]);
                            }
                            else{
                                setPlaylist([row.data]);
                            }
                        }}>
                            {row.type == "song" ? <>
                                <div className="w3-col s3 w3-center">
                                    <img src={"artwork/"+row.data.resampled_artwork} width={"60%"} className="rounded" />
                                </div>
                                <div className="w3-col s9">
                                    <font className="block">{row.data.title}</font>
                                    <font className="w3-tiny w3-opacity">{row.data.name}</font>
                                </div>
                            </>:
                            <>
                                <div className="w3-col s3 w3-center">
                                    <img src={"uploads/artists/"+row.data.resampled} width={"60%"} className="rounded" />
                                </div>
                                <div className="w3-col s9">
                                    <font className="block">{row.data.name}</font>
                                    <font className="w3-tiny w3-opacity">Artist</font>
                                </div>
                            </>}
                        </div>
                    ))}
                </>)}
            </div>
        </>
    )
}

function PlayerPage(){
    const {playlist,setPlaylist,playIndex,setPlayIndex,current,setCurrent,duration,setDuration,isPlaying,setIsPlaying,page,setPage,setActiveArtist,activeArtist} = useContext(Main);
    const [value, setValue] = React.useState(0);
    const [step,setStep] = useState("player");
    const [comments,setComments] = useState([]);
    const [data,setData] = useState({
        comments:0,
        likes:0,
        hasLiked:false,
        initial:1,
        final:1
    })

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

    const getComments = () => {
        $.post("web-handler.php", {getComments:current.song_id,page:data.initial}, function(response){
            try{
                let res = JSON.parse(response);
                setComments(res.comments);
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    useEffect(()=>{
        if(duration.total != 0){
            setValue(duration.current / duration.total * 100);
        }
    },[duration]);

    useEffect(()=>{
        if(step == "comments"){
            getComments();
        }
    }, [step,current]);

    const downloadSong = (e) => {
        if(hasLogged1){
            window.open(`web-handler.php?downloadSong=${current.id}&user=${userObj.id}`, '_blank').focus();
        }
        else{
            Toast("Please login");
        }
    }

    useEffect(()=>{
        //get the stats 
    }, []);

    const likePost = (e) => {
        //like the song
        if(hasLogged1){
            $.post("web-handler.php", {likeSong:current.song_id,user:userObj.id}, function(response){
                try{
                    let res = JSON.parse(response);
                    Toast("Success!");
                    setData({...data, hasLiked:res.hasLiked});
                }
                catch(E){
                    alert(E.toString()+response);
                }
            });
        }
        else{
            Toast("Please Login");
        }
    }

    const sendComment = (event) => {
        event.preventDefault();

        $.post("web-handler.php", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setComments([res.comment, ...comments]);
                    Toast("Sent!");
                    event.target.reset();
                }
                else{
                    Toast(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return <>
        <GoBack onClick={e=>setPage("listen_now")}/>
        <div className="w3-center pt-20 pb-20">
            <img src={"artwork/"+current.resampled_artwork} width={step=="comments"?"30%":"60%"} className="rounded" />
        </div>
        <div className="w3-padding">
            <font className="block">{current.artist_data.name}</font>
            <font className="block w3-opacity">{current.title}</font>
        </div>

        {step =="player" ? <>
            <div className="pr-10 pl-10">
                <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
                    <font className="w3-small">{formatTime(duration.current)}</font>
                    <Slider aria-label="Volume" size="small" value={value} onChange={handleChange} />
                    <font className="w3-small">{formatTime(duration.total)}</font>
                </Stack>
            </div>

            <div className="w3-center">
                <span style={{padding:"4px"}}>
                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={previous} style={{display:"inline-block"}}>
                        <i className="fa fa-random w3-small" style={{fontSize:"1.3rem"}} />
                    </span>
                </span>

                <span style={{paddingTop:"6px", paddingRight:"20px"}}>
                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={previous} style={{display:"inline-block"}}>
                        <i className="fa fa-step-backward" style={{fontSize:"1.3rem"}} />
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

                <span style={{paddingTop:"6px", paddingLeft:"20px"}}>
                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={next} style={{display:"inline-block"}}>
                        <i className="fa fa-step-forward" style={{fontSize:"1.3rem"}} />
                    </span>
                </span>

                <span style={{padding:"4px"}}>
                    <span className="play-btn2 w3-center rounded w3-hover-light-grey" onClick={next} style={{display:"inline-block"}}>
                        <i className="fa fa-thumbs-down text-danger w3-small" style={{fontSize:"1.3rem"}} />
                    </span>
                </span>
            </div>

            <div className="pl-15 pr-15 pt-40 pb-20">
                <div className="w3-row">
                    <div className="w3-col s3 w3-center" onClick={downloadSong}>
                        <i className="far fa-arrow-alt-circle-down w3-large"/>
                        <font className="block w3-small">Download</font>
                    </div>
                    <div className="w3-col s3 w3-center" onClick={e=>{
                        if(hasLogged1){
                            setStep("comments");
                        }
                        else{
                            Toast("Please Sign In");
                        }
                    }}>
                        <i className="far fa-comment-alt w3-large"/>
                        <font className="block w3-small">{data.comments} Comments</font>
                    </div>
                    <div className="w3-col s3 w3-center" onClick={likePost}>
                        <img src={"images/"+(data.hasLiked?"chakuda.png":"heart.png")} width={25}/>
                        <font className="block w3-small">{data.likes} Likes</font>
                    </div>
                    <div className="w3-col s3 w3-center">
                    <i className="fa fa-list-ol w3-large"/>
                        <font className="block w3-small">Playlist</font>
                    </div>
                </div>
            </div>
            <div className="pt-15 pb-40">
                <div className="w3-row" onClick={e=>{
                        setPage("artist_details");
                        setActiveArtist(current.artist_data);
                    }}>
                    <div className="w3-col s1">&nbsp;</div>
                    <div className="w3-col s2 w3-center">
                        <img src={"uploads/artists/"+current.artist_data.resampled} className="rounded-50" width={"70%"}/>
                    </div>
                    <div className="w3-col s9">
                        <font className="bold block" style={{fontFamily:"segoeBold"}}>{current.artist_data.name}</font>
                        <font className="block">20 songs, 0 followers</font>
                    </div>
                </div>
            </div>
        </>:
        step == "comments"?<>
            <Button size="small" variant="outlined" sx={{textTransform:"none",mb:2,mt:2, ml:3}} onClick={e=>setStep("player")}>Go Back</Button>
            <form className="w3-padding" onSubmit={sendComment}>
                <Rating name="rating" defaultValue={2.5} precision={0.5} />
                <input type="hidden" name="song" value={current.song_id}/>
                <input type="hidden" name="user" value={userObj.id}/>
                <input type="hidden" name="parent" value={0}/>
                
                <div className="w3-row">
                    <div className="w3-col s12">
                        <TextField multiline name="sendComment" label="Write comments" sx={{mb:2,mt:2}} fullWidth size="small" />
                    </div>
                    <div className="w3-col s12">
                        <Button type="submit" variant="contained" size="small">Send</Button>
                    </div>
                </div>
            </form>
            
            {data.initial > 0 ? <>
                <Link href="#" sx={{pl:3}} onClick={e=>setData({...data, initial:data.initial-1})}>Load older comments</Link>
            </>:""}
            {comments.map((row,index)=>(
                <Comment data={row}/>
            ))}
            {data.initial < Math.ceil(data.comments / 10) ? <>
                <Link href="#" sx={{pl:3}} onClick={e=>setData({...data, initial:data.initial-1})}>Show more comments</Link>
            </>:""}
        </>
        :""}
    </>
}

function Account(){
    const {page,setPage} = useContext(Main);
    const [adverts,setAdverts] = useState([])
    const [firstAdvert,setFirstAdvert] = useState({});

    const [open,setOpen] = useState({
        logout:false
    })

    const uploadFile = () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", function(event){
            let formdata = new FormData();
            formdata.append("uploadProfile", input.files[0]);
            formdata.append("user_id", userObj.id);

            post("web-handler.php", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        $('#profile1').attr('src', 'profiles/'+res.filename);
                        $('#profile2').attr('src', 'profiles/'+res.filename);
                        Toast("Success");
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    //alert(E.t)
                }
            })
        });

        input.click();
    }

    const getAdverts = () => {
        $.post("web-handler.php", {getAdverts:userObj.id}, res=>setAdverts(res));
    }

    useEffect(()=>{
        getAdverts();
    }, []);

    useEffect(()=>{
        if(adverts.length > 0){
            setFirstAdvert(adverts.filter(r=>r.isImage)[0]);
        }
    }, [adverts]);

    return (
        <>
            {hasLogged1 ? <>
                <div className="w3-row pt-10 pb-20">
                    <div className="w3-col s3 w3-center">
                        <img src={"web-handler.php?getUserPicture="+userObj.id} onClick={uploadFile} id="profile1" className="rounded" width={"80%"}/>
                    </div>
                    <div className="w3-col s9">
                        <font className="w3-large bold block">{userObj.name}</font>
                        <font className="w3-opacity block py-2">{userObj.email.length > 0 ? userObj.email : userObj.phone}</font>
                        <div>
                            <Chip label="Manage Account" size="small" />
                            <Chip label="Logout" onClick={e=>setOpen({...open, logout:true})} size="small" sx={{ml:2}} color="primary" />
                        </div>
                    </div>
                </div>

                <hr />
                <div className="w3-padding-large font-lg text-lg">
                    <i className="fa fa-arrow-up-wide-short mr-3"/>
                    Whats New
                </div>
                <div className="w3-padding-large font-lg text-lg">
                    <i className="fa fa-history mr-3"/>
                    Listening History
                </div>
                <div className="w3-padding-large font-lg text-lg">
                    <i className="fa fa-cog mr-3"/>
                    Settings and Privacy
                </div>
            </>:
            <>
                <div className="w3-row pt-10 pb-20" onClick={e=>setPage("login")}>
                    <div className="w3-col s3 w3-center">
                        <img src="images/pro_file.png" className="rounded-50" width={"40%"}/>
                    </div>
                    <div className="w3-col s9">
                        <font className="w3-large bold block">Login in / Sign Up</font>
                        <font className="w3-opacity">Login and be able to save favourite music</font>
                    </div>
                </div>

                <div className="w3-padding-small">
                    <div className="w3-round-large w3-light-grey w3-padding">
                        <font className="w3-opacity block mb-2">Experience music's magic. Join us for endless tunes. Sign up now!</font>
                        <font className="block">What would you like to do?</font>
                        <div className="pt-1 pb-2">
                            <button onClick={e=>setPage("login")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full border-0 outline-none ml-2" id="revise">Login</button>
                        </div>
                    </div>
                </div>
            </>}

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
                        <Button variant="outlined" sx={{textTransform:"none",px:3}} color="success" className="w3-round-jumbo float-right">
                            <i className="fab fa-whatsapp mr-2"/>
                            Ask
                        </Button>
                    </div>
                </div>
            </>}   

            <Dialog open={open.logout} onClose={()=>setOpen({...open, logout:false})}>
                <div className="w3-padding-large" style={{width:(0.7*window.innerWidth)+"px"}}>
                <font className="w3-large block mb-30 block">Logout</font>
                    <font className="block mb-15">Are you sure you want to logout?</font>
                    <div className="pt-10 pb-10 clearfix">
                        <span className="float-right">
                            <Button size="small"  onClick={event=>setOpen({...open, logout:false})}>Close</Button>
                            <Button size="small"  onClick={event=>{
                                window.localStorage.removeItem("user");
                                setOpen({...open, logout:false})
                                window.location = 'logout.php';
                            }}>Logout</Button>
                        </span>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function Login(){
    const {page,setPage} = useContext(Main);
    const [step,setSteps] = useState("email");
    const [email,setEmail] = useState("");
    const [errors,setErrors] = useState({
        email:"",
        login:"",
        register:""
    })

    const nextStep = () => {
        $.post("web-handler.php", {phoneStartLogin:email}, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setSteps(res.type)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const completeLogin = (event) => {
        event.preventDefault();

        $.post("web-handler.php", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    window.localStorage.setItem('user', response);
                    userObj = res;
                    hasLogged1 = true;
                    setPage("account");
                }
                else{
                    setErrors({...errors,login:res.message});
                }
            }
            catch(E){
                //
            }
        })
    }

    return (
        <>
            <div className="pt-30 pb-30 pr-30 pl-30">
                <div>
                    <img src="images/wp.png" width={"40"} onClick={e=>setPage("listen_now")} style={{width:"20"}} className="mr-10" /> 
                    <font onClick={e=>setPage("listen_now")} className="w3-large bold">Amuzee Player</font>
                </div>
                <div className="pt-30">
                    {step == "email" ? <>
                        <font>Enter your phone or email</font>
                        <TextField fullWidth value={email} onChange={e=>setEmail(e.target.value)} label="Email or phone" sx={{mb:2,mt:2}} size="small"/>
                        <Button onClick={nextStep} variant="contained">Next Step</Button>
                    </>:
                    step == "login" ? <>
                        {errors.login.length > 0 ? <Alert severity="error">{errors.login}</Alert>:""}
                        <form onSubmit={completeLogin}>
                            <input type="hidden" name="phoneLogin" value={email}/>
                            <font>Enter password</font>
                            <TextField fullWidth name="password" type="password" label="Password" sx={{mb:2,mt:2}} size="small"/>
                            <Button type="submit" variant="contained">Login</Button>
                        </form>
                    </>:
                    step == "register" ? <>
                        {errors.register.length > 0 ? <Alert severity="error">{errors.register}</Alert>:""}
                        <form onSubmit={completeLogin}>
                            <input type="hidden" name="register_phone" value={email}/>
                            <font>Welcome. Complete registration</font>
                            <TextField fullWidth name="name" label="Your name" sx={{mb:2,mt:2}} size="small"/>
                            <TextField fullWidth name="password" label="Password" type="password" sx={{mb:2,mt:2}} size="small"/>
                            <Button type="submit" variant="contained">Register</Button>
                        </form>
                    </>:
                    ""}
                </div>
            </div>
        </>
    )
}

function ListDetails(){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist,setActiveList,activeList} = useContext(Main);
    const [songs,setSongs] = useState([]);

    const getSongs = () => {
        $.post("web-handler.php", {getListSongs:activeList.id}, function(res){
            setSongs(res);
            //Toast(res.length+" - songs");
        })
    }

    useEffect(()=>{
        if(activeList.id != undefined){
            getSongs();
        }
    }, [activeList]);

    return (
        <>
            <GoBack onClick={e=>setPage("listen_now")}/>
            <div className="w3-col w3-padding" style={{width:window.innerWidth+"px"}}>
                <div className="" style={{position:"relative"}}>
                    <img src={"uploads/"+activeList.picture} width={"100%"} className="" />
                    <Chip label={"User made"} sx={{position:"absolute",top:"20px",left:"20px"}} size="small" color="primary" />
                    <div className="w3-padding-xxlarge" style={{background:"linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.9))",position:"absolute",bottom:"0",left:"0",width:"100%"}}>
                        <font className="w3-large w3-text-white">{activeList.name}</font>
                    </div>
                </div>
            </div>

            <div className="pt-20 pl-20">
                <Button startIcon={<i className="fa fa-play"/>} onClick={e=>setPlaylist(songs)} variant="contained" style={{textTransform:"none"}}>Play all</Button>
                <Button startIcon={<i className="fa fa-random"/>} onClick={e=>{
                    setPlaylist(shuffleArray(songs));
                }} variant="contained" sx={{textTransform:"none",ml:3}}></Button>
            </div>

            <div className="pt-20">
                <div className="">
                    <div className="">
                        {songs.map((row,index)=>(
                            <div className="w3-row w3-round w3-hover-light-grey block pointer w3-hover-light-grey" key={row.song_id} onClick={e=>{
                                //setplay list
                                setPlaylist(songs);
                                
                                setTimeout(()=>{
                                    setPlayIndex(index);
                                }, 500);
                            }} style={{padding:"6px 16px",marginBottom:"3px"}}>
                                <div className="w3-col s2">
                                    <img src={"artwork/"+row.resampled_artwork} className="rounded-0" width={"90%"}/>
                                </div>
                                <div className="w3-col s8 pr-10" style={{whiteSpace: "nowrap",overflow:"hidden"}}>
                                    <font style={{paddingLeft:"4px"}} className="w3-opacity">{row.title}</font>
                                    <font className="block">{row.artist_data.name}</font>
                                </div>
                                <div className="w3-col s2 pt-10">
                                    <img src="images/play_defaultl_icon.png" width={"24"}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function ChartDetails(){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist,setActiveChart,activeChart} = useContext(Main);
    const [songs,setSongs] = useState([]);

    const getSongs = () => {
        $.post("web-handler.php", {getChartSongs:activeChart.id}, function(res){
            setSongs(res);
            //Toast(res.length+" - songs");
        })
    }

    useEffect(()=>{
        if(activeChart.id != undefined){
            getSongs();
        }
    }, [activeChart]);

    return (
        <>
            <div className="w3-col w3-padding" style={{width:window.innerWidth+"px"}}>
                <div className="" style={{position:"relative"}}>
                    <img src={"uploads/"+activeChart.picture} width={"100%"} className="" />
                    <div className="w3-padding-xxlarge" style={{background:"linear-gradient(rgba(0,0,0,0.01), rgba(0,0,0,0.9))",position:"absolute",bottom:"0",left:"0",width:"100%"}}>
                        <font className="w3-large w3-text-white">{activeChart.name}</font>
                    </div>
                </div>
            </div>

            <div className="pt-20 pl-20">
                <Button startIcon={<i className="fa fa-play"/>} onClick={e=>setPlaylist(songs)} variant="contained" style={{textTransform:"none"}}>Play all</Button>
                <Button startIcon={<i className="fa fa-random"/>} onClick={e=>{
                    setPlaylist(shuffleArray(songs));
                }} variant="contained" sx={{textTransform:"none",ml:3}}></Button>
            </div>

            <div className="pt-20">
                <div className="">
                    <div className="">
                        {songs.map((row,index)=>(
                            <div className="w3-row w3-round w3-hover-light-grey block pointer w3-hover-light-grey" onClick={e=>{
                                //setplay list
                                setPlaylist(songs);
                                
                                setTimeout(()=>{
                                    setPlayIndex(index);
                                }, 500);
                            }} style={{padding:"6px 16px",marginBottom:"3px"}}>
                                <div className="w3-col s2">
                                    <img src={"artwork/"+row.resampled_artwork} className="rounded" width={"90%"}/>
                                </div>
                                <div className="w3-col s8 pr-10 w3-border-bottom" style={{whiteSpace: "nowrap",overflow:"hidden"}}>
                                    <font style={{paddingLeft:"4px"}} className="w3-opacity">{row.title}</font>
                                    <font className="block">{row.artist_data.name}</font>
                                </div>
                                <div className="w3-col s2 pt-10">
                                    <img src="images/play_defaultl_icon.png" width={"24"}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

function Browse(){
    const [rows,setRows] = useState([]);
    const [countriesTop,setCountriesTop] = useState([]);
    const [steps, setSteps] = useState([1,2,3,4]);

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

    const getCountriesTop = () => {
        //render monthly tops
        $.post("web-handler.php?", {countriesTopSongs:userObj.id}, function(response, status){
            try{
                var rows = JSON.parse(response);
                setCountriesTop(rows);
            }
            catch(E){
                alert(E.toString()+response);
            }
        });
    }

    useEffect(()=>{
        getMonthly();
        getCountriesTop();
    }, []);

    const playAllMonthly = () => {
        setPlaylist(rows);
    }

    return (
        <>
            <div>
                <div>
                    <font style={{color:"var(--orange-600)"}} className="ml-20 font">Monthly Top (20)</font> 
                    <Chip 
                        avatar={<Avatar><i className="fa fa-play"/></Avatar>} 
                        label="Play All" size="small" 
                        sx={{ml:2}} 
                        onClick={playAllMonthly}
                        color="primary" />
                    <div className="w3-responsive scrollbar1">
                        <div className="w3-row" style={{width:((window.innerWidth*.8)*4)+"px"}}>
                            {steps.map((step,io) => {
                                let songs = rows.slice((step-1)*5, (step*5));
                                return (
                                    <div className="w3-col s3" key={io}>
                                        <div className="w3-padding-small">
                                            <div className="w3-padding-small rounded light-grey" style={{background:"#f1f1f1"}}>
                                                {songs.map((song,i) => {
                                                    //i += 1;
                                                    return (
                                                        <div className="w3-row w3-hover-text-orange pointer" key={song.song_id}>
                                                            <div className="w3-col s1"><font className="block">{i+1 +((step-1)*5)}</font>_</div>
                                                            <div className="w3-col s3">
                                                                <img src={"artwork/"+song.resampled_artwork} style={{background:"#eee"}} className="rounded" width="30" />
                                                            </div>
                                                            <div className="w3-col s8" style={{overflowX:"hidden", paddingRight:"3px"}}>
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
                <div className="w3-padding">
                    <font className="w3-large bold">Countries Top Songs</font>
                </div>
                <div className="w3-row">
                    {countriesTop.map((row,index)=> {
                        let titles = [];
                        row.songs.map((r,i)=>{
                            if(titles.length < 3){
                                titles.push(r.title);
                            }
                        })
                        return (
                            <div className="w3-col s12">
                                <div className="w3-padding-small">
                                    <div className="w3-row w3-light-grey rounded">
                                        <div className="w3-col s3">
                                            <img src={"artwork/"+row.artwork} className="rounded-left" width={"100%"}/>
                                        </div>
                                        <div className="w3-col s9 w3-padding-right pl-10" style={{overflowX:"hidden", paddingRight:"3px"}}>
                                            <font className="block">{row.label}</font>
                                            <font className="block w3-opacity">{titles.join(", ")}</font>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

function Comment(props){
    return (
        <>
            <div className="w3-row pb-15">
                <div className="w3-col s2 clearfix w3-padding">
                    <img src={"profiles/"+props.data.user_data.photo} width={"70%"} className="rounded-50 float-right"/>
                </div>
                <div className="w3-col s9">
                    <font className="bold text-primary block pointer">{props.data.user_data.name}</font>
                    <font style={{opacity:.8}}>
                        {props.data.comment}
                        <font className="pl-15 w3-small w3-opacity">{props.data.rating} <i className="fa fa-star"/> - {props.data.time}</font>
                    </font>
                    
                </div>
                <div className="w3-col s1">
                    <i className="far fa-heart"/>
                    <font className="block">{0}</font>
                </div>
            </div>
        </>
    )
}

function GoBack(props){
    return (
        <>
            <div className="w3-padding">
                <Button variant="outlined" onClick={e=>props.onClick(e)} className="w3-round-jumbo" sx={{px:2}}>
                    <i className="fa fa-arrow-left mr-2"></i>

                    Go Back
                </Button>
            </div>
        </>
    )
}