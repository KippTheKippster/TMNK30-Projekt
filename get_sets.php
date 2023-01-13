<?php
    $part_name = $_POST[text];
    $offset = $_POST[offset];
    $limit = $_POST[limit];
    $connection = mysqli_connect("mysql.itn.liu.se", "lego", "", "lego");

    if (!$connection)
    {
        die("Connection Failed");
    }

    $condition = "parts.Partname = '$part_name' AND parts.PartID = inventory.ItemID AND inventory.SetID = sets.SetID AND sets.SetID = images.ItemID AND inventory.ColorID = colors.ColorID";
    $tables = "parts, inventory, sets, images, colors";
    $query="SELECT * FROM " . $tables . " WHERE " . $condition . " ORDER BY inventory.Quantity DESC, sets.Setname ASC LIMIT $limit OFFSET $offset";

    $part_result = mysqli_query($connection, "SELECT * FROM parts, images WHERE parts.Partname = '$part_name' AND parts.PartID = images.ItemID");
    $count_result = mysqli_query($connection, "SELECT COUNT(1) as total FROM " . $tables . " WHERE " . $condition);
    $set_result = mysqli_query($connection, $query);

    
    while ($row = mysqli_fetch_array($count_result))
    {
        print("<input type='hidden' id='item_count' value='$row[0]'>");
    } 


    mysqli_close($connection);

    if (mysqli_num_rows($set_result) == 0)
    {
        PrintError();
    }
    else
    {
        PrintPart($part_result);
        PrintAllSets($set_result);
    }

    function PrintPart($data)
    {
        $filePath = "http://www.itn.liu.se/~stegu76/img.bricklink.com/";

        $row = mysqli_fetch_array($data);
        $type = GetFileType($row, false);
        $fileName = "$type[1]/$row[PartID].$type[0]";
        $source = "$filePath$fileName";

        print("<div class='sets_img-query-text'><span class='search-query-text'> You are searching for: $row[Partname] </span></div>");
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

    function PrintSet($source, $set_name, $set_id, $year, $colors)
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
        print("<div class='load-fail'><h1 class='load-fail-text'>Failed To Load! : $_POST[text] </h1></div>");
    }

    function GetFileType($row, $set)
    {
        $type_array = array();
        
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

        if ($set == false)
        {
            $sizeType = str_replace("S", "P", $sizeType);
        }

        array_push($type_array, $fileType);
        array_push($type_array, $sizeType);

        return $type_array;
    }
?>