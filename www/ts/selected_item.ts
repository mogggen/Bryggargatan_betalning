var selectedItems: Array<SelectedItem> = new Array();

class SelectedItem
{
    name: string;
    price: number;
    egg_free: boolean;
    milk_free: boolean;
    gluten_free: boolean;
    notes_to_chef: string;

    constructor(name: string, price: number, egg_free: boolean, milk_free: boolean, gluten_free: boolean)
    {
        this.name = name;
        this.price = price;
        this.egg_free = egg_free;
        this.milk_free = milk_free;
        this.gluten_free = gluten_free;
    }
}

/* When str is longer then width insert a newline
    so that no line is wider than width
 */
function string_max_width(str :string, width :number) :string
{
    if(str.length <= width)
        return str;
    else
    {
        let new_str = "";
        let splits = str.split(' ');

        let len :number = 0; 
        splits.forEach((it :string) => {
            if(len + it.length > width)
            {
                len = 0;
                new_str += '<br>';
            }
            new_str += it + " ";
            len += it.length;
        });

        return new_str;
    }
}

function update_order_summary() :void
{
    let total_price :number = 0;
    let summary_html :string = "";

    let index :number = 0;
    selectedItems.forEach((it) => 
    {
        let name :string = string_max_width(it.name, 23);

        summary_html += '<div class="summaryElement"><p class="summaryElementName">' + name + 
                        '</p><div class=\"button removeItemButton\" onclick=\"remove_item_button_callback(' + index.toString() + 
                        ');\">X</div><p class="summaryElementPrice">' + it.price.toString() + '</p></div>';

        total_price += it.price;
        index++;
    });

    summary_html += '<div class="summaryElement" id="orderSumElement"><p class="summaryElementName" id="orderSum">Summa:</p><p class="summaryElementPrice" id="orderPrice">' + total_price + '</p></div>';

    document.getElementById("orderSummary").innerHTML = summary_html;
}

function remove_item_button_callback(index :number) :void
{
    console.log("removeing: " + index.toString());

    selectedItems.splice(index, 1);
    update_order_summary();
}
