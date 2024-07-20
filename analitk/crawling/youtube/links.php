<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#085a9d">
<link rel="stylesheet" type="text/css" href="../../w3css/w3.css">
<link rel="stylesheet" type="text/css" href="../../w3css/w3-theme-indigo.css">

<script type="text/javascript" src="../../vendor/jquery/jquery.min.js"></script>
<link rel="stylesheet" href="../../fontawesome/css/all.min.css">
<script type="text/javascript" src="../../dataTable.js"></script>

<script src="../../dist/sweetalert2.min.js"></script>
<link rel="stylesheet" href="../../dist/sweetalert2.min.css">
<!--====== Default CSS ======-->
<link rel="stylesheet" href="../../w3css/default.css">

<!--====== Style CSS ======-->
<link rel="stylesheet" href="../../assets/css/style.css">

<!--====== Nice Select CSS ======-->
<link rel="stylesheet" href="../../assets/css/nice-select.css">
<!--====== Nice Select js ======-->
<script src="../../assets/js/jquery.nice-select.min.js"></script>
<link rel="stylesheet" type="text/css" href="../../libs/toastify/src/toastify.css">
<script type="text/javascript" src="../../libs/toastify/src/toastify.js"></script>

<link rel="stylesheet" type="text/css" href="../../vendor/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="../../semantic/semantic.min.css">

<!--<script type="text/javascript" src="exportTable.js"></script>-->
<script type="text/javascript" src="../../resources/react.js"></script>
<script type="text/javascript" src="../../resources/rodz.js"></script>
<script type="text/javascript" src="../../resources/react-dom.js"></script>
<script type="text/javascript" src="../../resources/babel.js"></script>
<script type="text/javascript" src="../../resources/prop-types.js"></script>

<script type="text/javascript" src="../../resources/react-is.js"></script>

