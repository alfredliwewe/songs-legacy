const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead,
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody,Fab
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

window.onload = function(){
    ReactDOM.render(<Index />, document.getElementById("root"));
}

function Index(){
    const [page,setPage]= useState("Home"); //Home
    
    const menus = [
        {
            title:"Home",
            icon:"fa fa-home"
        },
        {
            title:"Genres",
            icon:"fa fa-music"
        },
        {
            title:"Artists",
            icon:"fa fa-user-friends"
        },
        {
            title:"Music",
            icon:"fa fa-music"
        },
        {
            title:"Charts",
            icon:"fa fa-list-ol"
        },
        {
            title:"Playlists",
            icon:"fa fa-list-ol"
        },
        {
            title:"Users",
            icon:"fa fa-users"
        },
        {
            title:"Admins",
            icon:"fa fa-user-friends text-danger"
        },
        {
            title:"Adverts",
            icon:"fa fa-bullhorn"
        },
        {
            title:"Emails",
            icon:"fa fa-envelope"
        },
        {
            title:"System Values",
            icon:"fa fa-list-ul"
        },
        {
            title:"Profile",
            icon:"fa fa-user"
        }
    ]
    return (
        <Context.Provider value={{page,setPage}}>
            <div className="w3-row">
                <div className="w3-col w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto",width:"200px"}}>
                    <div className="w3-center pt-20 pb-20">
                        <img src={"../images/logo.png"} width="40" />
                    </div>
                    {menus.map((row,index)=>(
                        <MenuButton data={row} key={row.title} isActive={page == row.title} onClick={()=>setPage(row.title)} />
                    ))}

                    <ListItem size="small" onClick={e=>{
                        window.location = '../logout.php';
                    }} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <i className={"fa fa-power-off"} />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                    
                </div>
                <div className="w3-rest" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {page == "Home" ? <Home />:
                    page == "Artists" ? <ArtistsView />:
                    page == "Charts" ? <Charts />:
                    page == "Playlists" ? <Playlists />:
                    page == "Users" ? <Users />:
                    page == "Adverts" ? <Adverts />:
                    page == "Genres" ? <Genres />:
                    page == "System Values" ? <SystemValues />:
                    page == "Music" ? <Music />:
                    page == "Emails" ? <Emails />:
                    page == "Profile" ? <Profile />:
                    page == "Admins" ? <Admins />:
                    <>{page}</>}
                </div>
            </div>
        </Context.Provider>
    )
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
    const [data,setData] = useState({
        users:0,
        songs:0,
        charts:0,
        artists:0,
        genres:0
    });
    const {page,setPage} = useContext(Context);

    const getData = () => {
        $.get("api/", {getDashboardData:"true"}, function(res){
            setData({...data, ...res});
        })
    }

    const numberFormat = (num) => {
        return new Intl.NumberFormat().format(num);
    }

    useEffect(()=>{
        getData();
    }, []);

    useEffect(()=>{
        //getData();

        //print graphs
        printGraph1();
        printGraph2();
        printListeningGraph();
        //printGenderGraph();
    }, []);

    const printGraph1 = () => {
        const elem = document.getElementById("last30days");
        const ctx = document.createElement('CANVAS');
        elem.appendChild(ctx);

        $.get("api/", {get30Data:"true"}, function(res){
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: res.labels,
                    datasets: [
                        {
                            label: 'Users Visited',
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
        })
    }

    const printListeningGraph = () => {
        const elem = document.getElementById("listening30days");
        const ctx = document.createElement('CANVAS');
        elem.appendChild(ctx);

        $.get("api/", {getListening30Data:"true"}, function(res){
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
        })
    }

    const printGraph2 = () => {
        const elem = document.getElementById("last7days");
        const ctx = document.createElement('CANVAS');
        elem.appendChild(ctx);

        $.get("api/", {get7Data:"true"}, function(res){
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: res.labels,
                    datasets: [{
                        label: 'Users Visited',
                        data: res.values,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
    }

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>All User</font>
                            <font className="w3-large block">{data.users}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Songs</font>
                            <font className="w3-large block">{numberFormat(data.songs)}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary" onClick={e=>setPage("Genres")}>
                            <font>Genres</font>
                            <font className="w3-large block">{data.genres}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Charts</font>
                            <font className="w3-large block">{data.charts}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>Artists</font>
                            <font className="w3-large block">{numberFormat(data.artists)}</font>
                        </div>
                    </div>
                </div>

                <div className="w3-col m2">
                    <div className="w3-padding-small">
                        <div className="w3-padding rounded alert-primary">
                            <font>All User</font>
                            <font className="w3-large block">20</font>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="w3-padding">
                <div className="pt-15 pb-15">Usage Statistics</div>
                <div className="w3-row pt-15">
                    <div className="w3-col m5 w3-padding">
                        <h5>Homepage Visits and App Launch Last 7 days</h5>
                        <div id="last7days"></div>
                    </div>
                    <div className="w3-col m7">
                        <h5>Homepage Visits and App Launch Last 30 days</h5>
                        <div id="last30days"></div>
                    </div>
                </div>
                <div className="w3-row pt-35">
                    <div className="w3-col m5 w3-padding">
                        <h5>Most Listened Countries</h5>
                        <div id="genderBalance"></div>
                    </div>
                    <div className="w3-col m7">
                        <h5>Listening 30 days</h5>
                        <div id="listening30days"></div>
                    </div>
                </div>
            </div>
        </>
    )
}

function ArtistsView(){
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
                            <Tab label="Artists" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Categories" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Artists />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ArtistsCategories />
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Artists(){
    const [rows,setRows] = useState([]);
    const [countries,setCountries] = useState([]);
    const [page,setPage] = useState(0);
    const [count,setCount] = useState(0);
    const [country,setCountry] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false,
        webPhoto:false
    });
    const [active,setActive]= useState({
        photo:""
    });
    const anchor = "manage";
    const [stage,setStage] = useState("table");
    const [search,setSearch] = useState("");
    const [results,setResults]= useState([]);
    const [songs, setSongs]= useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getArtists();
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        getArtists();
    };

    const getArtists = () => {
        $.get("api/", {getArtists:"true",start:(page*rowsPerPage),limit:rowsPerPage, country:country}, function(response){
            setRows(response);
        });
    }

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    const getCount = () => {
        $.get("api/", {countArtists:"true"}, function(response){
            setCount(response.count);
        })
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen({ ...state, [anchor]: open });
    };

    useEffect(()=>{
        getArtists();
        getCountries();
        getCount();
    }, []);

    const saveChanges = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, manage:false, webPhoto:false});
                    getArtists();
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
        if(search.length > 0){
            $.get("api/", {searchArtist:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

    const saveArtist = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response) {
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    Toast("Success");
                    getArtists();
                    setOpen({...open, add:false});
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
        if(active.id != undefined){
            $.get("api/", {getArtistSongs:active.id}, function(response){
                setSongs();
            })
        }
    }, [active]);

    useEffect(()=>{
        getArtists();
    }, [country,rowsPerPage,page]);

    const artistPhoto = (url) => {
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            return url;
        }
        else{
            return "../uploads/artists/"+url;
        }
    }

    const changePhoto = (event) => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*"

        input.addEventListener('change', function(event) {
            let formdata = new FormData();
            formdata.append("change_artist_picture", input.files[0]);
            formdata.append("artist_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        Toast("Success");
                        setActive({...active, photo:res.photo})
                    }
                    else{
                        Toast(res.message)
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });

        input.click();
    }

    const updatePic = (event) => {
        event.preventDefault();
        let form = event.target;

        $.post("api/", $(form).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setActive({...active, photo:res.filename});
                    Success("Success!");
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

    const heat = (id,pos) => {
        $.post("api/", {heatArtist:id}, function(response){
            Toast(response);
            if(pos == 1){
                $.get("api/", {searchArtist:search}, function(res){
                    setResults(res);
                })
            }
            else{
                getArtists();
            }
        })
    }

    return (
        <Context.Provider value={{songs,setSongs,active,setActive}}>
            {stage == "table" ? 
            <div className="w3-padding">
                <Button variant="contained" onClick={()=>setOpen({...open, add:true})}>Add Artist</Button>

                <Paper sx={{mt:2}}>
                    <div >
                        <Input placeholder="Search Artist" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                        <select value={country} onChange={e=>setCountry(e.target.value)}>
                            <option value={0}>--Country--</option>
                            {countries.map((row,index)=>(
                                <option key={row.id} value={row.id}>{row.name}</option>
                            ))}
                        </select>
                    </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:"bold !important"}}>#</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>WebId</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Name</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Biography</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Country</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Status</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Stats</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.length > 0 ? <>
                                {results.map((row,index) => (
                                    <TableRow hover sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} key={row.id}>
                                        <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.biography.length > 50 ? row.biography.substring(0,50)+"..." : row.biography}</TableCell>
                                        <TableCell padding="none">{row.country_data.name}</TableCell>
                                        <TableCell padding="none">{row.status}</TableCell>
                                        <TableCell padding="none">
                                            {row.actions}
                                            <Chip label="Heat" size="small" color="primary" sx={{ml:2}} onClick={e=>heat(row.id,1)}/>
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>

                                            <Button variant="contained" color="secondary" size="small" sx={{textTransform:"none",ml:2}} onClick={e=>{
                                                setActive(row);
                                                setStage("details");
                                            }}>Songs</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>:
                            <>
                            {rows.map((row,index) => (
                                <TableRow sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} hover key={row.id}>
                                    <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                    <TableCell padding="none">{row.webid}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.biography.length > 50 ? row.biography.substring(0,50)+"..." : row.biography}</TableCell>
                                    <TableCell padding="none">{row.country_data.name}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell padding="none">
                                        {row.actions}
                                        <Chip label="Heat" size="small" color="primary" sx={{ml:2}} onClick={e=>heat(row.id,2)}/>
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, manage:true});
                                        }}>Details</Button>

                                        <Button variant="contained" size="small" color="secondary" sx={{textTransform:"none",ml:2}} onClick={e=>{
                                            setActive(row);
                                            setStage("details");
                                        }}>Songs</Button>
                                    </TableCell>
                                </TableRow>
                            ))}</>}
                        </TableBody>
                    </Table>
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={Number(count)}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>:
            stage == "details" ?<>
                <div className="w3-padding" onClick={e=>{
                    setStage("table")
                }}>
                    <i className="fa fa-arrow-left" /> Go Back
                </div>
                <div className="w3-padding">
                    <ArtistDetails />
                </div>
            </>:
            <>{stage}</>}

            <Drawer
                anchor="right"
                open={open.manage}
                onClose={()=>{
                    setOpen({...open, manage:false, webPhoto:false})
                }}
                >
                <div style={{width:"400px"}} className="w3-padding-large">
                    <font>Manage {active.name}</font>

                    <div className="pt-15 pb-15 w3-center">
                        <img src={artistPhoto(active.photo)} width="50%" className="rounded" />
                        <br />
                        <br />
                        <Button variant="outlined" size="small" onClick={changePhoto} sx={{textTransform:"none"}}>Change</Button> 
                        <Button variant="outlined" size="small" startIcon={<i className="fa fa-globe w3-small"/>} onClick={e=>{
                            setOpen({...open, webPhoto:true});
                        }} sx={{textTransform:"none",ml:1}}>Web</Button>
                        <form onSubmit={updatePic} style={{display:(open.webPhoto?"block":"none")}}>
                            <input type="hidden" name="artist_id" value={active.id} />
                            <TextField fullWidth label="Paste Image Link" name="img_link" sx={{mt:1,mb:1}} size="small" />
                            <Button variant="outlined" size="small">Save</Button>
                        </form>
                    </div>

                    <form onSubmit={saveChanges}>
                        <input type="hidden" name="artist_id" value={active.id} />
                        <TextField label="Name" size="small" name="artist_name_edit" fullWidth value={active.name} onChange={e=>setActive({...active, name:e.target.value})} sx={{mt:2}} />
                        <TextField label="WebId" size="small" name="webid" fullWidth value={active.webid} onChange={e=>setActive({...active, webid:e.target.value})} sx={{mt:2}} />
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" value={active.country} onChange={e=>setActive({...active, country:e.target.value})} fullWidth>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Biography" size="small" multiline rows={3} name="biography" fullWidth value={active.biography} onChange={e=>setActive({...active, biography:e.target.value})} sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15">
                        <Button variant="contained" color="error">Delete</Button>
                    </div>
                </div>
            </Drawer>

            <Dialog
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div className="w3-padding-large" style={{width:"450px"}}>
                    <font className="w3-large">Add Artist</font>

                    <form onSubmit={saveArtist}>
                        <TextField label="Artist Name" fullWidth name="artist_name" sx={{mt:2}}/>
                        <TextField label="Biography" multiline rows={3} fullWidth name="biography" sx={{mt:2}}/>
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" fullWidth>
                            <MenuItem value={"0"}>
                                None
                            </MenuItem>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Photo" fullWidth name="photo" required type="file" sx={{mt:2,mb:3}}/>
                        <Button variant="contained" type="submit">Save Artist</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button variant="contained" className="float-right" color="error" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </Context.Provider>
    )
}

