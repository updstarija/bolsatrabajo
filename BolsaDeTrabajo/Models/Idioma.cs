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
    
    public partial class Idioma
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Nivel { get; set; }
        public string Lectura { get; set; }
        public string Escritura { get; set; }
        public int IdEducacion { get; set; }
    
        public virtual Educacion Educacion { get; set; }
    }
}