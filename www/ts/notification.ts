function hideExpandDiv(dish_index:number) :void{
    var notificationDiv =
        <HTMLDivElement>document.getElementById("notificationDiv");
    
    (async () => { 
        notificationDiv.style.display = "inline";

        await delay(645);
    
        notificationDiv.style.display = "none";
    })();
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}