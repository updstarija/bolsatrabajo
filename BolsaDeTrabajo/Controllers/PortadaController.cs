using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaDeTrabajo.Controllers
{
    public class PortadaController : Controller
    {
        // GET: Portada
        public ActionResult Index()
        {
            return View();
        }
    }
}