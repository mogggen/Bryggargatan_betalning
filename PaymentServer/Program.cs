using System.Collections.Generic;
using System.Net.Sockets;
using System;
using System.Linq;

namespace PaymentServer
{
    class Program
    {
        static void Main(string[] args)
        {
            bool on = true;
            while (on)
            {
                //  1. Ta emot betalningsförfrågningar från klienter
                //      lagra betalningsförfrågningarna
                Queue<Socket> MySocketQueue = new Queue<Socket>();

                //adds a new socket if neccessery
                Socket NewSocket;
                if (MySocketQueue.Last().Connected)
                {
                    NewSocket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    MySocketQueue.Enqueue(NewSocket);
                }

                //  2. Skapa payment request (swish api)
                //  3. Ta emot bekräftelse från swish
                //  4. Skicka till webbappen att öppna Swish med mottagen payment request token
                //  5. Väntar på en callback/bekräftelse från Swish.
                //  6. Skicka bekräftelse till webapp och köket.

                MySocketQueue.Dequeue();
            }
        }
    }
}
