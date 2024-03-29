<?php
    /*
        This document is used to print out all sets that include the input piece. There is a system to split up the information into smaller pieces with help of the offset and limit inputs. 
        This document is used by two functions through javascript, searching for a piece and pressing on the next or prev arrows
    */


    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");
    $part_name = mysqli_real_escape_string($connection, $_POST[text]);
    $offset = mysqli_real_escape_string($connection, $_POST[offset]);
    $limit = mysqli_real_escape_string($connection, $_POST[limit]);
    $color_id = $_POST[colorID];

    if (!$connection)
    {
        die("Connection Failed");
    }

    /*
        The getting of information is splitted up in to three, getting the part that the user is searching for, getting the total amount of sets that are valid (used for splitting up the information)
        and getting a list of all the lists.
    */

    $color_condition = "AND inventory.ColorID = '$color_id' ";
    $color_image_condition = "AND images.ColorID = '$color_id'";

    if ($color_id == 0)
    {
        $color_condition = "";
        $color_image_condition = "";
    }

    $condition = "parts.Partname = '$part_name' AND parts.PartID = inventory.ItemID AND inventory.SetID = sets.SetID AND sets.SetID = images.ItemID AND inventory.ColorID = colors.ColorID $color_condition";
    $tables = "parts, inventory, sets, images, colors";
    $query="SELECT * FROM " . $tables . " WHERE " . $condition . " ORDER BY inventory.Quantity DESC, sets.Setname ASC LIMIT $limit OFFSET $offset";

    $part_result = mysqli_query($connection, "SELECT * FROM parts, images WHERE parts.Partname = '$part_name' AND parts.PartID = images.ItemID $color_image_condition");  //Gets the part
    $count_result = mysqli_query($connection, "SELECT COUNT(1) as total FROM " . $tables . " WHERE " . $condition); //Gets the total count of sets
    $set_result = mysqli_query($connection, $query); //Gets the sets
    $color_result = mysqli_query($connection, 
    "SELECT colors.ColorID, colors.Colorname, colors.ColorRGB
    FROM colors, images, parts
    WHERE colors.ColorID = images.ColorID AND parts.Partname = '$part_name' AND images.ItemID = parts.PartID
    ORDER BY colors.ColorID ASC");     

    
    mysqli_close($connection);

    if (mysqli_num_rows($set_result) == 0) //Checks if the set result is empty and prints a error if that is true. It checks only for sets since that is the only truly important thing that needs to work
    {
        PrintError();
    }
    else
    {
        PrintPart($part_result, $color_result); //Prints the part that the user is searching for
        PrintAllSets($set_result); //Prints all the sets that has the piece
        print("<input type='hidden' id='item_count' value='".  mysqli_fetch_array($count_result)[0] . "'>"); //Prints a hidden value that contains the total amount of sets that are valid which is later used by javascript to determine if you can go to the next page.
    }

    function PrintPart($part_data, $color_data)
    {
        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";
        $part = mysqli_fetch_array($part_data);

        $colors = array(); 

        print("<div class='sets_img-query-text'><span class='search-query-text'> You are searching for: $part[Partname] </span></div>");

        print ("<div class = 'query-color-picker'>");
        print ("<select name='colors' id='colors-dropdown' class = 'query-color-picker-box'>");

        $selected = "";

        if (mysqli_num_rows($color_data) != 1)
        {
            print("<option value='0'>Any color</option>");
        }
    
        while ($row = mysqli_fetch_array($color_data)) 
        {   
            $part_name = $row[Partname];
            $color_id = $row[ColorID];
            $color_name = $row[Colorname];
            $color_rgb = $row[ColorRGB];
    
            array_push($colors, $color_name);
            array_push($colors, $color_id);
            array_push($colors, $color_rgb);
            print("<option value='$color_id' selected = 'selected'> $color_name </option>"
            );
        }
    
    
        print ("</select>");
        print ("</div>"); 

        $color_id =  $_POST[colorID];

        if ($color_id == 0)
        {
            $color_id = $colors[1];
        }

        $type = GetFileType($part, false, true);
        $fileName = "$type[1]/" . $color_id . "/$part[PartID].$type[0]";
        $source = "$filePath$fileName";

        print("<div class='sets_img-query'><img src='$source' alt='$source' class='sets_img'></div>");
    }

    function PrintAllSets($data)
    {
        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

        $old_id = "";
        $i = 0;
        $set_name = "";
        $set_id = "";
        $year = "";
        $source = "";
        $colors = "";

        //Goes through all the sets. Checks if the current set is the same as the old set (which means that one set has multiple of the same pieces with different colours) and combines them.
        //THIS IS A BAD SOLUTION AND SHOULD BE REPLACED 
        while ($row = mysqli_fetch_array($data)) 
        {
            if ($old_id == $row[SetID])
            {
                $colors .= 
                "<div class='brick-colors'>
                    <span class='$row[ColorRGB] brick-colors-text'>$row[Quantity]</span>
                </div>";
                continue;
            }

            if ($i != 0)
            {
                PrintSet($source, $set_name, $set_id, $year, $colors);
            }

            $type = GetFileType($row, true);

            $fileName = "$type[1]/$row[SetID].$type[0]";
            $old_id = "$row[SetID]";
            $i++;

            $source = "$filePath$fileName";
            $set_name = $row[Setname];
            $set_id = $row[SetID];
            $year = $row[Year];
            $colors = 
            "<div class='brick-colors'>
                <span class='$row[ColorRGB] brick-colors-text'>$row[Quantity]</span>
            </div>";
        }  

        PrintSet($source, $set_name, $set_id, $year, $colors);
    }

    function PrintSet($source, $set_name, $set_id, $year, $colors) //PrintSet is a function that prints a set with the correct params
    {   
        print("
        <div class='sets_rows go_to_set_info'>
            <div class='sets_img_td'><img src='$source' alt='failed' class='sets_img'></div>
            <div class='sets_info_td'>
                <span class='sets_info_header'>$set_name</span>
                <hr>
                <div class='sets_info_text'><span class='info_id'>ID: </span><span class='id_number'>$set_id</span>
                    <span class='info_id'>Year: </span><span class='id_number'>$year</span>
                    <span class='id_number'>Your piece is included in these colors:</span>
                </div>  
                <div class='brick-colors-container'>
                    $colors
                </div>
            </div>     
        </div>");
    }
    
    function PrintError()
    {
        print("<div class='load-fail'><h1 class='load-fail-text'>No sets found with piece: $_POST[text]</h1><h2>This piece may not exist or no sets include this piece.</h2></div>");
    }
    //Get file type returns the correct type of image the input is using, $set is used to check whether or not the input is a piece or set, (false meaning it is a piece).
    //The function returns an array, with the first position being the filetype (i.e jpg or png) and the second position being type size (i.e large or small)
    function GetFileType($row, $set, $small = false)
    {
        $type_array = array();
        
        $fileType = "jpg";
        if ($row[has_gif] == true)
        {
            $fileType = "gif";
        }

        $sizeType = "S";
        if ($row[has_largejpg] && $small == false)
        {
            $fileType = "jpg";
            $sizeType = "SL";
        }
        else if ($row[has_largegif] && $small == false)
        {
            $fileType = "gif";
            $sizeType = "SL";
        }

        if ($set == false)
        {
            $sizeType = str_replace("S", "P", $sizeType);
        }

        array_push($type_array, $fileType);
        array_push($type_array, $sizeType);

        return $type_array;
    }
?>