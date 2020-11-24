function create_add_button_html(dish_name :string, price :number): string
{
    return "<div class=\"button nonDishButton\" onclick=\"add_button_callback('" + dish_name + "','" + price.toString() + "');\">Lägg till</div>"
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

function add_button_callback(dish_name :string, price :string) :void
{
    console.log("added " + dish_name + " " + price.toString());
    selectedItems.push(new SelectedItem( dish_name, +price, false, false, false ));
    console.log(selectedItems);
    update_order_summary();
}

function add_dish_button_callback(dish_index :number) :void
{
    let dish :Dish = menuItems[dish_index] as Dish;
    console.log("added " + dish.name + " " + dish.price.toString());
    selectedItems.push(new SelectedItem( dish.name, +dish.price, false, false, false ));
    console.log(selectedItems);
    update_order_summary();
}

function expand_button_callback(dish_index :number) :void
{
    let dish :Dish = menuItems[dish_index] as Dish;
    let expand_button_content = document.getElementById("expand_button_content" + dish_index);

    if(dish.is_expanded === true)
    {
        dish.is_expanded = false;
        console.log("retract");
        expand_button_content.classList.remove("arrow_up");
        
        // Add Retracting stuff here
    }
    else
    {
        // Add Expanding stuff here
        dish.is_expanded = true;
        console.log("expand");
        expand_button_content.classList.add("arrow_up");
    }
}
