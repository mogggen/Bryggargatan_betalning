package paymentserver;

import com.sun.mail.smtp.SMTPTransport;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Properties;
import javax.activation.DataHandler;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.activation.DataSource;

public class EmailSender
{
	public static void SendEmail(String subject, String msg)
	{
		try
		{
			// TODO 
			// Create new email account for sending stuff
			// load logincredentials from file
			//MailMessage message = new MailMessage();
			//SmtpClient smtp = new SmtpClient();
			//message.From = new MailAddress("maglii-9@student.ltu.se");
			//message.To.Add(new MailAddress("mornym-9@student.ltu.se"));
			//message.Subject = subject;
			//message.IsBodyHtml = true;
			//message.Body = msg;

			//smtp.Port = 25;
			//smtp.Host = "smtphost.ltu.se";
			//smtp.EnableSsl = true;

			//smtp.Send(message);

			Properties prop = System.getProperties();
			prop.setProperty("mail.smtp.host", "smtphost.ltu.se");
			prop.put("mail.smtp.auth", "true");
			prop.put("mail.smtp.port", "25");

			Session session = Session.getDefaultInstance(prop);

			MimeMessage message = new MimeMessage(session);
			message.setFrom(new InternetAddress("maglii-9@student.ltu.se"));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress("maglii-9@student.ltu.se"));
			message.setSubject(subject);
			message.setDataHandler(new DataHandler(new HTMLDataSource(msg)));

			SMTPTransport t = (SMTPTransport) session.getTransport("smtp");
			t.connect("smtphost.ltu.se", "maglii-9", "");
			t.sendMessage(message, message.getAllRecipients());
			System.out.println("Send Email");
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	}

	// Copy 'n' Paste
    // https://mkyong.com/java/java-how-to-send-email/
	static class HTMLDataSource implements DataSource {

		private String html;

		public HTMLDataSource(String htmlString) {
			html = htmlString;
		}

		@Override
		public InputStream getInputStream() throws IOException {
			if (html == null) throw new IOException("html message is null!");
			return new ByteArrayInputStream(html.getBytes());
		}

		@Override
		public OutputStream getOutputStream() throws IOException {
			throw new IOException("This DataHandler cannot write HTML");
		}

		@Override
		public String getContentType() {
			return "text/html";
		}

		@Override
		public String getName() {
			return "HTMLDataSource";
		}
	}
}