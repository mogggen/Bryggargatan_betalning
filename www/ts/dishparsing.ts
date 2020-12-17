async function readTextFile(file: string): Promise<{}>
{
    return new Promise(() => {
        var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                parseAndPrintDishesFile(JSON.stringify(allText));
            }
        }
    }
    rawFile.send(null);
    });
}

function parseAndPrintDishesFile(allText: string){
    
    var parsedText = JSON.parse(JSON.parse(allText));
    var printText = '<div id="dishesDiv">';
    
    for(var i = 0; i < parsedText.dishes.length; i++){
        menuItems.push(new Dish(
        parsedText.dishes[i].name,
        parsedText.dishes[i].price,
        parsedText.dishes[i].type,
        parsedText.dishes[i].description,
        parsedText.dishes[i].is_milk_free,
        parsedText.dishes[i].is_gluten_free,
        parsedText.dishes[i].is_egg_free,
        parsedText.dishes[i].contains_soy));
        printText += menuItems[menuItems.length-1].menuToHTML();
    }
    
    printText += "</div>" + '<div id="drinksDiv">' + '<p class="subMenuHeadP"> DRYCKER </p>';
    for(var i = 0; i < parsedText.drinks.length; i++){
        menuItems.push(new MenuItem(
        parsedText.drinks[i].name,
        parsedText.drinks[i].price));
        printText += menuItems[menuItems.length-1].menuToHTML();
    }
    
    printText += "</div>" + '<div id="warmDrinksDiv">' + '<p class="subMenuHeadP"> VARMA DRYCKER </p>';
    for(var i = 0; i < parsedText.warm_drinks.length; i++){
        menuItems.push(new MenuItem(
        parsedText.warm_drinks[i].name,
        parsedText.warm_drinks[i].price));
        printText += menuItems[menuItems.length-1].menuToHTML();
    }
    
    printText += "</div>" + '<div id="dessertsDiv">' + '<p class="subMenuHeadP"> EFTERRÄTT </p>';
    for(var i = 0; i < parsedText.desserts.length; i++){
        menuItems.push(new MenuItem(
        parsedText.desserts[i].name,
        parsedText.desserts[i].price));
        printText += menuItems[menuItems.length-1].menuToHTML();
    }
    printText += "</div>";
    
    document.getElementById("menuDiv").innerHTML = printText;
    
    for(var i = 0; i < parsedText.dishes.length; i++){
        preCheckBoxes(i);
    }
}
