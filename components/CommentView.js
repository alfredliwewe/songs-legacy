class CommentView extends React.Component{

    constructor(){
        super()

        this.state = {
            replyFormDisplay:"none",
            reply:"",
            repliesContainerDisplay:"none",
            repliesPage:1
        };
    }

    componentDidMount(){
        //resize the rows
    }

    changeFocus = (bool) => {
        
    }

    sendReply = (event) => {
        if(this.state.reply.length != 0){
            $.post("web-handler.php", {comment_id:this.props.comment.id, text_reply:this.state.reply, song:this.props.song}, function(response,status){
                try{
                    let res = JSON.parse(response);
                    if(res.status){
                        //comment sent
                        this.setState({...this.state, reply:""});
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
        else{
            Toast("Please write in something");
        }
    }

    render(){
        return (
            <div className="w3-row pt-15 pb-15" key={this.props.comment.id}>
                <div className="w3-col m1 w3-padding clearfix">
                    <img src={"../artwork/"+this.props.comment.user_data.photo} className="float-right" width="30" style={{borderRadius:"50%"}} />
                </div>
                <div className="w3-col m11">
                    <font className="bold font block pointer w3-hover-text-orange">{this.props.comment.user_data.name}</font>
                    <font>{this.props.comment.comment}</font>
                    <div className="w3-row">
                        <div className="w3-col m8">
                            <font>{this.props.comment.time}</font>
                            <font className="bold font ml-15">{this.props.comment.rating}stars</font>
                            <font className="bold font ml-15 pointer w3-hover-text-orange" onClick={(event) => {
                                if(this.state.replyFormDisplay == "none"){
                                    this.setState({...this.state, replyFormDisplay:"block"})
                                }
                                else{
                                    this.setState({...this.state, replyFormDisplay:"none"})
                                }
                            }}>Reply</font>
                        </div>
                        <div className="w3-col m4 clearfix">
                            <font className="float-right">
                                <font>6 <i className="fa fa-heart"></i></font>

                                <i className="fa fa-thumbs-down ml-20"></i>
                            </font>
                        </div>
                    </div>
                    <div style={{display:this.state.replyFormDisplay}}>
                        <div className="w3-round-large border w3-padding-small w3-light-grey">
                            <input type="text" placeholder="Enter reply" value={this.state.reply} onChange={event => {
                                this.setState({...this.state, reply:event.target.value})
                            }} className="w3-text-black" style={{background:"inherit", outline:"none",width:"80%"}} />
                            <button className="button mui-button button-contained mui-small" onClick={this.sendReply}>Send</button>
                        </div>
                    </div>
                    <div>
                        <font className="font pointer w3-hover-text-orange" onClick={(event) => {
                                if(this.state.replyFormDisplay == "none"){
                                    this.setState({...this.state, repliesContainerDisplay:"block"})
                                }
                                else{
                                    this.setState({...this.state, repliesContainerDisplay:"none"})
                                }
                            }}>Replies({this.props.comment.replies.length})</font>
                    </div>
                    <div className="pl-30" style={{display:this.state.repliesContainerDisplay}}>
                        {this.props.comment.replies.slice((this.state.repliesPage-1)*4, this.state.repliesPage*4).map((reply) => {
                            return (
                                <ReplyView key={reply.id} comment={reply} />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

function ReplyView(props){
    return (
        <div className="w3-row pt-15 pb-15" key={props.comment.id}>
            <div className="w3-col m1 w3-padding clearfix">
                <img src={"../artwork/"+props.comment.user_data.photo} className="float-right" width="30" style={{borderRadius:"50%"}} />
            </div>
            <div className="w3-col m11">
                <font className="bold font block pointer w3-hover-text-orange">{props.comment.user_data.name}</font>
                <font>{props.comment.comment}</font>
                <div className="w3-row">
                    <div className="w3-col m8">
                        <font>{props.comment.time}</font>
                        <font className="bold font ml-15">stars</font>
                    </div>
                    <div className="w3-col m4 clearfix">
                        <font className="float-right">
                            <font>6 <i className="fa fa-heart"></i></font>

                            <i className="fa fa-thumbs-down ml-20"></i>
                        </font>
                    </div>
                </div>
            </div>
        </div>
    )
}