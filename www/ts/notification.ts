function displayNotificationDiv() :void{
    var notificationDiv =
        <HTMLDivElement>document.getElementById("notificationDiv");
    
    (async () => { 
        notificationDiv.style.display = "inline";

        await delay(4000);
    
        notificationDiv.style.display = "none";
    })();
}