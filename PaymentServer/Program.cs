using System.IO;
using System;
using System.Net;
using System.Linq;
using System.Text;

namespace PaymentServer
{
    class Program
    {
        static void Main(string[] prefixes)
        {
            if (!HttpListener.IsSupported)
            {
                Console.WriteLine("Windows XP SP2 or Server 2003 is required to use the HttpListener class.");
                return;
            }
            // URI prefixes are required,
            // for example "http://contoso.com:8080/index/".
            if (prefixes == null || prefixes.Length == 0)
                throw new ArgumentException("prefixes");

            // Create a listener.
            HttpListener listener = new HttpListener();
            // Add the prefixes.
            foreach (string s in prefixes)
            {
                listener.Prefixes.Add(s);
            }
            listener.Start();
            Console.WriteLine("Listening...");
            // Note: The GetContext method blocks while waiting for a request.
            HttpListenerContext context = listener.GetContext();
            HttpListenerRequest request = context.Request;
            // Obtain a response object.
            HttpListenerResponse response = context.Response;
            // Construct a response.

            Stream input = request.InputStream;
            byte[] buf = new byte[512];
            int count = input.Read(buf, 0, buf.Length);


            Console.WriteLine(Encoding.Default.GetString(buf));

            Stream output = response.OutputStream;
            output.Write(Encoding.Default.GetBytes("HI!"));
            output.Flush();
            response.Close();

            // You must close the output stream.
            listener.Stop();
            //Queue<HttpListener> list = new Queue<HttpListener>();
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
        }
    }
}
