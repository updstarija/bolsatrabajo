using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class AdministradorC
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string TipoDeDocumento { get; set; }
        public string NroDocumento { get; set; }
        public string FechaNacimiento { get; set; }
        public string FechaNacimientoDate { get; set; }
        public string Sexo { get; set; }
        public string Direccion { get; set; }
        public string Profesion { get; set; }
        public PerfilC Perfil { get; set; }

        public AdministradorC CargarAdministradorC(Administrador obj)
        {
            AdministradorC admin = new AdministradorC();
            admin.Id = obj.Id;
            admin.Nombre = obj.Nombre;
            admin.Apellido = obj.Apellido;
            admin.TipoDeDocumento = obj.TipoDeDocumento;
            admin.NroDocumento = obj.NroDocumento;
            admin.FechaNacimiento = obj.FechaNacimiento.ToString("dd/MM/yyyy");
            admin.FechaNacimientoDate = obj.FechaNacimiento.ToString("yyyy-MM-dd");
            admin.Sexo = obj.Sexo;
            admin.Direccion = obj.Direccion == null ? "" : obj.Direccion;
            admin.Profesion = obj.Profesion;
            admin.Perfil = new PerfilC();
            admin.Perfil = admin.Perfil.CargarPerfilC(obj.Perfil);
            return admin;
        }
    }
}