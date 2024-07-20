<?php 
require 'db.php';
require 'config.php';
?>
<!DOCTYPE html>
<html>
<head>
    <title><?=$config['name'];?> - <?php echo $languages[$language]['stream'];?></title>
    <?php require 'links.php';?>
    <style type="text/css">
        .slbt{
            margin-left: 5px;
        }
    </style>
</head>
<body class="w3-light-grey">
    <div class="w3-row">
        <div class="w3-col m3">&nbsp;</div>
        <div class="w3-col m6">
            <h1>&nbsp;</h1>
            <div class="w3-padding-large w3-round-large w3-white">
                <h4>Scan with your phone</h4>
                <div class="w3-row">
                    <div class="w3-half">
                        &nbsp;
                        <div id="barcode_content"></div>
                    </div>
                    <div class="w3-half">
                        <font class="w3-large">Open Amuze App / Account Page / Scan</font>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>