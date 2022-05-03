using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class NotificacionC
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Tipo { get; set; }
        public string FechaRegistro { get; set; }
        public string FechaActualizacion { get; set; }
        public string Estado { get; set; }
        public string Emisor { get; set; }
        public string Receptor { get; set; }
        public Nullable<int> IdPostulante { get; set; }
        public Nullable<int> IdInvitado { get; set; }
        public Nullable<int> IdEmpresaReceptor { get; set; }
        public Nullable<int> IdCurriculum { get; set; }
        public virtual InvitadoC Invitado { get; set; }
        public virtual PostulanteC Postulante { get; set; }
        public virtual EmpresaC Empresa { get; set; }
        public virtual CurriculoC Curriculum { get; set; }
        public NotificacionC CargarNotificacion(Notificacion obj)
        {
            NotificacionC notificacion = new NotificacionC();
            notificacion.Id = obj.Id;
            notificacion.Titulo = obj.Titulo;
            notificacion.Descripcion = obj.Descripcion;
            notificacion.Tipo = obj.Tipo;
            notificacion.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            notificacion.FechaActualizacion = obj.FechaActualizacion.ToString("dd/MM/yyyy");
            notificacion.Estado = obj.Estado;
            notificacion.Emisor = obj.Emisor;
            notificacion.Receptor = obj.Receptor;
            notificacion.IdInvitado = obj.IdInvitado;
            notificacion.IdPostulante = obj.IdPostulante;
            notificacion.IdCurriculum = obj.IdCurriculum;
            if (obj.Invitado != null)
            {
                InvitadoC invi = new InvitadoC();
                invi = invi.CargarInvitado(obj.Invitado);
                notificacion.Invitado = invi;
            }
            if (obj.Postulante != null)
            {
                PostulanteC pos = new PostulanteC();
                pos = pos.getPostulanteC(obj.Postulante);
                notificacion.Postulante = pos;
            }
            if (obj.Empresa != null)
            {
                EmpresaC emp = new EmpresaC();
                emp = emp.CargarEmpresaC(obj.Empresa);
                notificacion.Empresa = emp;
            }
            if (obj.Curriculum !=null)
            {
                CurriculoC cur = new CurriculoC();
                cur = cur.CargarCurriculum(obj.Curriculum);
                notificacion.Curriculum = cur;
            }
            return notificacion;
        }
        public class ListaNotificaciones
        {
            public int NotificacionesPendientes { get; set; }
            public List<NotificacionC> Notificacion { get; set; }
            public List<NotificacionC> CargarLista(List<Notificacion> list)
            {
                List<NotificacionC> listaNotificacion = new List<NotificacionC>();
                foreach (var item in list)
                {
                    NotificacionC noti = new NotificacionC();
                    noti = noti.CargarNotificacion(item);
                    listaNotificacion.Add(noti);
                }
                return listaNotificacion;
            }
        }
    }
}