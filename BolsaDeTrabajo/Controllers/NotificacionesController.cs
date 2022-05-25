using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static BolsaDeTrabajo.Models.NotificacionC;

namespace BolsaDeTrabajo.Controllers
{
    public class NotificacionesController : Controller
    {
        // GET: Notificaciones
        private UPDS_BDTEntities db = new UPDS_BDTEntities();
        public ActionResult Index()
        {
            return View();
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getNotificaciones()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ListaNotificaciones lista = new ListaNotificaciones();
            ua = ua.getUser(User);
            if (ua.Rol == "Candidato")
            {
                var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
                var noticaciones = db.Notificacion.Where(x => (x.Invitado.Curriculum.Candidato.Id == us.Id || x.Postulante.Curriculum.Candidato.Id == us.Id || x.Curriculum.IdCandidato == us.Id) && x.Receptor == "Candidato").OrderByDescending(x => x.FechaRegistro).Take(10).ToList();
                lista.Notificacion = lista.CargarLista(noticaciones);
                //var noticaciones2 = db.Notificacion.Where(x => x.Postulante.Curriculum.Candidato.Id == us.Id).OrderByDescending(x => x.FechaRegistro).ToList();
                //lista.Notificacion = lista.CargarLista(noticaciones2);
            }
            else if (ua.Rol == "Empresa")
            {
                var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
                var noticaciones = db.Notificacion.Where(x => (x.Postulante.Empleo.Empresa.Id == us.Id || x.Invitado.Empleo.Empresa.Id == us.Id || x.Invitado.Empresa.Id == us.Id || x.Empresa.Id == us.Id) && x.Receptor == "Empresa").OrderByDescending(x => x.FechaRegistro).Take(10).ToList();
                lista.Notificacion = lista.CargarLista(noticaciones);
            }
            lista.NotificacionesPendientes = lista.Notificacion.Where(x => x.Estado == "Pendiente").Count();
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult verNotificacion(int Id)
        {
            var notificacones = db.Notificacion.SingleOrDefault(x => x.Id == Id);
            Notificacion notficaciones = db.Notificacion.SingleOrDefault(x => x.Id == Id);
            notficaciones.Estado = "Visto";
            db.SaveChanges();
            if (notificacones.Receptor == "Candidato")
            {
                if (notificacones.Tipo == "Invitacion")
                {
                    return RedirectToAction("Lista", "Invitaciones");
                }
                else if (notficaciones.Tipo == "Curriculum")
                {
                    return RedirectToAction("Index", "Curriculos");
                }
                else
                {
                    return RedirectToAction("Postulaciones", "Candidatos");
                }
            }
            else
            {
                if (notificacones.Tipo == "Postulacion" || notificacones.Tipo == "Empleo")
                {
                    return RedirectToAction("Index", "Empleos");
                }
                else
                {
                    if (notficaciones.Tipo == "Invitacion")
                    {
                        return RedirectToAction("Index", "Invitaciones");
                    }
                    else
                    {
                        return RedirectToAction("IndexFD", "Invitaciones");
                    }
                }
            }
        }
    }
}