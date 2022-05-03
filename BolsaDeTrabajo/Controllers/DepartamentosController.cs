using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaDeTrabajo.Controllers
{
    public class DepartamentosController : Controller
    {
        // GET: Departamentos
        private UPDS_BDTEntities db = new UPDS_BDTEntities();

        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult getAll()
        {
            var departamentos = db.DepartamentoBDT.ToList();
            return Json(departamentos, JsonRequestBehavior.AllowGet);
        }
    }
}