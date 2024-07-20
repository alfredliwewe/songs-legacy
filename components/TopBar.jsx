let {Chip, Avatar, Link, Typography,ThemeProvider,createTheme} = MaterialUI;
let searchShown = false;
var notificationsShow = false;
var notificationsContainer = null;

function TopBar(){
    let icon;
    //let theme = "Light";
    const {page,setPage,playlist,setPlaylist,activeArtist,setActiveArtist,hasLogged,setHasLogged} = useContext(Main);
    const [login,setLogin] = useState(false);

    if(themeName == "Light"){
        icon = "fa fa-sun";
    }else{
        icon = "fa fa-moon";
    }

    const [mode, setMode] = React.useState({
        name:themeName,
        icon:icon
    });

    const buttonArray = [
        {
            id:"listen_now",
            title:"Listen Now",
            icon: "far fa-play-circle"
        },
        {
            id:"browse",
            title:"Browse",
            icon: "fa fa-th-large"
        },
        {
            id:"charts",
            title:"Charts",
            icon: "fa fa-tasks"
        },
    ];

    const logout = () =>{
        window.location = 'logout.php';
    }

    const changeMode = (event) => {
        if(mode.name == "Light"){
            //set dark
            setMode({
                name:"Dark",
                icon:"fa fa-moon"
            });

            $.get("web-handler.php?setTheme=dark", function(res,s){
                $('#theme-changer').load("dark.css");
            })
            themeName = "Dark";
        }
        else{
            //set light
            setMode({
                name:"Light",
                icon:"fa fa-sun"
            });

            $.get("web-handler.php?setTheme=light", function(res,s){
                $('#theme-changer').load("light.css");
            });
            themeName = "Light";
        }
    }

    const launchProfile = (event) => {
        //do nothing for now
        toggleNotifications(event.target);
    }

    return (
        <Main.Provider value={{login,setLogin,playlist,setPlaylist,page,setPage,activeArtist,setActiveArtist,hasLogged,setHasLogged}}>
            <div className="w3-top w3-border-bottom light-grey w3-white" style={{position:"fixed",zIndex:28327}}>
                <div className="w3-row">
                    <div className="w3-col m1 w3-padding w3-center pointer" onClick={(event) => {window.location = 'index.php'}}>
                        <img src="./images/wp1.png" width="27" height="27" />
                    </div>
                    <div className="w3-col m3 w3-center topButtons" style={{paddingTop:"3px",paddingBottom:"3px"}}>
                        {buttonArray.map((button) => (
                            <button key={button.id} className={"w3-padding-small rounded w3-hover-white "+(button.id == page ? "w3-white" : "")} onClick={e=>{
                                setPage(button.id)
                            }} style={{marginLeft:"6px"}}>
                                <i className={button.icon + " block"} style={{fontSize:"1.2rem"}} />
                                <font className="font w3-small w3-opacity">{button.title}</font>
                            </button>
                        ))}
                    </div>
                    <div className="w3-col m3 w3-center" style={{paddingTop:"6px"}} id="p-s">
                        <TopSearch />
                    </div>
                    <div className="w3-col m1 w3-padding w3-center">&nbsp;</div>
                    <div className="w3-col m3 w3-padding">
                        {hasLogged ? (
                            <Chip 
                                avatar={<Avatar>{userObj.name.substring(0,1).toUpperCase()}</Avatar>} 
                                label={userObj.name} 
                                size="small" 
                                className="pointer w3-text-black" 
                                onClick={launchProfile} />
                        ):(
                            <Chip 
                                avatar={<Avatar>L</Avatar>} 
                                label="Login" 
                                size="small" 
                                className="pointer w3-text-black" 
                                onClick={e=>setLogin(true)} />
                        )}
                        
                        <Chip avatar={<Avatar><i className={"fa "+mode.icon} /></Avatar>} className="ml-25 w3-text-black" label={mode.name} size="small" style={{marginLeft:"25px"}} onClick={changeMode} />
                    </div>
                    <div className="w3-rest clearfix w3-padding">
                        <Link className="float-right" color="inherit" href="https://mui.com/">
                            About Us
                        </Link>
                    </div>
                </div>
            </div>

            {login ? <div className="w3-modal" style={{display:"block"}}>
                <div className="w3-modal-content w3-padding-large w3-round-large w3-card-16 w3-white" style={{width:"450px"}}>
                    <div className="w3-padding-small clearfix">
                        <i className="fa float-right fa-times w3-text-black w3-hover-text-red pointer" onClick={e=>setLogin(false)} />
                    </div>
                    <div>
                        <ThemeProvider theme={theme}><LoginForm /></ThemeProvider>
                    </div>
                </div>
            </div>:""}
        </Main.Provider>
    );
}

