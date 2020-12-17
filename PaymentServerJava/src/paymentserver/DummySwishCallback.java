package paymentserver;

import org.json.simple.JSONObject;

public class DummySwishCallback
{
	private String status;

	public DummySwishCallback(JSONObject jo)
	{
		status = jo.get("status").toString();
	}

	public final String get_status()
	{
		// status can be:
		//  PAID
		//  CANCELED
		//  ERROR
		//  CREATED
		return status;
	}
}