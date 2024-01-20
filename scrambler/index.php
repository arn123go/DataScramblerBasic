<?php
session_start();

// Site info
$host = "localhost/";
$dir = "scrambler/";
$page = "";  // Name of the page with extension. For index.php, write 'index.php' or ''.

//including necessary function(s)
include_once "scramblerf.php";

//================================================== php data
//task will be either encode or generate-key or decode. Nothing else.
$task = (isset($_GET['task']) && ($_GET['task'] === 'generate-key' || $_GET['task'] === 'decode')) ? $_GET['task'] : 'encode';

// session mechanism is called/set by javascript in order to have synchronization in between the two programs (PHP and JavaScript).
if(isset($_SESSION['task']) && ($_SESSION['task']==='encode' || $_SESSION['task']==='generate-key' || $_SESSION['task']==='decode')){
    if($task !== $_SESSION['task']){
        $url = $host . $dir . $page . "?task=" . $_SESSION['task'];
        unset($_SESSION['task']);
        header("Location: http://$url");
    }
    unset($_SESSION['task']);  // Unsetting, because we don't need it now.
}
// Using unset on an undefined variable will not cause any errors (unless the variable
// is the index of an array (or object) that doesn't exist).
// https://stackoverflow.com/questions/1374705/check-if-var-exist-before-unsetting-in-php
// unset($_SESSION['task']);   //although $_SESSION['task] should be already unset.

$keyOriginal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
$keyLength = strlen($keyOriginal);
$key = '';
$data = '';
$resultData = '';
$scrambledData = '';
$decodedData = '';

//================================================== html content data
$progName = '<span class="progName">PHP:</span>';
$errLn1 = '<span class="error">Error!</span> Invalid Key!';
$successEnc = 'Task complete! Encoded data located in the Result. Save the key for future decoding purpose! You can again generate/insert key, insert your data, and then "Execute"!';
$successDec = 'Task complete! Decoded data located in the Result. You can again insert your key and data, and then "Execute"!';
$messageMain = '';
$error = '';

//================================================== css design data
$selEnc = '';
$selGen = '';
$selDec = '';
$selected = ' selected';

//================================================== This is the control and execution section of PHP
if ('generate-key' === $task) {
    $selGen = $selected;
    $keySplitted = str_split($keyOriginal);
    shuffle($keySplitted);
    $key = join('', $keySplitted);
} else if ('encode' === $task) {
    $selEnc = $selected;
    inputIni();
    if ($data != '') {
        if(keyCheck($key, $keyLength, $keyOriginal)){
            $scrambledData = scrambleData($data, $key);
            $messageMain = $progName . " " . $successEnc;
            $resultData = $scrambledData;
        }else{
            $messageMain .= $progName . " " . $errLn1 . $error;
        }
    }
} else if('decode' === $task){
    $selDec = $selected;
    inputIni();
    if ($data != '') {
        if(keyCheck($key, $keyLength, $keyOriginal)){
            $decodedData = decodeData($data, $key);
            $messageMain = $progName . " " . $successDec;
            $resultData = $decodedData;
        }else{
            $messageMain .=$progName . " " . $errLn1 . $error;
        }
    }
}
?>

