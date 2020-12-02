function send_order_to_server()
{
    var numberOfTables = 10;
    var errorColor = "rgb(250, 160, 160)";
    
    var tableidInputObject =
        <HTMLInputElement>document.getElementById("tableidInput");
    var tableidInputPromptObject =
        <HTMLDivElement>document.getElementById("tableidpromptDiv");
    
    var phonenrInputObject =
        <HTMLInputElement>document.getElementById("phonenrInput");
    var phonenrInputPromptObject =
        <HTMLDivElement>document.getElementById("phonenrpromptDiv");
    
    var invalidphonenr = phonenrInputObject.value === ""
       || phonenrInputObject.value.length < 10;
    //OBS Add check for if value is not a number!!!
    
    var invalidtableid = tableidInputObject.value === "" 
       || Number(tableidInputObject.value) > numberOfTables;
    //OBS Add check for if value is not a number!!!
    
    //Making sure table number is a number within range
    if(invalidtableid){
        tableidInputObject.style.background = errorColor;
        tableidInputPromptObject.style.display = "inline";
    }
    else{
        tableidInputObject.style.background = "white";
        tableidInputPromptObject.style.display = "none";
    }
    
    //Making sure phone number is at least a 10 digit number
    if(invalidphonenr){
        phonenrInputObject.style.background = errorColor;
        phonenrInputPromptObject.style.display = "inline";
    }
    else{
        phonenrInputObject.style.background = "white";
        phonenrInputPromptObject.style.display = "none";
    }
    
    //make sure the function only continues with valid data
    if (invalidtableid || invalidphonenr){
        return;
    }
    
    let msg :string = order_to_xml();
    SendToServer(msg);
    
    //Reset tableid textbox for stylistic purposes
    tableidInputObject.value = "";
    phonenrInputObject.value = "";
}

function SendToServer(msg: string)
{
    const http = new XMLHttpRequest();
    const url = "http://localhost:9002";
    http.open("POST", url);
    http.send(msg);
    http.onreadystatechange = () =>  {
        if(http.readyState === 4)
        {
            if(http.status === 200 || http.status == 0)
            {
                console.log("response: " + http.response);
                const http2 = new XMLHttpRequest();
                http2.open("POST", url);
                http2.send(http.response);
                http2.onreadystatechange = () =>  {
                    if(http2.readyState === 4)
                    {
                        if(http2.status === 200 || http2.status == 0)
                        {
                            console.log("response: " + http2.response);
                        }
                    }
                };

            }
        }
        
    };
}

function order_to_xml() :string
{
    // converts the selected items to a xml format
    // Example of format
    //<order>
    //    <item name="Dagens soppa"/>
    //    <item name="Lyxig räkmacka">
    //        <milk_free/>
    //        <gluten_free/>
    //        <egg_free/>
    //        <notes>Jag vill inte ha räkor på min räckmacka</notes>
    //    </item>
    //    <item name="Dagens Bubbel"/>
    //    <item name="Fransk fiskgryta">
    //        <gluten_free/>
    //    </item>
    //    <price>1000</price>
    //    <tableid>7</tableid>
    //    <phonenr>0701234567</phonenr>
    //</order>

    let xml :string = "";

    let total_price :number = 0

    xml += "<order>"

    selectedItems.forEach((it) => {

        let item_content :string = "";
    
        if(it.milk_free)
            item_content += "<milk_free/>";
        if(it.gluten_free)
            item_content += "<gluten_free/>";
        if(it.egg_free)
            item_content += "<egg_free/>";

        if(it.notes_to_chef != null && it.notes_to_chef != undefined)
            item_content += "<notes>" + it.notes_to_chef + "</notes>";

        if(item_content.length <= 0)
            xml += "<item name=\"" + it.name + "\"/>";
        else
            xml += "<item name=\"" + it.name + "\">" + item_content + "</item>";

        total_price += it.price;
    });

    xml += "<price>" + total_price + "</price>";
    xml += "<tableid>" + (<HTMLInputElement>document.getElementById("tableidInput")).value + "</tableid>";
    xml += "<phonenr>" + (<HTMLInputElement>document.getElementById("phonenrInput")).value + "</phonenr>";
    xml += "</order>";

    console.log(xml);
    return xml;
}
