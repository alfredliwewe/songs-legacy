let {Chip, Avatar, Link, Typography} = MaterialUI;
let searchShown = false;
var notificationsShow = false;
var notificationsContainer = null;

function TopBar(){
    let icon;
    if(theme == "Light"){
        icon = "fa fa-sun";
    }else{
        icon = "fa fa-moon";
    }

    const [mode, setMode] = React.useState({
        name:theme,
        icon:icon
    });

    const buttonArray = [
        {
            id:"listen_now",
            title:"Listen Now",
            icon: "far fa-play-circle"
        },
        {
            id:"browse",
            title:"Browse",
            icon: "fa fa-th-large"
        },
        {
            id:"charts",
            title:"Charts",
            icon: "fa fa-tasks"
        },
    ];

    const logout = () =>{
        window.location = 'logout.php';
    }

    const login = () =>{
        showLogin();
    }

    const changeMode = (event) => {
        if(mode.name == "Light"){
            //set dark
            setMode({
                name:"Dark",
                icon:"fa fa-moon"
            });

            $.get("web-handler.php?setTheme=dark", function(res,s){
                $('#theme-changer').load("dark.css");
            })
        }
        else{
            //set light
            setMode({
                name:"Light",
                icon:"fa fa-sun"
            });

            $.get("web-handler.php?setTheme=light", function(res,s){
                $('#theme-changer').load("light.css");
            });
        }
    }

    const launchProfile = (event) => {
        //do nothing for now
        toggleNotifications(event.target);
    }

    return (<div className="w3-top w3-border-bottom light-grey">
        <div className="w3-row">
            <div className="w3-col m1 w3-padding w3-center pointer" onClick={(event) => {window.location = 'index.php'}}>
                <img src="../images/logo.png" width="20" height="20" />
            </div>
            <div className="w3-col m3 w3-center topButtons" style={{paddingTop:"3px"}}>
                {buttonArray.map((button) => (
                    <button key={button.id} id={button.id}>
                        <i className={button.icon + " block"} style={{fontSize:"1.2rem"}} />
                        <font className="font w3-small">{button.title}</font>
                    </button>
                ))}
            </div>
            <div className="w3-col m3 w3-center" style={{paddingTop:"3px"}} id="p-s">
                <TopSearch />
            </div>
            <div className="w3-col m1 w3-padding w3-center">&nbsp;</div>
            <div className="w3-col m3 w3-padding">
                {hasLogged?(<Chip avatar={<Avatar>{userObj.name.substring(0,1).toUpperCase()}</Avatar>} label={userObj.name} size="small" className="pointer w3-text-black" onClick={launchProfile} />):(<Chip avatar={<Avatar>L</Avatar>} label="Login" size="small" className="pointer w3-text-black" onClick={login} />)}
                
                <Chip avatar={<Avatar><i className={"fa "+mode.icon} /></Avatar>} className="ml-25 w3-text-black" label={mode.name} size="small" style={{marginLeft:"25px"}} onClick={changeMode} />
            </div>
            <div className="w3-rest clearfix w3-padding">
                <Link className="float-right" color="inherit" href="https://mui.com/">
                    About Us
                </Link>
            </div>
        </div>
    </div>);
}

class TopSearch extends React.Component{

    constructor(){
        super()

        this.state = {
            width:150,
            borderColor:""
        };
    }

    componentDidMount(){
        var p_s = new Rodz.Div('p-s'), t_s = new Rodz.Div('t-s'), bvt = new Rodz.Div('b-v-t');

        this.setState({...this.state, width:p_s.view.clientWidth});
        bvt.css('height', t_s.view.clientHeight+"px");

        let icon = bvt.view.getElementsByTagName("i")[0];
        if(icon != null && icon != undefined){
            bvt.css('padding-top', ((t_s.view.clientHeight - icon.clientHeight)/2)+"px");
        }
    }

    changeFocus = (bool) => {
        if(bool){
            this.setState({...this.state, borderColor:"border-primary"});
        }
        else{
            this.setState({...this.state, borderColor:""});
        }
    }

    render(){
        return (
            <div id="t-s" className={"border w3-white rounded w3-row "+this.state.borderColor} style={{width:this.state.width+"px"}}>
                <div className="w3-col" style={{width:(this.state.width - 52)+"px"}}>
                    <input type="text" className="w3-text-black" id="topSearch" onFocus={(event) => {this.changeFocus(true)}} onBlur={(event) => {this.changeFocus(false)}} placeholder="Search" style={{
                        width:"100%",
                        background:"inherit",
                        outline:"none"
                    }} />
                </div>
                <div className="w3-col w3-light-grey rounded-right" id='b-v-t' style={{width:(50)+"px"}}>
                    <i className="fa fa-search"></i>
                </div>
            </div>
        );
    }
}

