function MatEditText(props) {
    let value = "";
    if(props.value != undefined){
        value = props.value;
    }

    let isFilled = value.length>0?"is-filled":"";

    const onChange = (event)=>{
        value = event.target.value;
    }

    return <div className={"input-group input-group-outline my-3 "+isFilled}>
        <label className="form-label">{props.label}</label>
        <input type="text" name={props.name} className="form-control" value={value} onChange={onChange} />
    </div>
}

function MatBtn(props){
    return <button className="btn btn-dark">{props.text}</button>
}

function ConfirmForm(props){

    return <form onSubmit={props.submit}>
        <label className="text-danger" id="error1">{}</label>
        <MatEditText label="Enter code" name="code" />
        <MatBtn text="Confirm" />
    </form>
}

function EditAdvert(props){
    return <div>
        <div className="w3-row">
            <div className="w3-col m7 w3-padding-small">
                <form onSubmit={props.submit}>
                    <input type="hidden" name="advert_id" value={props.values.id} />
                    <label className="text-danger" id="error1">{}</label>
                    <MatEditText label="Company" name="company" value={props.values.company} />
                    <MatEditText label="Title" name="title" value={props.values.title} />
                    <MatEditText label="Description" name="description" value={props.values.description} />
                    <MatEditText label="Phone" name="phone" value={props.values.phone} />
                    <MatEditText label="Email" name="email" value={props.values.email} />
                    <MatEditText label="Link" name="link" value={props.values.link} />
                    <MatBtn text="Confirm" />
                </form>
            </div>
            <div className="w3-col m5 w3-padding-small">
                <font>Advert Wide Pictures</font>
                <img src={props.wideImage} id="wideImage" width="100%" />
                <br />
                <br />
                <button className="btn btn-dark" onClick={props.changeWideImage}>Change</button>
                <br />
                <br />
                <font>Advert Square Picture</font>
                <img src={props.squareImage} id="squareImage" width="100%" />
                <br />
                <br />
                <button className="btn btn-dark" onClick={props.changeSquareImage}>Change</button>
            </div>
        </div>
        <div className="w3-padding-large w3-center">
            <button className="btn btn-danger" onClick={props.deleteAdvert}>Delete Advert</button>
        </div>
    </div>
}

