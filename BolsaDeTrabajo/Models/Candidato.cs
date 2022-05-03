//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace BolsaDeTrabajo.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Candidato
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Candidato()
        {
            this.Curriculum = new HashSet<Curriculum>();
        }
    
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Nacionalidad { get; set; }
        public string TipoDeDocumento { get; set; }
        public string NroDocumento { get; set; }
        public System.DateTime FechaNacimiento { get; set; }
        public string Sexo { get; set; }
        public string Direccion { get; set; }
        public string EstadoCivil { get; set; }
        public string LicenciaVehiculo { get; set; }
        public string LicenciaMotocicleta { get; set; }
        public string ProfesionOcupacion { get; set; }
        public int IdEstudiante { get; set; }
    
        public virtual Perfil Perfil { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Curriculum> Curriculum { get; set; }
    }
}