function process_url_query()
{
    let query :string = location.search;
    console.log(query);

    let parameters :string[] = query.split(new RegExp("[?=&]"));
    console.log(parameters);

    for(let i=0; i<parameters.length; i++)
    {
        if(parameters[i] === "table" && i+1 < parameters.length)
        {
            let tableid :string = parameters[i+1];
            let table_input = (<HTMLInputElement>document.getElementById("tableidInput"));
            
            table_input.value = tableid;
            table_input.disabled = true;
        }

    }

}
