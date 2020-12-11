// When the user clicks on <div>, open the popup
function addAreYouSureContent(){
    
    //Doing a bunch of checks to make sure the customer filled in all necessary details.
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
        || phonenrInputObject.value.length < 10
        || !(+phonenrInputObject.value);
    
    var invalidtableid = tableidInputObject.value === "" 
        || Number(tableidInputObject.value) > numberOfTables
        || !(+tableidInputObject.value);
    
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
    
    // don't send empty order
    if(selectedItems.length <= 0)
        return;

    
    //Actually adding the content of the popup div
    let popupHolder = document.getElementById("popupHolderDiv");
    popupHolder.innerHTML = 
        "<div class=\"popupClass\" id=\"popupOverlayDiv\" onclick=\"removeAreYouSureContent();\">"+
                
        "</div>"+
        "<div class=\"popupClass\" id=\"popupDiv\">"+
                //"<p id=\"areYouSureP\"> Vill du ha kvitto till din beställing? </p>"+
            "<div id=\"receiptCheckDiv\">"+
                "<div id=\"receiptBoxDiv\">"+
                    "<label id=\"receiptBoxLabel\" for=\"receiptBox\">Bocka i för kvitto:</label>"+
                    "<input type=\"checkbox\" id=\"receiptBox\" name=\"receiptBox\" onclick=\"toggleEmailInput(this)\">"+
                "</div>"+
                    "<input type=\"email\" inputmode=\"email\" id=\"emailInput\" name=\"email\">"+
                    "<div id=\"emailpromptDiv\" style=\"display: none;\">"+
                        "<label>* Ange E-post adress</label>"+
                    "</div>"+
            "</div>"+
            "<div class=\"dishButtonContainer\" id=\"sureButtonContainer\">"+
                "<div class=\"button\" id=\"confirmButton\" onclick=\"send_order_to_server();\">Betala</div>"+
                "<div class=\"button\" id=\"declineButton\" onclick=\"removeAreYouSureContent();\">Avbryt</div>"+
            "</div>"+
        "</div>";
    
}

function removeAreYouSureContent(){
    let popupHolder = document.getElementById("popupHolderDiv");
    popupHolder.innerHTML = "";
}

function addPopupWaitingForSwishContent(){
    
    let popupOverlayDiv = document.getElementById("popupOverlayDiv");
    popupOverlayDiv.attributes.removeNamedItem("onclick");
    
    let popupDiv = document.getElementById("popupDiv");
    popupDiv.innerHTML = "";
    popupDiv.innerHTML += "<p id=\"waitingForSwishP\"> Inväntar svar från Swish </p>";
    popupDiv.innerHTML += "<div class=\"loader\"></div>";
    
    //Call addPopupWaitingForUserContent() when Swish gives the OK
    (async () => { 
        
        //Simulating Swish callback
        await delay(5000);
    
        addPopupWaitingForUserContent();
    })();
    
}

function addPopupWaitingForUserContent(){
    
    let popupOverlayDiv = document.getElementById("popupOverlayDiv");
    if(popupOverlayDiv.attributes.getNamedItem("onclick")){
        popupOverlayDiv.attributes.removeNamedItem("onclick");
    }
    
    let popupDiv = document.getElementById("popupDiv");
    popupDiv.innerHTML = "";
    popupDiv.innerHTML += "<p id=\"waitingForSwishP\"> Öppnar Swish och inväntar din betalning </p>";
    popupDiv.innerHTML += "<div class=\"loader\"></div>";
    
    // Öppna Swish här!
    
}

function toggleEmailInput(emailBox:HTMLInputElement){
    let emailInput = document.getElementById("emailInput");
    let emailPromptDiv = document.getElementById("emailpromptDiv");
    if(emailBox.checked === true){
        emailInput.style.visibility = "visible";
        emailPromptDiv.style.display = "block";
    }else{
        emailInput.style.visibility = "collapse";
        emailPromptDiv.style.display = "none";
    }
}