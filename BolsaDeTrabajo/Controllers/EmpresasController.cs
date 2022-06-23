using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using BolsaDeTrabajo.Models;

namespace BolsaDeTrabajo.Controllers
{
    public class EmpresasController : Controller
    {
        // GET: Empresas
        private UPDS_BDTEntities db = new UPDS_BDTEntities();

        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Index()
        {
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            return View();
        }

        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Guardar(FormCollection form)
        {
            int IdEmpresa = int.Parse(form["id_empresa"]);
            //var modelo = form;
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    bool Existencia = false;
                    Empresa empresa = IdEmpresa == -1 ? new Empresa() : bd.Empresa.Where(e => e.Id == IdEmpresa).SingleOrDefault();
                    string correo = form["correo_empresa"];
                    string NIT = form["NIT_empresa"];
                    if (IdEmpresa == -1)
                    {
                        var obj = bd.Empresa.Where(x => x.Perfil.Usuario.Correo == correo || x.NIT == NIT).SingleOrDefault();
                        Existencia = obj == null ? false : true;
                    }
                    else
                    {
                        if (empresa.Perfil.Usuario.Correo == correo && empresa.NIT == NIT)
                        {
                            Existencia = false;
                        }
                        else if (empresa.Perfil.Usuario.Correo == correo && empresa.NIT != NIT)
                        {
                            var obj = bd.Empresa.Where(x => x.NIT == NIT).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                        else if (empresa.Perfil.Usuario.Correo != correo && empresa.NIT == NIT)
                        {
                            var obj = bd.Empresa.Where(x => x.Perfil.Usuario.Correo == correo).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                        else if (empresa.Perfil.Usuario.Correo != correo && empresa.NIT != NIT)
                        {
                            var obj = bd.Empresa.Where(x => x.Perfil.Usuario.Correo == correo || x.NIT == NIT).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                    }
                    if (Existencia == false)
                    {
                        bool VerificacionCorreo = false;
                        //Empresa empresa = IdEmpresa == -1 ? new Empresa() : bd.Empresa.Where(e => e.Id == IdEmpresa).SingleOrDefault();
                        Perfil perfil = IdEmpresa == -1 ? new Perfil() : bd.Perfil.Where(p => p.Id == empresa.Perfil.Id).SingleOrDefault();
                        Usuario usuario = IdEmpresa == -1 ? new Usuario() : bd.Usuario.Where(us => us.Id == empresa.Perfil.Usuario.Id).SingleOrDefault();
                        Img img = new Img();
                        perfil.Descripcion = form["descripcion_empresa"];
                        if (form["telefonoCelular"] != "") { perfil.TelefonoCelular = form["telefonoCelular"]; }
                        if (form["telefonoFijo"] != "") { perfil.TelefonoFijo = form["telefonoFijo"]; }
                        perfil.Tipo = "EMPRESA";
                        perfil.Pais = form["pais_empresa"];
                        perfil.EstadoRegion = form["estadoregion"];
                        perfil.Ciudad = form["ciudad_empresa"];
                        perfil.FechaActualizacion = DateTime.Now;
                        if (Request.Files[0].InputStream.Length != 0)
                        {
                            perfil.Foto = img.GetBytess(Request.Files[0].InputStream);
                        }
                        if (IdEmpresa == -1)
                        {
                            perfil.Estado = "Activa";
                            perfil.FechaRegistro = DateTime.Now;
                            bd.Perfil.Add(perfil);
                        }
                        bd.SaveChanges();
                        if (IdEmpresa != -1)
                        {
                            VerificacionCorreo = usuario.Correo == form["correo_empresa"] ? false : true;
                        }
                        usuario.Correo = form["correo_empresa"];
                        usuario.FechaActualizacion = DateTime.Now;
                        var password = form["clave"];
                        if (password != null && password != "")
                        {
                            EncriptarClass enc = new EncriptarClass();
                            usuario.Clave = enc.GetSHA256(form["clave"]);
                        }
                        if (IdEmpresa == -1)
                        {
                            usuario.Rol = "Empresa";
                            usuario.Id = perfil.Id;
                            bd.Usuario.Add(usuario);
                        }
                        bd.SaveChanges();

                        empresa.NIT = form["NIT_empresa"];
                        empresa.NombreEmpresa = form["nombre_empresa"];
                        empresa.NombrePersonaResponsable = form["nombre_persona_empresa"];
                        if (form["sitio_web_empresa"] != "")
                        {
                            empresa.SitioWeb = form["sitio_web_empresa"];
                        }
                        empresa.Direccion = form["direccion_empresa"];
                        if (IdEmpresa == -1)
                        {
                            empresa.Id = perfil.Id;
                            bd.Empresa.Add(empresa);
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
                        s.Msj = "La cuenta ya se encuentra registrada (Correo o NIT existente)";
                    }
                }
            }
            catch
            {
                s.Tipo = 3;
                s.Msj = "Se produjo un error comuniquese con el administrador";
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        //[Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Editar()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Empresa")) != null)
                {
                    var user = db.Usuario.Where(u => u.Correo == User.Identity.Name).SingleOrDefault();
                    //Empresa empresa = db.Empresa.Where(em => em.Id == user.Id).SingleOrDefault();
                    if (user == null)
                    {
                        return HttpNotFound();
                    }
                    ViewBag.IdEmpresa = user.Id;
                    ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
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

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getEmpresa(int Id)
        {
            var emp = db.Empresa.Where(e => e.Id == Id).SingleOrDefault();
            EmpresaC empresaC = new EmpresaC();
            empresaC = empresaC.CargarEmpresaC(emp);
            return Json(empresaC, JsonRequestBehavior.AllowGet);
        }
    }
}