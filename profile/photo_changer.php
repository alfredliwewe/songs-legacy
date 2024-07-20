<!DOCTYPE html>
<html>
<head>
    <title>RODZ Music - Stream and Purchase Music</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="../w3css/w3.css">
    <link rel="stylesheet" type="text/css" href="../vendor/bootstrap/css/bootstrap.min.css">
    <script type="text/javascript" src="../vendor/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../vendor/bootstrap/js/bootstrap.min.js"></script>
    <link rel="stylesheet" type="text/css" href="../semantic/semantic.min.css">
    <link rel="stylesheet" type="text/css" href="../fontawesome/css/all.css">
    <script src="js/sweetalert.min.js"></script>
    <!--dataTables links -->
    <script type="text/javascript" src="../vendor/jquery/jquery.min.js"></script>
    
    <link rel="stylesheet" type="text/css" href="../datatables/media/css/jquery.dataTables.css">
    <link rel="stylesheet" type="text/css" href="../datatables/examples/resources/syntax/shCore.css">
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.dataTables.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/media/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/examples/resources/syntax/shCore.js"></script>
    <script type="text/javascript" language="javascript" src="../datatables/examples/resources/demo.js"></script>
    <script type="text/javascript" src="../modernizr-2.6.2-respond-1.1.0.min.js"></script>

    <!--Table exporting plugin-->
    <script type="text/javascript" src="libs/js-xlsx/xlsx.core.min.js"></script>
    <script type="text/javascript" src="libs/FileSaver/FileSaver.min.js"></script>
    <script type="text/javascript" src="libs/jsPDF/jspdf.min.js"></script>
    <script type="text/javascript" src="libs/jsPDF-AutoTable/jspdf.plugin.autotable.js"></script>
    <script type="text/javascript" src="libs/es6-promise/es6-promise.auto.min.js"></script>
    <script type="text/javascript" src="libs/html2canvas/html2canvas.min.js"></script>
    <!--<![endif]-->
    <script type="text/javascript" src="tableExport.js"></script>
    <script src="js/sweetalert.min.js"></script>
    <style type="text/css">
        .pointer:hover{
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
        input{
        	padding: 7px 7px !important;
        	border: 0px !important;
        }
        input[type="text"]{
        	border:;
        }
    </style>
</head>
<body>
    <div class="w3-row major" id="create_upload">
        <div class="w3-col m3">&nbsp;</div>
        <div class="w3-col m6" id="upload_content">
            <h1>Change profile picture</h1>
            <div class="w3-padding-left">
                <button class="btn bg w3-text-white" onclick="$('#file1').click()">Choose file</button>
                <p>&nbsp;</p>
                <div id="uploadMaster" style="display: none;">
                    <progress value="0" max="100" id="progressBar"></progress>
                    <div id="uploadStatus"></div>
                </div>
            </div>
        </div>
    </div>
<div class="w3-hide">
    <input type="file" name="image" id="file1" onchange="uploadFile()" class="w3-hide" accept="image/*">
</div>
</body>
<script type="text/javascript">
    $(document).ready(function(event) {
        //alert("hello world");
        //$('#file1').click();
    })
    function get_ext(filename) {
        var chars = filename.split(".");
        var rev_arr = chars.reverse();
        return rev_arr[0];
    }

    function _(el) {
        return document.getElementById(el);
    }
    function uploadFile() {
        $('#uploadMaster').show();
        var file = _("file1").files[0];
        var file_ext = get_ext(file.name);
        
        var formdata = new FormData();
        formdata.append("image", file);
        var ajax = new XMLHttpRequest();
        //adding event listeners
        ajax.upload.addEventListener("progress", progressHandler, false);
        ajax.addEventListener("load", completeHandler, false);
        ajax.addEventListener("error", errorHandler, false);
        ajax.addEventListener("abort", abortHandler, false);
        ajax.open("POST", "changing_photo.php");
        ajax.send(formdata);
        
    }

    function progressHandler(event) {
        var percent = (event.loaded / event.total) * 100;
        _("uploadStatus").innerHTML = Math.round(percent) + " % uploaded.... Please wait";
        $('#progressBar').val(Math.round(percent));
    }

    function completeHandler(event) {
        $('#uploadMaster').hide();
        _("upload_content").innerHTML = event.target.responseText;
        window.location = 'index.php?pic';
    }

    function errorHandler(event) {
        _("uploadStatus").innerHTML = "Upload failed";
    }

    function abortHandler(event) {
        _("uploadStatus").innerHTML = "Upload Aborted";
    }
</script>
</html>