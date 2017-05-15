<?php

if($_SERVER['HTTP_CAST_DEVICE_CAPABILITIES']) {
    echo(file_get_contents('receiver.html'));
}
else {
    echo(file_get_contents('client.html'));
}

?>