$(document).on('keyup', '#topSearch', function(event){
    let elem = this, offset = $(this).offset(), container;
    let t_s = _('t-s');

    if(this.value.length > 0){
        if(searchShown){
            container = new Rodz.Div('topSearchResults');
        }
        else{
            container = new Rodz.Div();
            container.addClasses(['border', 'shadow', 'w3-white', 'rounded', 'w3-padding']);
            var maxZ = Math.max.apply(null, 
                $.map($('body *'), function(e,n) {
                if ($(e).css('position') != 'static'){
                    return parseInt($(e).css('z-index')) || 1;
                }
            }));
            container.css('z-index', maxZ+1).css('position', 'fixed').css('left', offset.left+"px").css('top', (offset.top+elem.clientHeight+2)+"px").css('width', t_s.clientWidth+"px").css('min-height', '100px');
            container.setAttribute('id', 'topSearchResults');
            document.body.appendChild(container.view);
            searchShown = true;
        }

        //perform search
        $.get("web-handler.php?searchModal="+elem.value, function(response, status){
            console.log(response);
            try{
                var rows = JSON.parse(response);
                container.removeAllViews();

                if (rows.length > 0) {
                    //show results
                    var row_cont = function(row) {
                        var div = new Rodz.Div();
                        div.addClasses(['w3-padding', 'pointer', 'w3-hover-light-grey', 'playMusic', 'rounded', 'w3-text-black']);
                        if (row.type == "malawi") {
                            div.setAttribute('data', row.song_id);
                        }
                        else{
                            div.setAttribute('data', row.id);
                        }
                        div.setAttribute('type', row.type);

                        var text = new Rodz.Label();
                        text.setText(row.title);
                        div.addView(text);
                        return div;
                    }
                    for(var row of rows){
                        container.addView(row_cont(row));
                    }
                }
                else{
                    var empty = new Rodz.Label();
                    empty.addClasses(['block', 'w3-margin', 'text-secondary']);
                    empty.setText("No results found");
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        })
    }
    else{
        $('#topSearchResults').remove();
        searchShown = false;
    }
});

$(document).on('click', '.playMusic', function(event){
    window.location = 'play.php?v='+$(this).attr('data');
});


function showLogin() {
    var maxZ = Math.max.apply(null, 
    $.map($('body *'), function(e,n) {
        if ($(e).css('position') != 'static')
            return parseInt($(e).css('z-index')) || 1;
    }));
    var div = new Rodz.Div();
    document.body.appendChild(div.view);
    div.addClasses(['w3-modal']);
    div.css('display', 'block').css('z-index', maxZ+1);

    var content = new Rodz.Div();
    div.addView(content);
    content.addClasses(['w3-modal-content', 'w3-padding-large', 'w3-round-large', 'w3-card-16', 'w3-white']);
    content.css('width', '350px');

    var top = new Rodz.Div();
    top.addClasses(['w3-padding-small clearfix']);
    content.addView(top);

    var close = new Rodz.Icon();
    close.addClasses(['float-right fa-times', 'w3-text-black', 'w3-hover-text-red pointer']);
    top.addView(close);
    close.view.addEventListener('click', function(event) {
        $(div.view).remove();
    })

    var cont = new Rodz.Div();
    content.addView(cont);

    $(cont.view).load("../signin.php", function() {
        //handle the forms
        var loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            var formdata = $(loginForm).serialize();

            $.post("handler.php", formdata, function(response, status) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status) {
                        $(div.view).remove();
                        //loadProfile();
                        window.location = 'index.php';
                    }
                    else{
                        //die an error;
                        $('#login_error').html(obj.message).hide().fadeIn();
                    }
                }
                catch(E){
                    alert(E.toString()+response);
                }
            })
        });

        printLogintForm();
    })
}

function printLogintForm(){
	let div = new Rodz.Div('react-login');
	ReactDOM.render(<LoginForm />, div.view);
}

$(document).on('click', '.signBtn',function(event) {
    $('.signBtn').removeClass('w3-padding-large w3-large').addClass('w3-padding');
    $(this).removeClass('w3-padding').addClass('w3-padding-large w3-large');

    $('.sign-cont').hide();
    var text = this.innerHTML.trim();
    text = text.replace(" ", "");
    $('#'+text).show();
});

