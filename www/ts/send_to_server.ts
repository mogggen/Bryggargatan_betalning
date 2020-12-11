function send_order_to_server()
{
    //Checking if customer wants an email receipt as well as if they entered their email in the case that they do.
    let emailCheckBox = <HTMLInputElement>document.getElementById("receiptBox");
    if(emailCheckBox.checked){
        var emailInputObject = <HTMLInputElement>document.getElementById("emailInput");
        var emailInputPromptObject = <HTMLInputElement>document.getElementById("emailpromptDiv");
    
        var invalidemail = emailInputObject.value === "" || emailInputObject.value.length <= 4;
    
        if(invalidemail){
            emailInputObject.style.background = "rgb(250, 160, 160)";
            emailInputPromptObject.innerHTML = "* Ogiltigt E-post adress";
            return;
        }else{
            emailInputObject.style.background = "white";
        }
    }
    
    
    var tableidInputObject =
        <HTMLInputElement>document.getElementById("tableidInput");
    var phonenrInputObject =
        <HTMLInputElement>document.getElementById("phonenrInput");
    
    let msg :string = order_to_xml();
    SendToServer(msg);
    
    //Call to visually show customer we sent the order
    addPopupWaitingForSwishContent();
    
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
    //    <email>harry.hedman@gmail.com</email>
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
    if((<HTMLInputElement>document.getElementById("receiptBox")).checked){
        xml += "<email>" + (<HTMLInputElement>document.getElementById("emailInput")).value + "</email>";
    }else{
        xml += "<email></email>";
    }
    xml += "</order>";

    console.log(xml);
    return xml;
}
