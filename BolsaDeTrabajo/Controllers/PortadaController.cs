using BolsaDeTrabajo.Models;
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


        //public ActionResult EnviarMensaje(FormCollection form)
        //{
        //    string nombre = form["name"];
        //    string correo = form["email"];
        //    string asunto = form["subject"];
        //    string mensajeR = form["message"];
        //    Correo o = new Correo();
        //    o.enviarCorreo(mensajeR, asunto, us.Correo, "", "");
        //    return RedirectToAction("Index");
        //}
    }
}