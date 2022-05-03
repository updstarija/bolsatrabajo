using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace BolsaDeTrabajo.Controllers
{
    public class CandidatosController : Controller
    {
        // GET: Candidatos
        private UPDS_BDTEntities db = new UPDS_BDTEntities();
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getCandidato(int Id)
        {
            var obj = db.Candidato.Where(c => c.Id == Id).SingleOrDefault();
            Candidato candidato = new Candidato();
            //candidato.Nombre = obj.Nombre;
            //candidato.Apellido = obj.Apellido;
            //candidato.Perfil.Usuario.Correo = obj.Perfil.Usuario.Correo;
            //candidato.Perfil.Foto = obj.Perfil.Foto;


            candidato.Sexo = obj.Sexo;
            candidato.TipoDeDocumento = obj.TipoDeDocumento;
            return Json(candidato, JsonRequestBehavior.AllowGet);
        }

        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        public ActionResult Guardar(FormCollection form)
        {
            var modelo = form;
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    bool Existencia = false;
                    int IdCandidato = int.Parse(form["idCandidato"]);
                    string correo = form["email"];
                    int IdPersona = Convert.ToInt32(form["idpersona"]);
                    Candidato cantidato = IdCandidato == -1 ? new Candidato() : bd.Candidato.Where(c => c.Id == IdCandidato).SingleOrDefault();
                    if (IdCandidato == -1)
                    {
                        var obj = bd.Candidato.Where(x => x.Perfil.Usuario.Correo == correo || x.IdEstudiante == IdPersona).SingleOrDefault();
                        Existencia = obj == null ? false : true;
                    }
                    else
                    {
                        if (cantidato.Perfil.Usuario.Correo == correo && cantidato.IdEstudiante == IdPersona)
                        {
                            Existencia = false;
                        }
                        else if (cantidato.Perfil.Usuario.Correo != correo && cantidato.IdEstudiante == IdPersona)
                        {
                            var obj = bd.Candidato.Where(x => x.Perfil.Usuario.Correo == correo).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                    }
                    if (Existencia == false)
                    {
                        bool VerificacionCorreo = false;
                        Perfil perfil = IdCandidato == -1 ? new Perfil() : bd.Perfil.Where(p => p.Id == cantidato.Perfil.Id).SingleOrDefault();
                        Usuario usuario = IdCandidato == -1 ? new Usuario() : bd.Usuario.Where(u => u.Id == perfil.Usuario.Id).SingleOrDefault();
                        Img img = new Img();
                        perfil.Descripcion = form["descripcion"];
                        if (form["telefonoCelular"] != "") { perfil.TelefonoCelular = form["telefonoCelular"]; }
                        if (form["telefonoFijo"] != "") { perfil.TelefonoFijo = form["telefonoFijo"]; }
                        perfil.Tipo = "CANDIDATO";
                        perfil.Pais = form["pais"];
                        perfil.EstadoRegion = form["estadoRegion"];
                        perfil.Ciudad = form["ciudad"];
                        perfil.FechaActualizacion = DateTime.Now;
                        if (Request.Files[0].InputStream.Length != 0)
                        {
                            perfil.Foto = img.GetBytess(Request.Files[0].InputStream);
                        }
                        if (IdCandidato == -1)
                        {
                            perfil.Estado = "Activo";
                            perfil.FechaRegistro = DateTime.Now;
                            bd.Perfil.Add(perfil);
                        }
                        bd.SaveChanges();
                        if (IdCandidato != -1)
                        {
                            VerificacionCorreo = usuario.Correo == form["email"] ? false : true;
                        }
                        usuario.Correo = form["email"];
                        var password = form["clave"];
                        if (password != null)
                        {
                            EncriptarClass enc = new EncriptarClass();
                            usuario.Clave = enc.GetSHA256(form["clave"]);
                        }
                        usuario.FechaActualizacion = DateTime.Now;
                        if (IdCandidato == -1)
                        {
                            usuario.Rol = "Candidato";
                            usuario.Id = perfil.Id;
                            bd.Usuario.Add(usuario);
                        }
                        bd.SaveChanges();

                        cantidato.Nombre = form["nombre"];
                        cantidato.Apellido = form["apellido"];
                        cantidato.Nacionalidad = form["nacionalidad"];
                        cantidato.TipoDeDocumento = form["tipoDocumento"];
                        cantidato.NroDocumento = form["nroDocumento"];
                        cantidato.FechaNacimiento = Convert.ToDateTime(form["fechaNacimiento"]);
                        cantidato.Sexo = form["sexo"];
                        cantidato.ProfesionOcupacion = form["profesionOcupacion"];
                        if (IdCandidato == -1)
                        {
                            cantidato.IdEstudiante = Convert.ToInt32(form["idpersona"]);
                            cantidato.Id = perfil.Id;
                            bd.Candidato.Add(cantidato);
                        }
                        bd.SaveChanges();
                        if (VerificacionCorreo == false)
                        {
                            s.Tipo = 1;
                            s.Msj = "Exito al guardar";
                        }
                        else
                        {
                            s.Tipo = 4;
                            s.Msj = "Exito al guardar";
                        }
                    }
                    else
                    {
                        s.Tipo = 5;
                        s.Msj = "La cuenta ya se encuentra registrada (Correo o Estudiante existente)";
                    }
                }
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = "Se produjo un error comuniquese con el administrador";
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Editar()
        {
            var user = db.Usuario.Where(u => u.Correo == User.Identity.Name).SingleOrDefault();
            if (user == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Candidato candidato = db.Candidato.Where(c => c.Id == user.Id).SingleOrDefault();
            if (candidato == null)
            {
                return HttpNotFound();
            }
            return View(candidato);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Postulaciones()
        {
            return View();
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getTablePostulaciones()
        {
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var Postulaciones = db.Postulante.Where(x => x.Curriculum.IdCandidato == us.Id && x.Estado != "Cancelado" && x.Empleo.Estado != "Eliminado").ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Postulaciones)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Empleo.Titulo;
                obj.atrib4 = item.Empleo.Empresa.NombreEmpresa;
                obj.atrib5 = item.Curriculum.Titulo;
                obj.atrib6 = item.Aceptado;
                //obj.atrib7 = "<a href='/Candidatos/Postulacion?IdPostulante=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                obj.atrib7 = "<div class='d-flex flex-nowrap align-items-center'><a href='"+baseUrl+"Candidatos/Postulacion?IdPostulante=" + item.Id + "' class='tooltip-test' title='Ver Postulación'><i class='fas fa-eye ico-blue ico-animation fa-lg '></i></a>";
                if (item.Aceptado != "Aceptado" && item.Empleo.Estado!= "Inactivo")
                {
                    obj.atrib7 += "<button type='button' id='" + item.Id + "' class='btn btn-link tooltip-test' title='Cancelar Postulación' onclick='CancelarPostulacion(" + item.Id + ")'><i class='fas fa-times ico-red ico-animation fa-lg'></i></button>";
                }
                obj.atrib7 += "</div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getTablePostulacionesByEstado(string estado)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var Postulaciones = db.Postulante.Where(x => x.Curriculum.IdCandidato == us.Id && x.Aceptado == estado && x.Estado != "Cancelado").ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Postulaciones)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Empleo.Titulo;
                obj.atrib4 = item.Empleo.Empresa.NombreEmpresa;
                obj.atrib5 = item.Curriculum.Titulo;
                obj.atrib6 = item.Aceptado;
                obj.atrib7 = "<div class='d-flex flex-nowrap align-items-center'><a href='"+baseUrl+"Candidatos/Postulacion?IdPostulante=" + item.Id + "' class='tooltip-test' title='Ver Postulación'><i class='fas fa-eye ico-blue ico-animation fa-lg '></i></a>";
                if (item.Aceptado != "Aceptado" && item.Empleo.Estado != "Inactivo")
                {
                    obj.atrib7 += "<button type='button' id='" + item.Id + "' class='btn btn-link tooltip-test' title='Cancelar Postulación' onclick='CancelarPostulacion(" + item.Id + ")'><i class='fas fa-times ico-red ico-animation fa-lg'></i></button>";
                }
                obj.atrib7 += "</div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Postulacion(int IdPostulante)
        {
            ViewBag.IdPostulante = IdPostulante;
            return View();
        }
    }
}