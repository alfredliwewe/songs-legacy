function MobileView(props){
    return (
        <div className="w3-row playMusic w3-padding-top w3-padding-bottom rounded pointer mobileView mb-10" id={"mySong"+props.row.id} data={props.row.id} type="malawi">
            <div className="w3-col s3 w3-center">
                <img src={"../artwork/"+props.row.artwork} className="rounded" width="60%" />
            </div>
            <div className="w3-col s9" style={{overflowX:"hidden"}}>
                <font className="block bold w3-text-black roboto no-wrap">{props.row.title}</font>
                <font className="block w3-opacity no-wrap">{props.row.artist}</font>
                <div>
                    <FAIcon icon="fa fa-play-circle w3-opacity" />
                    <label className="mr-15">{props.row.plays}</label>
                    <FAIcon icon="fa fa-comment w3-opacity" />
                    <label className="mr-15">{props.row.comments}</label>
                    <FAIcon icon="fa fa-arrow-down w3-opacity" />
                    <label>{props.row.downloads}</label>
                </div>
            </div>
        </div>
    )
}