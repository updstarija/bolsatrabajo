using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BolsaDeTrabajo.Models;

namespace BolsaDeTrabajo.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Portada()
        {
            return View();
        }

        public ActionResult Login()
        {
            return View();
        }

        public ActionResult SinAcceso()
        {
            if (User.Identity.IsAuthenticated)
            {
                UPDS_BDTEntities db = new UPDS_BDTEntities();
                if (db.Usuario.SingleOrDefault(x=> x.Correo == User.Identity.Name && x.Rol == "Administrador") != null)
                {
                    return RedirectToAction("Index", "Administradores");
                }
                else
                {
                    return View();
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}