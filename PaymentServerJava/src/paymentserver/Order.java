package paymentserver;

import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

public class Order
{
	private static long receiptCounter;
	public long getReceiptCounter()
	{
		return receiptCounter;
	}
	public void setReceiptCounter(long value)
	{
		receiptCounter = value;
	}
	private Document document;



	public Order(Document doc)
	{
	    this.document = doc;
	}

	public float get_total_price()
	{
		return Float.parseFloat(document.getElementsByTagName("total_price").item(0).getTextContent());
	}

	public String get_phone_number()
	{
		return document.getElementsByTagName("phonenr").item(0).getTextContent();
	}

	public String get_table_number()
	{
		return document.getElementsByTagName("tableid").item(0).getTextContent();
	}

	public String get_email()
	{
		return document.getElementsByTagName("email").item(0).getTextContent();
	}

	public String toReceipt()
	{
		DateTimeZone sweden = DateTimeZone.forID("Europe/Stockholm");
		DateTime now = DateTime.now(sweden);

		String dateTime = now.toString().split("T")[0] + " "
				+ (now.toString().split("T")[1]).split("\\.")[0];

		setReceiptCounter(getReceiptCounter() + 1);

		String html = "";
		html += "<body>" +
				"<h1>Bryggargatan </h1>" +
				"---------------------------------------------" +
				"<p>Kvitto: " +  getReceiptCounter() + "</p>" +
				"<p>Org Nr: 556657-3621</p>" +
				"<p>Datum: " + dateTime + "</p>" +
				"<p>Kassör: SjälvBetalning via Bord " + get_table_number() + "</p>" +
				"---------------------------------------------";


		NodeList items = document.getElementsByTagName("item");

		html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\"><div style=\"float: right;\">SEK</div></div>";

		for (int i = 0; i < items.getLength(); i++)
		{
			html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">" + items.item(i).getAttributes().getNamedItem("name").getTextContent();

			Node node = items.item(i);
			for (int j = 0; j < node.getChildNodes().getLength(); j++)
			{
				switch (node.getChildNodes().item(j).getNodeName())
				{
					case "price":
						html += "<div style=\"float: right; margin-left: 10px;\">" + node.getChildNodes().item(j).getTextContent() + ",00</div>";
						break;

					case "gluten_free":
						html += "<div style=\"float: right; margin-left: 10px;\">Glutenfri</div>";
						break;
					case "egg_free":
						html += "<div style=\"float: right; margin-left: 10px;\">Äggfri</div>";
						break;
					case "milk_free":
						html += "<div style=\"float: right; margin-left: 10px;\">Mjölkfri</div>";
						break;
					default:
				}
			}

			html += "</div>"; //closes order div
		}



		html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">ATT BETALA";
		html += "<div style=\"float: right; margin-left: 10px;\">" +  String.format("%.2f", (double)get_total_price()) + "</div>";
		html += "</div>";

		float moms = 0.12f;
		html += "<div>";
		html += "<div style=\"display: inline-block; font-weight: normal;\">Moms</div>";
		html += "<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Belopp</div>";
		html += "<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Netto</div>";
		html += "<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Brutto</div>";
		html += "</div>";

		html += "<div>";
		html += "<div style=\"display: inline-block; font-weight: normal;\">" + (int)(moms * 100) + "%</div>";
		html += "<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">" + Math.round(get_total_price() * moms * 100.0) / 100.0 + "</div>";
		html += "<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">" + Math.round(get_total_price() * (1 - moms) * 100.0) / 100.0 + "</div>";
		html += "<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">" + get_total_price() + "</div>";
		html += "</div>";

		html += "</body>";

		return html;
	}

	//TODO remove toHTML
	public final String toHTML()
	{
		String html = "" + "<body>" + "<h1>Beställning från bord " + document.getElementsByTagName("tableid").item(0).getTextContent() + "</h1>";

		NodeList items = document.getElementsByTagName("item");
		for (int i = 0; i < items.getLength(); i++)
		{

			html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">" + items.item(i).getAttributes().getNamedItem("name").getTextContent();
			String notes = "";

			NodeList children = items.item(i).getChildNodes();
			for (int j = 0; j < children.getLength(); j++)
			{
				switch (children.item(j).getNodeName()) {
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
						notes += children.item(j).getNodeValue();
						notes += "</p>";
						break;
					default:
				}
			}

			html += "</div>";

			html += notes;

		}

		html += "</body>";
		System.out.println(html);
		return html;
	}
}