function create_add_button_html(dish_name :string, price :number): string
{
    return "<div class=\"button nonDishButton\" onclick=\"add_button_callback('" + dish_name + "','" + price.toString() + "');\">Lägg till</div>"
}

function create_add_dish_button_html(dish_name :string, price :number): string
{
    return "<div class=\"button\" onclick=\"add_dish_button_callback('" + dish_name + "','" + price.toString() + "');\">Lägg till</div>"
}

function add_button_callback(dish_name :string, price :string)
{
    console.log("added " + dish_name + " " + price.toString());
    selectedItems.push(new SelectedItem( dish_name, +price, false, false, false ));
    console.log(selectedItems);
    update_order_summary();
}

function add_dish_button_callback(dish_name :string, price :string)
{
    console.log("added " + dish_name + " " + price.toString());
    selectedItems.push(new SelectedItem( dish_name, +price, false, false, false ));
    console.log(selectedItems);
    update_order_summary();
}
