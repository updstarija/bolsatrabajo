using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BolsaDeTrabajo.Controllers
{
    public class InvitacionesController : Controller
    {
        // GET: Invitaciones
        private UPDS_BDTEntities db = new UPDS_BDTEntities();

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Index()
        {
            ViewBag.tCategoria = db.CategoriaBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            return View();
        }
        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Guardar(Invitado obj)
        {
            status s = new status();
            try
            {
                UsuarioActivo ua = new UsuarioActivo();
                Curriculum cur = db.Curriculum.Where(x => x.Id == obj.IdCurriculum).SingleOrDefault();
                ua = ua.getUser(User);
                var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
                var nombreEmisor = db.Empresa.SingleOrDefault(u => u.Id == us.Id);
                Mensaje mensaje = new Mensaje();
                mensaje.FechaRegistro = DateTime.Now;
                mensaje.Intermediario = "UPDS_BolsaDeTrabajo@outlook.com";
                mensaje.Emisor = us.Correo;
                mensaje.Destinatario = cur.DatosPersonales.Correo;
                mensaje.Asunto = "Invitacion a Empleo";
                mensaje.Texto = obj.Carta;
                mensaje.Estado = "Pendiente";
                db.Mensaje.Add(mensaje);
                db.SaveChanges();
                obj.IdEmpleo = obj.IdEmpleo == -1 ? null : obj.IdEmpleo;
                Invitado invitado = new Invitado();
                invitado = obj;
                invitado.FechaRegistro = DateTime.Now;
                invitado.Estado = "Pendiente";
                invitado.IdEmpresa = us.Id;
                invitado.IdMensaje = mensaje.Id;
                db.Invitado.Add(invitado);
                db.SaveChanges();

                Notificacion notificacion = new Notificacion();
                notificacion.Titulo = "Invitación a Postular";
                if (obj.IdEmpleo != null)
                {
                    var empleo = db.Empleo.SingleOrDefault(x => x.Id == obj.IdEmpleo);
                    notificacion.Descripcion = "La Empresa <span>" + nombreEmisor.NombreEmpresa + "</span> le mando una invitación a postular a su empleo <span>" + empleo.Titulo + "</span>.";
                }
                else
                {
                    notificacion.Descripcion = "La Empresa <span>" + nombreEmisor.NombreEmpresa + "</span> le mando una invitación";
                }
                notificacion.Tipo = "Invitacion";
                notificacion.FechaRegistro = DateTime.Now;
                notificacion.FechaActualizacion = DateTime.Now;
                notificacion.Estado = "Pendiente";
                notificacion.Emisor = "Empresa";
                notificacion.Receptor = "Candidato";
                notificacion.IdInvitado = invitado.Id;
                db.Notificacion.Add(notificacion);
                db.SaveChanges();

                Correo co = new Correo();
                co.enviarCorreo(invitado.Carta, "Invitación a empleo: " + cur.DatosPersonales.Nombre + " " + cur.DatosPersonales.Apellido, cur.DatosPersonales.Correo, "", "");
                s.Tipo = 1;
                s.Msj = "Invitacion enviada.";
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        //VER LISTA INVITACIONES DE CANDIDATO
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Lista()
        {
            return View();
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getLista()
        {
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var invitado = db.Invitado.Where(em => em.Curriculum.IdCandidato == us.Id && em.Empleo.Estado != "Eliminado").ToList();

            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitado)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                if (item.IdEmpleo != null)
                {
                    obj.atrib3 = item.Empleo.Empresa.NombreEmpresa;
                    obj.atrib4 = item.Empleo.Titulo;
                }
                else
                {
                    obj.atrib3 = item.Empresa.NombreEmpresa;
                    obj.atrib4 = "-";
                }
                obj.atrib5 = item.Curriculum.Titulo;
                obj.atrib6 = item.Mensaje != null ? item.Mensaje.Estado : "-";
                obj.atrib7 = "<div class='w-100 d-flex justify-content-center'><a href='" + baseUrl + "Invitaciones/Invitacion?Id=" + item.Id + "' class='tooltip-test' title='Ver Invitación'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        //VER INVITACION
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Invitacion(int Id)
        {
            var Invitado = db.Invitado.SingleOrDefault(x => x.Id == Id);
            ViewBag.IdInvitado = Id;
            ViewBag.IdEmpleo = Invitado.IdEmpleo;
            ViewBag.IdCurriculum = Invitado.IdCurriculum;
            return View();
        }

        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult getInvitacion(int Id)
        {
            Invitado inv = db.Invitado.SingleOrDefault(x => x.Id == Id);
            InvitadoC invitado = new InvitadoC();
            invitado = invitado.CargarInvitado(inv);
            if (inv.Mensaje != null)
            {
                Mensaje men = db.Mensaje.SingleOrDefault(x => x.Id == inv.Mensaje.Id);
                men.Estado = "Visto";
                db.SaveChanges();
            }
            return Json(invitado, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult VerificarInvitacion(int Id,int IdEmpleo)
        {         
            var validador = false;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var invitacion = db.Invitado.Where(x => x.IdEmpresa == us.Id && x.IdCurriculum == Id && x.IdEmpleo==IdEmpleo).ToList();
            if (invitacion.Count() != 0)
            {
                validador = true;
            }
            else
            {
                validador = false;
            }
            return Json(validador, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult listaInvitados(int id)
        {
            ViewBag.IdEmpleo = id;
            return View();
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getlistainvitados(int Id)
        {
            var invitados = db.Invitado.Where(x => x.IdEmpleo == Id && x.Curriculum.Estado == "Activo").ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitados)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.DatosPersonales.Nombre + " " + item.Curriculum.DatosPersonales.Apellido;
                obj.atrib4 = item.Curriculum.Titulo;
                obj.atrib5 = item.Curriculum.DatosPersonales.Nacionalidad;
                obj.atrib6 = item.Curriculum.DatosPersonales.Sexo;
                obj.atrib7 = item.Estado;
                obj.atrib8 = "<div class='w-100 d-flex justify-content-center'><button type='button' class='btn' data-toggle='modal' data-target='#ModalInvitado' onclick='verdetallecurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><button type='button' class='btn ' onclick='imprimirCurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getInvitacionFD()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var invitado = db.Invitado.Where(em => em.Empresa.Id == us.Id && em.IdEmpleo == null).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitado)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.DatosPersonales.Nombre + " " + item.Curriculum.DatosPersonales.Apellido;
                obj.atrib4 = item.Curriculum.Titulo;
                obj.atrib5 = item.Curriculum.DatosPersonales.Nacionalidad;
                obj.atrib6 = item.Curriculum.DatosPersonales.Sexo;
                obj.atrib7 = item.Estado;
                obj.atrib8 = "<div class='w-100 d-flex justify-content-center'><button type='button' class='btn' data-toggle='modal' data-target='#ModalInvitado' onclick='verdetallecurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><button type='button' class='btn ' onclick='imprimirCurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult cambiodeestado(int Id)
        {
            status s = new status();
            try
            {
                Invitado inv = db.Invitado.SingleOrDefault(x => x.Id == Id);
                inv.Estado = "Aceptado";
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult enviarMensaje(string mensajeR, int Id)
        {
            status s = new status();
            try
            {
                UsuarioActivo ua = new UsuarioActivo();
                ua = ua.getUser(User);
                var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
                var invitacion = db.Invitado.SingleOrDefault(x => x.Id == Id && x.Curriculum.Candidato.Id == us.Id);
                Mensaje mensaje = new Mensaje();
                mensaje.FechaRegistro = DateTime.Now;
                mensaje.Asunto = "Respuesta a Invitación";
                mensaje.Texto = mensajeR;
                mensaje.Intermediario = "UPDS_BolsaDeTrabajo@outlook.com";
                mensaje.Emisor = us.Correo;
                mensaje.Destinatario = invitacion.Empresa.Perfil.Usuario.Correo;
                mensaje.Estado = "Entregado";
                db.Mensaje.Add(mensaje);
                db.SaveChanges();
                Invitado inv = db.Invitado.SingleOrDefault(x => x.Id == invitacion.Id);
                inv.idMensajeReceptor = mensaje.Id;
                inv.Estado = "Respondido";
                //db.Invitado.Add(inv);
                db.SaveChanges();

                var invitado = db.Invitado.SingleOrDefault(x => x.Id == Id);
                Notificacion notificacion = new Notificacion();
                notificacion.Titulo = "Invitación Aceptada ";
                notificacion.Descripcion = "El candidato <span>" + invitado.Curriculum.DatosPersonales.Nombre + " " + invitado.Curriculum.DatosPersonales.Apellido + "</span> acepto la invitación a tu empresa <span>" + invitado.Empresa.NombreEmpresa + "</span>.";
                notificacion.Tipo = "Invitacion";
                notificacion.FechaRegistro = DateTime.Now;
                notificacion.FechaActualizacion = DateTime.Now;
                notificacion.Estado = "Pendiente";
                notificacion.Emisor = "Candidato";
                notificacion.Receptor = "Empresa";
                notificacion.IdInvitado = inv.Id;
                db.Notificacion.Add(notificacion);
                db.SaveChanges();

                s.Tipo = 1;
                s.Msj = "Mensaje enviado.";
                Correo c = new Correo();
                var r = c.enviarCorreo(mensajeR, "Postulacion a Empleo" + ": " + "Respuesta a Invitación", invitacion.Empresa.Perfil.Usuario.Correo, "", "");
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getByEstado(int Id, string cadena)
        {
            var invitados = db.Invitado.Where(x => x.IdEmpleo == Id && x.Estado == cadena).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitados)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.DatosPersonales.Nombre + " " + item.Curriculum.DatosPersonales.Apellido;
                obj.atrib4 = item.Curriculum.Titulo;
                obj.atrib5 = item.Curriculum.DatosPersonales.Nacionalidad;
                obj.atrib6 = item.Curriculum.DatosPersonales.Sexo;
                obj.atrib7 = item.Estado;
                obj.atrib8 = "<div class='w-100 d-flex justify-content-center'><button type='button' class='btn' data-toggle='modal' data-target='#ModalInvitado' onclick='verdetallecurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><button type='button' class='btn ' onclick='imprimirCurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getByEstadoFD(string cadena)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var invitado = db.Invitado.Where(em => em.Empresa.Id == us.Id && em.IdEmpleo == null && em.Estado == cadena).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitado)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.DatosPersonales.Nombre + " " + item.Curriculum.DatosPersonales.Apellido;
                obj.atrib4 = item.Curriculum.Titulo;
                obj.atrib5 = item.Curriculum.DatosPersonales.Nacionalidad;
                obj.atrib6 = item.Curriculum.DatosPersonales.Sexo;
                obj.atrib7 = item.Estado;
                obj.atrib8 = "<div class='w-100 d-flex justify-content-center'><button type='button' class='btn' data-toggle='modal' data-target='#ModalInvitado' onclick='verdetallecurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><button type='button' class='btn ' onclick='imprimirCurriculum(" + item.Curriculum.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getListaFiltros(string cadena)
        {
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            // && em.IdEmpleo != null
            var invitado = db.Invitado.Where(em => em.Curriculum.IdCandidato == us.Id && em.Mensaje.Estado == cadena).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in invitado)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                if (item.IdEmpleo != null)
                {
                    obj.atrib3 = item.Empleo.Empresa.NombreEmpresa;
                    obj.atrib4 = item.Empleo.Titulo;
                }
                else
                {
                    obj.atrib3 = item.Empresa.NombreEmpresa;
                    obj.atrib4 = "-";
                }
                obj.atrib5 = item.Curriculum.Titulo;
                obj.atrib6 = item.Mensaje.Estado;
                obj.atrib7 = "<div class='w-100 d-flex justify-content-center'><a href='" + baseUrl + "Invitaciones/Invitacion?Id=" + item.Id + "' class='tooltip-test' title='Ver Invitación'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
    }
}