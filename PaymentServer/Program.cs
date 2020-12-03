using System.IO;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using System.Xml;

namespace PaymentServer
{

	//  1. Ta emot betalningsförfrågningar från klienter
	//  2. Skapa payment request (swish api)
	//  3. Ta emot bekräftelse från swish
	//  4. Skicka till webbappen att öppna Swish med mottagen payment request token (first response)
	//  5. Väntar på en callback/bekräftelse från Swish och andra meddelandet från webbappen.
	//  6. Skicka bekräftelse till webapp och köket. (second response)
    //
    //  stage      WebApp          Server          Swish
    //    1            ---------->                              
    //    2                             --------->
    //    3                             <---------
    //    4            <----------
    //    5            ---------->      <--------- 
    //    6            <----------
    //       









    class Program
    {
        static void Main(string[] prefixes)
        {
            if (!HttpListener.IsSupported)
            {
                Console.WriteLine("Windows XP SP2 or Server 2003 is required to use the HttpListener class.");
                return;
            }

            if (prefixes == null || prefixes.Length == 0)
                throw new ArgumentException("ArgumentError: No prefixes given as an argument in Main().");

            HttpListener listener = new HttpListener();
            
            foreach (string s in prefixes)
                listener.Prefixes.Add(s);
            List<Client> list = new List<Client>();
            while (true)
            {                
                listener.Start();

                HttpListenerContext context = listener.GetContext(); // Note: The GetContext method blocks while waiting for a request.
                HttpListenerRequest request = context.Request;

                Stream input = request.InputStream;
                StreamReader sr = new StreamReader(input);
                string msg = sr.ReadToEnd();

                if (msg.Substring(0, 7) == "<order>")
                {
                    // receive order 
                    // stage 1
                    Client client = new Client(new WebbappResponse(context.Response), msg);
                    list.Add(client);

                    client.SendSwishRequest();
                    Console.WriteLine("New client");
                }
                else if (msg.Substring(0, 8) == "<client>")
                {
                    // receieve second message from webapp
                    // stage 5


                    // get client id from msg
                    XmlDocument xdoc = new XmlDocument();
                    xdoc.LoadXml(msg);
                    var client_id = xdoc.GetElementsByTagName("id");
                    string id = client_id[0].InnerText;

                    // already existing client
                    foreach (Client c in list)
                    {
                        if (c.Id == id)
                        {
                            Console.WriteLine("Hittade en annan klient");
                            c.setSecondResponse(new WebbappResponse(context.Response));
                        }
                    }
                }
                else if (msg != "")
                {
                    // receive callback from swish
                    // stage 5
                    Console.WriteLine("Swish callback");

					// json parsing
					JsonDocument jd = JsonDocument.Parse(msg);
					string token = jd.RootElement.GetProperty("token").GetString();

                    foreach (Client c in list)
                    {
                        if (c.Token == token)
                        {
                            c.SwishCallback(new DummySwishCallback(msg));
                        }
                    }
                }

                // cleanup client objects
                List<Client> remove_list = new List<Client>();
                foreach (Client c in list)
                    if (c.IsDone)
                        remove_list.Add(c);
                foreach (Client c in remove_list)
                    list.Remove(c);
                    
            }
        }
    }
}
