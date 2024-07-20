function getPathFromUrl(url) {
    return url.split("?")[0];
}

function BottomPlayerLayout(props){
    const [duration, setDuration] = React.useState(0);

    try{
        audio = document.getElementById("audio");
        audio.src = getPathFromUrl(props.data.mp3_url);
        console.log(props.data.mp3_url);
        //audio.removeEventListener("ended");
        audio.play();

        showCurrentTime();
    }
    catch(E){
        alert(E.toString());
    }

    const downloadFile = (event) => {
		//download file in a new window
		let a = document.createElement("a");
		a.setAttribute('target', '_blank');
		a.href = 'download.php?id='+props.data.id;
		a.click();
	}

    const addFav = (event) => {
        $.post("handler.php", {addFav:props.data.id}, (response, status) => {
            try{
                var ibj = JSON.parse(response);
                if(ibj.status){
                    //done
                    if(ibj.isFirst){
                        ShowSnack("Thank you! This will help us in suggestions");
                    }

                    let icon = event.target.getElementsByTagName("i")[0];
                    if(icon != null){
                        icon.classList.add("w3-text-orange");
                    }
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const restart = (event) => {
        audio.currentTime = 0;
    }

    React.useEffect(() => {
        setTimeout(() => {
            let percent = Math.floor((audio.currentTime / audio.duration)*100);
            if(percent == NaN){
                percent = 0;
            }
            setDuration(percent);
        }, 1000);
    });


    const handleSliderChange = (event, newValue) => {
        var time = Math.floor((newValue/100) * audio.duration);
        audio.currentTime = time;
        setDuration(newValue);
    };

    return (
        <div style={{width:"1600px",position: "fixed", bottom:"0px", right: "0px", zIndex: 20}} id="bottom_player" className="w3-white w3-border-top w3-row">
            <div className="w3-col w3-padding-small" style={{width: "60px"}}>
                <img style={{width: "40px"}} className="rounded pointer w3-hover-opacity" onClick={(event) => {
                    showModalPlayer(props.data);
                }} src={"artwork/"+props.data.resampled_artwork} />
            </div>
            <div className="w3-col m3 w3-padding">
                <font className="roboto block">{props.data.title}</font>
                <font className="w3-opacity">{props.data.artist}</font>
            </div>
            <div className="w3-col m6 w3-padding">
                <div className="w3-row">
                    <div className="w3-col s1" style={{paddingTop:"12px"}}>
                        <span className="rounded w3-hover-blue w3-padding pointer" id="playBtn">
                            <i className="fa fa-pause w3-large"></i>
                        </span>
                    </div>
                    <div className="w3-col s8 w3-row">
                        <div className="w3-col m10">
                            <PrintMuiSlider id="slider" />
                        </div>
                        <div className="w3-col m2 w3-padding w3-small w3-opacity">
                            <font id="player_duration">03:12/03:12</font>
                        </div>
                    </div>
                    <div className="w3-col s2 w3-row">
                        <div className="w3-col m3">
                            <div className="w3-padding">
                                <i className="fa fa-volume-off w3-large"></i>            
                            </div>
                        </div>
                        <div className="w3-col m9" style={{paddingTop:"3px"}}>
                            <Slider size="small" defaultValue={0} aria-label="Small" valueLabelDisplay="auto" />
                        </div>
                    </div>
                    <div className="w3-col s1 w3-padding">
                        <IconButton size="small" style={{outline:"none"}} onClick={(event) => {
                            showPlayList(event);
                        }} color="inherit">
                            <i className="fa fa-list w3-large"></i>
                        </IconButton>
                    </div>
                </div>
            </div>
            <div className="w3-rest clearfix">
                <font className="float-right" style={{paddingTop:"12px", paddingRight:"12px"}}>
                    <IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
                        <FAIcon icon="fa fa-arrow-alt-circle-down" />
                    </IconButton>
                    <IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={addFav} color="inherit">
                        <FAIcon icon="fa fa-heart" />
                    </IconButton>
                    <IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={restart} color="inherit">
                        <FAIcon icon="fa fa-redo" />
                    </IconButton>
                    <IconButton size="small" style={{outline:"none", marginLeft:"15px"}} onClick={downloadFile} color="inherit">
                        <FAIcon icon="fa fa-cog" />
                    </IconButton>
                </font>
            </div>
        </div>
    )
}