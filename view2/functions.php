<?php

function time_ago($time){
    $time = (int)trim($time);
	$labels = [
		['s', 60],
		['min', 3600],
		['h', 3600 * 24],
		['d', 3600 * 24 * 7],
		['w', 3600 * 24 * 7 * 4],
		['mon', 3600 * 24 * 7 * 30],
		['y', 3600 * 24 * 7 * 30 * 12]
	];

	$dif = time() - $time;

	$can = true;
	$label = null;
	$div = 1;

	if ($dif == 0) {
		return "now";
	}

	for ($i=0; $i < count($labels); $i++) { 
		if ($dif < $labels[$i][1]) {
			if($can){
				$can = false;
				$label = $labels[$i][0];

				if($i != 0){
					$div = $labels[$i-1][1];
				}
			}
		}
	}

	if ($label == null) {
		return "Unknown";
	}
	else{
		return floor($dif/$div).$label;
	}
}

?>