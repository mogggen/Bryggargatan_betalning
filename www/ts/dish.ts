
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
            this.price.toString();
        menuItemString += create_add_button_html(this.name, this.price);
        menuItemString += "</div>";
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
        var menuItemString: string;
        menuItemString = "<div class=\"menuItem dish\">" + 
            "<p id=dishTitle>" + this.name.toUpperCase() + " " + "‧" + " " +
            this.price.toString() + "</p>" + 
            "<p id=desc>" + this.description + "</p>" +
            this.getFoodOptionsHTML();

        menuItemString += create_add_dish_button_html(this.name, this.price);
        menuItemString += "</div>";
        return menuItemString;
    }
    
    getFoodOptionsHTML():string{
        
        //Temporary string storage variable
        var FOString: string;
        
        //Checks if all FO are no, in that case returns an empty string since no further checking is necessary
        if(this.milkFreeFO === FoodOption.No && this.glutenFreeFO === FoodOption.No && this.eggFreeFO === FoodOption.No && this.contains_soy === false){
            return "";
        }
        
        //Set FOString to start of paragraph
        FOString = '<p id="FO">(';
        
        
        //Check which FO are Yes
        if(this.milkFreeFO === FoodOption.Yes){
            FOString += "MF";
        }
        if(this.glutenFreeFO === FoodOption.Yes){
            if(this.milkFreeFO === FoodOption.Yes){
                FOString += " ‧ ";
            }
            FOString += "GF";
            if(this.contains_soy === true){
                FOString += " " + "(innehåller soja)";
            }
        }
        if(this.eggFreeFO === FoodOption.Yes){
            if(this.milkFreeFO === FoodOption.Yes || this.glutenFreeFO === FoodOption.Yes){
                FOString += " ‧ ";
            }
            FOString += "ÄF";
        }
        
        
        //If no FO are Possible, bails out of the method and returns a finished string
        if(this.milkFreeFO !== FoodOption.Possible && this.glutenFreeFO !== FoodOption.Possible && this.eggFreeFO !== FoodOption.Possible && this.contains_soy === false){
            FOString += ")</p>";
            return FOString;
        }
        
        
        //Check which FO are Possible
        if(this.milkFreeFO === FoodOption.Yes || this.glutenFreeFO === FoodOption.Yes || this.eggFreeFO === FoodOption.Yes || this.contains_soy === true){
            FOString += ". ";
        }
        FOString += "Går att få ";
        if(this.milkFreeFO === FoodOption.Possible){
            FOString += "MF";
        }
        if(this.glutenFreeFO === FoodOption.Possible){
            if(this.milkFreeFO === FoodOption.Possible){
                FOString += ", ";
            }
            FOString += "GF";
        }
        if(this.eggFreeFO === FoodOption.Possible){
            if(this.milkFreeFO === FoodOption.Possible || this.glutenFreeFO === FoodOption.Possible){
                FOString += ", ";
            }
            FOString += "ÄF";
        }
        
        //Finishes the string with html p tag and returns it
        FOString += ")</p>";
        return FOString;
    }
    
    //Obsolete
    getMilkFreeHTML():string{
        switch(this.milkFreeFO){
            case FoodOption.Yes:{
                return "MF";
            }
            case FoodOption.No:{
                return "";
            }
            case FoodOption.Possible:{
                return "Går att få MF";
            }
            default:{
                return "";
            }
        }
    }
    //Obsolete
    getGlutenFreeHTML():string{
        switch(this.glutenFreeFO){
            case FoodOption.Yes:{
                return "GF";
            }
            case FoodOption.No:{
                return "";
            }
            case FoodOption.Possible:{
                return "Går att få GF";
            }
            default:{
                return "";
            }
        }
    }
    //Obsolete
    getEggFreeHTML():string{
        switch(this.eggFreeFO){
            case FoodOption.Yes:{
                return "ÄF";
            }
            case FoodOption.No:{
                return "";
            }
            case FoodOption.Possible:{
                return "Går att få ÄF";
            }
            default:{
                return "";
            }
        }
    }
    //Obsolete
    getSoyHTML():string{
        if(this.contains_soy){
            return "(innehåller soja)";
        }
        return "";
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
