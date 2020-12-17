package paymentserver;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.mail.Message;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.*;
import java.util.Properties;

public class EmailSender
{
	static EmailSender instance;

	private String email_addr;
	private String password;

	private EmailSender() throws IOException
	{
		File file = new File("email_credentials.txt");

		BufferedReader reader = new BufferedReader(new FileReader(file));

		String s;
		s = reader.readLine();
		if(s != null)
			email_addr = s;
		else throw new IOException("Credentials file doesn't have email address.");

		s = reader.readLine();
		if(s != null)
			password = s;
		else throw new IOException("Credentials file doesn't have password.");

		System.out.println(email_addr);
		System.out.println(password);
	}

	public static boolean Instantiate()
	{
	    try
		{
			instance = new EmailSender();
			return true;
		}
	    catch (IOException e)
		{
			System.out.println(e.getMessage());
			return false;
		}
	}

	public static void SendEmail(String recipient, String subject, String msg)
	{
		try
		{
			Properties prop = System.getProperties();
			prop.put("mail.smtp.host", "smtp.gmail.com");
			prop.put("mail.smtp.socketFactory.port", "465");
			prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");

			prop.put("mail.smtp.auth", "true");
			prop.put("mail.smtp.port", "465");

			Session session = Session.getDefaultInstance(prop, new javax.mail.Authenticator() {
				@Override
				protected PasswordAuthentication getPasswordAuthentication() {
				    return new PasswordAuthentication(instance.email_addr, instance.password);
				}
			});

			MimeMessage message = new MimeMessage(session);
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipient));
			message.setSubject(subject);
			message.setDataHandler(new DataHandler(new HTMLDataSource(msg)));

			Transport.send(message);

			System.out.println("Send Email");
		}
		catch (Exception e)
		{
		    e.printStackTrace();
		}
	}

	public static void SendEmailToKitchen(String subject, String msg)
	{
		SendEmail(instance.email_addr, subject, msg);
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