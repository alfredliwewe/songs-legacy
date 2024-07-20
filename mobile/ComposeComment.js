function ComposeComment(props){
    const [value, setValue] = React.useState("");
    const [rate, setRate] = React.useState(0);

    const sendComment = (event) => {
        if(value.length != 0){
            if(rate != 0){
                $.post("web-handler.php", {sendComment:value, song:props.song, rating:rate}, function(response, status){
                    try{
                        var res = JSON.parse(response);
                        if(res.status){
                            //print the comment
                            attachComment(res.comment);
                            setValue("");
                            $('#commentInput').html("Write a comment");
                            //revert back the height
                        }
                    }
                    catch(E){
                        alert(E.toString()+response);
                    }
                })
            }
            else{
                Toast("Give some rating");
            }
        }
        else{
            Toast("Please write in something");
        }
    }

    const checkStart = (event) => {
        if(event.target.textContent == "Write a comment"){
            event.target.innerHTML = ''
            setValue("")
        }
    }

    const writePlaceHolder = (event) => {
        if(event.target.textContent == ""){
            event.target.innerHTML = 'Write a comment'
            setValue("");
        }
    }

    return (
        <div>
            <MaterialUI.Rating name="simple-controlled" color="primary" value={rate} onChange={(event, newValue) => {
                    setRate(newValue);
                }}
            />
            <div className="w3-round-large w3-light-grey w3-padding-large w3-row">
                <div className="w3-col m1">
                    <i className="fa fa-paperclip"></i>
                </div>
                <div className="w3-col m9">
                    <div id="commentInput" style={{outline: "none",cursor: "text"}} onFocus={checkStart} onBlur={writePlaceHolder} onInput={event => {setValue(event.target.innerHTML)}} contentEditable>Write a comment</div>
                </div>
                <div className="w3-col m2">
                    <input type="text" placeholder="Enter reply" value={value} onChange={event => {setValue(event.target.value)}} className="w3-text-black" style={{background:"inherit", outline:"none",width:"80%", display:"none"}} />
                    <button className="button mui-button button-contained" onClick={sendComment}>Send</button>
                </div>
            </div>
        </div>
    )
}

//attach the comment
function attachComment(comment){
    var parent = new Rodz.Div('sentComments');
    let container = new Rodz.Div();
    parent.addView(container);

    ReactDOM.render(<CommentView comment={comment} />, container.view);
}