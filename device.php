<?php

/**
 * This class was written to detect client information
 * Sample: -- Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134 
 */
class client_info
{
    
    function __construct()
    {
        $this->status = false;
        if (isset($_SERVER['HTTP_USER_AGENT'])) {
            $this->string = $_SERVER['HTTP_USER_AGENT'];
        }
        else{
            $this->string = "string";
        }
        $this->get_os();
        $this->get_browser();
        $this->get_device();
    }

    function get_os()
    {
        $os_string = substr($this->string, strpos($this->string, "(")+1, (strpos($this->string, ")") - strpos($this->string, "("))-1);
        $this->os_string = $os_string;
        $os_array = explode(";", $os_string);
        $this->os = trim($os_array[0]);
    }

    function get_browser()
    {
        //browser name is the last part of the string
        $array = explode(" ", $this->string);
        $rev = array_reverse($array);
        $this->browser_string = $rev[0];
        $array2 = explode("/", $this->browser_string);
        if (count($array2) < 2) {
            $this->browser_name = "Unknown";
            $this->browser_version = "Unknown";
        }
        else{
            $this->browser_name = $array2[0];
            $this->browser_version = $array2[1];
        }

        if ($this->browser_name == "Safari") {
            $this->browser_string = $rev[1];
            $array2 = explode("/", $this->browser_string);
            if (count($array2) == 2) {
            	$this->browser_name = $array2[0];
	            $this->browser_version = $array2[1];
            }
	        else{
	        	$this->browser_name = $array2[0];
	        }
        }
    }

    function get_device()
    {
        $string = strtolower($this->string);

        $pos = strpos($string, "android");
        if ($pos == false) {
            $this->device = "desktop";
            //$this->device = "mobile";
        }
        else{
            $this->device = "mobile";
            //$this->device = "desktop";
        }
    }
}