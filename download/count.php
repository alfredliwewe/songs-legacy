<?php

file_put_contents('count.txt', (1 + (int)file_get_contents("count.txt")));

header("location: amuze.apk");
?>