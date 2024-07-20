let {TextField, Typography, Link, Button} = MaterialUI;

function LoginForm(){
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error,setError]= useState("");
    const {login,setLogin,hasLogged,setHasLogged} = useContext(Main);
    const [stage,setStage] = useState("login");

    const handleSubmit = (event) => {
        event.preventDefault();

        $.post("web-handler.php", $(event.target).serialize(), function(response, status) {
            try{
                var obj = JSON.parse(response);
                if (obj.status) {
                    //ReactDOM.unmountComponentAtNode(document.getElementById("react-login"))
                    //$(div.view).remove();
                    //loadProfile();
                    //window.location = 'index.php';
                    setLogin(false);
                    setHasLogged(true);
                    Toast("Success");
                    userObj = obj;
                    window.location = './';
                }
                else{
                    //die an error;
                    ///$('#login_error').html(obj.message).hide().fadeIn();
                    //printReactError('r-l-e', obj.message);
                    setError(error);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const handlerRegister = (event) => {
        event.preventDefault();

        $.post("web-handler.php", $(event.target).serialize(), function(response, status) {
            try{
                var obj = JSON.parse(response);
                if (obj.status) {
                    //ReactDOM.unmountComponentAtNode(document.getElementById("react-login"))
                    //$(div.view).remove();
                    //loadProfile();
                    //window.location = 'index.php';
                    setLogin(false);
                    setHasLogged(true);
                    Toast("Success");
                    userObj = obj;
                    window.location = './';
                }
                else{
                    //die an error;
                    ///$('#login_error').html(obj.message).hide().fadeIn();
                    //printReactError('r-l-e', obj.message);
                    setError(error);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            {stage == "login" ?
            <div className="w3-padding-large">
                <div className="w3-center pt-15 pb-20">
                    <img src="images/wp.png" width="60" />
                </div>
                <div className="mb-10" id="r-l-e">
                    {error.length > 2 ? <MaterialUI.Alert severity="error">{error}</MaterialUI.Alert>:""}
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField id="outlined-basic" sx={{mt:2}} name="phone_login" className="w3-text-black" value={phone} onKeyUp={(event) => {checkSubmit(event)}} onChange={(event) => {setPhone(event.target.value)}} fullWidth label="Email or phone" variant="outlined" />
                    
                    <TextField id="outlined-basic" sx={{mt:2,mb:2}} name="password" value={password} onKeyUp={(event) => {checkSubmit(event)}} onChange={(event) => {setPassword(event.target.value)}} fullWidth type="password" label="Password" variant="outlined" />
                    
                    <Button type="submit" fullWidth variant="contained">Sign In</Button>
                </form>
                
                <Typography sx={{ mt: 4, mb: 3 }} color="text.secondary">
                    Already logged on phone? {' '}
                    <Link href="scan.php">Click here to Scan</Link>
                </Typography>
                <Button variant="outlined" onClick={e=>setStage("register")} fullWidth sx={{mt:3,mb:2}}>Create Account</Button>
            </div>
            :<>
                <div className="w3-padding-large">
                    <div className="w3-center pt-15 pb-20">
                        <img src="images/wp.png" width="60" />
                    </div>
                    <div className="mb-10" id="r-l-e">
                        {error.length > 2 ? <MaterialUI.Alert severity="error">{error}</MaterialUI.Alert>:""}
                    </div>
                    <form onSubmit={handlerRegister}>
                        <TextField id="outlined-basic" sx={{mt:2}} name="register_name" className="w3-text-black" fullWidth label="Your name" variant="outlined" />
                        <TextField id="outlined-basic" sx={{mt:2}} name="email" className="w3-text-black" fullWidth label="Email" type="email" variant="outlined" />
                        <TextField id="outlined-basic" sx={{mt:2}} name="phone" className="w3-text-black" fullWidth label="Phone" variant="outlined" />
                        <TextField id="outlined-basic" sx={{mt:2,mb:2}} name="password" value={password} onKeyUp={(event) => {checkSubmit(event)}} onChange={(event) => {setPassword(event.target.value)}} fullWidth type="password" label="Password" variant="outlined" />
                        
                        <Button type="submit" fullWidth variant="contained">Sign In</Button>
                    </form>
                    
                    
                    <Button variant="outlined" fullWidth sx={{mt:3,mb:2,textTransform:"none"}}>Login</Button>
                </div>
            </>}
        </>
    )
}