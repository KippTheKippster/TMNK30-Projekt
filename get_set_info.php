<?php
    $set_id = $_POST[id];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $result = mysqli_query($connection, 
        "SELECT inventory.ItemtypeID, inventory.ItemID, sets.Setname, sets.SetID, sets.Year, inventory.ColorID, images.has_jpg, images.has_largejpg, parts.Partname
        FROM sets, parts, inventory, images 
        WHERE sets.SetID = '$set_id' AND sets.SetID = inventory.SetID AND inventory.ItemID = parts.PartID AND inventory.ItemID = images.ItemID AND inventory.ColorID = images.ColorID LIMIT 3000");

    $fileName = "$row[ItemtypeID]/$row[ColorID]/$row[ItemID].gif";
                
    $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

    $a = mysqli_fetch_array($result);
    print("<div class='flexbox-container-header'>");

    // Modal header image
    $SL="SL";
    $fileType = "gif";    
    if ($a[has_largejpg])
    {
        $fileType = "jpg";
    }

    print("<div class='flex-element-header'>");    
    print("<img src='$filePath$SL/$a[SetID].$fileType' alt='$filePath$SL/$a[SetID].$fileType' class='sets_img'>");
    print("</div>");

    print("<div class='flex-element-header'>");
    print("<h1 class='modal-header-text'> $a[Setname] </h1>");
    print("<p class='modal-header-info-text'> ID: $a[SetID] </p>");   
    print("<p class='modal-header-info-text'> Release Year: $a[Year] </p>");
    print("</div>");

    print("</div>");

    // Flexbox container
    print("<div class='flexboxContainer'>");
    while ($row = mysqli_fetch_array($result)) 
    {

        $fileType = "gif";

        if ($row[has_jpg])
        {
            $fileType = "jpg";
        }

        $fileName = "$row[ItemtypeID]/$row[ColorID]/$row[ItemID].$fileType";
        // Brick img and name of brick div
        print("<div class='flex-element'>");
        print("<img src='$filePath$fileName' alt='$filePath$fileName' class='sets_img'>");
        print("<p class='modal-text'> $row[Partname] </p>");
        print("</div>");
    }
    print("</div>");

   
?>