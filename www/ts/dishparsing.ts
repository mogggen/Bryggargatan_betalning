async function readTextFile(file): Promise<{}>
{
    return new Promise(() => {
        var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                document.getElementById("this_is_a_div").innerHTML = allText;
            }
        }
    }
    rawFile.send(null);
    });
}

//readTextFile("../dishes.json");