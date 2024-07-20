const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab,ThemeProvider,createTheme
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

let theme = createTheme({
	palette: {
		primary: {
			main: '#212529',
		},
		secondary: {
			main: '#edf2ff',
		},
	},
});

var user;

window.onload = function(){
    user = JSON.parse(localStorage.getItem("user-artist"));

    ReactDOM.render(<Index />, document.getElementById("root"));
}

function Index(){
    const [page,setPage]= useState("Home"); //Home
    const [open,setOpen] = useState({
        logout:false
    })
    
    const menus = [
        {
            title:"Home",
            icon:"fa fa-home"
        },
        {
            title:"Artist Profile",
            icon:"fa fa-music"
        },
        {
            title:"Songs",
            icon:"fa fa-user-friends"
        },
        {
            title:"Statistics",
            icon:"fa fa-music"
        },
        {
            title:"Profile",
            icon:"fa fa-user"
        }
    ]
    return (
        <Context.Provider value={{page,setPage}}>
            <ThemeProvider theme={theme}>
                <div className="w3-row">
                    <div className="w3-col w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto",width:"200px"}}>
                        <div className="w3-center pt-20 pb-20">
                            <img src={"../images/logo.png"} width="40" />
                        </div>
                        {menus.map((row,index)=>(
                            <MenuButton data={row} key={row.title} isActive={page == row.title} onClick={()=>setPage(row.title)} />
                        ))}

                        <MenuButton data={{icon:"fa fa-power-off",title:"Logout"}} isActive={false} onClick={()=>{
                            //window.location = '../logout.php';
                            setOpen({...open, logout:true});
                        }} />
                    </div>
                    <div className="w3-rest" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                        {page == "Home" ? <Home />:
                        page == "Artist Profile" ? <ArtistProfile />:
                        page == "Songs" ? <Songs />:
                    <>{page}</>}
                    </div>
                </div>

                <Dialog open={open.logout} onClose={()=>setOpen({...open, logout:false})}>
                    <div className="w3-padding-large" style={{width:"360px"}}>
                        <CloseHeading label="Logout" onClose={()=>setOpen({...open, logout:false})}/>

                        <p>Are you sure you want to logout?</p>
                        <Box sx={{py:3}}>
                            <Button variant="contained" onClick={e=>{
                                localStorage.removeItem("user-artist");
                                window.location = '../logout.php';
                            }}>Logout</Button>
                        </Box>
                    </div>
                </Dialog>
            </ThemeProvider>
        </Context.Provider>
    )
}

function TabPanel(props){
    const {children, value,index, ...other} = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    )
}

function a11yProps(index){
    return {
        id:'simple-tab-'+index,
        'aria-controls':`simple-tabpanel-${index}`
    }
}

function MenuButton(props){
    return (
        <>
            <div className={"p-2 hover:bg-gray-100 pointer menu-button "+(props.isActive?"bg-gray-100 active":"")} onClick={e=>{
                if(props.onClick != undefined){
                    props.onClick(e);
                }
            }}>
                <span className="w3-center" style={{width:"50px",display:"inline-block"}}>
                    <i className={props.data.icon} />
                </span>
                <font>{props.data.title}</font>
            </div>
        </>
    )
}

