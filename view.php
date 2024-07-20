<?php 
?>
<!DOCTYPE html>
<html>
<head>
    <title>View</title>
    <?php require 'links.php';?>
    <style type="text/css">
        .rrange{
            background: var(--bs-dark);
            outline: none;
            border: 0;
            border-radius: 26px;
            color: #00b3ff;
            display: block;
            transition: box-shadow .3s ease;
            width: 100%;
        }
    </style>
</head>
<body>
    <div class="w3-row w3-border-bottom">
        <div class="w3-col m4">&nbsp;</div>
        <div class="w3-col m6 w3-padding">
            <div class="prodShadow w3-row">
                <div class="w3-col s1 w3-padding-top">
                    <span class="rounded w3-hover-blue w3-padding pointer"><i class="fa fa-play w3-large"></i></span>
                </div>
                <div class="w3-col s8 w3-row">
                    <div class="w3-col m10">
                        <input type="range" class="rrange" name="progress" width="100%" style="width:100%">
                    </div>
                    <div class="w3-col m2 w3-padding">
                        <font>2:30</font>
                    </div>
                </div>
                <div class="w3-col s2 w3-row">
                    <div class="w3-col m3">
                        <div class="w3-padding">
                            <i class="fa fa-volume-off w3-large"></i>
                        </div>
                    </div>
                    <div class="w3-col m9">
                        <input type="range" name="volume" style="width:100%">
                    </div>
                </div>
                <div class="w3-col s1 w3-padding">
                    <i class="fa fa-cog w3-large"></i>
                </div>
            </div>
        </div>
        <div class="w3-col m2 w3-padding">
            <div class="w3-center w3-padding-top">
                <i class="fa fa-fast-backward w3-xlarge mr-30"></i>
                <i class="fa fa-fast-forward w3-xlarge"></i>
            </div>
        </div>
    </div>
</body>