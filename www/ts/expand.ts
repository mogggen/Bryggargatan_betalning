//Adds a holder and an expand div in HTML, the holder is there if 
// we want to remove the old expand div whenever opening a new one
function addNewExpandDivHolder(dish :Dish):string{
    let dish_index :number = menuItems.indexOf(dish);
    var expandHTML = 
    "<div class=\"expandDivHolder\" id=\"expandDivHolder"+dish_index+"\">"+
        "<div class=\"expandDiv\" id=\"expandDiv"+dish_index+"\">"+
            "<div class=\"expandCheckbox1\">"+
                "<input type=\"checkbox\" class=\"FOCheckBox"+dish_index+"\" id=\"MF\" name=\"MF\" value=\"MF\">"+
                "<label class=\"expandLabel\" for=\"MF\">Mjölkfri</label><br>"+
            "</div>"+
            "<div class=\"expandCheckbox2\">"+
                "<input type=\"checkbox\" class=\"FOCheckBox"+dish_index+"\" id=\"GF\" name=\"GF\" value=\"GF\">"+
                "<label class=\"expandLabel\" for=\"GF\">Glutenfri</label><br>"+
            "</div>"+
            "<div class=\"expandCheckbox3\">"+
                "<input type=\"checkbox\" class=\"FOCheckBox"+dish_index+"\" id=\"EF\" name=\"EF\" value=\"EF\">"+
                "<label class=\"expandLabel\" for=\"EF\">Äggfri</label>"+
            "</div>"+
        "</div>"+
    "</div>";
    return expandHTML;
}

//Toggles css classes on current expandDiv which add visibility: visible and height: 18% or so
function showExpandDiv(dish_index:number) :void{
    let expandDiv = document.getElementById("expandDiv"+dish_index);
    expandDiv.classList.toggle("visibility");
    expandDiv.classList.toggle("show");
}

//Toggles css classes on current expandDiv which in turn sets height to 0% and after a delay removes visibility
function hideExpandDiv(dish_index:number) :void{
    let expandDiv = document.getElementById("expandDiv"+dish_index);
    
    (async () => { 
        expandDiv.classList.toggle("show");

        await delay(645);
    
        expandDiv.classList.toggle("visibility");
    })();
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function preCheckBoxes(dish_index:number) :void{
    let dish :Dish = menuItems[dish_index] as Dish;
    let labels = document.getElementsByClassName("expandLabel");
    
    //Check the FO value of milk free on the current dish
    let mf = document.getElementsByName("MF");
    switch(dish.milkFreeFO){
        //If it is inherently milk free then user does not need to be able to interact with the box, also checks the box
        case FoodOption.Yes: {
            mf[dish_index].setAttribute("checked", "checked");
            mf[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3].classList.toggle("disabled");
            break;
        }
        //If it is inherently not milk free user does not need to be able to interact
        case FoodOption.No: {
            mf[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3].classList.toggle("disabled");
            break;
        }
        //If either way is possible then nothing needs to be changed because that's where the checkbox comes into play
        case FoodOption.Possible: {
            break;
        }
        default: {
            break;
        }
    }
    
    let gf = document.getElementsByName("GF");
    switch(dish.glutenFreeFO){
        case FoodOption.Yes: {
            gf[dish_index].setAttribute("checked", "checked");
            gf[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3 + 1].classList.toggle("disabled");
            break;
        }
        case FoodOption.No: {
            gf[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3 +1].classList.toggle("disabled");
            break;
        }
        case FoodOption.Possible: {
            break;
        }
        default: {
            break;
        }
    }
    
    let ef = document.getElementsByName("EF");
    switch(dish.eggFreeFO){
        case FoodOption.Yes: {
            ef[dish_index].setAttribute("checked", "checked");
            ef[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3 +2].classList.toggle("disabled");
            break;
        }
        case FoodOption.No: {
            ef[dish_index].setAttribute("disabled", "disabled");
            labels[dish_index*3 +2].classList.toggle("disabled");
            break;
        }
        case FoodOption.Possible: {
            break;
        }
        default: {
            break;
        }
    }
}