function Charts(){
    const [charts,setCharts]= useState([]);
    const [page,setPage] = useState(0);
    const [stage,setStage]= useState("table")
    const [count,setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false
    });
    const [active,setActive]= useState({});
    const anchor = "manage";
    const [countries,setCountries] = useState([]);
    const [songs,setSongs] = useState([]);
    
    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCharts = () => {
        $.get("api/", {getCharts:"true"}, function(res){
            setCharts(res);
        })
    }

    useEffect(()=>{
        getCharts();
        getCountries();
    }, []);

    const addChart = (event)=> {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, add:false});
                    getCharts();
                    Toast("Success");
                    form.reset();
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
        if(active.id != undefined){
            $.get("api/", {getChartSongs:active.id}, function(response){
                setSongs(response);
            })
        }
    }, [active]);

    return (
        <Context.Provider value={{active,setActive,countries,setCountries,songs,setSongs}}>
            {stage == "table" ?
                <div className="w3-padding">
                    <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Add Chart</Button>

                    <Paper sx={{mt:2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Songs</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Picture</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {charts.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index) => (
                                <TableRow key={row.id} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.description}</TableCell>
                                    <TableCell padding="none">{row.songs}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell padding="none">
                                        <img src={"../uploads/"+row.picture} width="30" />
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            //setOpen({...open, manage:true});
                                            setStage("details");
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={charts.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                    </Paper>
                </div>:
            stage == "details" ? <>
                <div className="w3-padding" onClick={e=>{
                    setStage("table");
                    getCharts();
                }}>
                    <i className="fa fa-arrow-left"></i> Go back
                </div>
                <div className="w3-padding">
                    <ChartDetails />
                </div>
            </>:
            <>{stage}</>}

            <Dialog
                anchor="right"
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div style={{width:"400px"}} className="w3-padding-large">
                    <font>Add Music Chart</font>

                    <form onSubmit={addChart}>
                        <TextField label="Name" size="small" name="chart_name" fullWidth sx={{mt:2}} />
                        <TextField label="Picture" type="file" size="small" name="picture" fullWidth sx={{mt:2}} />
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" fullWidth>
                            <MenuItem value={"0"}>
                                International
                            </MenuItem>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Description" size="small" multiline rows={3} name="biography" fullWidth sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15 clearfix">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </Context.Provider>
    )
}

function Playlists(){
    const [playlists,setPlaylists]= useState([]);
    const [page,setPage] = useState(0);
    const [stage,setStage]= useState("table")
    const [count,setCount] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        manage:false
    });
    const [active,setActive]= useState({});
    const anchor = "manage";
    const [countries,setCountries] = useState([]);
    const [songs,setSongs] = useState([]);
    
    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getPlaylists = () => {
        $.get("api/", {getPlaylists:"true"}, function(res){
            setPlaylists(res);
        })
    }

    useEffect(()=>{
        getPlaylists();
        getCountries();
    }, []);

    const addChart = (event)=> {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen({...open, add:false});
                    getPlaylists();
                    Toast("Success");
                    form.reset();
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
        if(active.id != undefined){
            $.get("api/", {getChartSongsList:active.id}, function(response){
                setSongs(response);
            })
        }
    }, [active]);

    return (
        <Context.Provider value={{active,setActive,countries,setCountries,songs,setSongs}}>
            {stage == "table" ?
                <div className="w3-padding">
                    <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Create a List</Button>

                    <Paper sx={{mt:2}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Songs</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Picture</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {playlists.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index) => (
                                <TableRow key={row.id} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.description}</TableCell>
                                    <TableCell padding="none">{row.songs}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell padding="none">
                                        <img src={"../uploads/"+row.picture} width="30" />
                                    </TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" onClick={e=>{
                                            setActive(row);
                                            //setOpen({...open, manage:true});
                                            setStage("details");
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={playlists.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                    </Paper>
                </div>:
            stage == "details" ? <>
                <div className="w3-padding" onClick={e=>{
                    setStage("table");
                    getCharts();
                }}>
                    <i className="fa fa-arrow-left"></i> Go back
                </div>
                <div className="w3-padding">
                    <PlaylistDetails />
                </div>
            </>:
            <>{stage}</>}

            <Dialog
                anchor="right"
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div style={{width:"400px"}} className="w3-padding-large">
                    <font>Add Music Playlist</font>

                    <form onSubmit={addChart}>
                        <TextField label="Name" size="small" name="play_list_name" fullWidth sx={{mt:2}} />
                        <TextField label="Picture" type="file" size="small" name="picture" fullWidth sx={{mt:2}} />
                        <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel name="country" fullWidth>
                            <MenuItem value={"0"}>
                                International
                            </MenuItem>
                            {countries.map((row,index) => (
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Description" size="small" multiline rows={3} name="biography" fullWidth sx={{mt:2,mb:3}} />
                        
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                    </form>
                    <hr />
                    <div className="pt-15 clearfix">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </Context.Provider>
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

function ChartDetails(){
    const [value,setValue] = useState(0);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);

    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    const {active,setActive,countries,setCountries,songs,setSongs} = useContext(Context);

    const updateChart = (event) => {
        event.preventDefault();
    }

    const changePicture= () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", function(event){
            let formdata = new FormData();
            formdata.append("change_chart_picture", input.files[0]);
            formdata.append("chart_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, picture:res.picture});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            });
        })

        input.click();
    }

    useEffect(()=>{
        if(search.length > 0){
            //
            $.get("api/", {searchSong:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

    const getList = () => {
        $.get("api/", {getChartSongs:active.id}, function(response){
            setSongs(response);
        })
    }

    const saveToChart = (id) => {
        $.post("api/", {saveToChart:id,chart:active.id}, function(response){
            Toast(response);
            getList();
        })
    }

    const removeFromList = (id) => {
        $.post("api/", {removeFromChartList:id}, function(response) {
            try{
                let res = JSON.parse(response);
                if(res.status){
                    getList();
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return(
        <>
            <Box>
                <Box sx={{borderBottom:1,borderColor:'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Details" sx={{textTransform:"none"}} {...a11yProps(0)} />
                        <Tab label="Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <h1>Details</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <div className="pt-20 pb-20 w3-center">
                                <img src={"../uploads/"+active.picture} width="50%" className="w3-round-large" />

                                <br />
                                <br />
                                <Button variant="outlined" onClick={changePicture} size="small">Change Picture</Button>
                            </div>
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m5">
                            <h5>Update chart details</h5>
                            <form onSubmit={updateChart}>
                                <input type="hidden" name="chart_it" value={active.id} />
                                <TextField label="Name" size="small" name="chart_name" value={active.name} onChange={e=>setActive({...active, name:e.target.value})} fullWidth sx={{mt:2}} />
                                <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel value={active.country} onChange={e=>setActive({...active, country:e.target.value})} name="country" fullWidth>
                                    <MenuItem value={"0"}>
                                        International
                                    </MenuItem>
                                    {countries.map((row,index) => (
                                        <MenuItem key={row.id} value={row.id}>
                                            {row.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField label="Description" size="small" multiline rows={3} name="biography" value={active.description} onChange={e=>setActive({...active, description:e.target.value})} fullWidth sx={{mt:2,mb:3}} />
                                
                                <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                            </form>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h1>Songs</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <TextField label="Search song" value={search} onChange={e=>setSearch(e.target.value)} variant="standard" fullWidth/>
                            {results.length > 0 ? <>
                                {results.map((row,inde) => (
                                    <div className="w3-padding w3-border-bottom pointer w3-hover-light-grey" onClick={e=>saveToChart(row.song_id)}>
                                        <font className="block">{row.title}</font>
                                        <font className="block w3-small w3-opacity">{row.name}</font>
                                    </div>
                                ))}
                            </>:<Alert severity="warning">No matches</Alert>}
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m6">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Artist</TableCell>
                                        <TableCell>Song</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {songs.map((row,index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell padding="none" align="center">{index+1}</TableCell>
                                            <TableCell padding="none">{row.name}</TableCell>
                                            <TableCell padding="none">{row.title}</TableCell>
                                            <TableCell sx={{padding:"5px"}}>
                                                <Button variant="outlined" color="error" onClick={e=>removeFromList(row.chart_id)} size="small">Remove</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabPanel>
            </Box>
        </>
    )
}

function PlaylistDetails(){
    const [value,setValue] = useState(0);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);

    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    const {active,setActive,countries,setCountries,songs,setSongs} = useContext(Context);

    const updateChart = (event) => {
        event.preventDefault();
    }

    const changePicture= () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.addEventListener("change", function(event){
            let formdata = new FormData();
            formdata.append("change_list_picture", input.files[0]);
            formdata.append("chart_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, picture:res.picture});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            });
        })

        input.click();
    }

    useEffect(()=>{
        if(search.length > 0){
            //
            $.get("api/", {searchSong:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);


    const saveToChart = (id) => {
        $.post("api/", {saveToChartList:id,chart:active.id}, function(response){
            Toast(response);
            getList();
        })
    }

    const getList = () => {
        $.get("api/", {getChartSongsList:active.id}, function(response){
            setSongs(response);
        })
    }

    const removeFromList = (id) => {
        $.post("api/", {removeFromList:id}, function(response) {
            try{
                let res = JSON.parse(response);
                if(res.status){
                    getList();
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return(
        <>
            <Box>
                <Box sx={{borderBottom:1,borderColor:'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Details" sx={{textTransform:"none"}} {...a11yProps(0)} />
                        <Tab label="Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <h1>Details</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <div className="pt-20 pb-20 w3-center">
                                <img src={"../uploads/"+active.picture} width="50%" className="w3-round-large" />

                                <br />
                                <br />
                                <Button variant="outlined" onClick={changePicture} size="small">Change Picture</Button>
                            </div>
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m5">
                            <h5>Update chart details</h5>
                            <form onSubmit={updateChart}>
                                <input type="hidden" name="chart_it" value={active.id} />
                                <TextField label="Name" size="small" name="chart_name" value={active.name} onChange={e=>setActive({...active, name:e.target.value})} fullWidth sx={{mt:2}} />
                                <TextField select label="Country" size="small" sx={{mt:2}} hiddenLabel value={active.country} onChange={e=>setActive({...active, country:e.target.value})} name="country" fullWidth>
                                    <MenuItem value={"0"}>
                                        International
                                    </MenuItem>
                                    {countries.map((row,index) => (
                                        <MenuItem key={row.id} value={row.id}>
                                            {row.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField label="Description" size="small" multiline rows={3} name="biography" value={active.description} onChange={e=>setActive({...active, description:e.target.value})} fullWidth sx={{mt:2,mb:3}} />
                                
                                <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Changes</Button>
                            </form>
                        </div>
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h1>Songs</h1>
                    <div className="w3-row">
                        <div className="w3-col m5">
                            <TextField label="Search song" value={search} onChange={e=>setSearch(e.target.value)} variant="standard" fullWidth/>
                            {results.length > 0 ? <>
                                {results.map((row,inde) => (
                                    <div className="w3-padding w3-border-bottom pointer w3-hover-light-grey" onClick={e=>saveToChart(row.song_id)}>
                                        <font className="block">{row.title}</font>
                                        <font className="block w3-small w3-opacity">{row.name}</font>
                                    </div>
                                ))}
                            </>:<Alert severity="warning">No matches</Alert>}
                        </div>
                        <div className="w3-col m1">&nbsp;</div>
                        <div className="w3-col m6">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Artist</TableCell>
                                        <TableCell>Song</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {songs.map((row,index) => (
                                        <TableRow hover key={row.id}>
                                            <TableCell padding="none" align="center">{index+1}</TableCell>
                                            <TableCell padding="none">{row.name}</TableCell>
                                            <TableCell padding="none">{row.title}</TableCell>
                                            <TableCell sx={{padding:"5px"}}>
                                                <Button variant="outlined" color="error" size="small" onClick={e=>removeFromList(row.chart_id)}>Remove</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </TabPanel>
            </Box>
        </>
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

function Users(){
    const[users,setUsers] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = () => {
        $.get("api/", {getUsers:"true"}, function(res){
            setUsers(res);
        })
    }

    useEffect(()=>{
        getUsers();
    }, []);

    return (
        <>
            <div className="w3-padding">
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Date Reg</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow key={row.index} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.phone}</TableCell>
                                    <TableCell padding="none">{row.email}</TableCell>
                                    <TableCell padding="none">{row.date_reg}</TableCell>
                                    <TableCell padding="none">{row.country_data.name}</TableCell>
                                    <TableCell padding="none">{row.location}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>{row.status == "deactivated" ? <Button size="small" variant="contained">Activate</Button>:<Button size="small" variant="contained" color="error">Deactivate</Button>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>
        </>
    )
}

function Admins(){
    const[users,setUsers] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        add:false,
        view:false
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = () => {
        $.get("api/", {getAdmins:"true"}, function(res){
            setUsers(res);
        })
    }

    useEffect(()=>{
        getUsers();
    }, []);

    const addAdmin = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(res){
            if(res.status){
                setOpen({...open, add:false});
                Toast("Success");
                getUsers();
            }
            else{
                Toast(res.message);
            }
        })
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Add Admin</Button>
                <Paper sx={{mt:3}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Photo</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow key={row.index} hover>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.email}</TableCell>
                                    <TableCell padding="none">{row.photo}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button size="small" variant="contained">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={users.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>

            <Dialog
                anchor="right"
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div style={{width:"400px"}} className="w3-padding-large">
                    <font>Add Admin</font>

                    <Alert severity="info" sx={{mt:2}}>New admin will have <b>1234</b> as their password</Alert>

                    <form onSubmit={addAdmin}>
                        <TextField label="Admin Name" size="small" name="admin_name" fullWidth sx={{mt:2}} />
                        <TextField label="Email" size="small" name="admin_email" fullWidth sx={{mt:2,mb:3}} />
                        <Button variant="contained" type="submit" sx={{textTransform:"none"}}>Save Admin</Button>
                    </form>
                    <hr />
                    <div className="pt-15 clearfix">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function Genres(){
    const [genres,setGenres] = useState([]);
    const [active,setActive] = useState({});
    const [page,setPage] = useState(0);
    const [genre,setGenre] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [open,setOpen] = useState({
        manage:false,
        setSongs:false,
        merge:false
    });
    const [search,setSearch] = useState("");
    const [text,setText] = useState("");
    const [results,setResults] = useState([]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res.map(r=>{
                r.checked = false;
                return r;
            }));
        })
    }

    const deleteGenre = (id) => {
        $.post("api/", {deleteGenre:id}, function(res){
            Toast(res);
            getGenres();
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    const updateGenre = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(res){
            Toast(res);
            setOpen({...open,manage:false});
            getGenres();
        })
    }

    useEffect(()=>{
        if(search.length > 0){
            //
            $.get("api/", {searchSong1:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

    const saveSongGenre = (song_id) => {
        $.post("api/", {saveSongGenre:song_id, genre:genre}, function(response){
            Toast(response);
            $.get("api/", {searchSong:search}, function(res){
                setResults(res);
            })
        })
    }

    const mergeGenres = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    getGenres();
                    setOpen({...open, merge:false});
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const markRelated = (event) => {
        //set genre relations

        $.post("api/", {markRelated:genres.filter(r=>r.checked).map(r=>r.id).join(",")}, function(response){
            Toast(response);
        })
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" type="submit" sx={{textTransform:"none"}} onClick={e=>setOpen({...open, setSongs:true})}>Set Songs</Button>
                <Paper sx={{mt:3}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{fontWeight:"bold !important"}}>#</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Name</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Songs</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Status</TableCell>
                                <TableCell sx={{fontWeight:"bold !important"}}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {genres.filter(r=>{
                                if(text == ""){
                                    return true;
                                }
                                else{
                                    return (r.name.toLowerCase().indexOf(text.toLowerCase()) != -1)
                                }
                            }).slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow key={row.index} sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} hover>
                                    <TableCell padding="none" align="center">
                                        <input type="checkbox" checked={row.checked} onChange={e=>{
                                            setGenres(genres.map(r=>{
                                                if(r.id == row.id){
                                                    r.checked = e.target.checked;
                                                }
                                                return r;
                                            }))
                                        }} className="mr-10" />
                                        {(rowsPerPage*page) + index+1}
                                    </TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.songs}</TableCell>
                                    <TableCell padding="none">{row.status}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button size="small" variant="contained" onClick={e=>{
                                            setActive(row);
                                            setOpen({...open,manage:true})
                                        }} sx={{textTransform:"none"}}>Manage</Button>
                                        <Button size="small" variant="contained" color="error" onClick={e=>deleteGenre(row.id)} sx={{textTransform:"none",ml:2}}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={genres.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onSearchChange={t=>setText(t)}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>

                <div className="pt-10">
                    {genres.filter(r=>r.checked).length > 0 ? <>
                        <font>Selected: {genres.filter(r=>r.checked).length}. </font>
                        <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>setOpen({...open,merge:true})}>Merge to one</Button>
                        <Button variant="contained" size="small" color="warning" sx={{textTransform:"none",ml:2}} onClick={markRelated}>Mark Related</Button>
                    </> : "" }
                </div>
            </div>

            <Drawer open={open.manage} onClose={()=>setOpen({...open,manage:false})} anchor="right">
                <div className="w3-padding-large" style={{width:"300px"}}>
                    <form onSubmit={updateGenre}>
                        <input type="hidden" name="genre_id" value={active.id}/>
                        <TextField name="update_genre" label="Genre name" value={active.name} onChange={e=>setActive({...active,name:e.target.value})} fullWidth sx={{mt:3,mb:2}} />
                        <Button type="submit" variant="contained">Save Changes</Button>
                    </form>
                </div>
            </Drawer>

            <Dialog open={open.setSongs} onClose={()=>setOpen({...open,setSongs:false})}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Add multiple songs to genre</font>

                    <TextField select label="Genre" size="small" sx={{mt:2}} hiddenLabel name="genre" value={genre} onChange={e=>setGenre(e.target.value)} fullWidth>
                        {genres.map((row,index) => (
                            <MenuItem key={row.id} value={row.id}>
                                {row.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField label="Search song" value={search} onChange={e=>setSearch(e.target.value)} sx={{mt:2}} variant="standard" fullWidth/>
                    <div style={{height:"500px",overflowY:"auto"}}>
                        {results.length > 0 ? <>
                            {results.filter(r=>(r.genre == 0)).map((row,inde) => (
                                <div className="w3-padding w3-border-bottom pointer w3-hover-light-grey" onClick={e=>saveSongGenre(row.song_id)}>
                                    <font className="block">{row.title}</font>
                                    <font className="block w3-small w3-opacity">{row.name}</font>
                                </div>
                            ))}
                        </>:<Alert severity="warning" sx={{mt:2}}>No matches</Alert>}
                    </div>

                    <div className="pt-10 pb-15 clearfix">
                        <Button variant="outlined" color="error" className="float-right" onClick={()=>setOpen({...open,setSongs:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={open.merge} onClose={()=>setOpen({...open,merge:false})}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Merge to one genre</font>

                    <div className="pt-15">
                        {genres.filter(r=>r.checked).map(r=>(
                            <div className="w3-padding-small w3-hover-light-grey pointer w3-small w3-opacity" key={r.id}>{r.name}</div>
                        ))}
                    </div>
                    <form onSubmit={mergeGenres}>
                        <input type="hidden" name="genres_to_merge" value={genres.filter(r=>r.checked).map(r=>r.id).join(",")} />
                        <TextField fullWidth name="new_name" sx={{my:3}} size="small" label="Genre name"/>

                        <Button variant="contained" type="submit">Submit</Button>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function Pagination(props){
    const [pos,setPos] = useState({
        from:0,
        to:0,
        all:props.count
    });
    const [rowsPerPage,setRowsPerPage] = useState(props.rowsPerPage);
    const [page,setPage] = useState(props.page);
    const [pages,setPages] = useState([0]);
    const [search,setSearch] = useState("");
    
    useEffect(()=>{
        setRowsPerPage(props.rowsPerPage);
    }, [props.rowsPerPage]);

    useEffect(()=>{
        setPage(props.page);
    }, [props.page]);

    useEffect(()=>{
        setPos({...pos, all:props.count});
    }, [props.count]);

    useEffect(()=>{
        let max = Math.ceil(pos.all / rowsPerPage);
        let array = [];
        for(let i = 0; i < max; i++){
            array.push(i);
        }
        setPages(array);
    }, [rowsPerPage,pos]);

    useEffect(()=>{
        props.onPageChange(null, page);
    },[page])

    useEffect(()=>{
        props.onRowsPerPageChange({target:{value:rowsPerPage}}, rowsPerPage);
    },[rowsPerPage])

    useEffect(()=>{
        if(props.onSearchChange != undefined){
            props.onSearchChange(search);
        }
    }, [search]);

    return (
        <>
            <div className="w3-row w3-padding">
                <div className="w3-col m6">
                    <Input placeholder="Search table" value={search} onChange={e=>setSearch(e.target.value)} />
                </div>
                <div className="w3-col m6">
                    <font className="mr-15">Rows per page</font> 
                    <select className="mr-15" value={rowsPerPage} onChange={e=>setRowsPerPage(Number(e.target.value))}>
                        {props.rowsPerPageOptions.map((row)=>(
                            <option>{row}</option>
                        ))}
                    </select>
                    <font className="mr-15">{`${pos.from} - ${pos.to} of ${pos.all}`}</font>
                    <Fab size="small" sx={{boxShadow:"none",outline:"none",background:"inherit"}} onClick={e=>setPage(0)}>
                        <i className="fa fa-angle-double-left w3-large text-secondary"/>
                    </Fab>
                    <Fab size="small" sx={{boxShadow:"none",outline:"none",background:"inherit"}} disabled={page == 0} onClick={e=>{
                        if(page != 0){
                            setPage(page-1);
                        }
                    }}>
                        <i className="fa fa-angle-left w3-large text-secondary"/>
                    </Fab>
                    <select value={page} onChange={e=>setPage(Number(e.target.value))}>
                        <option value={-1}>Page</option>
                        {pages.map((row)=>(
                            <option>{row}</option>
                        ))}
                    </select>
                    <Fab size="small" sx={{boxShadow:"none",outline:"none",background:"inherit"}} disabled={page == pages[pages.length-1]} onClick={e=>{
                        if(page != pages[pages.length-1]){
                            setPage(page+1);
                        }
                    }}>
                        <i className="fa fa-angle-right w3-large text-secondary"/>
                    </Fab>
                    <Fab size="small" sx={{boxShadow:"none",outline:"none",background:"inherit"}} onClick={e=>setPage(pages[pages.length-1])}>
                        <i className="fa fa-angle-double-right w3-large text-secondary"/>
                    </Fab>
                </div>
            </div>
        </>
    )
}

function SystemValues(){
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
                            <Tab label="Countries" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Artist & Country" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <Countries />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ArtistCountry />
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Adverts(){
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
                            <Tab label="Active" sx={{textTransform:"none"}} {...a11yProps(0)} />
                            <Tab label="Expired" sx={{textTransform:"none"}} {...a11yProps(1)} />
                            <Tab label="Summary" sx={{textTransform:"none"}} {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>
                        <ActiveAdverts />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <ExpiredAdverts />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <h1>Summary</h1>
                    </TabPanel>
                </Box>
            </div>
        </>
    )
}

function Countries(){
    const [countries,setCountries] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    useEffect(()=>{
        getCountries();
    }, []);

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained">Add Country</Button>

                <Paper sx={{mt:2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Code</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Neighbours</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {countries.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow hover key={row.id}>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.code}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.neighbours}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={countries.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getMusic = () => {
        $.get("api/", {getSongs:"true",start:(page*rowsPerPage),limit:rowsPerPage}, function(response){
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
            setCount(response.count);
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

    useEffect(()=>{
        if(search.length > 0){
            $.get("api/", {searchSongRow:search}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [search]);

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

    const heat = (id,pos) => {
        $.post("api/", {heatSong:id}, function(response){
            Toast(response);
            if(pos == 1){
                $.get("api/", {searchSongRow:search}, function(res){
                    setResults(res);
                })
            }
            else{
                getMusic();
            }
        })
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open,add:true})} sx={{textTransform:"none"}}>Upload Song</Button> 
                <Button variant="contained" onClick={e=>setOpen({...open,web:true})} sx={{ml:2,textTransform:"none"}}>Add Song</Button>

                <Paper sx={{mt:2}}>
                    <Input placeholder="Search Song" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>WebId</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Artist</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell>Plays</TableCell>
                                <TableCell>Downloads</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.length > 0 ? <>
                                {results.map((row,index) => (
                                    <TableRow hover sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} key={row.song_id}>
                                        <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.title}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.length}</TableCell>
                                        <TableCell padding="none">{row.genre_data.name}</TableCell>
                                        <TableCell padding="none">
                                            {row.plays}
                                            <Chip label="Heat" size="small" color="primary" sx={{ml:2}} onClick={e=>heat(row.song_id,1)}/>
                                        </TableCell>
                                        <TableCell padding="none">
                                            {row.downloads}
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>:
                            <>
                            {rows.map((row,index) => (
                                <TableRow sx={{backgroundColor: (index % 2 == 0 ? "rgba(0, 0, 0, 0.02)":"inherit")}} hover key={row.song_id}>
                                    <TableCell padding="none" align="center">{rowsPerPage*page + (index+1)}</TableCell>
                                    <TableCell padding="none">{row.webid}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">{row.name}</TableCell>
                                    <TableCell padding="none">{row.length}</TableCell>
                                    <TableCell padding="none">{row.genre_data.name}</TableCell>
                                    <TableCell padding="none">
                                        {row.plays}
                                        <Chip label="Heat" size="small" color="primary" sx={{ml:2}} onClick={e=>heat(row.song_id,2)}/>
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
                            ))}</>}
                        </TableBody>
                    </Table>
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={Number(count)}
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

function AddMusic(props){
    const [open,setOpen] = useState(true);
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [artist,setArtist] = useState({});

    const[genres,setGenres] = useState([]);
    
    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    const saveSong = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    setOpen(false);
                    props.onClose();
                    Toast("Success");
                }
                else{
                    Toast(message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="block w3-large">Add New Music</font>

                    <form onSubmit={saveSong}>
                        <TextField label="Title" fullWidth name="song_title" sx={{mt:2}} />
                        <input type="hidden" name="artist_id" value={artist.id}/>

                        {artist.id != undefined? <Chip label={artist.name} variant="outlined" sx={{mt:2}} onDelete={()=>setArtist({})} />:
                        <>
                            <TextField label="Main Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                            {results.map((row,index)=>(
                                <div className="w3-padding" key={row.id}>
                                    <font className="block">{row.name}</font>
                                    <Chip label="Set this" size='small' variant="outlined" onClick={e=>{
                                        setArtist(row);
                                    }} />
                                </div>
                            ))}
                        </>}

                        <TextField label="Genre" fullWidth name="genre" select size="small" sx={{mt:2}}>
                            {genres.map((row,index)=>(
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField label="Artwork" fullWidth name="artwork" type="file" sx={{mt:2}} />
                        <TextField label="Song File" fullWidth name="file" type="file" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Upload Song</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function AddWebMusic(props){
    const [open,setOpen] = useState(true);
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [artist,setArtist] = useState({});
    const [artworkSrc,setArtworkSrc] = useState("upload");

    const[genres,setGenres] = useState([]);
    
    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    const saveSong = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    form.reset();
                    setOpen(false);
                    props.onClose();
                    Toast("Success");
                }
                else{
                    Toast(message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen(false)}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="block w3-large">Add New Music</font>

                    <form onSubmit={saveSong}>
                        <TextField label="Title" fullWidth name="song_title" sx={{mt:2}} />
                        <input type="hidden" name="artist_id" value={artist.id}/>

                        {artist.id != undefined? <Chip label={artist.name} variant="outlined" sx={{mt:2}} onDelete={()=>setArtist({})} />:
                        <>
                            <TextField label="Main Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                            {results.map((row,index)=>(
                                <div className="w3-padding" key={row.id}>
                                    <font className="block">{row.name}</font>
                                    <Chip label="Set this" size='small' variant="outlined" onClick={e=>{
                                        setArtist(row);
                                    }} />
                                </div>
                            ))}
                        </>}

                        <TextField label="Genre" fullWidth name="genre" select size="small" sx={{mt:2}}>
                            {genres.map((row,index)=>(
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className="pt-10 pb-10">
                            <input type="radio" id="upload" value={"upload"} onChange={e=>setArtworkSrc("upload")} checked={artworkSrc == "upload"}/>
                            <label htmlFor="upload">Upload Artwork</label><br/>

                            <input type="radio" id="web_src" value={"upload"} onChange={e=>setArtworkSrc("web_src")} checked={artworkSrc == "web_src"}/>
                            <label htmlFor="web_src">Web Source</label>
                        </div>
                        <TextField label="Artwork" fullWidth name="artwork" type={artworkSrc == "upload" ? "file":"text"} sx={{mt:2}} />
                        <TextField label="Song File" fullWidth name="mp3_url" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Add Song</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function ArtistDetails(){
    const {active,setActive} = useContext(Context);
    const [value,setValue] = useState(0);
    const [search,setSearch] = useState("");
    const [results,setResults] = useState([]);
    const [songs,setSongs] = useState([]);
    const [activeSong,setActiveSong] = useState({});
    const [open,setOpen] = useState({
        manage:false,
        transfer:false,
        album:false,
        genres:false
    });

    const [albums,setAlbums] = useState([]);

    const getAlbums = () => {
        if(active.id != undefined){
            $.get("api/", {getArtistAlbums:active.id}, function(response){
                setAlbums(response);
            })
        }
    }

    const getSongs = () => {
        if(active.id != undefined){
            $.get("api/", {getArtistSongs:active.id}, function(response){
                setSongs(response.map(r=>{
                    r.checked = false;
                    return r;
                }));
            });
        }
        else{
            Toast("Id is empty");
        }
    }

    useEffect(()=>{
        getAlbums();
        getSongs();
    }, []);

    useEffect(()=>{
        getAlbums();
        getSongs();
    }, [active]);

    const handleChange = (event,newValue) => {
        setValue(newValue);
    }

    const checkAllSongs = (event) => {
        if(event.target.checked){
            setSongs(songs.map(r=>{
                r.checked = true;
                return r;
            }))
        }
        else{
            setSongs(songs.map(r=>{
                r.checked = false;
                return r;
            }))
        }
    }

    const albumImage = (url) => {
        if(url.indexOf("http://") != -1 || url.indexOf("https://") != -1){
            return url;
        }
        else{
            return "../uploads/albums/"+url;
        }
    }

    return (
        <>
            <Box>
                <Box sx={{borderBottom:1,borderColor:'divider'}}>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Albums" sx={{textTransform:"none"}} {...a11yProps(0)} />
                        <Tab label="Songs" sx={{textTransform:"none"}} {...a11yProps(1)} />
                        <Tab label="Details" sx={{textTransform:"none"}} {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <h1>Albums</h1>
                    <Box sx={{p:1}}>
                        <Button variant="contained" onClick={e=>setOpen({...open, album:true})}>Add Album</Button> <Button variant="contained" sx={{ml:2}}>Upload Zip</Button>
                    </Box>
                    <Paper sx={{mt:1}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Supporting Artists</TableCell>
                                    <TableCell>Songs</TableCell>
                                    <TableCell>Plays</TableCell>
                                    <TableCell>Artwork</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {albums.map((row,index) => (
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="none" align="center">{index+1}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.year}</TableCell>
                                        <TableCell padding="none">{row.supporting_artists}</TableCell>
                                        <TableCell padding="none">{row.songs}</TableCell>
                                        <TableCell padding="none">{row.plays}</TableCell>
                                        <TableCell padding="none">
                                            <img src={albumImage(row.image)} width={"30"} />
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="outlined" size="small" startIcon={<i className="fa fa-file-archive w3-small"/>}>Upload Zip</Button>
                                            <Button variant="contained" size="small" sx={{ml:2}}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <h1>Songs</h1>
                    <Paper sx={{mt:2}}>
                        <Input placeholder="Search Artist" value={search} onChange={e=>setSearch(e.target.value)} sx={{width:"200px"}} />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <input type="checkbox" onChange={checkAllSongs}/>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell>#</TableCell>
                                    <TableCell>WebId</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>Genre</TableCell>
                                    <TableCell>Plays</TableCell>
                                    <TableCell>Downloads</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {songs.map((row,index) => (
                                    <TableRow hover key={row.song_id}>
                                        <TableCell>
                                            <input type="checkbox" checked={row.checked} onChange={e=>{
                                                setSongs(songs.map((r,i)=>{
                                                    if(i == index){
                                                        if(e.target.checked){
                                                            r.checked = true;
                                                        }
                                                        else{
                                                            r.checked = false;
                                                        }
                                                    }
                                                    return r;
                                                }))
                                            }} />
                                        </TableCell>
                                        <TableCell>
                                            <i className="fa fa-play pointer w3-hover-text-blue" onClick={e=>{
                                                let audio = document.getElementById("audio");
                                                audio.src= row.mp3_url;
                                                audio.play();
                                            }}/>
                                        </TableCell>
                                        <TableCell padding="none" align="center">{(index+1)}</TableCell>
                                        <TableCell padding="none">{row.webid}</TableCell>
                                        <TableCell padding="none">{row.title}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.length}</TableCell>
                                        <TableCell padding="none">{row.genre_data.name}</TableCell>
                                        <TableCell padding="none">{row.plays}</TableCell>
                                        <TableCell padding="none">
                                            {row.downloads}
                                        </TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button variant="contained" size="small" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, manage:true});
                                            }}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {/*<TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={Number(count)}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />*/}
                    </Paper>

                    <Box sx={{p:2}}>
                        {songs.filter(r=>r.checked).length > 0 ? <>
                            <Button variant="contained" color="warning" onClick={e=>setOpen({...open, transfer:true})}>Transfer</Button> 
                            <Button variant="contained" sx={{ml:2}}>Make Album</Button>
                            <Button variant="contained" sx={{ml:2, textTransform:"none"}} onClick={e=>setOpen({...open, genres:true})}>Set Genre</Button>
                        </>:""}
                    </Box>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <h1>Details</h1>
                </TabPanel>
            </Box>

            {open.transfer ? <TransferSongs songs={songs} onClose={()=>{
                setOpen({...open, transfer:false});
                getSongs();
            }} />:""}

            {open.genres ? <SetGenre songs={songs} onClose={()=>{
                setOpen({...open, genres:false});
                getSongs();
            }} />:""}

            {open.album ? <CreateAlbum artist={active} onClose={()=>{
                setOpen({...open, album:false});
                getAlbums();
            }} />:""}
        </>
    )
}

function SetGenre(props){
    const [genres,setGenres] = useState([]);
    const [open,setOpen] = useState(true);

    const getGenres = () => {
        $.get("api/", {getGenres:"true"}, function(res){
            setGenres(res);
        })
    }

    useEffect(()=>{
        getGenres();
    }, []);

    const setGenresSongs = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    setOpen(false);
                    props.onClose();
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

    return (
        <>
            <Dialog open={open} onClose={()=>{
                setOpen(false)
                props.onClose();
            }}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Set Genre </font>

                    <form onSubmit={setGenresSongs}>
                        <input type="hidden" name="set_genre_songs" value={props.songs.filter(r=>r.checked).map(r=>r.id).join(",")}/>
                        <TextField select size="small" name="genre" label="Choose categories" sx={{mt:2,mb:3}} fullWidth>
                            {genres.map((row,index)=>(
                                <MenuItem key={row.id} value={row.id}>
                                    {row.name}
                                </MenuItem>
                            ))}
                        </TextField><br/>

                        <Button type="sumbit" variant="contained">Submit</Button>
                    </form>
                </div>
            </Dialog>
        </>
    )
}

function CreateAlbum(props){
    const [artworkSrc,setArtworkSrc] = useState("upload");
    const {active,setActive} = useContext(Context);
    const [open,setOpen] = useState(true);

    const saveAlbum = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    props.onClose();
                    setOpen(false);
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

    return (
        <>
            <Dialog open={open} onClose={()=>setOpen(false)}>
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Create Album</font>
                    <form onSubmit={saveAlbum}>
                        <input type="hidden" name="artist" value={active.id} />
                        <TextField fullWidth label="Album title" name="album_title" sx={{mt:2}} />
                        <div className="pt-10 pb-10">
                            <input type="radio" id="upload" value={"upload"} onChange={e=>setArtworkSrc("upload")} checked={artworkSrc == "upload"}/>
                            <label htmlFor="upload">Upload Artwork</label><br/>

                            <input type="radio" id="web_src" value={"upload"} onChange={e=>setArtworkSrc("web_src")} checked={artworkSrc == "web_src"}/>
                            <label htmlFor="web_src">Web Source</label>
                        </div>
                        <TextField label="Artwork" fullWidth name="artwork" type={artworkSrc == "upload" ? "file":"text"} sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Add Album</Button>
                    </form>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false);
                            props.onClose();
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function TransferSongs(props){
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [open,setOpen] = useState(true);

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    return (
        <>
            <Dialog
                open={open}
                onClose={()=>setOpen({...open,transfer:false})}>
                <div className="w3-padding-large"style={{width:"350px"}}>
                    <font>Transfer songs to another artists</font>
                    <div className="pt-15">
                        {props.songs.filter(r=>r.checked).map((row,index)=>(
                            <div className="w3-padding">
                                <input type="checkbox" checked={row.checked} /> {row.title}
                            </div>
                        ))}

                        <TextField label="Destine Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                        {results.map((row,index)=>(
                            <div className="w3-padding" key={row.id}>
                                <font className="block">{row.name}</font>
                                <Chip label="Transfer" onClick={e=>{
                                    $.post("api/", {newArtist:row.id,songs:props.songs.filter(r=>r.checked).map(r=>r.id).join(",")}, function(response){
                                        Toast(response);
                                        setOpen(false);
                                        props.onClose();
                                    })
                                }} />
                            </div>
                        ))}
                        <Button variant="contained" sx={{mt:2}}>Transfer Now</Button>
                    </div>

                    <div className="pt-15 pb-15 clearfix">
                        <Button className="float-right" variant="contained" color="error" onClick={()=>{
                            setOpen(false)
                            props.onClose();
                        }}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function ArtistCountry(){
    const [countries,setCountries] = useState([]);
    const [value,setValue] = useState("");
    const [country,setCountry] = useState(0);
    const [results,setResults] = useState([]);
    
    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    useEffect(()=>{
        getCountries();
    }, []);

    const searchMe = () => {
        $.get("api/", {searchArtistNoCountry:value}, function(res){
            setResults(res);
        })
    }

    useEffect(()=>{
        if(value == ""){
            setResults([]);
        }
        else{
            searchMe();
        }
    }, [value]);

    return (
        <>
            <div className="w3-padding">
                <select value={country} onChange={e=>setCountry(e.target.value)}>
                    {countries.map((row,index)=>(
                        <option value={row.id}>{row.name}</option>
                    ))}
                </select>

                <div className="border" style={{width:"400px"}}>
                    <Input placeholder="search artist" value={value} onChange={e=>setValue(e.target.value)} fullWidth />
                    {results.map((row,index)=>(
                        <div className="w3-padding w3-hover-light-grey pointer" onClick={e=>{
                            $.post("api/", {updateArtistCountry:row.id,country:country}, function(res){
                                searchMe();
                            })
                        }}>{row.name}</div>
                    ))}
                </div>
            </div>
        </>
    )
}

function ActiveAdverts(){
    const [adverts,setAdverts] = useState([]);
    const [page,setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage]= useState(10);
    const [active,setActive] = useState({
        file:""
    })
    const [open,setOpen] = useState({
        add:false,
        edit:false,
        images:false
    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getAdverts = () => {
        $.get("api/", {getAdverts:"true"}, function(response){
            setAdverts(response);
        })
    }

    useEffect(()=>{
        getAdverts();
    }, []);

    const addAdvert = (event) => {
        event.preventDefault();

        let form = event.target, formdata = new FormData(form);

        post("api/", formdata, function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    Toast("Success");
                    form.reset();
                    getAdverts();
                    setOpen({...open, add:false});
                }
                else{
                    Toast(res.message)
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const editAdvert = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(res){
            if(res.status){
                setOpen({...open, edit:false});
                Toast("Success!");
                getAdverts();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const attachType = (str) => {
        if(str == ""){
            return "";
        }

        let images = ["png", "jpeg", "gif", "jpg","webp"];
        let chars = str.split("."), ext = chars[chars.length - 1].toLowerCase();
        if(images.includes(ext)){
            return "image";
        }
        else if(ext == "mp4"){
            return "video";
        }
    }

    const arrayReverse = (array) => {
        array.reverse();
        return array()
    }

    const changeAdvertPic = (event) => {
        //
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*';

        input.addEventListener('change', function(event){
            //upload file
            let formdata = new FormData();
            formdata.append("advert_picture", input.files[0]);
            formdata.append("advert_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, square_image:res.image});
                        getAdverts();
                        Toast("Success");
                        setOpen({...open, images:false});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        })
        input.click();
    }

    const changeAdvertFile = (event) => {
        //
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*, .mp4';

        input.addEventListener('change', function(event){
            //upload file
            let formdata = new FormData();
            formdata.append("advert_file", input.files[0]);
            formdata.append("advert_id", active.id);

            post("api/", formdata, function(response){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        setActive({...active, file:res.file});
                        getAdverts();
                        Toast("Success");
                        setOpen({...open, images:false});
                    }
                    else{
                        Toast(res.message);
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        })
        input.click();
    }

    return (
        <>
            <div className="w3-padding">
                <Button variant="contained" onClick={e=>setOpen({...open, add:true})}>Add Advert</Button>

                <Paper sx={{mt:2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Link</TableCell>
                                <TableCell>Picture</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adverts.slice(rowsPerPage*page, (page+1)*rowsPerPage).map((row,index)=>(
                                <TableRow hover key={row.id}>
                                    <TableCell padding="none" align="center">{index+1}</TableCell>
                                    <TableCell padding="none">{row.company}</TableCell>
                                    <TableCell padding="none">{row.title}</TableCell>
                                    <TableCell padding="none">{row.description.substring(0,60)+"..."}</TableCell>
                                    <TableCell padding="none">{row.phone}</TableCell>
                                    <TableCell padding="none">{row.email}</TableCell>
                                    <TableCell padding="none">{row.link}</TableCell>
                                    <TableCell padding="none">
                                        <img src={"../uploads/"+row.square_image} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, images:true});
                                        }} width="30" className="rounded"/>
                                    </TableCell>
                                    <TableCell padding="none">{row.date}</TableCell>
                                    <TableCell sx={{padding:"5px"}}>
                                        <Button variant="contained" size="small" sx={{textTransform:"none"}} onClick={e=>{
                                            setActive(row);
                                            setOpen({...open, edit:true});
                                        }}>Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                        component="div"
                        count={adverts.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                </Paper>
            </div>

            <Dialog
                open={open.add}
                onClose={()=>setOpen({...open, add:false})}
                >
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Add Advert</font>
                    <form onSubmit={addAdvert}>
                        <TextField label="Company" fullWidth size="small" name="company" sx={{mt:2}} />
                        <TextField label="Title" fullWidth size="small" name="title" sx={{mt:2}} />
                        <TextField label="Description" fullWidth size="small" name="description" multiline rows={3} sx={{mt:2}} />
                        <TextField label="Phone" fullWidth size="small" name="phone" sx={{mt:2}} />
                        <TextField label="Email" fullWidth size="small" name="email" sx={{mt:2}} />
                        <TextField label="Link" fullWidth size="small" name="link" sx={{mt:2}} />
                        <TextField label="Display Image" fullWidth size="small" name="display" type="file" sx={{mt:2}} />
                        <TextField label="File" fullWidth size="small" name="file" type="file" sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Submit</Button>
                    </form>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, add:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>

            <Dialog
                open={open.images}
                onClose={()=>setOpen({...open, edit:false})}
                >
                <div className="w3-padding-large" style={{width:"400px"}}>
                    <font className="w3-large">Change Attachements</font>
                    <div className="pt-15 w3-center">
                        <font className="w3-opacity w3-small block">Display Picture</font>
                        <img src={"../uploads/"+active.square_image} width={"70%"} className="rounded" /><br/>
                        <Button size="small" sx={{mt:1}} onClick={changeAdvertPic} variant="outlined">Change</Button>
                        <hr/>

                        <font className="w3-opacity w3-small block">File attachments</font>
                        {attachType(active.file) == "image" ? <>
                            <img src={"../uploads/"+active.file} width={"70%"} className="rounded" />
                        </>:<>
                            <video width={"70%"} controls>
                                <source src={"../uploads/"+active.file} type="video/mp4"/>
                            </video>
                        </>}
                        <br/>
                        <Button size="small" sx={{mt:1}} onClick={changeAdvertFile} variant="outlined">Change</Button>
                    </div>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" className="float-right" onClick={()=>setOpen({...open, images:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>

            <Drawer
                open={open.edit}
                onClose={()=>setOpen({...open, edit:false})}
                anchor="right">
                <div className="w3-padding" style={{width:"300px"}}>
                    <font className="w3-large">Edit Advert</font>

                    <form onSubmit={editAdvert}>
                        <input type="hidden" name="advert_id" value={active.id} />
                        <TextField label="Company" fullWidth size="small" name="company_edit" sx={{mt:2}} value={active.company} onChange={e=>setActive({...active, company:e.target.value})} />
                        <TextField label="Title" fullWidth size="small" name="title" sx={{mt:2}} value={active.title} onChange={e=>setActive({...active, title:e.target.value})} />
                        <TextField label="Description" fullWidth size="small" name="description" multiline rows={3} sx={{mt:2}} value={active.description} onChange={e=>setActive({...active, description:e.target.value})} />
                        <TextField label="Phone" fullWidth size="small" name="phone" sx={{mt:2}} value={active.phone} onChange={e=>setActive({...active, phone:e.target.value})} />
                        <TextField label="Email" fullWidth size="small" name="email" sx={{mt:2}} value={active.email} onChange={e=>setActive({...active, email:e.target.value})} />
                        <TextField label="Link" fullWidth size="small" name="link" sx={{mt:2,mb:3}} value={active.link} onChange={e=>setActive({...active, link:e.target.value})} />

                        <Button variant="contained" type="submit">Save Changes</Button>
                    </form>

                    <div className="clearfix pt-15 pb-15">
                        <Button variant="contained" color="error" onClick={()=>setOpen({...open, edit:false})}>Close</Button>
                    </div>
                </div>
            </Drawer>
        </>
    )
}

function ExpiredAdverts(){
    return (
        <></>
    )
}

function ArtistsCategories(){
    const [activeCategory,setActiveCategory]= useState(0);
    const [categories,setCategories] = useState([]);
    const [artists,setArtists] = useState([]);
    const [value,setValue] = useState("");
    const [results,setResults] = useState([]);
    const [countries,setCountries] = useState([]);
    const [ids,setIds] = useState([]);
    const [active,setActive] = useState({});
    const [country,setCountry] = useState(0);

    const [page, setPage] = React.useState({
        categories:0,
        artists:0,
    });
    const [rowsPerPage, setRowsPerPage] = React.useState({
        categories:10,
        artists:10,
    });
    const [open,setOpen] = useState({
        edit:false
    })

    const handleChangePage = (event, newPage, table) => {
        setPage({...page, [table]:newPage});
    };
    
    const handleChangeRowsPerPage = (event, table) => {
        setRowsPerPage({...rowsPerPage, [table]:parseInt(event.target.value, 10)});
        setPage({...page, [table]:0});
    };

    const getCountries = () => {
        $.get("api/", {getCountries:"true"}, function(response){
            setCountries(response);
        })
    }

    useEffect(()=>{
        if(value != ""){
            //
            $.get("api/", {searchArtist:value}, function(res){
                setResults(res);
            })
        }
        else{
            setResults([]);
        }
    }, [value]);

    const getCategories = () => {
        $.get("api/", {getCategories:"true"}, function(response){
            setCategories(response);
        })
    }

    const getArtists = () => {
        $.get("api/", {getCategoryArtist:activeCategory,country:country}, function(response){
            setArtists(response);
        })
    }

    const saveCategory = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    getCategories();
                    event.target.reset();
                    Toast("Success!")
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
        //
        getCategories();
        getCountries();
    }, []);

    useEffect(()=>{
        getArtists();
    }, [country, activeCategory]);

    useEffect(()=>{
        //get Artist from this category
        getArtists();
    }, [activeCategory]);

    useEffect(()=>{
        setIds(artists.map((row,index)=>row.id))
    }, [artists])

    const addArtist = (id) => {
        $.post("api/", {addArtistCategory:id,category:activeCategory}, function(response){
            Toast(response);
            //setOpen(false);
            getArtists();
            setResults([]);
        })
    }

    const editCategory = (event) => {
        event.preventDefault();

        $.post("api/", $(event.target).serialize(), function(response){
            setOpen({...open, edit:false})
            Toast(response);
            getCategories();
        })
    }

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m5 w3-padding">
                    <form onSubmit={saveCategory}>
                        <TextField label="Add Category" size="small" name="new_category" sx={{mt:2,mb:2}} fullWidth/>
                        <Button type="submit" variant="contained" sx={{textTransform:"none"}}>Save</Button>
                    </form>

                    <Paper sx={{mt:3}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map((row,index)=>(
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="none" align="center">{index+1}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button size="small" variant="outlined" sx={{textTransform:"none"}} onClick={e=>{
                                                setActive(row);
                                                setOpen({...open, edit:true});
                                            }}>Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={categories.length}
                            rowsPerPage={rowsPerPage.categories}
                            page={page.categories}
                            onPageChange={(event, newPage)=>{handleChangePage(event, newPage, "categories")}}
                            onRowsPerPageChange={(event)=>{handleChangeRowsPerPage(event, "categories")}}
                            />
                    </Paper>
                </div>
                <div className="w3-col m7 w3-padding">
                    <TextField select size="small" label="Category" sx={{mt:2}} fullWidth onChange={e=>setActiveCategory(e.target.value)} value={activeCategory}>
                        {categories.map((row,index)=>(
                            <MenuItem key={row.id} value={row.id}>
                                {row.name}
                            </MenuItem>
                        ))}
                    </TextField><br/>
                    <TextField select size="small" label="Country" sx={{mt:2,display:"none"}} fullWidth onChange={e=>setCountry(e.target.value)} value={country}>
                        {countries.map((row,index)=>(
                            <MenuItem key={row.id} value={row.id}>
                                {row.name}
                            </MenuItem>
                        ))}
                    </TextField><br/>
                    <TextField label="Search Artist" value={value} onChange={e=>setValue(e.target.value)} sx={{mt:2}} fullWidth/>
                    {results.filter(row=>!ids.includes(row.id)).map((row,index)=>(
                        <div className="w3-padding" key={row.id}>
                            <font className="block">{row.name}</font>
                            <Chip label="Set" variant="outlined" size="small" onClick={e=>addArtist(row.id)} />
                        </div>
                    ))}

                    <Paper sx={{mt:3}}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Country</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {artists.map((row,index)=>(
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="none" align="center">{index+1}</TableCell>
                                        <TableCell padding="none">{row.name}</TableCell>
                                        <TableCell padding="none">{row.country_data.name}</TableCell>
                                        <TableCell sx={{padding:"5px"}}>
                                            <Button size="small" variant="outlined">Manage</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100,200,500]}
                            component="div"
                            count={artists.length}
                            rowsPerPage={rowsPerPage.artists}
                            page={page.artists}
                            onPageChange={(event, newPage)=>{handleChangePage(event, newPage, "artists")}}
                            onRowsPerPageChange={(event)=>{handleChangeRowsPerPage(event, "artists")}}
                            />
                    </Paper>
                </div>
            </div>

            <Dialog open={open.edit} onClose={()=>setOpen({...open, edit:false})}>
                <div className="w3-padding" style={{width:"350px"}}>
                    <font className="block">Edit Category</font>
                    <form onSubmit={editCategory}>
                        <input type="hidden" name="category_id" value={active.id}/>
                        <TextField size="small" fullWidth label="Artist Category" value={active.name} onChange={e=>setActive({...active, name:e.target.value})} name="category_edit" sx={{mt:2,mb:2}} />
                        <Button variant="contained" type="submit">Save Changes</Button>
                    </form>
                    <div className="clearfix pt-3 pb-2">
                        <Button className="float-right" variant="contained" color="error" onClick={e=>setOpen({...open, edit:false})}>Close</Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

function Profile(props){
    const [value, setValue] = React.useState(0);
    const [picture, setPicture] = React.useState(user.photo);
    const [modals, setModals] = useState({
        editEmail:false,
        editName:false
    });
    const [user2, setUser2] = useState({...user});
  
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const choosePicture = (event) => {
        let input = document.createElement("input");
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', function (event){
            //upload
            let formdata = new FormData();
            formdata.append("change_picture", input.files[0]);

            post("api/", formdata, function (response){
                try{
                    let res = JSON.parse(response);

                    if (res.status){
                        window.localStorage.setItem("user", response);
                        user = JSON.parse(window.localStorage.getItem("user"));
                        setPicture(user.photo);
                    }
                }
                catch (e) {
                    alert(e.toString()+response);
                }
            })
        });

        input.click();
    }

    const updateEmail = (event) => {
        $.post("api/", {updateEmail:user2.email}, function(res){
            if (res.status){
                Toast("Successfully updated email");
                setModals({...modals, editEmail:false});
                getUser();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const getUser = () => {
        $.get("api/", {getCurrentUser:"true"}, function(res){
            setUser2(res);
            localStorage.setItem("user", JSON.stringify(res));
        })
    }

    const updateName = (event) => {
        $.post("api/", {updateName:user2.name}, function(res){
            if (res.status){
                Toast("Successfully updated name");
                setModals({...modals, editName:false});
                getUser();
            }
            else{
                Toast(res.message);
            }
        })
    }

    const changePassword = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", {admin_new_password:form.admin_new_password.value}, function(res){
            if(res.status){
                setOpen(false)
                Toast("Success");
            }
            else{
                Toast(res.message);
            }
        })
    }

    return (
        <div>
            <div className="w3-padding-large w3-large alert-warning text-dark">
                Your Profile
            </div>
            <div className="pt-30">
                <div className="w3-row">
                    <div className="w3-col m1">&nbsp;</div>
                    <div className="w3-col m3 pl-20 pr-20">
                        <img src={"../uploads/"+picture} width="100%" />
                    </div>
                    <div className="w3-col m8 pr-20 pl-20">
                        <Typography variant="h4" component="h1" gutterBottom>
                            {user.name}
                        </Typography>
                        <Link href="#" className="block">{user.type}</Link>
                        <FormLabel id="demo-radio-buttons-group-label" sx={{mt:4}}>Rankings</FormLabel>
                        <div className="mb-40">
                            <font style={{display:"inline-block"}} className="w3-large">3.4</font> 
                            <Rating
                                name="text-feedback"
                                value={3.5}
                                readOnly
                                precision={0.5}
                                />
                        </div>
                        <div className="">
                            <Button variant="outlined" onClick={choosePicture} startIcon={<i className="fa fa-photo w3-small" />}>
                                Choose Picture
                            </Button>

                            <Button variant="contained" sx={{ml:3}} onClick={handleClickOpen} startIcon={<i className="fa fa-lock w3-small" />}>
                                Change password
                            </Button>
                        </div>
                        <div className="pt-30">
                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="About" icon={<i className="far fa-user" />} iconPosition="start" {...a11yProps(0)} />
                                        <Tab label="Activity Log" icon={<i className="fa fa-list-ol" />} iconPosition="start" {...a11yProps(1)} />
                                    </Tabs>
                                </Box>
                                <TabPanel value={value} index={0}>
                                    <FormLabel id="demo-radio-buttons-group-label">BASIC INFORMATION</FormLabel>
                                    <div className="w3-row pt-15">
                                        <div className="w3-col m2">
                                            <font className="bold">Email:</font>
                                        </div>
                                        <div className="w3-col m9">
                                            <Link href="#" onClick={e=>{
                                                setModals({...modals, editEmail: true});
                                            }
                                            }>{user2.email}</Link>
                                        </div>
                                    </div>
                                    <div className="w3-row pt-15">
                                        <div className="w3-col m2">
                                            <font className="bold">Name:</font>
                                        </div>
                                        <div className="w3-col m9">
                                            <Link href="#" onClick={e=>setModals({...modals, editName: true})}>{user2.name}</Link>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    Expired
                                </TabPanel>
                            </Box>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    size="small"
                    >
                    <DialogTitle id="alert-dialog-title">
                        Change password
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            &nbsp;
                        </DialogContentText>
                        <form onSubmit={changePassword}>
                            <TextField
                                id="filled-password-input"
                                label="Enter new Password"
                                name="admin_new_password"
                                fullWidth
                                type="password"
                                sx={{mb:3, mt:2}}
                                size="small" />

                            <Button type="submit" role="submit" sx={{mt:2}} variant="contained">Save Changes</Button>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>

            <div className={"w3-modal"} style={{display:(modals.editEmail?"block":"none")}}>
                <div className={"w3-modal-content w3-round-large shadow w3-padding"} style={{width:"370px"}}>
                    <font className={"w3-large block"}>Edit Email</font>
                    <TextField label={"Change Email"} sx={{mt:3}} value={user2.email} onChange={e=>setUser2({...user2, email:e.target.value})} fullWidth size={"small"} />

                    <div className={"w3-row pt-30 pb-15"}>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"outlined"} onClick={e=>setModals({...modals, editEmail:false})}>Close</Button>
                        </div>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"contained"} onClick={updateEmail}>Update</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={"w3-modal"} style={{display:(modals.editName?"block":"none")}}>
                <div className={"w3-modal-content w3-round-large shadow w3-padding"} style={{width:"370px"}}>
                    <font className={"w3-large block"}>Edit Name</font>
                    <TextField label={"Change Name"} sx={{mt:3}} value={user2.name} onChange={e=>setUser2({...user2, name:e.target.value})} fullWidth size={"small"} />

                    <div className={"w3-row pt-30 pb-15"}>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"outlined"} onClick={e=>setModals({...modals, editName:false})}>Close</Button>
                        </div>
                        <div className={"w3-half w3-padding"}>
                            <Button fullWidth variant={"contained"} onClick={updateName}>Update</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Emails(){
    const [emails,setEmails] = useState([]);
    const [email,setEmail] = useState("");
    const [heads,setHeads] = useState([]);
    const [stage,setStage] = useState("");
    const [active,setActive] = useState({});

    const getEmails = () => {
        $.get("api/", {getEmails:"true"}, res=>setEmails(res));
    }

    const getEmailHeads = () => {
        $.get("api/", {getEmailHeads:email},res=>setHeads(res));
    }

    useEffect(()=>{
        getEmails();
    }, []);

    useEffect(()=>{
        if(email != ""){
            getEmailHeads();
        }
        else{
            setHeads([]);
        }
    }, [email])

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2 w3-border-right" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    <div className="w3-padding-small">
                        <input type="text" className="form-control" placeholder="Search"/>
                    </div>
                    {emails.map((row,index)=>(
                        <div className={"w3-padding pointer hover:bg-gray-100 "+(row.receiver == email ? "bg-gray-100":"")} key={row.receiver} onClick={e=>{
                            setEmail(row.receiver);
                            setStage("heads");
                        }}>{row.receiver}</div>
                    ))}
                </div>
                <div className="w3-col m10" style={{height:window.innerHeight+"px",overflow:"auto"}}>
                    {stage == "heads" ?
                    <>
                        {heads.map((row,index)=>(
                            <div className="w3-padding w3-border-bottom" onClick={e=>{
                                setActive(row);
                                setStage("view");
                            }}>
                                <font className="text-lg block">{row.subject}</font>
                                <p>{row.text}</p>
                            </div>
                        ))}
                    </>:
                    stage == "view" ? <>
                        <div className="w3-padding">
                            <Chip label="Go back" icon={<i className="fa fa-arrow-left"/>} variant="outlined" onClick={e=>setStage("heads")} />
                            <Chip label="Resend" sx={{ml:2}} icon={<i className="fa fa-undo"/>} variant="outlined" onClick={e=>setStage("heads")} />
                            <Chip label="Delete" sx={{ml:2}} icon={<i className="fa fa-trash"/>} color="error" variant="outlined" onClick={e=>setStage("heads")} />
                        </div>
                        <iframe src={"api/preview-email.php?id="+active.id} style={{width:"100%",border:"none",height:"700px"}}></iframe>
                    </>:
                    ""}
                </div>
            </div>
        </>
    )
}