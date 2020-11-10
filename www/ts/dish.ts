class MenuItem{
    name: string;
    price: number;
    
    constructor(name: string, price: number){
        this.name = name;
        this.price = price;
    }
    
    menuToString():string{
        var menuItemString;
        menuItemString = this.name + " " + this.price.toString();
        return menuItemString;
    }
}

class Dish extends MenuItem{
    type: string;
    description: string;
    is_milk_free: string;
    is_gluten_free: string;
    is_egg_free: string;
    contains_soy: boolean;
    
    constructor(name:string, price:number, type:string, description:string, is_milk_free:string, is_gluten_free:string, is_egg_free: string, contains_soy:boolean){
        super(name, price);
        this.type = type;
        this.description = description;
        this.is_milk_free = is_milk_free;
        this.is_gluten_free = is_gluten_free;
        this.is_egg_free = is_egg_free;
        this.contains_soy = contains_soy;
    }
    
    menuToString():string{
        var menuItemString;
        menuItemString = this.name + " " + this.price.toString() + " " + this.type + " " + this.description
                        +" " + this.is_milk_free + " " + this.is_gluten_free + " " + this.is_egg_free
                        +" " + this.contains_soy;
        return menuItemString;
    }
}