const { useState } = React;
const {Chip} = MaterialUI;

window.onload = function(){
    ReactDOM.render(<Welcome />, document.getElementById("root"));
}

function Welcome(){
    const buttons = ["All","Popular Tracks","Tracks", "Albums", "Playlists", "Reports"];
    const [selected,setSelected] = useState("All");
    const [open,setOpen] = useState({
        edit:false
    })
    return (
        <>
            <div className="w3-padding-large bg-dark">&nbsp;</div>
            <div className="w3-row">
                <div className="w3-col m2">&nbsp;</div>
                <div className="w3-col m8">
                    <div className="w3-padding bg-red-100 text-red-900">
                        Almost there! Verify your email address to add images, links and bio to your profile. An email was sent to liwewerobati@gmail.com
                        Didn't get the email?
                        or change your address
                    </div>
                    <div className="w3-row py-3" style={{background:"linear-gradient(to right, #331a00 , #0d0d26)"}}>
                        <div className="w3-col m3 w3-center" style={{position:"relative"}}>
                            <img src="images/pro_file.png" style={{borderRadius:"50%"}} width={"60%"} />
                            <span className="w3-padding-small bg-dark w3-text-white w3-small pointer" style={{position:"absolute", right:"5px",bottom:"10px"}}>
                                <i className="fa fa-camera"/> Upload Image
                            </span>
                        </div>
                        <div className="w3-col m9">
                            <font className="block pl-3 pt-2 w3-xlarge">Liwewerobati</font>
                        </div>
                    </div>
                    <div className="w3-padding-small">
                        <div className={"w3-responsive scrollbar1"}>
                            <div className="w3-row pt-2 w3-border-bottom clearfix">
                                {buttons.map((row,index)=>(
                                    <span className={"navbar-nav pointer "+(selected == row ? "font-bold text-blue-700":"font-medium text-gray-700")} onClick={e=>setSelected(row)}>
                                        <a className={"tops px-3 "+(selected == row ? "font-bold text-blue-700 active":"font-semibold text-gray-700")}>{row}</a>
                                    </span>
                                ))}
                                <span className="float-right pr-3 pt-2">
                                    <Chip label="Share" size="small" icon={<i className="fa fa-share"/>} />
                                    <Chip label="Edit" sx={{ml:2}} onClick={e=>setOpen({...open, edit:true})} size="small" icon={<i className="fa fa-pen"/>} />
                                </span>
                            </div>
                        </div>

                        <div className="w3-row mt-3">
                            <div className="w3-col m8">
                                &nbsp;
                            </div>
                            <div className="w3-col m4 w3-border-left" style={{minHeight:"350px"}}>
                                <div className="w3-row">
                                    <div className="w3-col m4 w3-padding">
                                        <font className="block w3-opacity">Followers</font>
                                        <font className="block w3-xlarge w3-opacity">0</font>
                                    </div>
                                    <div className="w3-col m4 w3-border-left  w3-padding">
                                        <font className="block w3-opacity">Followers</font>
                                        <font className="block w3-xlarge w3-opacity">0</font>
                                    </div>
                                    <div className="w3-col m4 w3-border-left  w3-padding">
                                        <font className="block w3-opacity">Followers</font>
                                        <font className="block w3-xlarge w3-opacity">0</font>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {open.edit ? <div className="w3-modal" style={{display:"block"}}>
                <div className="w3-modal-content" style={{width:"800px"}}>
                    <div className="w3-padding">
                        <div className="w3-padding clearfix">
                            <i className="fa fa-times float-right pointer w3-hover-text-red" onClick={e=>setOpen({...open, edit:false})}></i>
                        </div>
                        <font className="block w3-lare pb-2">Edit Your Profile</font>
                    </div>
                </div>
            </div>:""}
        </>
    )
}