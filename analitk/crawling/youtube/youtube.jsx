const {TextField,Button,Alert,ListItem,ListItemButton,ListItemIcon,ListItemText,Paper,Table,
    TableHead, Fab, 
    TableRow,Tabs, Tab,Box,Chip,Typography, FormLabel,Rating,DialogTitle,DialogActions,DialogContent,DialogContentText,
    TableCell,TablePagination,Drawer,Link,MenuItem,Dialog,Input,
    TableBody
} = MaterialUI;
const {useState,useEffect,useContext,createContext} = React;

const Context = createContext({});

function Welcome(){
    const [rows,setRows] = useState([]);
    const [results,setResults] = useState([]);
    const [youtubeLinks,setYoutubeLinks] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [active,setActive] = useState({});
    const [word,setWord] = useState("")
    const [resultIndex,setResultIndex] = useState(-1)
    const [open,setOpen] = useState({
        edit:false
    });

    const saveLink = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", $(form).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    if(res.type == 'link'){
                        getRows();
                        Toast("Success");
                        form.reset();
                    }
                    else{
                        setYoutubeLinks(res.results);
                        setResults([]);
                    }
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

    const saveChanges = (event) => {
        event.preventDefault();

        let form = event.target;

        $.post("api/", $(form).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    getRows();
                    Toast("Success");
                    setOpen({...open, edit:false});
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

    const getRows = () => {
        $.get("api/", {getRows:"true"}, function(res){
            res.reverse();
            setRows(res);
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(()=>{
        getRows();
    }, []);

    useEffect(()=>{
        if(word == ""){
            setResults([]);
            setResultIndex(-1);
        }
        else{
            //search
            //setResultIndex(-1);
            $.get("api/", {searchWord:word}, function(response){
                try{
                    let res = JSON.parse(response);
                    setResults(res.results);
                }
                catch(E){
                    //alert(E.toString()+response);
                    //setResults([]);
                }
            })
        }
    }, [word]);

    useEffect(()=>{
        if(resultIndex != -1){
            if(results.length > resultIndex){
                setWord(results[resultIndex]);
            }
        }
    }, [resultIndex]);

    return (
        <>
            <div className="w3-row">
                <div className="w3-col m2">&nbsp;</div>
                <div className="w3-col m8">
                    <div className="pt-20 pb-10" >
                        <form onSubmit={saveLink}>
                            <TextField label="Search or Paste a link" value={word} onChange={e=>{
                                setWord(e.target.value)
                            }} onKeyUp={e=>{
                                if(e.keyCode == 40){
                                    setResultIndex(resultIndex+1);
                                }
                                else if(e.keyCode == 38){
                                    setResultIndex(resultIndex-1);
                                }
                                else{
                                    setResultIndex(-1);
                                }
                            }} size="small" fullWidth name="new_link" style={{width:"400px"}} />
                            <Box sx={{mb:3,width:"400px"}} className="border rounded">
                                {results.slice(0,6).map((row,index)=>(
                                    <div className={"w3-padding w3-hover-light-grey pointer "+(resultIndex == index ? "w3-light-grey":"")} onClick={e=>setWord(row)}>{row}</div>
                                ))}
                            </Box>
                            <div className="w3-row">
                                {youtubeLinks.slice(0,6).map((row,index)=>(
                                    <div className="w3-col m2 w3-padding-small rounded pointer w3-hover-light-grey" onClick={e=>{
                                        Toast("Please wait");
                                        $.post("api/", {new_link:"https://www.youtube.com/watch?v="+row.id.videoId}, function(response){
                                            try{
                                                let res = JSON.parse(response);
                                                if(res.status){
                                                    if(res.type == 'link'){
                                                        getRows();
                                                        Toast("Success");
                                                    }
                                                }
                                                else{
                                                    Toast(res.message);
                                                }
                                            }
                                            catch(E){
                                                alert(E.toString()+response);
                                            }
                                        })
                                    }}>
                                        <img src={row.snippet.thumbnails.default.url} width={"90%"}/>
                                        <font className="block">{row.snippet.title}</font>
                                    </div>
                                ))}
                                {youtubeLinks.slice(6).map((row,index)=>(
                                    <div className="w3-col m2 w3-padding-small rounded pointer w3-hover-light-grey" onClick={e=>{
                                        Toast("Please wait");
                                        $.post("api/", {new_link:"https://www.youtube.com/watch?v="+row.id.videoId}, function(response){
                                            try{
                                                let res = JSON.parse(response);
                                                if(res.status){
                                                    if(res.type == 'link'){
                                                        getRows();
                                                        Toast("Success");
                                                    }
                                                }
                                                else{
                                                    Toast(res.message);
                                                }
                                            }
                                            catch(E){
                                                alert(E.toString()+response);
                                            }
                                        })
                                    }}>
                                        <img src={row.snippet.thumbnails.default.url} width={"90%"}/>
                                        <font className="block">{row.snippet.title}</font>
                                    </div>
                                ))}
                            </div>
                            <Button variant="contained" type="submit">Add Link</Button>
                        </form>
                    </div>

                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>Link</TableCell>
                                    <TableCell>Artist</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Artwork</TableCell>
                                    <TableCell>Year</TableCell>
                                    <TableCell>Vid</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page*rowsPerPage, (page+1)*rowsPerPage).map((row,index)=>(
                                    <TableRow key={row.id} hover>
                                        <TableCell padding="none" align="center">{index+1}</TableCell>
                                        <TableCell padding="none">{row.link.substring(0,40)}</TableCell>
                                        <TableCell padding="none">{row.artist}</TableCell>
                                        <TableCell padding="none">{row.title}</TableCell>
                                        <TableCell padding="none">
                                            <img src={row.artwork} width={"30"}/>
                                        </TableCell>
                                        <TableCell padding="none">{row.year}</TableCell>
                                        <TableCell padding="none">{row.vid}</TableCell>
                                        <TableCell sx={{padding:"7px"}}>
                                            <Button variant="contained" onClick={e=>{
                                                setActive(row);
                                                setOpen({...open,edit:true});
                                            }} size="small" color="success">Edit</Button>
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
            </div>

            <Drawer open={open.edit} anchor="right" onClose={()=>setOpen({...open,edit:false})}>
                <div className="w3-padding-large" style={{width:"300px"}}>
                    <font>Edit details</font>
                    <div className="w3-center pt-20 pb-20">
                        <img src={active.artwork} width={"50%"}/>
                    </div>
                    <form onSubmit={saveChanges}>
                        <input type="hidden" name="row_id" value={active.id}/>
                        <TextField size="small" label="Title" fullWidth name="title_edit" value={active.title} onChange={e=>setActive({...active, title:e.target.value})} sx={{mt:2}} />
                        <TextField size="small" label="Artist" fullWidth name="artist" value={active.artist} onChange={e=>setActive({...active, artist:e.target.value})} sx={{mt:2}} />
                        <TextField size="small" label="Year" fullWidth name="year" value={active.year} onChange={e=>setActive({...active, year:e.target.value})} sx={{mt:2,mb:3}} />

                        <Button variant="contained" type="submit">Save Changes</Button>
                    </form>
                </div>
            </Drawer>
        </>
    )
}

window.onload = function(){
    ReactDOM.render(<Welcome />, document.getElementById("root"));
}