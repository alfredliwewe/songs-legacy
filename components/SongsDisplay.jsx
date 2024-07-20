function SongsDisplay1 (props){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist} = useContext(Main);

    useEffect(()=>{
        //
    }, []);

    
    return (
        <div>
            {props.categories.map(category => {
                return (
                    <div style={{overflowX:"hidden"}} key={category.id} className="mb-40">
                        <div className="clearfix">
                            <font>{category.label}</font>
                            <Chip 
                                avatar={<Avatar><i className="fa fa-play"/></Avatar>} 
                                label="Play All" 
                                size="small" 
                                onClick={e=>setPlaylist(category.products)}
                                sx={{ml:2}} 
                                color="primary" />
                            <Chip label="See more" variant="outlined" size="small" sx={{ml:2}} className="float-right" />
                        </div>
                        <div className="w3-row" style={{width:"2000px"}}>
                            {category.products.map((song,index) => (
                                <div className="w3-col w3-hover-text-orange pointer songPlay" onClick={e=>{
                                    //setplay list
                                    setPlaylist(category.products);
                                    
                                    setTimeout(()=>{
                                        setPlayIndex(index);
                                    }, 500);
                                }} key={song.id} data={song.id} style={{width:"150px"}}>
                                    <div className="w3-padding-small" style={{overflowX:"hidden"}}>
                                        <img src={"artwork/"+song.resampled_artwork} width="100%" />
                                        <font className="block font no-wrap">{song.title}</font>
                                        <font className="block font w3-small w3-opacity no-wrap" onClick={e=>{
                                            e.stopPropagation();
                                            setPage("artist_details");
                                            setActiveArtist(song.artist_data);
                                        }}>{song.artist_data.name}</font>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
            
        </div>
    );
}

function SongsDisplay(props){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist} = useContext(Main);

    useEffect(()=>{
        //
    }, []);

    const resampledImage = (img) => {
        if(img.length < 3){
            return "icon.png";
        }
        else{
            return img;
        }
    }

    return (
        <>
            <div className="w3-responsive scrollbar1">
                <div className="w3-row" style={{width:((150*props.categories.length)+10)+"px"}}>
                    {props.categories.map(category => {
                        let artists = [];

                        category.songs.map((row)=>{
                            if(artists.length < 3){
                                if(!artists.includes(row.artist_data.name)){
                                    artists.push(row.artist_data.name);
                                }
                            }
                        })

                        return (
                            <div className="w3-col w3-hover-text-orange pointer songPlay w3-hover-light-grey rounded" onClick={e=>{
                                //setplay list
                                setPlaylist(category.songs);
                            }} key={category.label} style={{width:"150px"}}>
                                <div className="w3-padding-small" style={{overflowX:"hidden"}}>
                                
                                    <div style={{position:"relative",height:"140px"}}>
                                        <img src={(category.artwork)} className="rounded" width="136" />
                                        <img src="images/play_defaultl_icon.png" style={{position:"absolute",right:"10px", bottom:"10px"}} height={25} width={25}/>
                                    </div>
                                    <font className="block font no-wrap">{category.label}</font>
                                    <font className="block font w3-small w3-opacity" onClick={e=>{
                                        e.stopPropagation();
                                        setPage("artist_details");
                                        setActiveArtist(song.artist_data);
                                    }}>{category.names}</font>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

function SongsRow(props){
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist} = useContext(Main);

    useEffect(()=>{
        //
    }, []);

    const resampledImage = (img) => {
        if(img.length < 3){
            return "icon.png";
        }
        else{
            return img;
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="w3-responsive">
                <div className="w3-row">
                    {props.categories.map(category => {
                        
                        return (
                            
                                <div className="w3-col w3-hover-text-orange pointer songPlay w3-hover-light-grey rounded" onClick={e=>{
                                    //setplay list
                                    setPlaylist(category.songs);
                                }} key={category.label} style={{width:"150px"}}>
                                    <div className="w3-padding-small" style={{overflowX:"hidden"}}>
                                    
                                        <div style={{position:"relative",height:"140px"}}>
                                            <img src={"uploads/artists/"+resampledImage(category.artwork)} className="rounded" width="136" />
                                            <img src="images/play_defaultl_icon.png" style={{position:"absolute",right:"10px", bottom:"10px"}} height={25} width={25}/>
                                        </div>
                                        <font className="block font no-wrap">{category.label}</font>
                                        <font className="block font w3-small w3-opacity" onClick={e=>{
                                            e.stopPropagation();
                                            setPage("artist_details");
                                            setActiveArtist(song.artist_data);
                                        }}>{category.names}</font>
                                    </div>
                                </div>
                        )
                    })}
                </div>
            </div>
        </ThemeProvider>
    )
}