function TopSearch (){
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);
    const {playlist,setPlaylist,playIndex,setPlayIndex,page,setPage,activeArtist,setActiveArtist} = useContext(Main);
    const [state,setState] = useState({
        width:150,
        borderColor:""
    });

    useEffect(()=>{
        const _ = (id) => {
            return document.getElementById(id);
        }
    }, []);

    const changeFocus = (bool) => {
        if(bool){
            setState({state, borderColor:"border-primary"});
        }
        else{
            setState({state, borderColor:""});
        }
        //set the results container
        let elem = document.getElementById("topSearch"), offset = $(elem).offset(), container;
        let t_s = _('t-s');
        container = new Rodz.Div('topSearchResults');
        container.addClasses(['border', 'shadow', 'w3-white', 'w3-round-large', 'scrollbar1']);
        var maxZ = Math.max.apply(null, 
            $.map($('body *'), function(e,n) {
            if ($(e).css('position') != 'static'){
                return parseInt($(e).css('z-index')) || 1;
            }
        }));
        container.css('z-index', maxZ+1).css('position', 'absolute').css('left', offset.left+"px").css('top', (offset.top+elem.clientHeight+2)+"px").css('width', t_s.clientWidth+"px").css('min-height', '100px');
        container.setAttribute('id', 'topSearchResults');
        container.css('display','none');
        container.css('padding','4px')
    }

    const saveSearch = (obj,type) => {
        //
        $.post("web-handler.php", {saveSearch:type,word:(type=="song" ? obj.title : obj.name), user:userObj, ref:obj.id}, function(res){
            //do nothing
        })
    }

    useEffect(()=>{
        let container = new Rodz.Div('topSearchResults');
        if(search.length > 0){
            //
            $.get("web-handler.php?searchModal="+search, function(response, status){
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
    },[search])
    
    return (
        <>
            <div id="t-s" className={"border w3-white w3-round-xxlarge w3-row "+state.borderColor} style={{}}>
                <div className="w3-col search2" style={{width:"100%",position:"relative"}}>
                    <input type="text" className="w3-text-black" id="topSearch" value={search} onChange={e=>setSearch(e.target.value)} onFocus={(event) => {changeFocus(true)}} placeholder="Search" style={{
                        width:"100%",
                        background:"inherit",
                        border:"none",
                        padding:"7px 32px",
                        outline:"none"
                    }} />
                    <i className="fa fa-search w3-opacity"></i>
                </div>
            </div>
            <div id="topSearchResults" style={{maxHeight:"400px",overflowY:"auto",overflowX:"hidden"}}>
                {results.map((row,index)=>(
                    <>{row.type == "song" ? <div className="w3-padding-small pointer w3-hover-light-grey playMusic w3-round w3-text-black" onClick={e=>{
                        setSearch(row.title)
                        //setPlaylist([row]);
                        setResults([]);
                        
                        $('#topSearchResults').hide();
                        //save result
                        saveSearch(row,"song");

                        //fetch a playlist
                        const song = row;
                        $.post("web-handler.php", {getRelated:row.id, type:"user", user:userObj.id}, function(response){
                            try{
                                let res = JSON.parse(response);
                                setPlaylist([song, ...res]);
                            }
                            catch(E){
                                alert(E.toString()+response);
                            }
                        });
                    }} style={{textAlign:"left",alignContent:"left"}}>
                        <font className="block">{row.title}</font>
                        <font className="w3-tiny w3-opacity">{row.name}</font>
                    </div>:

                    row.type == "artist" ? <>
                        <div className="w3-padding-small pointer w3-hover-light-grey playMusic w3-round w3-text-black" onClick={e=>{
                            setSearch(row.name)
                            setPage("artist_details")
                            setActiveArtist(row);
                            setResults([]);
                            saveSearch(row,"artist");

                            $('#topSearchResults').hide()
                        }} style={{textAlign:"left",alignContent:"left"}}>
                            <font className="block">{row.name}</font>
                            <font className="w3-tiny w3-opacity">Artist</font>
                        </div>
                    </>:
                    ""}</>
                    
                ))}
            </div>
        </>
    );
}

$(document).on('keyup', '#topSearch11', function(event){
    let elem = this, offset = $(this).offset(), container;
    let t_s = _('t-s');

    if(this.value.length > 0){
        if(searchShown){
            container = new Rodz.Div('topSearchResults');
        }
        else{
            container = new Rodz.Div();
            container.addClasses(['border', 'shadow', 'w3-white', 'rounded', 'w3-padding']);
            var maxZ = Math.max.apply(null, 
                $.map($('body *'), function(e,n) {
                if ($(e).css('position') != 'static'){
                    return parseInt($(e).css('z-index')) || 1;
                }
            }));
            container.css('z-index', maxZ+1).css('position', 'fixed').css('left', offset.left+"px").css('top', (offset.top+elem.clientHeight+2)+"px").css('width', t_s.clientWidth+"px").css('min-height', '100px');
            container.setAttribute('id', 'topSearchResults');
            document.body.appendChild(container.view);
            searchShown = true;
        }

        //perform search
        $.get("web-handler.php?searchModal="+elem.value, function(response, status){
            console.log(response);
            try{
                var rows = JSON.parse(response);
                container.removeAllViews();

                if (rows.length > 0) {
                    //show results
                    var row_cont = function(row) {
                        var div = new Rodz.Div();
                        div.addClasses(['w3-padding', 'pointer', 'w3-hover-light-grey', 'playMusic', 'rounded', 'w3-text-black']);
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
                        container.addView(row_cont(row));
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
    else{
        $('#topSearchResults').remove();
        searchShown = false;
    }
});

$(document).on('click', '.playMusic', function(event){
    //window.location = 'play.php?v='+$(this).attr('data');
});


$(document).on('click', '.signBtn',function(event) {
    $('.signBtn').removeClass('w3-padding-large w3-large').addClass('w3-padding');
    $(this).removeClass('w3-padding').addClass('w3-padding-large w3-large');

    $('.sign-cont').hide();
    var text = this.innerHTML.trim();
    text = text.replace(" ", "");
    $('#'+text).show();
});

function toggleNotifications(element) {
    var offset = $(element).offset();
    var elem_width = element.clientWidth;
    var center = offset.left + (elem_width/2);
    var width = 250;
    var offset_left = center - (width/2);

    if (!notificationsShow) {
        notificationsShow = true;

        //show notification
        notificationsContainer = new Rodz.Div();
        notificationsContainer.css('position', 'fixed').css('left', offset_left+"px").css('top', (offset.top + element.clientHeight +4)+"px").css('z-index', '20').css('width', width+"px").css('height', '400px').css('overflow-y', 'auto');
        notificationsContainer.addClasses(['shadow', 'rounded', 'w3-white']);
        document.body.appendChild(notificationsContainer.view);

        //attach the content
        var head = new Rodz.Div();
        head.addClasses(['rounded-top', 'w3-padding']);
        notificationsContainer.addView(head);

        var title = new Rodz.Label();
        title.setText("Profile");
        title.addClasses(['block bold', 'w3-large', 'roboto', 'w3-text-black']);
        head.addView(title);

        var content = new Rodz.Div();
        notificationsContainer.addView(content);

        var div1 = new Rodz.Div();
        div1.addClasses(['w3-padding']);
        content.addView(div1);

        var divider= new Rodz.Divider();
        divider.setTitle(userObj.name);
        divider.setSecondaryText("Current User");
        divider.setImage("../artwork/"+userObj.photo);
        div1.addView(divider);

        var div2 = new Rodz.Div();
        div2.addClasses(['w3-padding']);
        content.addView(div2);

        showLogout(div2);

        /*$.get("handler.php?getNotifications", function(response, status) {
            try{
                var rows = JSON.parse(response);

                for(var row of rows){
                    var cont = new Rodz.Div();
                    cont.setAttributes({
                        class:"w3-row mb-10"
                    });

                    var left = new Rodz.Div();
                    left.setAttributes({class:"w3-col s3 w3-center"});
                    cont.addView(left);

                    var icon = new Rodz.Icon();
                    icon.addClasses(['fa-bell', 'fa-2x']);
                    left.addView(icon);

                    var right = new Rodz.Div();
                    right.addClasses(['w3-col', 's9', 'w3-padding-right']);
                    cont.addView(right);

                    var top = new Rodz.Div();
                    right.addView(top);

                    var type = new Rodz.Label();
                    type.setText(row.type);
                    type.addClasses(['pr-10', 'w3-opacity']);
                    top.addView(type);

                    var date = new Rodz.Label();
                    date.setText(row.date);
                    date.addClasses(['w3-small']);
                    top.addView(date);

                    var bottom = new Rodz.Div();
                    right.addView(bottom);

                    var msg_content = new Rodz.Label();
                    msg_content.setText(row.content);
                    bottom.addView(msg_content);

                    var hr = new Rodz.Hr();
                    right.addView(hr);

                    content.addView(cont);
                }

                if (rows.length == 0) {
                    var empty_cont = new Rodz.Div();
                    empty_cont.addClasses(['w3-center', 'pt-100']);
                    content.addView(empty_cont);

                    var icon = new Rodz.Icon();
                    icon.addClasses(['fa-bell', 'w3-opacity', 'fa-4x', 'block']);
                    empty_cont.addView(icon);

                    var label = new Rodz.Label();
                    label.setText("No Notifications");
                    label.addClasses(['w3-large w3-opacity bold roboto']);
                    empty_cont.addView(label);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        }); */

        //create the footer
        var footer = new Rodz.Div();
        footer.addClasses(['w3-padding', 'clearfix', 'rounded-bottom']);
        notificationsContainer.addView(footer);

        var clear = new Rodz.MaterialButton();
        clear.setText("Clear All");
        clear.setSize(Size.SMALL);
        clear.setVariant("outlined");
        clear.onClick(function(event) {
            $.post("handler.php", {clearNotifications:"true"}, function(response, status) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status) {
                        //go ahead and clear
                        content.removeAllViews();

                        var empty_cont = new Rodz.Div();
                        empty_cont.addClasses(['w3-center', 'pt-100']);
                        content.addView(empty_cont);

                        var icon = new Rodz.Icon();
                        icon.addClasses(['fa-bell', 'w3-opacity', 'fa-4x', 'block']);
                        empty_cont.addView(icon);

                        var label = new Rodz.Label();
                        label.setText("No Notifications");
                        label.addClasses(['w3-large w3-opacity bold roboto']);
                        empty_cont.addView(label);
                    }
                    else{
                        Toast(obj.status);
                    }
                }
                catch(E){
                    alert(E.toString());
                }
            })
        })

        var close = new Rodz.MaterialButton();
        close.setText("Close");
        close.addClasses(['float-right']);
        close.setVariant("text");
        close.onClick(function(event) {
            //close notifications
            $(notificationsContainer.view).remove();
            notificationsContainer = null;
            notificationsShow = false;
        })

        footer.addAll(clear, close);

        content.css('overflow-y', 'auto').css('height', (400 - head.view.clientHeight - footer.view.clientHeight-1)+"px");
    }
    else{
        //close notifications
        $(notificationsContainer.view).remove();
        notificationsContainer = null;
        notificationsShow = false;
    }
}

function showLogout(div2){
	var logout = (event) => {
		window.location = 'logout.php';
	}
	ReactDOM.render(<Chip avatar={<Avatar>L</Avatar>} label="Logout" className="pointer" onClick={logout} />, div2.view);
}