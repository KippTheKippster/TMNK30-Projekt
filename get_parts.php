<?php
    $name = $_POST['text'];
    $connection = mysqli_connect("127.0.0.1","root","", "lego");
    $result = mysqli_query($connection, "SELECT * FROM parts WHERE Partname LIKE '%$name%' OR PartID=$name");

    $parts_array = array();

    while ($row = mysqli_fetch_array($result)) 
    {
        $name = $row['Partname'];
        array_push($parts_array, $name);
    }

    print(json_encode($parts_array));
?>