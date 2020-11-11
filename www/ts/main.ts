var menuItems:Array<MenuItem> = new Array();
var selectedItems: Array<SelectedItem> = new Array();

function onStartUp()
{
    console.log("Bar");
    readTextFile("dishes.json");
    //SendToServer("Hello there!");
}
