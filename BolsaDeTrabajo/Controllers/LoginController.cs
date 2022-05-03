using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using System.Web.Mvc;
using BolsaDeTrabajo.Models;
using Microsoft.Owin.Host.SystemWeb;
using Microsoft.Owin.Security;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web.Security;

namespace BolsaDeTrabajo.Controllers
{
    public class LoginController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Ingresar(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    bool Acceder = true;
                    Usuario usuario = new Usuario();
                    EncriptarClass enc = new EncriptarClass();
                    var clave = enc.GetSHA256(form["clave"]);
                    var usuar = form["usuario"];
                    usuario = bd.Usuario.SingleOrDefault(x => x.Clave == clave && x.Correo == usuar);
                    if (usuario != null)
                    {
                        if (usuario.Rol == "Empresa")
                        {
                            Acceder = usuario.Perfil.Estado == "Desaprobado" ? false : true;
                        }
                        else if (usuario.Rol == "Candidato" || usuario.Rol == "Administrador")
                        {
                            Acceder = usuario.Perfil.Estado == "Inactivo" ? false : true;
                        }
                        //var us = bd.Usuario.SqlQuery("Select * from Usuario u where u.Clave = " + clave + " and u.Correo=" + usuar + "").ToList();
                        if (Acceder == true)
                        {
                            s.RolUsuario = usuario.Rol;
                            IAuthenticationManager authenticationManager = HttpContext.GetOwinContext().Authentication;
                            authenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                            ClaimsIdentity identity = new ClaimsIdentity(DefaultAuthenticationTypes.ApplicationCookie);
                            identity.AddClaim(new Claim(ClaimTypes.Name, usuario.Correo));
                            AuthenticationProperties props = new AuthenticationProperties();
                            props.IsPersistent = true;
                            authenticationManager.SignIn(props, identity);
                            s.Tipo = 1;
                            s.Msj = "Exito";
                        }
                        else
                        {
                            s.Tipo = 4;
                            s.Msj = "La cuenta no se encuentra habilitada. Por favor comuniquese con un administrador, al correo: UPDS_BolsaDeTrabajo@outlook.com";
                        }
                    }
                    else
                    {
                        s.Tipo = 2;
                        s.Msj = "Usuario o Contraseña incorrecta";
                    }
                }
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = "Exito. Verifique el correo.";
            }

            return Json(s, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Logout()
        {
            IAuthenticationManager authenticationManager = HttpContext.GetOwinContext().Authentication;
            authenticationManager.SignOut();
            return RedirectToAction("Index", "Login");
        }

        [AllowAnonymous]
        [HttpPost]
        public ActionResult CambiarClave(FormCollection form)
        {
            status s = new status();
            try
            {
                UPDS_BDTEntities db = new UPDS_BDTEntities();
                string Correo = form["Correo"];
                Usuario us = db.Usuario.SingleOrDefault(x => x.Correo == Correo);

                Correo o = new Correo();
                string Clave = Membership.GeneratePassword(6, 1);
                string textMensaje = "Se a solicitado restablecer la contraseña para el correo " + us.Correo + ". La nueva contraseña es: " + Clave;
                var r = o.enviarCorreo(textMensaje, "Nueva Contraseña", us.Correo, "", "");
                if (r == true)
                {
                    EncriptarClass enc = new EncriptarClass();
                    us.Clave = enc.GetSHA256(Clave);
                    us.FechaActualizacion = DateTime.Now;
                    db.SaveChanges();
                    s.Tipo = 1;
                    s.Msj = "Exito. Verifique el correo.";
                }
                else
                {
                    s.Tipo = 2;
                    s.Msj = "Se produjo un error con el correo";
                }
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = "Se produjo un error comuniquese con el administrador";
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
    }
}