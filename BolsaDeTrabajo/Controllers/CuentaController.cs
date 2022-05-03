using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaDeTrabajo.Controllers
{
    public class CuentaController : Controller
    {
        // GET: Cuenta
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Candidato()
        {
            return View();
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Empresa()
        {
            return View();
        }
    }
}