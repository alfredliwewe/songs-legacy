const {Button, Snackbar, IconButton} = MaterialUI;

function ShowSnack(msg){
    var div = new Rodz.Div('reusable');
    try{
        ReactDOM.unmountComponentAtNode(div.view);
    }catch(E){alert(E.toString())}
    ReactDOM.render(<SimpleSnackbar msg={msg} />, div.view);
}

function SimpleSnackbar(props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        else{
            Toast(reason);
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <Button color="secondary" size="small" onClick={handleClose}>
                Okay
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <FAIcon icon="fa fa-times" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} message={props.msg} action={action} />
        </div>
    );
}