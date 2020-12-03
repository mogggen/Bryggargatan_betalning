using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;

namespace PaymentServer
{
	class Order
	{
		XmlDocument document;


		public Order(string order)
		{
			document = new XmlDocument();
			document.LoadXml(order);
		}

		public float get_price()
		{
			return float.Parse(document.GetElementsByTagName("price")[0].InnerText);	
		}

		public string get_phonenumber()
		{
			return document.GetElementsByTagName("phonenr")[0].InnerText;	
		}

	}
}
