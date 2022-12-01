<?php
    $search_name = $_POST[text];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $result = mysqli_query($connection, "SELECT * FROM parts WHERE Partname LIKE '$search_name%' LIMIT 30");

    //OR PartID = '$search_name'

    $parts_array = array();

    while ($row = mysqli_fetch_array($result)) 
    {
        $part_name = $row[Partname];
        array_push($parts_array, $part_name);
    }

    print(json_encode($parts_array));
?>