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
    send_message_to_server(msg, send_order_callback);
    
    //Call to visually show customer we sent the order
    addPopupWaitingForSwishContent();
    
    //Reset tableid textbox for stylistic purposes
    tableidInputObject.value = "";
    phonenrInputObject.value = "";
}

// Example of recieve values on success
//      <client status="true"><id>7</id><token>1234567890</token></client>
//
// Example of recieve values on failure
//      <client status="false"><errormsg>Error message</errormsg></client>
//

function send_order_callback(success :boolean, http :XMLHttpRequest)
{
    if(!success)
    {
        console.log("Failed to connect to server.");
        return;
    }


    console.log("response: " + http.response);
    if(http.responseXML.getElementsByTagName("client")[0].getAttribute("status") === "false")
    {
        console.log("server error");
        let err_msg :string = http.responseXML.getElementsByTagName("errormsg")[0].textContent;
        console.log(err_msg);

        addPopupErrorMessage(err_msg);
        return;
    }

    addPopupWaitingForUserContent();
    send_message_to_server(http.response, second_send_callback);
}

function second_send_callback(success :boolean, http :XMLHttpRequest)
{
    if(!success)
    {
        console.log("Falied to connect to server")
        return;
    }

    
    console.log("response: " + http.response);
    let status :string = http.responseXML.getElementsByTagName("status")[0].textContent;

    switch(status)
    {
        case "PAID":
        { 
            console.log("Payment successful");
            addPopupSuccessMessage();
        } break;
        case "DECLINED":
        {
            console.log("Payment declined");
            addPopupErrorMessage("Betalning avbruten");
        } break;
        case "ERROR":
        {
            console.log("Swish error");
            addPopupErrorMessage("");
        } break;
        case "CREATED":
        {
            // This should never happen
            console.log("Swish error");
            addPopupErrorMessage("");
        } break;
    }
}

function send_message_to_server(msg: string, callback_func :(success :boolean, http :XMLHttpRequest) => void)
{
    const http = new XMLHttpRequest();
    //const url = "http://130.240.54.162:9002";
    const url = "http://130.240.40.7:9002";
    http.open("POST", url);
    //http.setRequestHeader("Access-Control-Allow-Origin", "*");
    http.send(msg);
    http.onreadystatechange = () =>  {

        if(http.readyState === 4)
        {
            if(http.status === 200 || http.status === 0)
            {
                callback_func(true, http);
                return;
            }
            callback_func(false, null);
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
    //        <price>129</price>
    //        <milk_free/>
    //        <gluten_free/>
    //        <egg_free/>
    //        <notes>Jag vill inte ha räkor på min räckmacka</notes>
    //    </item>
    //    <item name="Dagens Bubbel"/>
    //    <item name="Fransk fiskgryta">
    //        <gluten_free/>
    //    </item>
    //    <total_price>1000</total_price>
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
        
        item_content += "<price>" + it.price + "</price>";
        
        if(it.milk_free)
            item_content += "<milk_free/>";
        if(it.gluten_free)
            item_content += "<gluten_free/>";
        if(it.egg_free)
            item_content += "<egg_free/>";

        if(it.notes_to_chef != null && it.notes_to_chef != undefined)
            item_content += "<notes>" + it.notes_to_chef + "</notes>";

        xml += '<item name="' + it.name + '">' + item_content + '</item>';

        total_price += it.price;
    });


    xml += "<total_price>" + total_price + "</total_price>";
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
