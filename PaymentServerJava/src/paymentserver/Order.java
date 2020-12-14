package paymentserver;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.IOException;
import java.time.*;

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
public class Order
{
//C# TO JAVA CONVERTER WARNING: Unsigned integer types have no direct equivalent in Java:
//ORIGINAL LINE: private ulong reciptCounter;
	private long reciptCounter;
//C# TO JAVA CONVERTER WARNING: Unsigned integer types have no direct equivalent in Java:
//ORIGINAL LINE: public ulong getReciptCounter()
	public final long getReciptCounter()
	{
		return reciptCounter;
	}
//C# TO JAVA CONVERTER WARNING: Unsigned integer types have no direct equivalent in Java:
//ORIGINAL LINE: public void setReciptCounter(ulong value)
	public final void setReciptCounter(long value)
	{
		reciptCounter = value;
	}
	private Document document;

	public Order(Document doc)
	{
	    this.document = doc;
	}

	public final float get_price()
	{
		return Float.parseFloat(document.getElementsByTagName("price").item(0).getTextContent());
	}

	public final String get_phonenumber()
	{
		return document.getElementsByTagName("phonenr").item(0).getTextContent();
	}

	public final String get_tablenumber()
	{
		return document.getElementsByTagName("tableid").item(0).getTextContent();
	}

	public final String toRecipt()
	{
		//String tableid = document.GetElementsByTagName("tableid")[0].InnerText;
		String tableid = get_tablenumber();
		setReciptCounter(getReciptCounter() + 1);
		String html = "" + "<body>" + "<h1>Beställning från bord " + tableid + "</h1>" + "---------------------------------------------" + "<p>Kvitto: " + getReciptCounter() + "</p>" + "<p>Org Nr: 556657-3621</p>" + "<p>Datum: " /*TODO Fix this shit + LocalDateTime.UtcNow.ToLocalTime()*/ + "</p>" + "<p>Kassör: Bord" + tableid + "</p>" + "---------------------------------------------";

		NodeList items = document.getElementsByTagName("item");
		for (int i = 0; i < items.getLength(); i++)
		{
			html += "<div style=\"overflow: auto; width: 600px; margin: 20px; font-weight: bold; font-size: 1.7em; border: solid gray; border-width: 0 0 3px 0;\">" + items.item(i).getAttributes().getNamedItem("name").getTextContent();

			Node node = items.item(i);
			for (int j = 0; j < node.getChildNodes().getLength(); j++)
			{
				switch (node.getChildNodes().item(j).getNodeName())
				{
					case "price":
						get_price();
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
					default:
						continue;
				}
			}

			html += "</div>";
		}

		html += "</body>";

		return html;
	}

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
				if (children.item(j).getNodeName().equals("gluten_free"))
				{
					html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Glutenfri</div>";
				}
				else if (children.item(j).getNodeName().equals("egg_free"))
				{
					html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Äggfri</div>";
				}
				else if (children.item(j).getNodeName().equals("milk_free"))
				{
					html += "<div style=\"float: right; margin-left: 10px; font-weight: normal;\">Mjölkfri</div>";
				}
				else if (children.item(j).getNodeName().equals("notes"))
				{
					notes += "<p style=\"margin-left: 40px; font-size: 1.3em;\">";
					notes += children.item(j).getNodeValue();
					notes += "</p>";
				}
				else
				{
					continue;
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