<script type="text/javascript" src="../../resources/material-ui.js"></script>
<script type="text/javascript" src="Chart.min.js"></script>
<style type="text/css">
	@font-face{
		font-family: googleRoboto;
		src:url('../../fonts/Roboto/Roboto-Regular.ttf');
	}
	@font-face{
		font-family: robotLight;
		src:url('../../fonts/Roboto/Roboto-Light.ttf');
	}
	@font-face{
		font-family: openSans;
		src:url('../../fonts/Open_Sans/OpenSans-Regular.ttf');
	}
	@font-face{
		font-family: sourceSans;
		src:url('../../fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf');
	}
	.w3-grey{
		background: #9eb1bb !important;
	}
	.tp.w3-grey{
		border-left: 3px solid red ;
	}
	.tp{

	}
	.block{
		display: block;
	}
	thead{
		border-top-left-radius: 8px !important;
		border-top-right-radius: 8px !important;
		cursor: pointer;
	}
	.btn.btn-sm{
		font-family: googleRoboto;
		font-size: 1.0rem;
		cursor: pointer;
	}
	.form-control.sw{
		padding-left: 40px !important;min-height: 47px !important;
	}
	.pointer{
		cursor: pointer;
	}
	.rounded-left{
		border-radius: 0 !important;
		border-bottom-left-radius: 6px !important;
		border-top-left-radius: 6px !important;
	}
	.rounded-right{
		border-radius: 0 !important;
		border-bottom-right-radius: 6px !important;
		border-top-right-radius: 6px !important;
	}
	.bcenter{
        display: inline-flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
    }
    .pointer:hover,#progress{
        cursor: pointer;
    }
    .top-bar{
        border-top: 3px solid #3385ff !important;
    }
    .hide_images img{
        display: none;
    }
    .extendable{
        height: 600px;overflow-y: hidden;
    }
    .extendable img{
        display: none;
    }
    .scrollbar1::-webkit-scrollbar{
        display: none;
        width: 0;
        height: 0;
    }
    .scrollbar1{
        scrollbar-width:none;
        -ms-overflow-style:none;
    }
    @font-face{
        font-family: googleRoboto;
        src:url('../../fonts/Roboto/Roboto-Regular.ttf');
    }
    @font-face{
        font-family: robotLight;
        src:url('../../fonts/Roboto/Roboto-Light.ttf');
    }
    @font-face{
        font-family: openSans;
        src:url('../../fonts/Open_Sans/OpenSans-Regular.ttf');
    }
    @font-face{
        font-family: sourceSans;
        src:url('../../fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf');
    }
    @font-face{
        font-family: ubuntu;
        src:url('../../fonts/ubuntu/Ubuntu-Regular.ttf');
    }
    body{
        font-family: ubuntu !important;
    }
    .opensans{
        font-family: openSans;
    }
    .roboto{
        font-family: googleRoboto, sans-serif;
    }
    .ubuntu{
        font-family: ubuntu;
    }
    .block{
        display: block;
    }
    .white-grad{
        background: rgba(255, 255, 255, .97);
    }
    .top_search1{
        position: relative;
    }
    .top_search1 i {
        position: absolute;
        left: 10px;
        top: 8px;
    }
    .top_search1 input{
        padding-left: 40px !important;
        border: 1px solid #ccc !important;
        width: 100%;
        border-radius: 3px;
        color: black;
        background: inherit !important;
    }
    .top_search1 input:focus{
        padding-left: 40px !important;
        border: 1px solid #fd7e14 !important;
        background: inherit !important;
        width: 100%;
        color: black;
        outline: none;
    }
    .my_b{
        padding: 8px 6px;
        border-radius: 3px;
        color: black;
    }
    .my_b:hover{
        background: #ccc;
    }

    .leftBtn{
        border-right: 3px solid transparent;
    }
    .leftBtn.active{
        background: #ddd;
        padding: 3px 3px;
        border-right: 3px solid var(--bs-warning);
    }
    .wide{
        width: 25px;
    }
    .nav2{
        width: 120px;position: fixed;height: 700px;z-index: 10;background: var(--sidebar);border-right: 1px solid var(--sidebarBorderRule);
    }
    .loading-start{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        padding-top: 300px;
        height: calc(100%);
        align-content: center;
        z-index: 10;
    }
    .loading-start img{
        width: 100px;
        width: 100px;
    }
    .border-2{
        border-width: 2px !important;
    }
    .topButtons button{
        background: inherit;
        padding: 0px 12px;
        border: none;
        color: black;
        cursor: pointer;
        outline: none;
    }

    .bold{
        font-weight: bold;
    }

    .topButtons button:hover, .topButtons button.active{
        color: var(--orange-600) !important;
    }
    .font{
        font-family: "Roboto","Helvetica","Arial",sans-serif;
    }
    .no-wrap{
        word-wrap: unset;
        white-space: nowrap;
    }
    .activeButton{
        border-left: 3px solid var(--bs-blue);
        background-color: rgba(0, 0, 230, .10);
        color: var(--bs-blue);
    }
    button{
        outline: none;
    }
</style>
<script type="text/javascript">
	function _(id) {
        return document.getElementById(id);
    }

    function Toast(text) {
        Toastify({
            text: text,
            gravity: "top",
            position: 'center',
            backgroundColor:"#dc3545",
            background:"#dc3545"
        }).showToast();
    }

	<?php 
    if (isset($_COOKIE['theme'])) {
        $theme = $_COOKIE['theme'];
        ?>
        var theme = "<?=ucfirst($_COOKIE['theme']);?>";
        <?php
    }
    else{
        $theme = "light";
        ?>
        var theme = "Light";
        <?php
    }
    ?>
</script>
<style type="text/css" id="theme-changer">
    <?php
    if ($theme == "light") {
        // code...
        require '../../light.css';
    }
    else{
        //require '../../dark.css';
    }?>
</style>
<script type="text/javascript">
    <?php 
    if(isset($_SESSION['user'])){
        ?>
        var hasLogged = true;
        var userObj = JSON.parse('<?=json_encode($_SESSION['user']);?>');
        <?php
    }
    else{
        ?>
        var hasLogged = false;
        <?php
    }
    ?>
</script>