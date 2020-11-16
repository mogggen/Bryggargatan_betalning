using System.IO;
using System;
using System.Collections.Generic;
using System.Net;
using System.Linq;
using System.Text;
using System.Threading;

namespace PaymentServer
{
    

    class HTTPClient
    {
        public byte[] buf { get; set; }

        // Create a listener.
        HttpListenerContext context;
        HttpListenerRequest request;
        HttpListenerResponse response;

        public HTTPClient(HttpListener listener, string[] prefixes)
        {
            if (!HttpListener.IsSupported)
            {
                Console.WriteLine("Windows XP SP2 or Server 2003 is required to use the HttpListener class.");
                return;
            }
            if (prefixes == null || prefixes.Length == 0)
                throw new ArgumentException("ArgumentError: No prefixes given as an argument in Main().");
            else
            {
                foreach (string s in prefixes)
                    listener.Prefixes.Add(s);

                listener.Start();
                Console.WriteLine("Listening...");
                prefixes = null;
            }

            GetContext(listener);
            GetRequest();
            GetResponse();
            Recive();
            Send("Muffins");
        }

        public void GetContext(HttpListener listener)
        {
            context = listener.GetContext();
        }
        public void GetRequest()
        {
            // Note: The GetContext method blocks while waiting for a request.
            request = context.Request;
        }
        public void GetResponse()
        {
            response = context.Response;
        }

        public int Recive()
        {
            response.AppendHeader("Access-Control-Allow-Origin", "*");
            Stream input = request.InputStream;

            buf = new byte[1024];
            int count = input.Read(buf, 0, buf.Length);
            input.Dispose();
            return count;
        }

        public void Send(string val)
        {
            byte[] send = Encoding.UTF8.GetBytes(val);
            Stream output = response.OutputStream;
            output.Write(Encoding.UTF8.GetBytes(val));
            output.Dispose();

            //send
            response.Close();
        }
    };

    class Program
    {
        static void Main(string[] prefixes)
        {
            HttpListener listener = new HttpListener();

            if (true)
            {
                HTTPClient temp = new HTTPClient(listener, prefixes);

                Console.WriteLine(Encoding.UTF8.GetString(temp.buf));

            }
            Queue<HTTPClient> list = new Queue<HTTPClient>();
            while (true)
            {
                list.Enqueue(new HTTPClient(listener, prefixes));
                Thread.Sleep(1000);
                list.Dequeue();
            }

            while (false)
            {
                //  1. Ta emot betalningsförfrågningar från klienter
                //      lagra betalningsförfrågningarna
                //  2. Skapa payment request (swish api)
                //  3. Ta emot bekräftelse från swish
                //  4. Skicka till webbappen att öppna Swish med mottagen payment request token
                //  5. Väntar på en callback/bekräftelse från Swish.
                //  6. Skicka bekräftelse till webapp och köket.
            }

            list.Dequeue();
        }
    }
}
