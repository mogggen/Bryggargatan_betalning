async function readTextFile(file): Promise<{}>
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
                parseDishesFile(JSON.stringify(allText));
            }
        }
    }
    rawFile.send(null);
    });
}

function parseDishesFile(allText: string){
    var parsedText = JSON.parse(JSON.parse(allText));
    for(var i = 0; i < parsedText.dishes.length; i++){
        menuItems.push(new Dish(
        parsedText.dishes[i].name,
        parsedText.dishes[i].price,
        parsedText.dishes[i].type,
        parsedText.dishes[i].description,
        parsedText.dishes[i].is_milk_free,
        parsedText.dishes[i].is_gluten_free,
        parsedText.dishes[i].is_egg_free,
        parsedText.dishes[i].contains_soy))
    }
    for(var i = 0; i < parsedText.drinks.length; i++){
        menuItems.push(new MenuItem(
        parsedText.drinks[i].name,
        parsedText.drinks[i].price))
    }
    for(var i = 0; i < parsedText.warm_drinks.length; i++){
        menuItems.push(new MenuItem(
        parsedText.warm_drinks[i].name,
        parsedText.warm_drinks[i].price))
    }
    for(var i = 0; i < parsedText.desserts.length; i++){
        menuItems.push(new MenuItem(
        parsedText.desserts[i].name,
        parsedText.desserts[i].price))
    }
    printParsedDishes();
}

function printParsedDishes(){
    var allText = "";
    for(var i = 0; i < menuItems.length; i++){
        allText += menuItems[i].menuToString() + "<br>";
    }
    document.getElementById("this_is_a_div").innerHTML = allText;
}