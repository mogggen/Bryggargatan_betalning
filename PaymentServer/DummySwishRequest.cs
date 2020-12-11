using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace PaymentServer
{
	class DummySwishRequest
	{
        float amount;
        string phone_number;

        public static string callback_url;

        public DummySwishRequest(float amount, string phone_number)
        {
            this.amount = amount;
            this.phone_number = phone_number;
        }

        private string CreateMsgString()
        {
            StringBuilder payload_sb = new StringBuilder("", 50);

            payload_sb.Append("{\"callbackUrl\":\"" + callback_url + "\",\"payeeAlias\":\"");
            payload_sb.Append(phone_number);
            payload_sb.Append("\",\"amount\":");
            payload_sb.Append(amount.ToString());
            payload_sb.Append(",\"currency\":\"SEK\"}");

            return payload_sb.ToString();
        }

		public async Task<Result<string>> Send()
		{
            HttpClient client = new HttpClient();
            HttpRequestMessage req_msg = new HttpRequestMessage(HttpMethod.Put, "http://localhost:9001");

            string send_msg = CreateMsgString(); 
            req_msg.Content = new ByteArrayContent(Encoding.ASCII.GetBytes(send_msg));
            string token;
            HttpResponseMessage msg = null;
            try
            {
                msg = await client.SendAsync(req_msg);
                msg.EnsureSuccessStatusCode();

                string msgBody = await msg.Content.ReadAsStringAsync();

                Console.WriteLine("Recieved payment token");

                // json parsing
                JsonDocument jd = JsonDocument.Parse(msgBody);
                token = jd.RootElement.GetProperty("PaymentRequestToken").GetString();
            }
            catch (Exception)
            {
                return Result<string>.Failure(await getErrorMsg(msg));
            }
            return Result<string>.Success(token);
		}

        async Task<string> getErrorMsg(HttpResponseMessage msg)
        {
            if (msg != null)
            {
                HttpStatusCode status_code;
                status_code = msg.StatusCode;

				switch (status_code) 
				{
					case HttpStatusCode.UnprocessableEntity: // 422
						{
							try
							{
								JsonDocument jd = JsonDocument.Parse(await msg.Content.ReadAsStringAsync());
								string m = jd.RootElement.GetProperty("errorCode").GetString();
								m += ": " + jd.RootElement.GetProperty("errorMessage").GetString();
								//Console.WriteLine("swish failed: " + m);
								return m;
							}
							catch (JsonException)
							{
								return "Currupt message";
							}
						}

					case HttpStatusCode.BadRequest:
						return "400 Payment request malformed";
					case HttpStatusCode.Unauthorized:
						return "401 Authentication Problem";
					case HttpStatusCode.Forbidden:
						return "403 payeeAlias not the same as merchant swish number";
					case HttpStatusCode.UnsupportedMediaType:
						return "415 Content is not \"application/json\"";
					case HttpStatusCode.InternalServerError:
						return "500 Internal swish error";
				}
			}

            return "Failed to read message";
        }

	}

    class DummySwishCallback
    {
        JsonDocument document;

        public DummySwishCallback(string callback_msg)
        {
            document = JsonDocument.Parse(callback_msg);
        }

        public string get_status()
        {
            // status can be:
            //  PAID
            //  CANCELED
            //  ERROR
            //  CREATEAD
            return document.RootElement.GetProperty("status").GetString();
        }
    }
}