function toggleNotifications(element) {
    var offset = $(element).offset();
    var elem_width = element.clientWidth;
    var center = offset.left + (elem_width/2);
    var width = 250;
    var offset_left = center - (width/2);

    if (!notificationsShow) {
        notificationsShow = true;

        //show notification
        notificationsContainer = new Rodz.Div();
        notificationsContainer.css('position', 'fixed').css('left', offset_left+"px").css('top', (offset.top + element.clientHeight +4)+"px").css('z-index', '20').css('width', width+"px").css('height', '400px').css('overflow-y', 'auto');
        notificationsContainer.addClasses(['shadow', 'rounded', 'w3-white']);
        document.body.appendChild(notificationsContainer.view);

        //attach the content
        var head = new Rodz.Div();
        head.addClasses(['rounded-top', 'w3-padding']);
        notificationsContainer.addView(head);

        var title = new Rodz.Label();
        title.setText("Profile");
        title.addClasses(['block bold', 'w3-large', 'roboto', 'w3-text-black']);
        head.addView(title);

        var content = new Rodz.Div();
        notificationsContainer.addView(content);

        var div1 = new Rodz.Div();
        div1.addClasses(['w3-padding']);
        content.addView(div1);

        var divider= new Rodz.Divider();
        divider.setTitle(userObj.name);
        divider.setSecondaryText("Current User");
        divider.setImage("../artwork/"+userObj.photo);
        div1.addView(divider);

        var div2 = new Rodz.Div();
        div2.addClasses(['w3-padding']);
        content.addView(div2);

        showLogout(div2);

        /*$.get("handler.php?getNotifications", function(response, status) {
            try{
                var rows = JSON.parse(response);

                for(var row of rows){
                    var cont = new Rodz.Div();
                    cont.setAttributes({
                        class:"w3-row mb-10"
                    });

                    var left = new Rodz.Div();
                    left.setAttributes({class:"w3-col s3 w3-center"});
                    cont.addView(left);

                    var icon = new Rodz.Icon();
                    icon.addClasses(['fa-bell', 'fa-2x']);
                    left.addView(icon);

                    var right = new Rodz.Div();
                    right.addClasses(['w3-col', 's9', 'w3-padding-right']);
                    cont.addView(right);

                    var top = new Rodz.Div();
                    right.addView(top);

                    var type = new Rodz.Label();
                    type.setText(row.type);
                    type.addClasses(['pr-10', 'w3-opacity']);
                    top.addView(type);

                    var date = new Rodz.Label();
                    date.setText(row.date);
                    date.addClasses(['w3-small']);
                    top.addView(date);

                    var bottom = new Rodz.Div();
                    right.addView(bottom);

                    var msg_content = new Rodz.Label();
                    msg_content.setText(row.content);
                    bottom.addView(msg_content);

                    var hr = new Rodz.Hr();
                    right.addView(hr);

                    content.addView(cont);
                }

                if (rows.length == 0) {
                    var empty_cont = new Rodz.Div();
                    empty_cont.addClasses(['w3-center', 'pt-100']);
                    content.addView(empty_cont);

                    var icon = new Rodz.Icon();
                    icon.addClasses(['fa-bell', 'w3-opacity', 'fa-4x', 'block']);
                    empty_cont.addView(icon);

                    var label = new Rodz.Label();
                    label.setText("No Notifications");
                    label.addClasses(['w3-large w3-opacity bold roboto']);
                    empty_cont.addView(label);
                }
            }
            catch(E){
                alert(E.toString()+response);
            }
        }); */

        //create the footer
        var footer = new Rodz.Div();
        footer.addClasses(['w3-padding', 'clearfix', 'rounded-bottom']);
        notificationsContainer.addView(footer);

        var clear = new Rodz.MaterialButton();
        clear.setText("Clear All");
        clear.setSize(Size.SMALL);
        clear.setVariant("outlined");
        clear.onClick(function(event) {
            $.post("handler.php", {clearNotifications:"true"}, function(response, status) {
                try{
                    var obj = JSON.parse(response);
                    if (obj.status) {
                        //go ahead and clear
                        content.removeAllViews();

                        var empty_cont = new Rodz.Div();
                        empty_cont.addClasses(['w3-center', 'pt-100']);
                        content.addView(empty_cont);

                        var icon = new Rodz.Icon();
                        icon.addClasses(['fa-bell', 'w3-opacity', 'fa-4x', 'block']);
                        empty_cont.addView(icon);

                        var label = new Rodz.Label();
                        label.setText("No Notifications");
                        label.addClasses(['w3-large w3-opacity bold roboto']);
                        empty_cont.addView(label);
                    }
                    else{
                        Toast(obj.status);
                    }
                }
                catch(E){
                    alert(E.toString());
                }
            })
        })

        var close = new Rodz.MaterialButton();
        close.setText("Close");
        close.addClasses(['float-right']);
        close.setVariant("text");
        close.onClick(function(event) {
            //close notifications
            $(notificationsContainer.view).remove();
            notificationsContainer = null;
            notificationsShow = false;
        })

        footer.addAll(clear, close);

        content.css('overflow-y', 'auto').css('height', (400 - head.view.clientHeight - footer.view.clientHeight-1)+"px");
    }
    else{
        //close notifications
        $(notificationsContainer.view).remove();
        notificationsContainer = null;
        notificationsShow = false;
    }
}

function showLogout(div2){
	var logout = (event) => {
		window.location = 'logout.php';
	}
	ReactDOM.render(<Chip avatar={<Avatar>L</Avatar>} label="Logout" className="pointer" onClick={logout} />, div2.view);
}