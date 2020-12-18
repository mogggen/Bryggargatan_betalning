let numberofNotifications = 0; // the number of identical, previously ordered orders.
let currentlyOrderedDishIndex = -1; //most recent dish_index ordered from.

function displayNotificationDiv(select :SelectedItem, item_index: number) :void{
    var notificationDiv =
        <HTMLDivElement>document.getElementById("notificationDiv");
    notificationDiv.innerHTML = "";

    if (
    currentlyOrderedDishIndex != item_index)
    {
        currentlyOrderedDishIndex = item_index;
        numberofNotifications = 0; 
    }

    numberofNotifications += 1;

    //print how many times the individual order a dish of the same type
    if (numberofNotifications > 1)
    {
        notificationDiv.innerHTML += numberofNotifications.toString() + "st ";
    }
    
    notificationDiv.innerHTML += select.name;
    
    //display specifications
    if (select.egg_free || select.milk_free || select.gluten_free)
    {
        
        notificationDiv.innerHTML += " ‧";
    
        if (select.egg_free)
        {
            notificationDiv.innerHTML += " ÄF";
        }
        if (select.milk_free)
        {
            notificationDiv.innerHTML += " MF";
        }
        if (select.gluten_free)
        {
            notificationDiv.innerHTML += " GF";
        }
    }
    
    notificationDiv.innerHTML += " ‧ tillagd.";
    displayNotification();    
}

function displayNotification()
{
    var that = (<HTMLDivElement>document.getElementById("notificationDiv"));
    (async () => {
        that.classList.add("notificationFade");
        await delay(3000);
        that.classList.remove("notificationFade");
        await delay(3000);
    })();
}
