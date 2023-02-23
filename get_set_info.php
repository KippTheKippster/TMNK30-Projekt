<?php
    /*
        This document is used to print information about a single set (including all the pieces that are used). Is used by the 'Modal' that shows up when the user clicks on a set
    */

    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $set_id = mysqli_real_escape_string($connection, $_POST[id]);

    /*
        The getting of information is splitted up in two, the set info (like name, id and year) and all the parts used by the set.
    */

    //Get set information, checks if the input id is the same as the coloumn id and also if images id is the same as set id, so that the image information can be used.
    $result = mysqli_query($connection, 
    "SELECT sets.Setname, sets.SetID, sets.Year, images.has_gif, images.has_largejpg, images.has_largegif
    FROM sets, images
    WHERE sets.SetID = '$set_id' AND sets.SetID = images.ItemID");

    PrintSet($result);

    //Get all the parts
    $result = mysqli_query($connection, 
    "SELECT inventory.ItemtypeID, inventory.ItemID, inventory.Quantity, sets.Setname, sets.SetID, sets.Year, inventory.ColorID, images.has_gif, images.has_largejpg, images.has_largegif, parts.Partname, colors.Colorname
    FROM sets, parts, inventory, images, colors 
    WHERE sets.SetID = '$set_id' AND sets.SetID = inventory.SetID AND inventory.ItemID = parts.PartID AND inventory.ItemID = images.ItemID AND inventory.ColorID = images.ColorID AND inventory.ColorID = colors.ColorID
    ORDER BY inventory.Quantity DESC LIMIT 3000");

    mysqli_close($connection);

    PrintParts($result);

    function PrintSet($data)
    {
        //Prints out all the information about the set

        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";
        //The data of the set should only contain one line, so a loop is not required
        $row = mysqli_fetch_array($data);
    
        // Modal header image
        //Decides which type of image the set uses, will priorities large images over small 
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
    
        //Prints out all the information so that it creates a correctly form modal
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
        //Prints out all the pieces in a flexbox container.

        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

        // Flexbox container
        print("<div class='flexboxContainer'>");
        
        while ($row = mysqli_fetch_array($data))  //Goes through all rows of the data and prints out the piece-
        {
            //Figures out what image the piece is using, will only choose the small ones to preserve loading times and the data required to load
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
