function SendToServer(msg: string)
{
    const http = new XMLHttpRequest();
    const url = "http://localhost:9002";
    http.open("POST", url);
    http.send(msg);
    http.onreadystatechange = () =>  {
        console.log("response: " + http.response);
    };
}
