﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SAADSTJEntities : DbContext
    {
        public SAADSTJEntities()
            : base("name=SAADSTJEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Estudiante> Estudiante { get; set; }
        public virtual DbSet<Idioma> Idioma { get; set; }
        public virtual DbSet<InscripcionCarrera> InscripcionCarrera { get; set; }
        public virtual DbSet<Pais> Pais { get; set; }
        public virtual DbSet<Persona> Persona { get; set; }
        public virtual DbSet<PlanEstudio> PlanEstudio { get; set; }
        public virtual DbSet<Carrera> Carrera { get; set; }
        public virtual DbSet<Ciudad> Ciudad { get; set; }
        public virtual DbSet<Provincia> Provincia { get; set; }
        public virtual DbSet<Departamento> Departamento { get; set; }
    }
}