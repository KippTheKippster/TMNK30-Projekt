<?php
    $part_name = $_POST[text];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");

    if (!$connection)
    {
        die("Connection Failed");
    }

    $condition = "parts.Partname = '$part_name' AND parts.PartID = inventory.ItemID AND inventory.SetID = sets.SetID AND sets.SetID = images.ItemID";
    $query="SELECT * FROM parts, inventory, sets, images WHERE " . $condition . " LIMIT 2000";
    
    $result = mysqli_query($connection, $query);

    $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

    //print($part_name);
    //print($query);
    $old_id = "";
    $i = 0;

    while ($row = mysqli_fetch_array($result))
    {   
        if ($old_id == $row[SetID])
        {
            continue;
        }

        $fileType = "jpg";
        if ($row[has_gif])
        {
            $fileType = "gif";
        }

        $sizeType = "S";
        if ($row[has_largejpg])
        {
            $fileType = "jpg";
            $sizeType = "SL";
        }
        else if ($row[has_largegif])
        {
            $fileType = "gif";
            $sizeType = "SL";
        }
        

        $fileName = "$sizeType/$row[SetID].$fileType";
        $old_id = "$row[SetID]";
        $i++;

        print("
        <div class='sets_rows go_to_set_info'>
            <div class='sets_img_td'><img src='$filePath$fileName' alt='failed' class='sets_img'></div>
            <div class='sets_info_td'>
                <span class='sets_info_header'>$row[Setname]</span>
                <hr>
                <div class='sets_info_text'><span class='info_id'>ID: </span><span class='id_number'>$row[SetID]</span>
                    <span class='info_id'>Year:</span><span class='id_number'>$row[Year]</span>
                    <span class='id_number'>Your piece is included in these colors:</span>
                </div>  
            </div>     
        </div>");
    }  

    if ($i == 0) // Fixa senare!!!!!!
    {
        print("<div class='load-fail'><span class='load-fail-text'>Failed To Load!</span></div>");
    }
?>