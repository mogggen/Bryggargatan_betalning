package paymentserver;

public class Client
{
	private static int globId = 1;

	private String id;
	private String token;

	private Order order;

	private String second_response_send_msg = null;
	private boolean successful_payment = false;

	private boolean is_done;

	private WebbappResponse first_response;
	private WebbappResponse second_response = null;


	public Client(WebbappResponse first_response, Order order)
	{
		globId++;
		id = String.valueOf(globId);

		this.order = order;
		this.first_response = first_response;

		this.is_done = false;
	}

//C# TO JAVA CONVERTER TODO TASK: There is no equivalent in Java to the 'async' keyword:
//ORIGINAL LINE: public async void SendSwishRequest()
	public final void SendSwishRequest()
	{
		// send swish request
		// stage 2
		DummySwishRequest swish_request = new DummySwishRequest(order.get_total_price(), order.get_phone_number());

//C# TO JAVA CONVERTER TODO TASK: There is no equivalent to 'await' in Java:
		Result<String> token = swish_request.Send();

		// receive swish response
		// stage 3
		if (token.Success())
		{
			this.token = token.getValue();

			// send first response
			// stage 4
			first_response.send("<client status=\"true\"><id>" + id + "</id><token>" + token.getValue() + "</token></client>\n");
		}
		else
		{
			// ERROR
			first_response.send("<client status=\"false\"><errormsg>" + token.getValue() + "</errormsg></client>\n");
			is_done = true;
		}
	}

	public final void SwishCallback(DummySwishCallback callback)
	{
		String status = callback.get_status();

		String send_msg = "<status>" + status + "</status>";

		second_response_send_msg = send_msg;

		successful_payment = status.equals("PAID");

		// the second response might not have been set at this moment
		if (second_response != null)
		{
			payment_done();
		}
	}

	public final void setSecondResponse(WebbappResponse response)
	{
		this.second_response = response;

		// the swish callback might already have arrived
		if (second_response_send_msg != null)
		{
			payment_done();
		}
	}

	private void payment_done()
	{
		// stage 6
		System.out.println("Payment done");
		second_response.send(second_response_send_msg);

		if (successful_payment)
		{
			EmailSender.SendEmailToKitchen("Bord " + this.order.get_table_number(), this.order.toReceipt());
			if (!order.get_email().equals(""))
			{
				EmailSender.SendEmail(order.get_email(), "Kvitto från bord " + this.order.get_table_number(), this.order.toReceipt());
			}
		}

		is_done = true;
	}

	public final String getId()
	{
		return id;
	}
	public final String getToken()
	{
		return token;
	}
	public final boolean getIsDone()
	{
		return is_done;
	}
}
