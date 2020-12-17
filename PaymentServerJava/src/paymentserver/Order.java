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

		StringBuilder html = new StringBuilder();
		html.append("<body>" + "<h1>Bryggargatan </h1>" + "---------------------------------------------" + "<p>Kvitto: ").append(getReceiptCounter()).append("</p>").append("<p>Org Nr: 556657-3621</p>").append("<p>Datum: ").append(dateTime).append("</p>").append("<p>Kassör: SjälvBetalning via Bord ").append(get_table_number()).append("</p>").append("---------------------------------------------");


		NodeList items = document.getElementsByTagName("item");

		html.append("<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\"><div style=\"float: right;\">SEK</div></div>");

		for (int i = 0; i < items.getLength(); i++)
		{
			html.append("<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">").append(items.item(i).getAttributes().getNamedItem("name").getTextContent());

			Node node = items.item(i);
			for (int j = 0; j < node.getChildNodes().getLength(); j++)
			{
				switch (node.getChildNodes().item(j).getNodeName())
				{
					case "price":
						html.append("<div style=\"float: right; margin-left: 10px;\">").append(node.getChildNodes().item(j).getTextContent()).append(",00</div>");
						break;

					case "gluten_free":
						html.append("<div style=\"float: right; margin-left: 10px;\">Glutenfri</div>");
						break;
					case "egg_free":
						html.append("<div style=\"float: right; margin-left: 10px;\">Äggfri</div>");
						break;
					case "milk_free":
						html.append("<div style=\"float: right; margin-left: 10px;\">Mjölkfri</div>");
						break;
					default:
				}
			}

			html.append("</div>"); //closes order div
		}



		html.append("<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">ATT BETALA");
		html.append("<div style=\"float: right; margin-left: 10px;\">").append(String.format("%.2f", (double) get_total_price())).append("</div>");
		html.append("</div>");

		float moms = 0.12f;
		html.append("<div>");
		html.append("<div style=\"display: inline-block; font-weight: normal;\">Moms</div>");
		html.append("<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Belopp</div>");
		html.append("<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Netto</div>");
		html.append("<div style=\"display: inline-block; margin-left: 8%; font-weight: normal;\">Brutto</div>");
		html.append("</div>");

		html.append("<div>");
		html.append("<div style=\"display: inline-block; font-weight: normal;\">").append((int) (moms * 100)).append("%</div>");
		html.append("<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">").append(Math.round(get_total_price() * moms * 100.0) / 100.0).append("</div>");
		html.append("<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">").append(Math.round(get_total_price() * (1 - moms) * 100.0) / 100.0).append("</div>");
		html.append("<div style=\"display: inline-block; margin-left: 10%; font-weight: normal;\">").append(get_total_price()).append("</div>");
		html.append("</div>");

		html.append("</body>");

		return html.toString();
	}
}