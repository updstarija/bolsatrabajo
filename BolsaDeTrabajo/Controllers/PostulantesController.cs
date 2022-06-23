using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.Entity;

namespace BolsaDeTrabajo.Controllers
{
    public class PostulantesController : Controller
    {
        // GET: Postulantes
        private UPDS_BDTEntities db = new UPDS_BDTEntities();

        //[Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Empresa")) != null)
                {

                    return View();
                }
                else
                {
                    return RedirectToAction("SinAcceso", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        //[Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Lista(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Empresa")) != null)
                {
                    ViewBag.IdEmpleo = Id;
                    return View();
                }
                else
                {
                    return RedirectToAction("SinAcceso", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        [HttpPost]
        public ActionResult ActualizarEstado(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    int IdPostulante = int.Parse(form["IdPostulante"]);
                    string estado = form["Estado"];
                    Postulante postulante = bd.Postulante.SingleOrDefault(x => x.Id == IdPostulante);
                    postulante.Estado = estado;
                    bd.SaveChanges();
                    s.Tipo = 1;
                    s.Msj = "Actualizado.";
                }
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Guardar(Postulante obj)
        {
            status s = new status();
            try
            {
                Postulante postulante = new Postulante();
                postulante = obj;
                postulante.FechaRegistro = DateTime.Now;
                postulante.Estado = "Pendiente";
                postulante.Aceptado = "Pendiente";
                db.Postulante.Add(postulante);
                db.SaveChanges();

                var cur = db.Curriculum.Where(x => x.Id == postulante.IdCurriculum).SingleOrDefault();
                var emp = db.Empleo.Where(x => x.Id == postulante.IdEmpleo).SingleOrDefault();

                Notificacion notificacion = new Notificacion();
                notificacion.Titulo = "Nueva Postulación ";
                notificacion.Descripcion = "El candidato <span>" + cur.DatosPersonales.Nombre + " " + cur.DatosPersonales.Apellido + "</span> se a postulado al empleo <span>" + emp.Titulo + "</span>.";
                notificacion.Tipo = "Postulacion";
                notificacion.FechaRegistro = DateTime.Now;
                notificacion.FechaActualizacion = DateTime.Now;
                notificacion.Estado = "Pendiente";
                notificacion.Emisor = "Candidato";
                notificacion.Receptor = "Empresa";
                notificacion.IdPostulante = postulante.Id;
                db.Notificacion.Add(notificacion);
                db.SaveChanges();

                Correo c = new Correo();
                string mensaje = "Postulante: " + cur.DatosPersonales.Nombre + " " + cur.DatosPersonales.Apellido + "\n";
                mensaje += "Correo: " + postulante.Curriculum.DatosPersonales.Correo + "\n";
                mensaje += obj.CartaPresentacion;
                mensaje += "\n";
                mensaje += "Para mas información verifique la lista de postulantes.";
                var r = c.enviarCorreo(mensaje, "Postulacion a Empleo" + ": " + emp.Titulo, emp.CorreoEnvioPostulaciones, "", "");
                s.Tipo = 1;
                s.Msj = "Exito al guardar";
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult GetList(int IdEmpleo)
        {
            string btn;
            string btn2;
            string estado = "";
            List<object[]> tabla = new List<object[]>();
            int i = 0;
            var empleo = db.Empleo.Where(e => e.Id == IdEmpleo).SingleOrDefault();
            var postulantes = new List<Postulante>();
            if (empleo.Estado == "Activo")
            {
                postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado" && x.Curriculum.Estado == "Activo").ToList();
            }
            else
            {
                postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado").ToList();
            }
            Empleo emp = db.Empleo.Where(x => x.Id == IdEmpleo).SingleOrDefault();
            string statusCheckbox = emp.Estado == "Inactivo" ? "disabled" : "";
            foreach (var item in postulantes)
            {
                i++;
                if (item.Estado == "Aceptado")
                {
                    estado = "checked";
                }
                else
                {
                    estado = "";
                }
                string sexo = "";
                if (item.Curriculum.Candidato.Sexo == "Masculino")
                {
                    sexo = "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>";
                }
                else
                {
                    sexo = "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                }
                btn = "<div class='d-flex flex-nowrap'><button  type='button'class='btn btn-sm btn-link' data-toggle='modal' data-target='#ModalPostulante' onclick='VerPostulante(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button> <button type='button' class='btn btn-sm btn-link' onclick='VerCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></i></button></div>";
                btn2 = "<input type='checkbox' class='style-checkbox' id='estadoCandidato" + i + "' " + estado + " onchange='ActualizarEstado(this," + item.Id + ")' " + statusCheckbox + ">";
                object[] obj = { i, item.FechaRegistro.ToString("dd/MM/yyyy"), item.Curriculum.Candidato.Nombre + ' ' + item.Curriculum.Candidato.Apellido, item.Curriculum.Candidato.Nacionalidad, sexo , btn, btn2 };
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        //AUXILIAR
        [Authorize(Roles = "Empresa,Administrador")]
        public Postulante CargarDatos(Postulante obj)
        {
            CurriculoC curriculo = new CurriculoC();
            //curriculo.DatosPersonalesC=obj
            Postulante postulante = new Postulante();
            postulante = obj;
            Curriculum curriculum = new Curriculum();
            curriculum = obj.Curriculum;
            curriculum.DatosPersonales = obj.Curriculum.DatosPersonales;
            curriculum.DatosPersonales.Curriculum = null;
            for (int i = 0; i < obj.Curriculum.ExperienciaLaboral.Count(); i++)
            {
                ExperienciaLaboral xl = new ExperienciaLaboral();
                xl = obj.Curriculum.ExperienciaLaboral.ElementAt(i);
                xl.Curriculum = null;
                curriculum.ExperienciaLaboral.Add(xl);
            }
            for (int i = 0; i < obj.Curriculum.Habilidad.Count(); i++)
            {
                Habilidad hab = new Habilidad();
                hab = obj.Curriculum.Habilidad.ElementAt(i);
                hab.Curriculum = null;
                curriculum.Habilidad.Add(hab);
            }
            List<InformacionAdicional> auxInforAdicional = new List<InformacionAdicional>();
            for (int i = 0; i < obj.Curriculum.InformacionAdicional.Count(); i++)
            {
                InformacionAdicional ia = new InformacionAdicional();
                ia = obj.Curriculum.InformacionAdicional.ElementAt(i);
                ia.Curriculum = null;
                auxInforAdicional.Add(ia);
            }
            curriculum.InformacionAdicional = auxInforAdicional;
            curriculum.Educacion = obj.Curriculum.Educacion;
            curriculum.Educacion.Colegio.Educacion = null;
            curriculum.Educacion.Curriculum.Clear();
            //curriculum.Educacion.Idioma.Clear();
            //curriculum.Educacion.Lista.Clear();

            List<Idioma> auxIdioma = new List<Idioma>();
            List<Lista> auxLista = new List<Lista>();
            for (int i = 0; i < obj.Curriculum.Educacion.Idioma.Count(); i++)
            {
                Idioma id = new Idioma();
                id = obj.Curriculum.Educacion.Idioma.ElementAt(i);
                id.Educacion = null;
                auxIdioma.Add(id);
            }
            for (int i = 0; i < obj.Curriculum.Educacion.Lista.Count(); i++)
            {
                Lista list = new Lista();
                list = obj.Curriculum.Educacion.Lista.ElementAt(i);
                list.Educacion = null;
                auxLista.Add(list);
            }
            postulante.Curriculum = curriculum;
            Candidato cd = new Candidato();
            postulante.Curriculum.Candidato = cd;
            postulante.Curriculum.Postulante.Clear();
            postulante.Curriculum.Educacion.Lista = auxLista;
            postulante.Curriculum.Educacion.Idioma = auxIdioma;

            List<CategoriaBDT> Listaux = new List<CategoriaBDT>();
            foreach (var item in obj.Empleo.CategoriaBDT)
            {
                CategoriaBDT ctg = new CategoriaBDT();
                ctg = item;
                ctg.Empleo.Clear();
                Listaux.Add(ctg);
            }

            Empleo emp = new Empleo();
            emp = obj.Empleo;
            emp.CategoriaBDT = Listaux;
            emp.Empresa.Empleo.Clear();
            emp.Empresa.Perfil.Empresa = null;
            emp.Postulante.Clear();
            emp.Empresa = null;
            postulante.Empleo = emp;
            return postulante;
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult GetById(int IdPostulante)
        {
            status s = new status();
            PostulanteC postulante = new PostulanteC();
            try
            {
                Postulante p = db.Postulante.Where(x => x.Id == IdPostulante).SingleOrDefault();
                postulante = postulante.getPostulanteC(p);
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(postulante, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Empresa,Administrador")]
        [HttpPost]
        public ActionResult FiltrarPostulantes(FormCollection form)
        {
            int IdEmpleo = int.Parse(form["IdEmpleo"]);
            string filtroEstado = form["Estado"];
            var Postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado" && x.Estado == filtroEstado).ToList();
            Empleo emp = db.Empleo.Where(x => x.Id == IdEmpleo).SingleOrDefault();
            string statusCheckbox = emp.Estado == "Inactivo" ? "disabled" : "";
            string btn;
            string btn2;
            string estado = "";
            List<object[]> tabla = new List<object[]>();
            int i = 0;
            foreach (var item in Postulantes)
            {
                i++;
                if (item.Estado == "Aceptado")
                {
                    estado = "checked";
                }
                else
                {
                    estado = "";
                }
                string sexo = "";
                if (item.Curriculum.Candidato.Sexo == "Masculino")
                {
                    sexo = "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>";
                }
                else
                {
                    sexo = "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                }
                btn = "<div class='d-flex flex-nowrap'><button  type='button'class='btn btn-sm btn-link' data-toggle='modal' data-target='#ModalPostulacion' onclick='VerPostulante(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button> <button  type='button' class='btn btn-sm btn-link' onclick='VerCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></i></button></div>";
                btn2 = "<input type='checkbox' class='style-checkbox' id='estadoCandidato" + i + "' " + estado + " onchange='ActualizarEstado(this," + item.Id + ")' " + statusCheckbox + ">";
                object[] obj = { i, item.FechaRegistro.ToString("dd/MM/yyyy"), item.Curriculum.Candidato.Nombre + ' ' + item.Curriculum.Candidato.Apellido, item.Curriculum.Candidato.Nacionalidad, sexo, btn, btn2 };
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getListByEstado(int IdEmpleo)
        {
            var postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado == "Aceptado").ToList();
            ListaPostulantes list = new ListaPostulantes();
            list.Postulantes = list.CargarLista(postulantes);
            list.TotalRegistros = list.Postulantes.Count();
            return Json(list, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult verificarPostulacion(int IdEmpleo, int IdCurriculum)
        {
            var validador = false;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.IdCurriculum == IdCurriculum);
            if (postulantes.Count() != 0)
            {
                validador = true;
            }
            else
            {
                validador = false;
            }
            return Json(validador, JsonRequestBehavior.AllowGet);
        }
    }
}