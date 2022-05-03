using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Security.Claims;
using Microsoft.Owin.Host.SystemWeb;
using BolsaDeTrabajo.Models;
//using System.Data;
//using System.Data.Entity;
//using System.Net;
//using System.Collections.ObjectModel;

namespace BolsaDeTrabajo.Controllers
{
    public class InicioController : Controller
    {
        // GET: Inicio
        private UPDS_BDTEntities db = new UPDS_BDTEntities();

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Index()
        {
            //string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            //var url2 = new Uri(Request.Url.AbsoluteUri);
            //var url1 = url2.Scheme + "://" + url2.Host + "/";
            EmpleoC emp = new EmpleoC();
            emp.ActualizarEstadosEmpleos();
            ViewBag.tCategoria = db.CategoriaBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            //ViewBag.tDepartamentos = db..ToList();
            return View();
        }
        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult IndexCurriculums()
        {
            EmpleoC emp = new EmpleoC();
            emp.ActualizarEstadosEmpleos();
            ViewBag.tCarreras = db.CarreraBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            return View();
        }
    }
}