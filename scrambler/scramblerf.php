<?php

function inputIni(){
    global $key, $data;
    $key = (isset($_POST['key']) && strlen($_POST['key']) > 0) ? trim(filter_input(INPUT_POST, 'key', FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
    $data = (isset($_POST['data']) && strlen($_POST['data']) > 0) ? trim(filter_input(INPUT_POST, 'data', FILTER_SANITIZE_FULL_SPECIAL_CHARS)) : '';
}

//Checks the key for error.
function keyCheck($key, $keyLength, $keyOriginal):bool{
    global $error;
    if($keyLength === strlen($key)){
        keyCharCheck($key, $keyOriginal);
        if($error !== ''){
            return false;
        }else{
            return true;
        }
    }else{
        $error = ' Length of key does not meet the required standard!';
        return false;
    }
}

//This function takes the input $key and checks for each character of $key whether that character is present in the
//original array $chars. If so, that character is removed from $chars. In that way, if $key has any character repeatition,
//that will be noticed.
function keyCharCheck($key='', $keyOriginal=''){
    global $error;
    $chars = str_split($keyOriginal);
    $length = Strlen($key);

    for($i = 0, $j = 0; $i < $length; $i++){
        if(in_array($key[$i], $chars) !== false){   //!==false is written because:
                                                    //"A common idiom of PHP is to have a function return some meaningful value, or a boolean FALSE in case of some failure."
                                                    //So.., cool.
            $index = array_search($key[$i], $chars);
            unset($chars[$index]);
        }
        else{
            $j++;
            $error .= '<br/><span class="error">' . $j . ". </span>Character '{$key[$i]}' is invalid or found more than once!";
        }
    }
}


//This function keeps on modifying the original input $data until all the characters of $data has been obfuscated.
//Then, the obfuscated $data is returned.
function scrambleData($data, $key){
    $keyOriginal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    $length = strlen($data);
    for($i = 0; $i < $length; $i++){
        $currentChar = $data[$i];
        $position = strpos($keyOriginal, $currentChar);
        if($position !== false){
            $data[$i] = $key[$position];
        }
    }
    return $data;
}

//This function keeps on modifying the original input obfuscated $data until all the characters of $data has been decoded.
//Then, the decoded $data is returned.
function decodeData($data, $key){
    $keyOriginal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    $length = strlen($data);
    for($i = 0; $i < $length; $i++){
        $currentChar = $data[$i];
        $position = strpos($key, $currentChar);
        if($position !== false){
            $data[$i] = $keyOriginal[$position];
        }
    }
    return $data;
}

?>
