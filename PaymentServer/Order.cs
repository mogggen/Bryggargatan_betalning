using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;

namespace PaymentServer
{
	/*
	kvitto behöver(enligt coop och Legend spelbutik AB):
	orginisationsnummer
	Datum
	Kassör
	Kvitto

	summering

	moms
	.
	%
	belopp
	exklusiv/Netto
	Inklusiv/Brutto
	.

	Enligt kvitto.org
	Enligt Bokföringslagen (5 kapitlet, 7 §) ska verifikationen eller kvittot innehålla uppgifter om:

	när kvittot sammanställts,
	när affärshändelsen inträffat,
	vad den avser,
	vilket belopp,
	vilken motpart,
	verifikationsnummer eller annan identifikation som hänvisar till den bokförda affärshändelsen.

	Vid ett köp brukar följande information finnas med på kvittot:
	Säljarens namn och adress
	Organisationsnummer
	Datum och klockslag
	Artikelnamn/tjänstens beteckning och antal (ev. m. tillhörande beskrivning eller begränsning)
	Belopp / pris
	Moms
	*/
	class Order
	{
		public ulong reciptCounter { get; set; }
		XmlDocument document;

		public Order(string order)
		{
			document = new XmlDocument();
			document.LoadXml(order);
		}

		public float get_total_price()
		{
			return float.Parse(document.GetElementsByTagName("total_price")[0].InnerText);
		}

		public string get_phonenumber()
		{
			return document.GetElementsByTagName("phonenr")[0].InnerText;
		}

		public string get_tablenumber()
		{
			return document.GetElementsByTagName("tableid")[0].InnerText;
		}

		public string get_email()
		{
			return document.GetElementsByTagName("email")[0].InnerText;
		}

		public string toRecipt()
		{
			reciptCounter++;
			string html = "" +
				"<body>" +
					"<h1>Beställning från bord " + get_tablenumber() + "</h1>" +
					"---------------------------------------------" +
					"<p>Kvitto: " + reciptCounter + "</p>" +
					"<p>Org Nr: 556657-3621</p>" +
					"<p>Datum: " + DateTime.UtcNow.ToLocalTime() + "</p>" +
					"<p>Kassör: SjälvBetalning via Bord " + get_tablenumber() + "</p>" +
					"---------------------------------------------";

			var items = document.GetElementsByTagName("item");
			foreach (XmlNode it in items)
			{
				html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">"
					+ it.Attributes.GetNamedItem("name").InnerText;

				foreach (XmlNode child in it.ChildNodes)
				{
                    switch (child.Name)
                    {
						case "price":
							html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">" + child.InnerText;
                            Console.WriteLine(child.InnerText);
							break;

                        case "gluten_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Glutenfri</div>";
                            break;
                        case "egg_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Äggfri</div>";
                            break;
                        case "milk_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Mjölkfri</div>";
                            break;

							case 
                        default:
                            continue;
                    }
                }

				html += "</div>";
			}

			html += "</body>";

			return html;
		}

		public string toHTML()
		{
			string html = "" +
				"<body>" +
					"<h1>Beställning från bord " + document.GetElementsByTagName("tableid")[0].InnerText + "</h1>";

			var items = document.GetElementsByTagName("item");
			for (int i = 0; i < items.Count; i++)
			{

				html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">" + items[i].Attributes.GetNamedItem("name").InnerText;
				string notes = "";

				foreach (XmlNode child in items[i].ChildNodes)
				{
                    switch (child.Name)
                    {
                        case "gluten_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Glutenfri</div>";
                            break;
                        case "egg_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Äggfri</div>";
                            break;
                        case "milk_free":
                            html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Mjölkfri</div>";
                            break;
                        case "notes":
                            notes += "<p style=\"margin-left: 40px; font-size: 1.3em;\">";
                            notes += child.InnerText;
                            notes += "</p>";
                            break;
                        default:
                            continue;
                    }
                }

				html += "</div>";

				html += notes;

			}

			html += "</body>";

			return html;
		}
	}
}
