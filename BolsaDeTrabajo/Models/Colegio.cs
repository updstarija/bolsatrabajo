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
    
    public partial class Colegio
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Colegio()
        {
            this.Educacion = new HashSet<Educacion>();
        }
    
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Nivel { get; set; }
        public string Pais { get; set; }
        public string EstadoRegion { get; set; }
        public string Ciudad { get; set; }
        public System.DateTime FechaInicio { get; set; }
        public System.DateTime FechaFin { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Educacion> Educacion { get; set; }
    }
}