function Home(){
    const [userData,setUserData] = useState({});

    const getUserData = () => {
        $.get("api/", {getUserData:user.id}, res=>setUserData(res));
    }

    const resend =() => {
        $.post("api/", {resendVerification:user.id}, res=>{
            Toast(res.message);
        })
    }

    const monthlyListeners = () => {
        const elem = document.getElementById("months");
        const ctx = document.createElement('CANVAS');
        elem.appendChild(ctx);

        $.get("api/", {getListening30Data:0,user:user.id}, function(res){
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: res.labels,
                    datasets: [
                        {
                            label: 'Songs Listened',
                            data: res.values,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    }

    const songsListening = () => {
        $.get("api/", {getSongs:user.id}, res=>{

            var chart = new ej.charts.Chart({
                //Initializing Primary X Axis
                primaryXAxis: {
                    valueType: "Category",
                    title: "Months"
                },
                //Initializing Primary Y Axis
                primaryYAxis: {
                    title: "Number of Visitors"
                },
                //Initializing Chart Series
                series: [
                    {
                        type: "Bar",
                        dataSource: [
                            ...(res.map((r)=>{
                                return {month: Strings.words(r.title,4),visitors:r.plays}
                            }))
             
                        ],
                        xName: "month",
                        yName: "visitors"
                    }
                ]
            });
            chart.appendTo("#songs");
        })
    }

    useEffect(()=>{
        getUserData();
        monthlyListeners();
        songsListening();
    }, []);

    return (
        <>
            <div className="p-2">
                {userData.status == "registered" && <Alert severity="warning" action={
                    <Button color="inherit" size="small" onClick={resend}>Resend Verification</Button>
                }>
                    Your email is not verified! We had sent a verification link. Check your inbox
                </Alert>}

                <div className="pt-4">
                    <h4>Listening Stats</h4>

                    <div className="w3-row">
                        <div className="w3-col m4 w3-padding">
                            <div id="months"></div>
                        </div>
                        <div className="w3-col m8 w3-padding">
                            <div id="songs"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function ArtistProfile(){
    const [artist,setArtist] = useState({status:false});
    const [countries,setCountries] = useState([]);

    const getArtist = () => {
        $.get("api/", {getArtist:user.id}, res =>setArtist(res));
    }

    const updatePhoto = (event) => {
        let input = document.createElement("input");
        input.accept = 'image/*'
        input.type = 'file';

        input.addEventListener('change', event=>{
            let formdata = new FormData();
            formdata.append("artist_picture", input.files[0]);
            formdata.append("user", user.id);

            Toast("Please wait..")
            post("api/", formdata, response=>{
                try{
                    let res = JSON.parse(response);
                    Toast(res.message);
                    getArtist();
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });

        input.click();
    }

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, res =>setCountries(res));
    }

    const updateDetails = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
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

    useEffect(()=>{
        getArtist();
        getCountries();
    }, []);

    return (
        <>
            <div className="p-3">
                <h3>Manage Artist Profile</h3>

                <div className="w3-row">
                    <div className="w3-half">
                        {artist.status && <>
                            <div className="w3-center py-3">
                                <img src={"../uploads/artists/"+artist.photo} width={"40%"} className="rounded"/>
                                <br/>
                                <br/>
                                <Button variant="outlined" onClick={updatePhoto} size="small">Choose Picture</Button>
                            </div>

                            <form className="pb-30" onSubmit={updateDetails}>
                                <TextField 
                                    label="Artist Name" 
                                    name="artist_name_update" 
                                    fullWidth 
                                    value={artist.name} 
                                    onChange={e=>setArtist({...artist, name:e.target.value})} 
                                    sx={{mt:2}}/>
                                <TextField 
                                    label="Biography" 
                                    fullWidth 
                                    name="biography" 
                                    value={artist.biography} 
                                    onChange={e=>setArtist({...artist, biography:e.target.value})} 
                                    rows={3} 
                                    multiline 
                                    sx={{mt:2}}/>
                                <TextField 
                                    label="Website" 
                                    fullWidth 
                                    name="website" 
                                    value={artist.website} 
                                    onChange={e=>setArtist({...artist, website:e.target.value})} 
                                    sx={{mt:2}}/>
                                <TextField 
                                    label="Country" 
                                    fullWidth 
                                    name="country" 
                                    value={artist.country} 
                                    onChange={e=>setArtist({...artist, country:e.target.value})} 
                                    sx={{mt:2,mb:3}} 
                                    select>
                                    {countries.map((row,index)=>(
                                        <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                    ))}
                                </TextField>

                                <Button variant="contained" sx={{px:3,textTransform:"none"}} type="submit">Update Details</Button>
                            </form>
                        </>}
                    </div>
                    <div className="w3-half"></div>
                </div>
            </div>
        </>
    )
}

function Songs(){
    const [value,setValue] = useState(0);
    
    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <div className="w3-padding">
                <Box>
                    <Box sx={{borderBottom:1,borderColor:'divider'}}>
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Albums" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="All Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Albums />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Music />
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Albums(){
    const [open,setOpen] = useState({
        add:false,
        edit:false
    });
    const [rows,setRows] = useState([]);

    const getRows = () => {
        $.get("api/",{getAlbums:user.id}, res=>setRows(res));
    }

    const saveAlbum = (event) => {
        event.preventDefault();

        let formdata = new FormData(event.target);

        post("api/", formdata, response=>{
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open,add:false});
                    Toast("Success")
                    getRows();
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

    useEffect(()=>{
        getRows();
    },[]);

    return (
        <>
            <div className="py-2">
                <Button variant="contained" sx={{px:3,textTransform:"none"}} onClick={e=>setOpen({...open, add:true})} className="w3-round-jumbo">
                    <i className="fa fa-plus mr-2"/>
                    Create Album
                </Button>
            </div>

            <Paper>
                <Input sx={{m:2}} placeholder="Search table.." />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Songs</TableCell>
                            <TableCell>Year</TableCell>
                            <TableCell>Artwork</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row,index)=>(
                            <TableRow hover key={row.id}>
                                <TableCell padding="none" sx={{pl:2}}>{index+1}</TableCell>
                                <TableCell padding="none">{row.name}</TableCell>
                                <TableCell padding="none">{0}</TableCell>
                                <TableCell padding="none">{row.year}</TableCell>
                                <TableCell padding="none">
                                    <img src={"../artwork/album/"+row.image} width={"40"} className="rounded"/>
                                </TableCell>
                                <TableCell padding="none">{row.status}</TableCell>
                                <TableCell sx={{padding:"7px"}}>
                                    <Button variant="outlined" size="small">Manage</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={open.add} onClose={()=>setOpen({...open, add:false})}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <CloseHeading label="Create new Album" onClose={()=>setOpen({...open, add:false})}/>

                    <form onSubmit={saveAlbum}>
                        <TextField name="album_name" label="Album Name/Title" required fullWidth size="small" sx={{mt:2}}/>
                        <TextField name="year" label="Year" fullWidth size="small" sx={{mt:2}}/>
                        <TextField name="link" fullWidth label="Any link to album?" size="small" sx={{mt:2}}/>
                        <TextField name="artwork" type="file" label="Artwork" focus fullWidth size="small" required sx={{mt:2,mb:3}}/>

                        <Button variant="contained" type="submit">Save Album</Button>
                    </form>
                    <BottomClose onClose={()=>setOpen({...open, add:false})}/>
                </div>
            </Dialog>
        </>
    )
}

function SongsList(){
    return (
        <></>
    )
}

function post(url, formdata, callback){
    var ajax = new XMLHttpRequest();

    var completeHandler = function(event) {
        const contentType = ajax.getResponseHeader("Content-Type");
        console.log(contentType);
        if (contentType == "application/json") {
            try{
                callback(JSON.parse(event.target.responseText));
            }
            catch(E){
                console.error(E.toString());
                console.error("Failed to parse: "+event.target.responseText);
            }
        }
        else{
            var response = event.target.responseText;
            callback(response);
        }
    }
    
    var progressHandler = function(event) {
        //try{return obj.progress(event.loaded, event.total);}catch(E){}
    }
    
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    //ajax.addEventListener("error", errorHandler, false);
    //ajax.addEventListener("abort", abortHandler, false);
    ajax.open("POST", url);
    ajax.send(formdata);
}

function CloseHeading(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <font className="w3-large">{props.label}</font>

                <span className="bg-gray-200 w3-round-large bcenter float-right pointer hover:bg-gray-300" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{height:"36px",width:"36px"}}>
                    <i className="fa fa-times text-lg"/>
                </span>
            </div>
        </>
    )
}

function BottomClose(props){
    return (
        <>
            <div className={"clearfix "+(props.className != undefined ? props.className : "")}>
                <Button variant="contained" color="error" className="float-right" onClick={e=>{
                    if(props.onClose != undefined){
                        props.onClose(e);
                    }
                }} style={{textTransform:"none"}}>
                    Close
                </Button>
            </div>
        </>
    )
}

function Music(){
    const [rows,setRows] = useState([]);
    const [genres,setGenres] = useState([]);
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false,
        web:false,
        webArtwork:false
    });
    const [active,setActive]= useState([]);
    const anchor = "manage";
    const [search,setSearch] = useState("");
    const [results,setResults]= useState([]);
    const [albums,setAlbums] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getAlbums = () => {
        $.get("api/",{getAlbums:user.id}, res=>setAlbums(res));
    }

    const getMusic = () => {
        $.get("api/", {getSongs:user.id,start:(page*rowsPerPage),limit:rowsPerPage}, function(response){
            setRows(response);
        })
    }

    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(response){
            setGenres(response);
        })
    }

    const getCount = () => {
        $.get("api/", {countSongs:"true"}, function(response){
            //setCount(response.count);
        })
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen({ ...state, [anchor]: open });
    };

    useEffect(()=>{
        getMusic();
        getGenres();
        getCount();
        getAlbums();
    }, []);

    useEffect(()=>{
        getMusic();
    }, [page,rowsPerPage]);

    const saveChanges = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, manage:false, webArtwork:false});
                    getMusic();
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

    const uploadArtwork = () => {
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener("change", function(event){
            let formdata = new FormData();
            formdata.append("uploadArtwork", input.files[0]);
            formdata.append("song_id", active.song_id);

            post("api/", formdata, function(response) {
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, resampled_artwork:res.filename});
                        Toast("Success");
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });
        input.click();
    }

    const saveWebArtwork = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            Toast(response);
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setActive({...active, resampled_artwork:res.filename});
                    Toast("Success");
                }
                else{
                    Toast(res.message);
                }
            }
            catch(E){
                alert(E.toString()+response)
            }
        })
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open,add:true})} sx={{textTransform:"none"}}>Upload Song</Button> 
                <Button variant="contained" onClick={e=>setOpen({...open,web:true})} sx={{ml:2,textTransform:"none"}}>Add Song</Button>

                <Paper sx={{mt:2}}>
                    <Input placeholder="Search Song" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px",m:2}} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Album</TableCell>
                                <TableCell>Artist</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Plays</TableCell>
                                <TableCell>Downloads</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                            .filter(r=>search == "" || r.title.toLowerCase().indexOf(search.toLowerCase) != -1)
                            .slice(rowsPerPage*page, (page+1)*rowsPerPage)
                            .map((row,index) => (
                                <TableRow sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} hover key={row.song_id}>
                                    <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                    <TableCell padding="none">{row.year}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">
                                        <Link href="#">{row.album_data.name}</Link>
                                    </TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.length}</TableCell>
                                    <TableCell padding="none">{row.genre_data.name}</TableCell>
                                    <TableCell padding="none">
                                        {row.plays}
                                    </TableCell>
                                    <TableCell padding="none">
                                        {row.downloads}
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, manage:true});
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>

            <Drawer
                anchor="right"
                open={open.manage}
                onClose={()=>setOpen({...open, manage:false, webArtwork:false})}
                >
                <div style={{width:"400px"}} className="w3-padding-large">
                    <font>Manage {active.title+" by "+active.name}</font>

                    <div className="pt-15 pb-15 w3-center">
                        <img src={"../artwork/"+active.resampled_artwork} width="50%" className="rounded" />
                        <br />
                        <br />
                        <Button variant="outlined" onClick={uploadArtwork} size="small" sx={{textTransform:"none"}}>Upload</Button>
                        <Button variant="outlined" size="small" onClick={e=>setOpen({...open, webArtwork:true})} sx={{textTransform:"none",ml:2}} startIcon={<i className="fa fa-globe"/>}>Web</Button>
                    </div>
                    <form onSubmit={saveWebArtwork} style={{display:(open.webArtwork?"block":"none")}}>
                        <input type="hidden" name="update_web_artwork" value={active.song_id}/>
                        <TextField fullWidth label="Paste img Link" name="web_link" size="small" sx={{mb:1}}/>
                        <Button type="submit" variant="contained">Submit</Button>
                    </form>

                    <form onSubmit={saveChanges}>
                        <input type="hidden" name="song_id" value={active.song_id} />
                        <TextField label="Title" size="small" name="song_title_edit" fullWidth value={active.title} onChange={e=>setActive({...active, title:e.target.value})} sx={{mt:2}} />
                        <TextField label="Year" size="small" name="year" fullWidth value={active.year} onChange={e=>setActive({...active, year:e.target.value})} sx={{mt:2}} />
                        <TextField select label="Genre" size="small" sx={{mt:2}} hiddenLabel name="genre" value={active.genre} onChange={e=>setActive({...active, genre:e.target.value})} fullWidth>
                            {genres.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Mp3 URL" size="small" multiline rows={3} name="mp3_url" fullWidth value={active.mp3_url} onChange={e=>setActive({...active, mp3_url:e.target.value})} sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15">
                        <Button variant="contained" color="error">Delete</Button>
                    </div>
                </div>
            </Drawer>

            {open.add ? <AddMusic onClose={()=>{
                setOpen({...open, add:false});
                getMusic();
                getCount();
            }} />:""}

            {open.web ? <AddWebMusic onClose={()=>{
                setOpen({...open, add:false});
                getMusic();
                getCount();
            }} />:""}
        </>
    )
}