const {useState, useEffect, useContext, createContext} = React;
const Main = createContext({});
const HomeContext = createContext({});
const {Switch,RadioGroup, FormControlLabel, Radio,TextField,Button, Link, createTheme,ThemeProvider,Tab,Tabs,Box,Dialog,DialogTitle,
    DialogContent,
    DialogContentText, Rating,
    DialogActions
} = MaterialUI;

let theme = createTheme({
    palette: {
        mode: themeName == "Dark" ? 'dark' : 'light',
        primary: {
            main: '#E95420',
        },
        secondary: {
            main: '#edf2ff',
        },
    },
});

window.onload = function(){
    ReactDOM.render(<ThemeProvider theme={theme}><SampleComments /></ThemeProvider>, document.getElementById("amuze-root"));
    $('#loading-start').hide();
}

function SampleComments() {
    const [current,setCurrent] = useState({
        song_id:2
    });
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

    useEffect(()=>{
        if(step == "comments"){
            getComments();
        }
    }, [step]);

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
        getComments();
    }, []);

    return (
        <>
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
            
            {data.initial > 1 ? <>
                <Link href="#" onClick={e=>setData({...data, initial:data.initial-1})}>Load older comments</Link>
            </>:""}
            {comments.map((row,index)=>(
                <Comment data={row}/>
            ))}
            {data.initial < Math.ceil(data.comments / 10) ? <>
                <Link href="#" onClick={e=>setData({...data, initial:data.initial-1})}>Show more comments</Link>
            </>:""}
        </>
    )
}