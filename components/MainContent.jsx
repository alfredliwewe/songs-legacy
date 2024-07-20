function MainContent(){
    const {page,setPage} = useContext(Main);

    return (<div>
        <div className="w3-col m1">&nbsp;</div>
        <div className="w3-col m10">
            <h1>&nbsp;</h1>
            <h1 style={{display:"none"}}>&nbsp;</h1>
            <div>
                {page == "listen_now" ? <WelcomePage />:
                page == "charts" ? <Charts /> :
                page == "artist_details" ? <ArtistDetails /> :
                <>{page}</>}
            </div>
            <div className="w3-padding" style={{height:"70px"}}>&nbsp;</div>
        </div>
    </div>)
}

function WelcomePage1(){
    return <>
        <h1>Hello there</h1>
    </>
}

function ArtistDetails(){
    const {page,setPage,activeArtist,setActiveArtist,playlist,setPlaylist,playIndex,setPlayIndex} = useContext(Main);
    const [songs,setSongs] = useState([]);
    const [details,setDetails] = useState({
        isFollowing:false,
        followers:0
    });

    const getSongs = () => {
        $.post("web-handler.php", {getArtistDetails:activeArtist.id, user:userObj.id}, function(response){
            try{
                let res = JSON.parse(response);
                setDetails(res);
                setSongs(res.songs);
            }
            catch(E){
                //alert(E.toString()+response);
            }
        })
    }

    useEffect(()=>{
        if(activeArtist.id != undefined){
            getSongs();
        }
    }, [activeArtist]);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const artistPhoto = (url) => {
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            return url;
        }
        else{
            return "uploads/artists/"+url;
        }
    }

    return <>
        <h1>&nbsp;</h1>
        <div className="w3-row">
            <div className="w3-col m1">&nbsp;</div>
            <div className="w3-col m10">
                <div className="w3-padding-large w3-round-large w3-light-grey">
                    <div className="w3-row">
                        <div className="w3-col m2">
                            <img src={artistPhoto(activeArtist.photo)} width={"100%"} className="w3-round-large"/>
                        </div>
                        <div className="w3-col m10 pl-20">
                            <div className="padding pt-20">
                                <font className="w3-xxlarge block pt-10 pb-10">{activeArtist.name}</font>
                                <font className="w3-opacity block pt-10 pb-10">0 Album <i className="fa fa-circle w3-tiny"/> {songs.length} Songs <i className="fa fa-circle w3-tiny"/> 1 min 30 seconds </font>
                                <font className="block">Artist - {activeArtist.name} - {details.followers+" follower"+(details.followers == 1 ? "":"s")}</font>
                                <div className="pt-20">
                                    <Button startIcon={<i className="fa fa-play"/>} onClick={e=>setPlaylist(songs)} size="small" variant="contained" style={{textTransform:"none"}}>Play all</Button>
                                    <Button startIcon={<i className="fa fa-random"/>} size="small" onClick={e=>{
                                        setPlaylist(shuffleArray(songs));
                                    }} variant="outlined" sx={{textTransform:"none",ml:3}}>Suffle and play</Button>
                                    {hasLogged1 &&
                                    <Button startIcon={<i className="fa fa-heart"/>} variant="outlined" size="small" sx={{textTransform:"none",ml:3}}>Add to</Button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20">
                    <div className="w3-row">
                        <div className="w3-col " style={{width:"12%"}}>
                            {songs.length > 0 ? <>
                                <img src={"artwork/"+songs[0].resampled_artwork} width={"100%"} className="rounded"/>
                                <font className="block pt-10 w3-opacity">{songs[0].title}</font>
                            </>:""}
                        </div>
                        <div className="w3-rest pl-30">
                            {songs.map((row,index)=>(
                                <div className="w3-row w3-round w3-hover-light-grey block pointer" onMouseEnter={e=>{
                                    try{
                                        e.target.getElementsByTagName("i")[0].style.visibility = 'visible';
                                    }
                                    catch(E){}
                                }} onMouseLeave={e=>{
                                    try{e.target.getElementsByTagName("i")[0].style.visibility = 'hidden';}catch(E){}
                                }} onClick={e=>{
                                    //setplay list
                                    setPlaylist(songs);
                                    
                                    setTimeout(()=>{
                                        setPlayIndex(index);
                                    }, 500);
                                }} style={{padding:"6px 16px",marginBottom:"3px"}}>
                                    <div className="w3-col m1 w3-center">
                                        <img src={"artwork/"+row.resampled_artwork} width={"40"} className="rounded"/>
                                    </div>
                                    <div className="w3-col m5 pr-10" style={{whiteSpace: "nowrap",overflow:"hidden"}}>
                                        <i className="fa fa-play mr-10" style={{visibility:"hidden"}}/>
                                        <font className="w3-small w3-opacity">
                                            {index+1}
                                        </font>
                                        <font className="pl-10">{row.title}</font>
                                    </div>
                                    <div className="w3-col m3">
                                        <font className="w3-small">{activeArtist.name}</font>
                                    </div>
                                    <div className="w3-col m1 w3-small">{row.year}</div>
                                    <div className="w3-col m2 w3-small">Unknown Genre</div>
                                    <div className="w3-col m1 w3-small">{row.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}