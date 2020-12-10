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

		public string get_tablenumber()
		{
			return document.GetElementsByTagName("tableid")[0].InnerText;
		}


		public string toHTML()
		{
			string html = "" +
				"<body>" +
					"<h1>Beställning från bord " + document.GetElementsByTagName("tableid")[0].InnerText + "</h1>";

			var items = document.GetElementsByTagName("item");
			for(int i=0; i<items.Count; i++)
			{

				html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">" + items[i].Attributes.GetNamedItem("name").InnerText;
				string notes = "";

				foreach (XmlNode child in items[i].ChildNodes)
				{
					if (child.Name == "gluten_free")
						html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Glutenfri</div>";
					else if (child.Name == "egg_free")
						html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Äggfri</div>";
					else if (child.Name == "milk_free")
						html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Mjölkfri</div>";
					else if (child.Name == "notes")
					{
						notes += "<p style=\"margin-left: 40px; font-size: 1.3em;\">";
						notes += child.InnerText;
						notes += "</p>";
					}
					else
						continue;
				}

				html += "</div>";

				html += notes;

			}

			html += "</body>";

			return html;
		}
	}
}
