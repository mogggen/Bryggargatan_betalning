function create_add_button_html(item: MenuItem): string
{
    let item_index :number = menuItems.indexOf(item);
    return "<div class=\"button nonDishButton\" onclick=\"add_button_callback('" + item_index + "');\">Lägg till</div>"
}

function create_add_dish_buttons_html(dish :Dish): string
{
    let dish_index :number = menuItems.indexOf(dish);
    
    return ""+
    "<div class=\"dishButtonContainer\">"+
        "<div class=\"button dishButton\" onclick=\"add_dish_button_callback("+dish_index+");\">"+
            "Lägg till"+
        "</div>"+
        "<div class=\"button expandButton\" onclick=\"expand_button_callback("+dish_index+")\">"+
            "<i class=\"arrow\" id=\"expand_button_content"+dish_index+"\"></i>"+
        "</div>"+
    "</div>";
}

function add_button_callback(item_index: number) :void
{
    let item :MenuItem = menuItems[item_index] as MenuItem;
    
    var temp = new SelectedItem(item.name, +item.price,false, false, false);
    displayNotificationDiv(temp, item_index);
    selectedItems.push(temp);
    console.log(selectedItems);
    update_order_summary();
}

function add_dish_button_callback(dish_index :number) :void
{
    let dish :Dish = menuItems[dish_index] as Dish;
    
    //Finding the correct input checkbox for each value
    let ef = (<HTMLInputElement>document.getElementsByName("EF")[dish_index]);
    let mf = (<HTMLInputElement>document.getElementsByName("MF")[dish_index]);
    let gf = (<HTMLInputElement>document.getElementsByName("GF")[dish_index]);
    
    var temp = new SelectedItem(
    dish.name, +dish.price,
    ef.checked && !ef.disabled,
    mf.checked && !mf.disabled,
    gf.checked && !gf.disabled);
    
    displayNotificationDiv(temp, dish_index);
    
    selectedItems.push(temp);
    console.log(selectedItems);
    
    update_order_summary();
}

function expand_button_callback(dish_index :number) :void
{
    let dish :Dish = menuItems[dish_index] as Dish;
    let expand_button_content = document.getElementById("expand_button_content" + dish_index);

    if(dish.is_expanded === true)
    {
        // Retracting
        hideExpandDiv(dish_index);
        dish.is_expanded = false;
        console.log("retract");
        expand_button_content.classList.remove("arrow_up");
    }
    else
    {
        // Expanding
        showExpandDiv(dish_index);
        dish.is_expanded = true;
        console.log("expand");
        expand_button_content.classList.add("arrow_up");
    }
}
