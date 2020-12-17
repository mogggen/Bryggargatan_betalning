var menuItems:Array<MenuItem> = new Array();

function onStartUp()
{
    readTextFile("dishes.json");
    process_url_query();
}
