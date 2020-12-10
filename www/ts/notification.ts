let numberofNotifications = 0;
let currentlyOrderedDishIndex = -1;

function displayNotificationDiv(select :SelectedItem, item_index: number) :void{
    var notificationDiv =
        <HTMLDivElement>document.getElementById("notificationDiv");
    notificationDiv.innerHTML = "";

    if (currentlyOrderedDishIndex != item_index)
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

    //display specifications
    if (select.egg_free)
    {
        notificationDiv.innerHTML += " ÄG";
    }
    if (select.milk_free)
    {
        notificationDiv.innerHTML += " MF";
    }
    if (select.gluten_free)
    {
        notificationDiv.innerHTML += " GF";
    }

    notificationDiv.innerHTML += "" + select.name + " ‧ tillagd.";

    displayNotification();

    if (currentlyOrderedDishIndex != item_index)
    {
        currentlyOrderedDishIndex = item_index;
        numberofNotifications = 0;
    }
}

function displayNotification()
{
    (async () => {
        (<HTMLDivElement>document.getElementById("notificationDiv")).classList.add("notificationFade");
        await delay(2000);
        (<HTMLDivElement>document.getElementById("notificationDiv")).classList.remove("notificationFade");
    })();
}