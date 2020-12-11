using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Text.Json;

namespace PaymentServer
{
    class Client
    {
        private static int globId = 1;

        private string id;
        private string token;

        Order order;

        private string second_response_send_msg;
        private bool successfull_payment = false;

        bool is_done;

        WebbappResponse first_response;
        WebbappResponse second_response;


        public Client(WebbappResponse first_response, string order)
        {
            globId++;
            id = globId.ToString();

            this.order = new Order(order);
            this.first_response = first_response;

            this.is_done = false;

        }

        public async void SendSwishRequest()
        {
            // send swish request 
            // stage 2
            DummySwishRequest swish_request = new DummySwishRequest(order.get_price(), order.get_phonenumber());

            Result<string> token = await swish_request.Send();

            // receive swish response
            // stage 3
            if (token.Success())
            {
                this.token = token.Value;

                // send first response
                // stage 4
                first_response.send("<client status=\"true\"><id>" + id + "</id><token>" + token.Value + "</token></client>\n");
            }
            else
            {
                // ERROR
                first_response.send("<client status=\"false\"><errormsg>" + token.Value + "</errormsg></client>\n");
                is_done = true;
            }
        }

        public void SwishCallback(DummySwishCallback callback)
        {
            string status = callback.get_status();

            string send_msg = "<status>" + status + "</status>";

			second_response_send_msg = send_msg;

            if (status == "PAID")
                successfull_payment = true;
            else
                successfull_payment = false;

            // the second response might not have been set at this moment
            if (second_response != null)
                payment_done();
        }

        public void setSecondResponse(WebbappResponse response)
        {
            this.second_response = response;

            // the swish callback might already have arrived
            if (second_response_send_msg != null)
                payment_done();
        }

        private void payment_done()
        {
            // stage 6
			second_response.send(second_response_send_msg);

            if (successfull_payment)
            {
				EmailSender.SendEmail("Bord " + this.order.get_tablenumber(), this.order.toHTML());
            }

            is_done = true;
        }


        public string Id
        {
            get { return id; }
		}
        public string Token
        {
            get { return token; }
		}
        public bool IsDone
        {
            get { return is_done; }
        }

	}
}
