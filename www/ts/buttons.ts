function create_add_button_html(dish_name :string, price: number): string
{
    let button :string = "";
    button += "<div class=\"button\" onclick=\"add_button_callback('" + dish_name + "','" + price.toString() + "');\">Lägg till</div>"
    return button;
}

function add_button_callback(dish_name :string, price: string)
{
    let p: number = +price; // converts string to number
    console.log("added " + dish_name + " " + p.toString());
    selectedItems.push(new SelectedItem( dish_name, +price, false, false, false ));
    console.log(selectedItems);
}
