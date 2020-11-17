function send_order_to_server()
{
    let msg :string = order_to_xml();
    SendToServer(msg);
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
                http2.send("Hej igen");
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
    //        <gluent_free/>
    //        <egg_free/>
    //        <notes>Jag vill inte ha räkor på min räckmacka</notes>
    //    </item>
    //    <item name="Dagens Bubbel"/>
    //    <item name="Fransk fiskgryta">
    //        <gluent_free/>
    //    </item>
    //    <price>1000</price>
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

    xml += "</order>";

    console.log(xml);
    return xml;
}
