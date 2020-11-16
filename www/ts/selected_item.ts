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

function update_order_summary()
{
    let total_price :number = 0;
    let summary_html :string = "";

    selectedItems.forEach((it) => 
    {
        summary_html += '<div class="summaryElement"><p class="summaryElementName">' + it.name + 
                        '</p><p class="summaryElementPrice">' + it.price.toString() + '</p><br></div>';

        total_price += it.price;
    });

    summary_html += '<div class="summaryElement" id="orderSumElement"><p class="summaryElementName" id="orderSum">Summa:</p><p class="summaryElementPrice" id="orderPrice">' + total_price + '</p></div>';

    document.getElementById("orderSummary").innerHTML = summary_html;
}
