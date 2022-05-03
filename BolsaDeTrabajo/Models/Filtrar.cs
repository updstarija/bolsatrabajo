using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class Filtrar
    {
        public string[] ListaDepartamentos { get; set; }
        public string[] ListaCategorias { get; set; }
        public string[] ListaCarreras { get; set; }
        public string IdCarrera { get; set; }
        public int Pagina { get; set; }
        public string Categoria { get; set; }
        public string Departamento { get; set; }
        public int PublicadoDentroDe { get; set; }
        public string Contrato { get; set; }
        public string PalabraClave { get; set; }
    }
}