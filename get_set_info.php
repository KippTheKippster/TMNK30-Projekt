<?php
    $set_id = $_POST[id];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");

    //Set
    $result = mysqli_query($connection, 
    "SELECT sets.Setname, sets.SetID, sets.Year, images.has_gif, images.has_largejpg, images.has_largegif
    FROM sets, images
    WHERE sets.SetID = '$set_id' AND sets.SetID = images.ItemID");

    PrintSet($result);

    //Parts
    $result = mysqli_query($connection, 
    "SELECT inventory.ItemtypeID, inventory.ItemID, inventory.Quantity, sets.Setname, sets.SetID, sets.Year, inventory.ColorID, images.has_gif, images.has_largejpg, images.has_largegif, parts.Partname, colors.Colorname
    FROM sets, parts, inventory, images, colors 
    WHERE sets.SetID = '$set_id' AND sets.SetID = inventory.SetID AND inventory.ItemID = parts.PartID AND inventory.ItemID = images.ItemID AND inventory.ColorID = images.ColorID AND inventory.ColorID = colors.ColorID
     LIMIT 3000");

    PrintParts($result);

    function PrintSet($data)
    {
        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";
        $row = mysqli_fetch_array($data);
    
        // Modal header image
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
    
        $source = "$filePath$sizeType/$row[SetID].$fileType";
    
        print("<div class='flexbox-container-header'>");

        print("<div class='flex-element-header'>");    
        print("<img src='$source' alt='$row[has_largejpg], $row[has_largegif]' class='sets_img'>");
        print("</div>");
    
        print("<div class='flex-element-header'>");
        print("<h1 class='modal-header-text'> $row[Setname] </h1>");
        print("<p class='modal-header-info-text'> ID: $row[SetID] </p>");   
        print("<p class='modal-header-info-text'> Release Year: $row[Year] </p>");
        print("</div>");
    
        print("</div>");
    }

    function PrintParts($data)
    {
        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

        // Flexbox container
        print("<div class='flexboxContainer'>");
        while ($row = mysqli_fetch_array($data)) 
        {

            $fileType = "jpg";

            if ($row[has_gif])
            {
                $fileType = "gif";
            }

            $fileName = "$row[ItemtypeID]/$row[ColorID]/$row[ItemID].$fileType";
            // Brick img and name of brick div
            print("<div class='flex-element'>");
            print("<img src='$filePath$fileName' alt='$filePath$fileName' class='sets_img'>");
            print("<p class='modal-text'> $row[Quantity] $row[Colorname] $row[Partname] </p>");
            print("</div>");
        }
        print("</div>");
    }   
?>