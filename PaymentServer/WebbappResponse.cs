using System;
using System.IO;
using System.Net;
using System.Collections.Generic;
using System.Text;

namespace PaymentServer
{
	class WebbappResponse
	{
		HttpListenerResponse http_response;

		public WebbappResponse(HttpListenerResponse response)
		{
			http_response = response;
		}

		public void send(string msg)
		{
			http_response.AppendHeader("Access-Control-Allow-Origin", "*");
			Stream output = http_response.OutputStream;
			output.Write(Encoding.UTF8.GetBytes(msg));
			output.Dispose();

			//send
			http_response.Close();
		}
	}
}