<!--================================================ html page starts here -->
<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Data Scrambler</title>

        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css">
        <link rel="stylesheet" href="milligram.css">
    <style>
        body {
            margin-top: 30px;
        }
        .center {
            text-align: center;
        }
        a.options {
            display: inline-block;
            box-sizing: border-box;
            color: purple;
            width: 32.5%;
            height: 36px;
            padding: 3px 16px;
            border-radius: 10px;
            border: 3px solid #5a3461;
            font-weight: bold;
            text-align: center;
            vertical-align: top;
        }
        a.options:hover{
            background-color: #f0b4fa;
        }

        a.selected, a.selected:hover {
            background-color: violet;

        }
        a#programSelect{
            color: grey;
            background-color: rgba(247, 234, 241, 0.8);
            width: 50%;
            border-color: silver;
        }
        a#programSelect:hover{
            background-color: rgba(249, 235, 217, 0.95); /*rgba(234, 219, 227, 0.8);*/
            border-color: rgba(92, 88, 90, 0.95);

        }
        span.progName{
            font-weight: bold;
        }
        span.error{
            color: red;
            font-weight: bold;
        }
        .form_button_others{
            background-color: #ffffff;/*rgba(247, 234, 241, 0.8);*/
            color: grey;
            border-radius: 15px;
            border: 2px solid silver;
        }
        .form_button_others:hover{
            background-color: #ffffff;            
            color: black;
        }
        .form_button_submit{
            background-color: #5a3461;
            border-radius: 8px;
        }
        #data, #result{
            width: 100%;
            height: 70px;
        }
        #key, #data, #result{
            border: 3px solid rgba(240, 180, 250, 0.5);
        }
        .hidden {
            display: none;
        }
        @media screen and (max-width: 960px) {
            a.options, a#programSelect{
                width: 80%;
            }
        }
        @media screen and (max-width: 640px) {
            a.options, a#programSelect{
                width: 100%;
            }
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="column column-60 column-offset-20">
                <!--Heading-->
                <h2 class="center">Data Scrambler <small>basic</small></h2>
                <p class="center">Use this application to scramble your data <br/><small>(Scroll down to read instructions below)</small></p>

                <!--Task selection menu-->
                <p class="center">
                    <a class="options<?php echo $selEnc; ?>" id="taskEnc" href="<?php echo $page;?>?task=encode" title="Start encoding your data!">Encode data</a>
                    <a class="options<?php echo $selGen; ?>" id="taskGen" href="<?php echo $page;?>?task=generate-key" title="Generate key (alphanumeric only)!">Generate key</a>
                    <a class="options<?php echo $selDec; ?>" id="taskDec" href="<?php echo $page;?>?task=decode" title="Start decoding your data!">Decode data</a>
                </p>

                <!--Program selection menu-->
                <p class="center" title="Process the submitted form using any of the following methods!">
                    <a class="options" id="programSelect"  href="#">
                        <span id="program1">JavaScript</span>  |  <span id="program2">PHP</span> |  <span id="program3">Both</span>
                    </a>
                </p>

                <!--PHP response-->
                <p class="center" id="phpResponse">
                    <?php
                      echo $messageMain;
                    ?>
                </p>

                <a href="<?php echo $page ?>#jsResponse" id="goToJSResponse" style="display:none;">
                        click me
                </a>

                <!--JavaScript response-->
                <p class="center" id="jsResponse">
                </p>

            </div>
        </div>
        <div class="row">
            <div class="column column-60 column-offset-20 center">
                <!--The form-->
                <form id="form" method="POST" action="?task=<?php echo ('decode' === $task) ? $task : "encode"; ?>#phpResponse">
                    <input type='hidden' id='taskSS' value='<?php echo $task;?>'>
                    <label for="key">Key</label>
                    <button id="clearKey" class="form_button_others">clear</button>
                    <input type="text" name="key" id="key" value="<?php echo $key; ?>"  required><!--minlength="62" maxlength="62"-->
                    <label for="data">Data</label>
                    <button id="clearData" class="form_button_others">clear</button>
                    <textarea name="data" id="data" minlength="1" required><?php echo $data; ?></textarea>
                    <label for="result">Result</label>
                    <textarea id="result"><?php echo $resultData; ?></textarea>
                    <button type="submit" class="form_button_submit">Execute</button>
                </form>
            </div>
        </div>
        <div class="row">
            <!--Help-->
            <p id="instructions">
            <b>Instructions:</b><br/><br/>
            In order to <b>encode</b> your data, select "Encode data", generate/insert key, insert your data, 
            and then "Execute"!<br/><br/>
            If you do not have a <b>key</b>, select "Generate key". It will generate an alphanumeric 
            case-sensitive 62 character key for you located in the box assigned for your key. You just have 
            to insert your data then and "Execute"!<br/><br/>
            In order to <b>decode</b> your data, select "Decode data", insert your key, insert your data, 
            and then "Execute!"<br/><br/>
            Method in use for the purpose is highlighted as <span style="color:Chocolate; font-weight:bold">
            Chocolate</span> color. It can be JavaScript or PHP or both. JavaScript will do everything in the client side. 
            PHP will do everything in the server side. Choosing both will make client side site interactions 
            by JavaScript and all kinds of processing, but final processing will be done by PHP again and 
            that is the result! Choosing either can do the job!<br/><br/>
            Special characters are converted to HTML entities. Extra white spaces before and after are trimmed.<br/><br/>
            It is a very basic level scrambling application (doesn't provide much security). 
            Use at your own responsibility. Have fun!
            </p>
        </div>
    </div>
<script src="script.js">
    //This script is the last element in the body so that the page gets to load first 
    //and then client side manipulation occurs.
</script>
</body>

</html>
