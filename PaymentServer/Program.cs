using System.IO;
using System;
using System.Collections.Generic;
using System.Net;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net.Http;

namespace PaymentServer
{
    class Client
    {
        public static int globId = 1;
        public string id;
        HttpListenerContext context;
        string order;
        HttpListenerResponse response;

        public Client(HttpListenerContext context, string order)
        {
            this.context = context;
            globId++;
            id = globId.ToString();
        }

        public void Send(string val)
        {
            response = context.Response;
            response.AppendHeader("Access-Control-Allow-Origin", "*");
            Stream output = response.OutputStream;
            output.Write(Encoding.UTF8.GetBytes(val));
			output.Dispose();

            //send
            response.Close();
        }

        public void setContext(HttpListenerContext context)
        {
            this.context = context;
        }
    };

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
            Queue<Client> list = new Queue<Client>();
            while (true)
            {                
                listener.Start();

                HttpListenerContext context = listener.GetContext(); // Note: The GetContext method blocks while waiting for a request.
                HttpListenerRequest request = context.Request;

                Stream input = request.InputStream;

                byte[] buf = new byte[2048];
                _ = input.Read(buf, 0, buf.Length);
                input.Dispose();
                Console.WriteLine(Encoding.UTF8.GetString(buf));

                bool lagra = true;
                foreach (Client c in list)
                {
                    if (c.id.Substring(0,1) == Encoding.UTF8.GetString(buf).Substring(0, 1))
                    {
                        Console.WriteLine("Hittade en annan klient");
                        c.setContext(context);
                        c.Send($"Hittade dig {c.id}");
                        lagra = false;
                    }
                }
                if (lagra)
                {
                    Client client = new Client(context, Encoding.UTF8.GetString(buf));
                    client.Send(client.id);
                    list.Enqueue(client);

                    Console.WriteLine("faktiskt fungerar");
                    SendDummySwishRequest();
                }

            }

            //  1. Ta emot betalningsförfrågningar från klienter
            //  1.1  lagra betalningsförfrågningarna
            //  2. Skapa payment request (swish api)
            //  3. Ta emot bekräftelse från swish
            //  4. Skicka till webbappen att öppna Swish med mottagen payment request token
            //  5. Väntar på en callback/bekräftelse från Swish.
            //  6. Skicka bekräftelse till webapp och köket.
        }
        static async void SendDummySwishRequest()
        {
            HttpClient client = new HttpClient();
            HttpRequestMessage req_msg = new HttpRequestMessage(HttpMethod.Put, "http://localhost:9001");

            IPAddress[] myIPs = Dns.GetHostAddresses(Dns.GetHostName());
            string myIP = myIPs[1].ToString();
			Console.WriteLine("myIp: " + myIP);
            req_msg.Content = new ByteArrayContent(Encoding.ASCII.GetBytes(myIP));
            try
            {
                HttpResponseMessage msg = await client.SendAsync(req_msg);
                msg.EnsureSuccessStatusCode();
                string msgBody = await msg.Content.ReadAsStringAsync();
                Console.WriteLine(msgBody);
            }
            catch (Exception)
            {

                throw;
            }
        }
    }
}
