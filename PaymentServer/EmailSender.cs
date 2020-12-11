using System;
using System.Collections.Generic;
using System.Text;
using System.Net;
using System.Net.Mail;

namespace PaymentServer
{
	class EmailSender
	{
		public static void SendEmail(string subject, string msg)
		{
			try
			{
				// TODO 
				// Create new email account for sending stuff
				// load logincredentials from file
				MailMessage message = new MailMessage();
				SmtpClient smtp = new SmtpClient();
				message.From = new MailAddress("maglii-9@student.ltu.se");
				message.To.Add(new MailAddress("mornym-9@student.ltu.se"));
				message.Subject = subject;
				message.IsBodyHtml = true;
				message.Body = msg;

				smtp.Port = 25;
				smtp.Host = "smtphost.ltu.se";
				smtp.EnableSsl = true;

				smtp.Send(message);
			}
			catch (Exception e)
			{
				throw e;
			}
		}
	}
}
