<?php
    /*
        This document is used for finding parts with names that include the input text. It is only used by the search recommendation. 
    */

    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $search_name = mysqli_real_escape_string($connection, $_POST[text]);
    
    //Gets a result from the database, checks if the input text is included in the column 'partname' and orders it by the length of the names
    $result = mysqli_query($connection, "SELECT Partname, LENGTH(Partname) FROM parts WHERE Partname LIKE '%$search_name%' ORDER BY LENGTH(Partname), Partname ASC LIMIT 40");

    mysqli_close($connection);

    //Creates an array and pushes all the result into it
$parts_array = array(/*$search_name*/); //Pushes the input text to show the user what they are currently writting. 

    while ($row = mysqli_fetch_array($result)) 
    {   
        $part_name = $row[Partname];
        array_push($parts_array, $part_name);
    }

    //Returns the array as a string so that javascript can make it into a javascript array.
    print(json_encode($parts_array));
?>