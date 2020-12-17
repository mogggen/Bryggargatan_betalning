package paymentserver;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class DummySwishRequest
{
	private float amount;
	private String phone_number;

	public static String callback_url;

	public DummySwishRequest(float amount, String phone_number)
	{
		this.amount = amount;
		this.phone_number = phone_number;
	}

	private String CreateMsgString()
	{
		StringBuilder payload_sb = new StringBuilder(50);

		payload_sb.append("{\"callbackUrl\":\"" + callback_url + "\",\"payeeAlias\":\"");
		payload_sb.append(phone_number);
		payload_sb.append("\",\"amount\":");
		payload_sb.append(String.valueOf(amount));
		payload_sb.append(",\"currency\":\"SEK\"}");

		return payload_sb.toString();
	}

	public final Result<String> Send()
	{
		HttpClient client = HttpClient.newHttpClient();
		HttpRequest req_msg = HttpRequest.newBuilder()
				.uri(URI.create("http://localhost:9001"))
				.header("Content-Type", "application/json")
				.PUT(HttpRequest.BodyPublishers.ofString(CreateMsgString()))
				.build();

		String token;
		HttpResponse<String> response = null;
		try
		{
			response = client.send(req_msg, HttpResponse.BodyHandlers.ofString());


			System.out.println("Received payment token");

			// json parsing
            JSONObject jo = (JSONObject) new JSONParser().parse(response.body());
            token = jo.get("PaymentRequestToken").toString();
		}
		catch (InterruptedException | IOException | ParseException e)
		{
			return Result.Failure(getErrorMsg(response));
		}
		return Result.Success(token);
	}

	private String getErrorMsg(HttpResponse<String> response)
	{
		if (response != null)
		{
			int status_code;
			status_code = response.statusCode();

			switch (status_code)
			{
				case 422: // 422
				{
						try
						{
							JSONObject jo = (JSONObject) new JSONParser().parse(response.body());
							String m = jo.get("errorCode").toString();
							m += jo.get("errorMessage").toString();
							return m;
						}
						catch (ParseException e)
						{
							return "Corrupt message";
						}
				}

				case 400:
					return "400 Payment request malformed";
				case 401:
					return "401 Authentication Problem";
				case 403:
					return "403 payeeAlias not the same as merchant swish number";
				case 415:
					return "415 Content is not \"application/json\"";
				case 500:
					return "500 Internal swish error";
			}
		}

		return "Failed to read message";
	}

}