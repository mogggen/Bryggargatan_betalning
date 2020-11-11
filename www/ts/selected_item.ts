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
