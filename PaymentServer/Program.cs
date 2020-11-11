using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace PaymentServer
{
    class Program
    {
        static void Main(string[] args)
        {
            if (!HttpListener.IsSupported)
            {
                Console.WriteLine("HttpListener not supported for current OS");
                return;
            }
            bool on = false;
            HttpListener httpListener = new HttpListener();
            httpListener.Start();
            Console.WriteLine("Listening...");
            
            HttpListenerContext context = httpListener.GetContext(); // blocking thread

            HttpListenerRequest request = context.Request;
            HttpListenerResponse response = context.Response;

            string responseString = "<HTML><BODY> Hello world!</BODY></HTML>";
            byte[] buffer = System.Text.Encoding.UTF8.GetBytes(responseString);
            
            response.ContentLength64 = buffer.Length;
            System.IO.Stream output = response.OutputStream;
            output.Write(buffer, 0, buffer.Length);
            
            output.Close();
            httpListener.Stop();
            //Queue<HttpListener> list = new Queue<HttpListener>();
            while (on)
            {
                //  1. Ta emot betalningsförfrågningar från klienter
                //      lagra betalningsförfrågningarna
                //  2. Skapa payment request (swish api)
                //  3. Ta emot bekräftelse från swish
                //  4. Skicka till webbappen att öppna Swish med mottagen payment request token
                //  5. Väntar på en callback/bekräftelse från Swish.
                //  6. Skicka bekräftelse till webapp och köket.
            }
        }
    }
}
