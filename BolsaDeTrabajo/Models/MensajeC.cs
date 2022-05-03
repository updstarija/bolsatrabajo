using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class MensajeC
    {
        public string Id { get; set; }
        public string FechaRegistro { get; set; }
        public string Asunto { get; set; }
        public string Texto { get; set; }
        public string Intermediario { get; set; }
        public string Emisor { get; set; }
        public string Destinatario { get; set; }
        public string Estado { get; set; }

        public MensajeC cargarMensaje(Mensaje obj)
        {
            MensajeC m = new MensajeC();
            m.Id = obj.Id.ToString();
            m.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            m.Asunto = obj.Asunto;
            m.Texto = obj.Texto;
            m.Intermediario = obj.Intermediario;
            m.Emisor = obj.Emisor;
            m.Destinatario = obj.Destinatario;
            m.Estado = obj.Estado;
            return m;
        }
    }
    public class ListMensajes
    {
        public List<MensajeC> Mensajes { get; set; }
        public string TotalRegistros { get; set; }
        public List<MensajeC> CargarLista(List<Mensaje> list)
        {
            List<MensajeC> listMensajes = new List<MensajeC>();
            foreach (var item in list)
            {
                MensajeC m = new MensajeC();
                m = m.cargarMensaje(item);
                listMensajes.Add(m);
            }
            return listMensajes;
        }
    }
}