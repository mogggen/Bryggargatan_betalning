var menuItems:Array<MenuItem> = new Array();

function onStartUp()
{
    console.log("Bar");
    readTextFile("dishes.json");
    process_url_query();
}
