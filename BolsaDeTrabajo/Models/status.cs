using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class status
    {
        private int tipo;
        private string msj;
        private string rolUsuario;
        public int Tipo { get => tipo; set => tipo = value; }
        public string Msj { get => msj; set => msj = value; }
        public string RolUsuario { get => rolUsuario; set => rolUsuario = value; }
    }
}