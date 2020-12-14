package paymentserver;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;

public class WebbappResponse
{
	private HttpExchange http_exchange;

	public WebbappResponse(HttpExchange http_exchange)
	{
		this.http_exchange = http_exchange;
	}

	public final void send(String msg)
	{
	    try
		{
			OutputStreamWriter output = new OutputStreamWriter(http_exchange.getResponseBody());
			output.write(msg);


			Headers h = http_exchange.getResponseHeaders();
			h.clear();
			h.add("Access-Control-Allow-Origin", "*");
			h.add("Access-Control-Allow-Methods", "PUT,POST,GET,OPTIONS,DELETE");

			http_exchange.sendResponseHeaders(200, msg.length());

			output.flush();
			output.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}