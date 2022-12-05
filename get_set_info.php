<?php
    $set_id = $_POST[id];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $result = mysqli_query($connection, 
        "SELECT inventory.ItemtypeID, inventory.ItemID, sets.Setname, sets.SetID, sets.Year, inventory.ColorID, images.has_jpg, parts.Partname
        FROM sets, parts, inventory, images 
        WHERE sets.SetID = '$set_id' AND sets.SetID = inventory.SetID AND inventory.ItemID = parts.PartID AND inventory.ItemID = images.ItemID AND inventory.ColorID = images.ColorID LIMIT 3000");

    //OR PartID = '$search_name'

    $fileName = "$row[ItemtypeID]/$row[ColorID]/$row[ItemID].gif";
                
    $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

    $a = mysqli_fetch_array($result);
    print("<h1> SetName: $a[Setname] </h1>");
    print("<h3> SetID: $a[SetID] </h3>");   
    print("<h3> Release Year: $a[Year] </h3>");
    print("<h4> Bricks used: </h4>");
    //print("<p>");
    while ($row = mysqli_fetch_array($result)) 
    {

        $fileType = "gif";

        if ($row[has_jpg])
        {
            $fileType = "jpg";
        }

        $fileName = "$row[ItemtypeID]/$row[ColorID]/$row[ItemID].$fileType";
        print("<p> $row[Partname] </p>");
        print("<img src='$filePath$fileName' alt='$filePath$fileName' class='sets_img'>");
        //print("<p> $row[SetID] </p>");
        //print("<p> <p>");
        //print("<p> $row[Year] </p>");
    }

    //print("</p>");
?>