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
    
    public partial class Mensaje
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Mensaje()
        {
            this.Invitado = new HashSet<Invitado>();
            this.Invitado1 = new HashSet<Invitado>();
            this.Postulante = new HashSet<Postulante>();
        }
    
        public int Id { get; set; }
        public System.DateTime FechaRegistro { get; set; }
        public string Asunto { get; set; }
        public string Texto { get; set; }
        public string Estado { get; set; }
        public string Intermediario { get; set; }
        public string Emisor { get; set; }
        public string Destinatario { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Invitado> Invitado { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Invitado> Invitado1 { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Postulante> Postulante { get; set; }
    }
}