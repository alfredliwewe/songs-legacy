const {TextField,Button,Alert,FormControlLabel, Checkbox,ThemeProvider,createTheme} = MaterialUI;
const {useState} = React;

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

window.onload = function(){
    ReactDOM.render(<Login />, document.getElementById("root"));
}

function Login(){
    const [error,setError] = useState("");
    const [stage,setStage] = useState("login");
    const [errors,setErrors] = useState({
        email:false,
        emailStmt:"",
        password:false,
        passwordStmt:"",
        registerPassword:false,
        registerPasswordStmt:"Minimum of 6 characters"
    })

    const login = (event) => {
        event.preventDefault();

        setErrors({
            email:false,
            emailStmt:"",
            password:false,
            passwordStmt:"",
            registerPassword:false,
            registerPasswordStmt:"Minimum of 6 characters"
        })

        $.post("api/login.php", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    localStorage.setItem('user-artist', response);
                    window.location = './';
                }
                else{
                    //setError(res.message);
                    if(res.type != undefined){
                        setErrors({...errors, [res.type]:true, [res.type+"Stmt"]:res.message});
                    }
                    else{
                        setError(res.message);
                    }
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const register = (event) => {
        event.preventDefault();

        setErrors({
            email:false,
            emailStmt:"",
            password:false,
            passwordStmt:"",
            registerPassword:false,
            registerPasswordStmt:"Minimum of 6 characters"
        })

        $.post("api/login.php", $(event.target).serialize(), function(response){
            try{
                let res = JSON.parse(response);
                if(res.status){
                    localStorage.setItem('user-artist', response);
                    window.location = './';
                }
                else{
                    //error
                    if(res.type != undefined){
                        setErrors({...errors, [res.type]:true, [res.type+"Stmt"]:res.message});
                    }
                    else{
                        setError(res.message);
                    }
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <div className="w3-row">
                    <div className="w3-col m4">&nbsp;</div>
                    <div className="w3-col m3 w3-padding-large">
                        <h1>&nbsp;</h1>
                        {stage == "login" ? 
                        <div style={{position:"relative"}}>
                            <div className="pt-50 border w3-round-xlarge px-4 pb-40" style={{zIndex:2}}>
                                <center>
                                    <font className="w3-large text-primary">Artists</font>
                                    <br/>
                                    <br/>
                                    <font className="w3-large bold">Sign in</font>
                                </center>

                                {error.length > 0 ? <Alert severity="error">{error}</Alert>:""}

                                <form onSubmit={login} className="pt-15">
                                    <TextField label="Email or Username" size="small" helperText={errors.emailStmt} error={errors.email} fullWidth name="login_email" />
                                    <TextField label="Password" size="small" type="password" helperText={errors.passwordStmt} error={errors.password} fullWidth sx={{mt:2,mb:3}} name="password" />

                                    <div className="w3-center w3-small py-3">
                                        Forgot <a href="#">Password</a> or <a href="#" onClick={e=>setStage("register")}>Register</a>
                                    </div>

                                    <div className="clearfix pb-4">
                                        <Button className="w3-round-jumbo" sx={{px:3,textTransform:"none"}} type="button" onClick={e=>{
                                            window.location = '../'
                                        }}><i className="fa fa-arrow-left mr-2"/> Back</Button>
                                        <Button variant="contained" className="w3-round-jumbo float-right" sx={{px:3,textTransform:"none"}} type="submit">Login</Button>
                                    </div>
                                </form>
                            </div>
                            <img src="../images/login-box-blobs.png" style={{position:"absolute", bottom:0,right:0,width:"120px",borderBottomRightRadius:"16px"}}/>
                        </div>:
                        <div style={{position:"relative"}}>
                            <div className="pt-50 border w3-round-xlarge px-4 pb-40">
                                <center>
                                    <font className="w3-large text-primary">Artists</font>
                                    <br/>
                                    <br/>
                                    <font className="w3-large bold">Sign Up</font>
                                </center>

                                {error.length > 0 ? <Alert severity="error">{error}</Alert>:""}

                                <form onSubmit={register} className="pt-15">
                                    <TextField label="Email" size="small" helperText={errors.emailStmt} error={errors.email} fullWidth name="register_email" />
                                    <TextField label="Password" size="small" helperText={errors.registerPasswordStmt} error={errors.registerPassword} type="password" fullWidth sx={{mt:2}} name="password" />
                                    <TextField label="Full name" size="small" fullWidth name="fullname" helperText="This is not your stage name" sx={{mt:2,mb:3}} />

                                    <div className="w3-small py-3">
                                        <FormControlLabel control={<Checkbox name="email-me" defaultChecked />} label="Email me Amuzee news and tips" />
                                    </div>

                                    <div className="clearfix pb-4">
                                        <Button className="w3-round-jumbo" sx={{px:3,textTransform:"none"}} type="button" onClick={e=>{
                                            setStage("login");
                                        }}><i className="fa fa-arrow-left mr-2"/> Back</Button>
                                        <Button variant="contained" className="w3-round-jumbo float-right" sx={{px:3,textTransform:"none"}} type="submit">Login</Button>
                                    </div>
                                </form>
                            </div>
                            <img src="../images/login-box-blobs.png" style={{position:"absolute", bottom:0,right:0,width:"120px",borderBottomRightRadius:"16px"}}/>
                        </div>}
                    </div>
                </div>
            </ThemeProvider>
        </>
    )
}