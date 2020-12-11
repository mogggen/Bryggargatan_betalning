function send_order_to_server()
{
    //Call to visually show customer we sent the order
    addPopupWaitingForSwishContent();
    
    var tableidInputObject =
        <HTMLInputElement>document.getElementById("tableidInput");
    var phonenrInputObject =
        <HTMLInputElement>document.getElementById("phonenrInput");
    
    let msg :string = order_to_xml();
    SendToServer(msg);
    
    //Reset tableid textbox for stylistic purposes
    //tableidInputObject.value = "";
    //phonenrInputObject.value = "";
}

// Example of recieve values on success
//      <client status="true"><id>7</id><token>1234567890</token></client>
//
// Example of recieve values on failure
//      <client status="false"><errormsg>Error message</errormsg></client>
//

function SendToServer(msg: string)
{
    const http = new XMLHttpRequest();
    //const url = "http://130.240.54.162:9002";
    const url = "http://localhost:9002";
    http.open("POST", url);
    //http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.send(msg);
    http.onreadystatechange = () =>  {
        if(http.readyState === 4)
        {
            if(http.status === 200 || http.status === 0)
            {
                console.log("response: " + http.response);
                const http2 = new XMLHttpRequest();
                http2.open("POST", url);
                if(http.responseXML.getElementsByTagName("client")[0].getAttribute("status") === "false")
                {
                    console.log("server error");
                    console.log(http.responseXML.getElementsByTagName("errormsg")[0].textContent);
                    return;
                }
                http2.send(http.response);
                http2.onreadystatechange = () =>  {
                    if(http2.readyState === 4)
                    {
                        if(http2.status === 200 || http2.status === 0)
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

    //xml += "<item name=\"ObiWan\"><milk_free/><gluten_free/><egg_free/><notes>Hello there! General Kenobi.</notes></item>";

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
