package paymentserver;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.net.InetSocketAddress;
import java.util.*;
import java.io.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

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

public class Program {
	public static void main(String[] prefixes) {
		HttpServer server;
		ArrayList<Client> list = new ArrayList();

		String hostname;

		if(prefixes.length > 0)
			hostname = prefixes[0];
		else
			hostname = "127.0.0.1";


		ThreadPoolExecutor threadPoolExecutor = (ThreadPoolExecutor) Executors.newFixedThreadPool(10);
		try {
			server = HttpServer.create(new InetSocketAddress(hostname, 9002), 10);
			server.setExecutor(threadPoolExecutor);
			server.createContext("/", new MyHttpHandler(list));
		} catch (Exception e) {
			System.out.println("failed to create server");
			return;
		}

		DummySwishRequest.callback_url = "http://localhost:9002";

		server.start();
	}

	private static class MyHttpHandler implements HttpHandler {

		private ArrayList<Client> list;

		public MyHttpHandler(ArrayList<Client> list)
		{
			this.list = list;
		}

		@Override
		public void handle(HttpExchange httpExchange) throws IOException {
			System.out.println("hello");
			if ("POST".equals(httpExchange.getRequestMethod())) { // Webapp Always send POST request
				handleClientRequest(httpExchange);
			} else if ("PUT".equals(httpExchange.getRequestMethod())) { // Swish Always sends PUT request
				handleSwishRequest(httpExchange);
			}

			// remove done clients
			for(Client c : list)
			{
				if (c.getIsDone())
					list.remove(c);
			}
		}

		private void handleClientRequest(HttpExchange http_exchange)
		{
		    // the message should always be xml
			InputStream reader = http_exchange.getRequestBody();
			Document document;
			System.out.println("client");

			//InputStreamReader i = new InputStreamReader(reader);
			//Scanner s = new Scanner(i).useDelimiter("\\A");
			//String result = s.hasNext() ? s.next() : "";

            try
			{
				DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
				DocumentBuilder builder = factory.newDocumentBuilder();
				document = builder.parse(reader);
			} catch (Exception e) {

				e.printStackTrace();
				return;
			}


			if (document.getElementsByTagName("order").getLength() > 0) {
				// receive order
				// stage 1
                try
				{
					Client client = new Client(new WebbappResponse(http_exchange), new Order(document));
					list.add(client);

					client.SendSwishRequest();
					System.out.println("New client");
				}
                catch (Exception e)
				{
					e.printStackTrace();
				}
			} else if (document.getElementsByTagName("client").getLength() > 0) {
				// receieve second message from webapp
				// stage 5
				System.out.println("previous client");

				// get client id from msg
				String id = document.getElementsByTagName("id").item(0).getTextContent();

				// already existing client
				for (Client c : list) {
					if (c.getId().equals(id)) {
						System.out.println("Hittade en annan klient");
						c.setSecondResponse(new WebbappResponse(http_exchange));
					}
				}
			}
		}

		private void handleSwishRequest(HttpExchange http_exchange)
		{
			System.out.println("swish");
			// receive callback from swish
			// stage 5
			System.out.println("Swish callback");

			// json parsing
			JSONObject jo;
			String token;
			try
			{
				InputStreamReader reader = new InputStreamReader(http_exchange.getRequestBody());
				jo = (JSONObject) new JSONParser().parse(reader);
				token = jo.get("token").toString();
			} catch (ParseException e) {
				e.printStackTrace();
				return;
			} catch (IOException e) {
				e.printStackTrace();
				return;
			}

			for (Client c : list) {
				if (c.getToken().equals(token)) {
					System.out.println("create swish callback");
					try
					{
						c.SwishCallback(new DummySwishCallback(jo));
					}
					catch (Exception e)
					{
						e.printStackTrace();
					}
					System.out.println(c.getIsDone());
				}
			}
		}
	}
}