function SendToServer(msg: string)
{
    const http = new XMLHttpRequest();
    const url = "http://130.240.54.164:9002";
    http.open("POST", url);
    http.send(msg);
    http.onreadystatechange = () =>  {
        console.log("response: " + http.response);
    };
}
