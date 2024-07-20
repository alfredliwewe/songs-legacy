let {TextField, Typography, Link, Button} = MaterialUI;

function LoginForm(){
    const [phone, setPhone] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        Toast("Hello");
    }

    const clickLogin = (event) => {
        $.post("web-handler.php", {phone_login:phone, password:password}, function(response, status) {
            try{
                var obj = JSON.parse(response);
                if (obj.status) {
                    ReactDOM.unmountComponentAtNode(document.getElementById("react-login"))
                    //$(div.view).remove();
                    //loadProfile();
                    window.location = 'index.php';
                }
                else{
                    //die an error;
                    ///$('#login_error').html(obj.message).hide().fadeIn();
                    printReactError('r-l-e', obj.message);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }

    const checkSubmit = (event) => {
        if(event.keyCode === 13){
            clickLogin(event);
        }
    }
    return (
        <div className="w3-padding-large">
            <div className="mb-10" id="r-l-e"></div>
            <form onSubmit={handleSubmit}>
                <TextField id="outlined-basic" className="w3-text-black" value={phone} onKeyUp={(event) => {checkSubmit(event)}} onChange={(event) => {setPhone(event.target.value)}} fullWidth size="small" label="Email or phone" variant="outlined" />
                <br /><br />
                <TextField id="outlined-basic" value={password} onKeyUp={(event) => {checkSubmit(event)}} onChange={(event) => {setPassword(event.target.value)}} fullWidth size="small" type="password" label="Password" variant="outlined" />
                <br /><br />
                <Button onClick={clickLogin} fullWidth variant="contained">Sign In</Button>
            </form>
            
            <Typography sx={{ mt: 4, mb: 3 }} color="text.secondary">
                Already logged on phone? {' '}
                <Link href="scan.php">Click here to Scan</Link>
            </Typography>
        </div>
    )
}