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

        public DummySwishRequest(float amount, string phone_number)
        {
            this.amount = amount;
            this.phone_number = phone_number;
        }

        private string CreateMsgString()
        {
            StringBuilder payload_sb = new StringBuilder("", 50);

            payload_sb.Append("{\"callbackUrl\":\"http://localhost:9002\",\"payeeAlias\":\"");
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
            try
            {
                HttpResponseMessage msg = await client.SendAsync(req_msg);
                msg.EnsureSuccessStatusCode();
                string msgBody = await msg.Content.ReadAsStringAsync();

                Console.WriteLine("Recieved payment token");

                // json parsing
                JsonDocument jd = JsonDocument.Parse(msgBody);
                token = jd.RootElement.GetProperty("token").GetString();
            }
            catch (Exception)
            {
                return Result<string>.Failure("");
            }
            return Result<string>.Success(token);
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
            return document.RootElement.GetProperty("status").GetString();
        }
    }

}
