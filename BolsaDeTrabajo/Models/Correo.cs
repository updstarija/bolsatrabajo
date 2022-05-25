using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class Correo
    {
        MailMessage correos = new MailMessage();
        SmtpClient envios = new SmtpClient();

        public bool enviarCorreo(string mensaje, string asunto, string destinatario, string ruta, string rutaReporte)
        {
            string emisor = "alejandro.echenique@upds.edu.bo";
            string password = "P@$$w0rd11";
            var exito = true;
            try
            {
                correos.To.Clear();
                correos.Body = "";
                correos.Subject = "";
                correos.Body = mensaje;
                correos.BodyEncoding = System.Text.Encoding.UTF8;
                correos.Subject = asunto;
                correos.IsBodyHtml = true;
                correos.To.Add(destinatario.Trim());

                if (ruta.Equals("") == false)
                {
                    System.Net.Mail.Attachment archivo = new System.Net.Mail.Attachment(ruta);
                    correos.Attachments.Add(archivo);
                }

                if (rutaReporte.Equals("") == false)
                {
                    System.Net.Mail.Attachment archivo2 = new System.Net.Mail.Attachment(rutaReporte);
                    correos.Attachments.Add(archivo2);
                }

                correos.From = new MailAddress(emisor);
                envios.Credentials = new NetworkCredential(emisor, password);

                //Datos importantes no modificables para tener acceso a las cuentas

                /*envios.Host = "smtp.gmail.com";
                envios.Port = 587;
                envios.EnableSsl = true;*/

                envios.Host = "smtp.office365.com";
                envios.Port = 587;
                envios.EnableSsl = true;

                Thread email = new Thread(delegate ()
                {
                    try
                    {
                        envios.Send(correos);
                    }
                    catch (Exception ex)
                    {
                        exito = false;
                    }
                });
                if (exito != false)
                {
                    email.IsBackground = true;
                    email.Start();
                }
                // MessageBox.Show("El mensaje fue enviado correctamente");
            }
            catch (Exception ex)
            {
                // MessageBox.Show(ex.Message, "No se envio el correo correctamente", MessageBoxButtons.OK, MessageBoxIcon.Error);
                exito = false;
            }
            return exito;
        }
    }
}