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
    
    public partial class Postulante
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Postulante()
        {
            this.Notificacion = new HashSet<Notificacion>();
        }
    
        public int Id { get; set; }
        public System.DateTime FechaRegistro { get; set; }
        public Nullable<int> PretencionSalarial { get; set; }
        public string CartaPresentacion { get; set; }
        public int IdEmpleo { get; set; }
        public int IdCurriculum { get; set; }
        public string Estado { get; set; }
        public Nullable<int> IdMensaje { get; set; }
        public string Aceptado { get; set; }
    
        public virtual Curriculum Curriculum { get; set; }
        public virtual Empleo Empleo { get; set; }
        public virtual Mensaje Mensaje { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Notificacion> Notificacion { get; set; }
    }
}