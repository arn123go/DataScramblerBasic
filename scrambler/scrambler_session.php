<?php
session_start();
if(isset($_GET['task']) && ($_GET['task']==='encode' || $_GET['task']==='generate-key' || $_GET['task']==='decode')){
$_SESSION['task'] = $_GET['task'];
}
?>
