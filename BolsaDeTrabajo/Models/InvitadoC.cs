using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class InvitadoC
    {
        public int Id { get; set; }
        public int IdCurriculum { get; set; }
        public int IdEmpresa { get; set; }
        public Nullable<int> IdEmpleo { get; set; }
        public string FechaRegistro { get; set; }
        public string SueldoAproximado { get; set; }
        public string Carta { get; set; }
        public string Estado { get; set; }
        public string IdMensaje { get; set; }
        public CurriculoC Curriculum { get; set; }
        public Empleo Empleo { get; set; }
        public MensajeC Mensaje { get; set; }

        public InvitadoC CargarInvitado(Invitado obj)
        {
            InvitadoC invitado = new InvitadoC();
            invitado.Id = obj.Id;
            invitado.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            invitado.SueldoAproximado = obj.SueldoAproximado;
            invitado.Carta = obj.Carta;
            invitado.Estado = obj.Estado;
            invitado.IdEmpleo = obj.IdEmpleo;
            invitado.IdEmpresa = obj.IdEmpresa;
            invitado.IdCurriculum = obj.IdCurriculum;
            CurriculoC curri = new CurriculoC();
            curri = curri.CargarCurriculum(obj.Curriculum);
            invitado.Curriculum = curri;
            if (obj.Empleo != null)
            {
                EmpleoC emple = new EmpleoC();
                emple = emple.cargarEmpleoC(obj.Empleo);
            }
            if (obj.Mensaje1 != null)
            {
                invitado.IdMensaje = obj.IdMensaje.ToString();
                invitado.Mensaje = new MensajeC();
                invitado.Mensaje = invitado.Mensaje.cargarMensaje(obj.Mensaje1);
            }
            return invitado;
        }
    }
}