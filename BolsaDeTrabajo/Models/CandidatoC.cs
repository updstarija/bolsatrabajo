using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class CandidatoC
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Nacionalidad { get; set; }
        public string TipoDeDocumento { get; set; }
        public string NroDocumento { get; set; }
        public string FechaNacimiento { get; set; }
        public string Sexo { get; set; }
        public string Direccion { get; set; }
        public string EstadoCivil { get; set; }
        public string LicenciaVehiculo { get; set; }
        public string LicenciaMotocicleta { get; set; }
        public string ProfesionOcupacion { get; set; }
        public int IdEstudiante { get; set; }
        public PerfilC perfil { get; set; }
        public CandidatoC cargarCandidato(Candidato obj) {

            CandidatoC can = new CandidatoC();
            can.Id = obj.Id.ToString();
            can.Nombre = obj.Nombre;
            can.Apellido = obj.Apellido;
            can.Nacionalidad = obj.Nacionalidad;
            can.TipoDeDocumento = obj.TipoDeDocumento;
            can.NroDocumento = obj.NroDocumento;
            can.FechaNacimiento = obj.FechaNacimiento.ToString("dd/MM/yyyy");
            can.Sexo = obj.Sexo;
            can.Direccion = obj.Direccion;
            can.EstadoCivil = obj.EstadoCivil;
            can.LicenciaMotocicleta = obj.LicenciaMotocicleta;
            can.ProfesionOcupacion = obj.ProfesionOcupacion;
            can.IdEstudiante = obj.IdEstudiante;
            PerfilC per = new PerfilC();
            per = per.CargarPerfilC(obj.Perfil);
            can.perfil = per;
            return can;

        }
    }

}