using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class PostulanteC
    {
        public int Id { get; set; }
        public string FechaRegistro { get; set; }
        public Nullable<int> PretencionSalarial { get; set; }
        public string CartaPresentacion { get; set; }
        public int IdEmpleo { get; set; }
        public int IdCurriculum { get; set; }
        public string IdMensaje { get; set; }
        public string Estado { get; set; }
        public string Aceptado { get; set; }
        public MensajeC Mensaje { get; set; }
        public CurriculoC Curriculum { get; set; }
        public EmpleoC Empleo { get; set; }

        public PostulanteC getPostulanteC(Postulante obj)
        {
            PostulanteC postulante = new PostulanteC();
            postulante.Id = obj.Id;
            postulante.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            postulante.PretencionSalarial = obj.PretencionSalarial;
            postulante.CartaPresentacion = obj.CartaPresentacion;
            postulante.IdEmpleo = obj.IdEmpleo;
            postulante.IdCurriculum = obj.IdCurriculum;
            postulante.Estado = obj.Estado;
            postulante.Aceptado = obj.Aceptado;
            CurriculoC curriculum = new CurriculoC();
            curriculum = curriculum.CargarCurriculum(obj.Curriculum);
            postulante.Curriculum = curriculum;
            EmpleoC empleo = new EmpleoC();
            empleo = empleo.cargarEmpleoC(obj.Empleo);
            postulante.Empleo = empleo;
            if (obj.IdMensaje != null)
            {
                postulante.IdMensaje = obj.IdMensaje.ToString();
                postulante.Mensaje = new MensajeC();
                postulante.Mensaje = postulante.Mensaje.cargarMensaje(obj.Mensaje);
            }
            return postulante;
        }
    }
    public class ListaPostulantes
    {
        public List<PostulanteC> Postulantes { get; set; }
        public int TotalRegistros { get; set; }
        public List<PostulanteC> CargarLista(List<Postulante> list)
        {
            List<PostulanteC> listaPostulantes = new List<PostulanteC>();
            foreach (var item in list)
            {
                PostulanteC p = new PostulanteC();
                p = p.getPostulanteC(item);
                listaPostulantes.Add(p);
            }
            return listaPostulantes;
        }
    }
}