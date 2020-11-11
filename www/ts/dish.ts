
enum FoodOption{
    Yes,
    No,
    Possible,
    Error
}

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
    
    menuToHTML():string{
        var menuItemString;
        menuItemString = "<div class=\"menuItem\">" + this.name + " " + 
            this.price.toString() + "</div>";
        return menuItemString;
    }
    
}



class Dish extends MenuItem{
    
    
    type: string;
    description: string;
    is_milk_free: string;
    milkFreeFO: FoodOption;
    is_gluten_free: string;
    glutenFreeFO: FoodOption;
    is_egg_free: string;
    eggFreeFO: FoodOption;
    contains_soy: boolean;
    
    constructor(name:string, price:number, type:string, description:string, is_milk_free:string, is_gluten_free:string, is_egg_free: string, contains_soy:boolean){
        super(name, price);
        this.type = type;
        this.description = description;
        this.milkFreeFO = this.checkMilkFO(is_milk_free);
        this.glutenFreeFO = this.checkGlutenFO(is_gluten_free);
        this.eggFreeFO = this.checkEggFO(is_egg_free);
        this.contains_soy = contains_soy;
    }
    
    menuToString():string{
        var menuItemString;
        menuItemString = this.name + " " + 
            this.price.toString() + " " + 
            this.type + " " + 
            this.description +" " + 
            this.milkFreeFO + " " + 
            this.glutenFreeFO + " " + 
            this.eggFreeFO +" " + 
            this.contains_soy;
        return menuItemString;
    }
    
    menuToHTML():string{
        var menuItemString;
        switch(this.milkFreeFO){
                
        }
        menuItemString = "<div class=\"menuItem dish\">" + this.name + " " + 
            this.price.toString() + "<br>" + 
            this.description +" " + 
            this.milkFreeFO + " " + 
            this.glutenFreeFO + " " + 
            this.eggFreeFO +" " + 
            this.contains_soy;

        menuItemString += create_add_button_html(this.name, this.price);
        menuItemString += "</div>";
        return menuItemString;
    }
    
    checkMilkFO(is_milk_free: string):FoodOption{
        if(is_milk_free === "ja"){
            return FoodOption.Yes;
        }else if(is_milk_free === "nej"){
            return FoodOption.No;
        }else if(is_milk_free === "mojligtvis"){
            return FoodOption.Possible;
        }
        console.log(this.name + ": error in milk free check");
        return FoodOption.Error;
    }
    checkGlutenFO(is_gluten_free: string):FoodOption{
        if(is_gluten_free === "ja"){
            return FoodOption.Yes;
        }else if(is_gluten_free === "nej"){
            return FoodOption.No;
        }else if(is_gluten_free === "mojligtvis"){
            return FoodOption.Possible;
        }
        console.log(this.name + ": error in gluten free check");
        return FoodOption.Error;
    }
    checkEggFO(is_egg_free: string):FoodOption{
        if(is_egg_free === "ja"){
            return FoodOption.Yes;
        }else if(is_egg_free === "nej"){
            return FoodOption.No;
        }else if(is_egg_free === "mojligtvis"){
            return FoodOption.Possible;
        }
        console.log(this.name + ": error in egg free check");
        return FoodOption.Error;
    }
}
