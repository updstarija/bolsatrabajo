using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Mvc;
using System.Data;

namespace BolsaDeTrabajo.Controllers
{
    public class AdministradoresController : Controller
    {
        // GET: Administradores
        private UPDS_BDTEntities db = new UPDS_BDTEntities();
        //[Authorize(Roles = "Administrador")]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x=> x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        /*ADMINISTRAR USUARIOS ADMINS*/

        //[Authorize(Roles = "Administrador")]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Admins()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    ViewBag.tCarreras = db.CarreraBDT.ToList();
                    ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult GuardarAdmin(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    bool Existencia = false;
                    int IdAdministrador = int.Parse(form["IdAdministrador"]);
                    string correo = form["Correo"];
                    string Documento = form["NroDocumento"];
                    Administrador admin = IdAdministrador == -1 ? new Administrador() : bd.Administrador.Where(c => c.Id == IdAdministrador).SingleOrDefault();
                    if (IdAdministrador == -1)
                    {
                        var obj = bd.Candidato.Where(x => x.Perfil.Usuario.Correo == correo || x.NroDocumento == Documento).SingleOrDefault();
                        Existencia = obj == null ? false : true;
                    }
                    else
                    {
                        if (admin.Perfil.Usuario.Correo == correo && admin.NroDocumento == Documento)
                        {
                            Existencia = false;
                        }
                        else if (admin.Perfil.Usuario.Correo == correo && admin.NroDocumento != Documento)
                        {
                            var obj = bd.Administrador.Where(x => x.NroDocumento == Documento).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                        else if (admin.Perfil.Usuario.Correo != correo && admin.NroDocumento == Documento)
                        {
                            var obj = bd.Administrador.Where(x => x.Perfil.Usuario.Correo == correo).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                        else if (admin.Perfil.Usuario.Correo != correo && admin.NroDocumento != Documento)
                        {
                            var obj = bd.Administrador.Where(x => x.Perfil.Usuario.Correo == correo || x.NroDocumento == Documento).SingleOrDefault();
                            Existencia = obj == null ? false : true;
                        }
                    }
                    if (Existencia == false)
                    {
                        bool VerificacionCorreo = false;
                        Perfil perfil = IdAdministrador == -1 ? new Perfil() : bd.Perfil.Where(p => p.Id == admin.Perfil.Id).SingleOrDefault();
                        Usuario usuario = IdAdministrador == -1 ? new Usuario() : bd.Usuario.Where(u => u.Id == perfil.Usuario.Id).SingleOrDefault();
                        Img img = new Img();
                        perfil.Descripcion = form["Descripcion"];
                        if (form["TelefonoCelular"] != "") { perfil.TelefonoCelular = form["TelefonoCelular"]; }
                        if (form["TelefonoFijo"] != "") { perfil.TelefonoFijo = form["TelefonoFijo"]; }
                        perfil.Tipo = "ADMINISTRADOR";
                        perfil.Pais = form["Pais"];
                        perfil.EstadoRegion = form["EstadoRegion"];
                        perfil.Ciudad = form["Ciudad"];
                        perfil.FechaActualizacion = DateTime.Now;
                        if (Request.Files[0].InputStream.Length != 0)
                        {
                            perfil.Foto = img.GetBytess(Request.Files[0].InputStream);
                        }
                        if (IdAdministrador == -1)
                        {
                            perfil.Estado = "Activo";
                            perfil.FechaRegistro = DateTime.Now;
                            bd.Perfil.Add(perfil);
                        }
                        bd.SaveChanges();
                        if (IdAdministrador != -1)
                        {
                            VerificacionCorreo = usuario.Correo == form["Correo"] ? false : true;
                        }
                        usuario.Correo = form["Correo"];
                        var password = form["Clave"];
                        if (password != null)
                        {
                            EncriptarClass enc = new EncriptarClass();
                            usuario.Clave = enc.GetSHA256(form["Clave"]);
                        }
                        usuario.FechaActualizacion = DateTime.Now;
                        if (IdAdministrador == -1)
                        {
                            usuario.Rol = "Administrador";
                            usuario.Id = perfil.Id;
                            bd.Usuario.Add(usuario);
                        }
                        bd.SaveChanges();

                        admin.Nombre = form["Nombre"];
                        admin.Apellido = form["Apellido"];
                        admin.TipoDeDocumento = form["TipoDeDocumento"];
                        admin.NroDocumento = form["NroDocumento"];
                        admin.FechaNacimiento = Convert.ToDateTime(form["FechaNacimiento"]);
                        admin.Sexo = form["Sexo"];
                        if (form["Direccion"] != "")
                        {
                            admin.Direccion = form["Direccion"];
                        }
                        if (form["Profesion"] != "")
                        {
                            admin.Profesion = form["Profesion"];
                        }
                        if (IdAdministrador == -1)
                        {
                            admin.Id = perfil.Id;
                            bd.Administrador.Add(admin);
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
                            s.Msj = "Exito al guardar, Se requiere reiniciar la sesion";
                        }
                    }
                    else
                    {
                        s.Tipo = 5;
                        s.Msj = "La cuenta ya se encuentra registrada (Correo o Administrador existente)";
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

        [Authorize(Roles = "Administrador")]
        public ActionResult getAdmin(int Id)
        {
            Administrador admin = db.Administrador.Where(e => e.Id == Id).SingleOrDefault();
            AdministradorC administradorC = new AdministradorC();
            administradorC = administradorC.CargarAdministradorC(admin);
            return Json(administradorC, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult getTableAdmins()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);

            var Admins = db.Administrador.OrderBy(e => e.Perfil.FechaRegistro).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Admins)
            {
                i++;
                ObjectAnonimo obj = new ObjectAnonimo();
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Nombre + " " + item.Apellido;
                obj.atrib4 = item.NroDocumento;
                obj.atrib5 = item.FechaNacimiento.ToString("dd/MM/yyyy");
                obj.atrib6 = item.Sexo == "Masculino" ? "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>" : "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                obj.atrib7 = item.Perfil.Usuario.Correo;
                string activ = item.Perfil.Estado == "Activo" ? "selected" : "";
                string inactiv = item.Perfil.Estado == "Inactivo" ? "selected" : "";
                obj.atrib8 = @"<select class='custom-select' id='Administrador" + item.Id + @"' name='Administrador[]' onchange='ActualizarEstado(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activo'>Activo</option>
                                <option " + inactiv + @" value='Inactivo'>Inactivo</option>
                            </select>";
                obj.atrib9 = "<div class='d-flex flex-nowrap w-100 justify-content-center'>";
                if (us.Correo == item.Perfil.Usuario.Correo)
                {
                    obj.atrib9 += "<button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarAdministrador' onclick='CargarDatosAdministrador(" + item.Id + ")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>";
                }
                else
                {
                    obj.atrib9 += "<div style='width: 33px;'></div>";
                }
                obj.atrib9 += "<button type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalAdministrador' onclick='VerAdministrador(" + item.Id + @")'><i class='fas fa-info ico-blue ico-animation fa-lg'></i></button>";
                obj.atrib9 += "</div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult getTableAdminsByEstado(string Estado)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);

            var Admins = db.Administrador.Where(x => x.Perfil.Estado == Estado).OrderBy(e => e.Perfil.FechaRegistro).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Admins)
            {
                i++;
                ObjectAnonimo obj = new ObjectAnonimo();
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Nombre + " " + item.Apellido;
                obj.atrib4 = item.NroDocumento;
                obj.atrib5 = item.FechaNacimiento.ToString("dd/MM/yyyy");
                obj.atrib6 = item.Sexo == "Masculino" ? "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>" : "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                obj.atrib7 = item.Perfil.Usuario.Correo;
                string activ = item.Perfil.Estado == "Activo" ? "selected" : "";
                string inactiv = item.Perfil.Estado == "Inactivo" ? "selected" : "";
                obj.atrib8 = @"<select class='custom-select' id='Administrador" + item.Id + @"' name='Administrador[]' onchange='ActualizarEstado(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activo'>Activo</option>
                                <option " + inactiv + @" value='Inactivo'>Inactivo</option>
                            </select>";
                obj.atrib9 = "<div class='d-flex flex-nowrap w-100 justify-content-center'>";
                if (us.Correo == item.Perfil.Usuario.Correo)
                {
                    obj.atrib9 += "<button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarAdministrador' onclick='CargarDatosAdministrador(" + item.Id + ")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>";
                }
                obj.atrib9 += "<button type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalAdministrador' onclick='VerAdministrador(" + item.Id + @")'><i class='fas fa-info ico-blue ico-animation fa-lg'></i></button>";
                obj.atrib9 += "</div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public ActionResult EditarEstadoAdmin(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    int IdAdministrador = int.Parse(form["IdAdministrador"]);
                    string estado = form["Estado"];
                    Administrador admin = bd.Administrador.SingleOrDefault(x => x.Id == IdAdministrador);
                    admin.Perfil.Estado = estado;
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

        /**********************************ADMINISTRAR EMPRESAS*******************************/
        //[Authorize(Roles = "Administrador")]
        [OutputCache(NoStore = true, Duration = 0, VaryByParam = "None")]
        public ActionResult Empresas()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult getTableEmpresas()
        {
            var Empresas = db.Empresa.OrderBy(e => e.Perfil.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Empresas)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.NIT;
                obj.atrib4 = item.NombreEmpresa;
                obj.atrib5 = item.Perfil.Usuario.Correo;
                obj.atrib6 = item.NombrePersonaResponsable;
                obj.atrib7 = item.Perfil.EstadoRegion;
                string activ = item.Perfil.Estado == "Activo" ? "selected" : "";
                string desaprob = item.Perfil.Estado == "Inactiva" ? "selected" : "";
                obj.atrib8 = @"<select class='custom-select' id='Empresa" + item.Id + @"' name='Empresa[]' onchange='ActualizarEstado(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activa'>Activa</option>
                                <option " + desaprob + @" value='Inactiva'>Inactiva</option>
                            </select>";
                obj.atrib9 = @"<div class='d-flex flex-nowrap'>
                                <a class='btn tooltip-test px-1' title='VER EMPLEOS' href='" + baseUrl + "Administradores/EmpleosByEmpresa?Id=" + item.Id + @"'><i class='fas fa-eye ico-gray ico-animation fa-lg'></i></a>
                                <button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarEmpresa' onclick='CargarDatosEmpresa(" + item.Id + @")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>                                
                                <button type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpresa' onclick='VerEmpresa(" + item.Id + @")'><i class='fas fa-info ico-blue ico-animation fa-lg'></i></button>
                            </div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult getTableEmpresasByEstado(string Estado)
        {
            var Empresas = db.Empresa.Where(x => x.Perfil.Estado == Estado).OrderBy(e => e.Perfil.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in Empresas)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.NIT;
                obj.atrib4 = item.NombreEmpresa;
                obj.atrib5 = item.Perfil.Usuario.Correo;
                obj.atrib6 = item.NombrePersonaResponsable;
                obj.atrib7 = item.Perfil.EstadoRegion;
                string activ = item.Perfil.Estado == "Activa" ? "selected" : "";
                string desaprob = item.Perfil.Estado == "Inactiva" ? "selected" : "";
                obj.atrib8 = @"
                            <select class='custom-select' id='Empresa" + item.Id + @"' name='Empresa[]' onchange='ActualizarEstado(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activa'>Activa</option>
                                <option " + desaprob + @" value='Inactiva'>Inactiva</option>
                            </select>
                ";
                obj.atrib9 = @"
                            <div class='d-flex flex-nowrap'>
                                <a class='btn tooltip-test px-1' title='VER EMPLEOS' href='" + baseUrl + "Administradores/EmpleosByEmpresa?Id=" + item.Id + @"'><i class='fas fa-eye ico-gray ico-animation fa-lg'></i></a>
                                <button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarEmpresa' onclick='CargarDatosEmpresa(" + item.Id + @")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>                                
                                <button  type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpresa' onclick='VerEmpresa(" + item.Id + @")'><i class='fas fa-info ico-blue ico-animation fa-lg'></i></button>
                            </div>
                ";

                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public ActionResult EditarEstadoEmpresa(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    int IdEmpresa = int.Parse(form["IdEmpresa"]);
                    string estado = form["Estado"];
                    Empresa empresa = bd.Empresa.SingleOrDefault(x => x.Id == IdEmpresa);
                    empresa.Perfil.Estado = estado;
                    bd.SaveChanges();
                    Correo o = new Correo();
                    string Asunto = estado == "Activa" ? "Cuenta Habilitada en Bolsa de Trabajo" : "Cuenta Inhabilitada en Bolsa de Trabajo";
                    string estad = estado == "Activa" ? "Habilitada" : "Inhabilitada por infringir las normas de la pagina";
                    string textMensaje = empresa.NombreEmpresa + ": Su cuenta " + empresa.Perfil.Usuario.Correo + " a sido " + estad + ". Para más información escribanos al correo UPDS_BolsaDeTrabajo@outlook.com";
                    Mensaje m = new Mensaje();
                    var r = o.enviarCorreo(textMensaje, Asunto, empresa.Perfil.Usuario.Correo, "", "");
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

        //[Authorize(Roles = "Administrador")]
        public ActionResult EmpleosByEmpresa(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    ViewBag.IdEmpresa = Id;
                    ViewBag.tCategoria = db.CategoriaBDT.ToList();
                    ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
                    ViewBag.NombreEmpresa = db.Empresa.Single(x => x.Id == Id).NombreEmpresa;
                    Usuario ua = db.Usuario.Where(x => x.Id == Id).SingleOrDefault();
                    ViewBag.Correo = ua.Correo;
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult getTableEmpleosByEmpresa(int Id)
        {
            var empleos = db.Empleo.Where(em => em.Empresa.Perfil.Id == Id).OrderBy(e => e.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            var TotalRegistros = 0;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in empleos)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.FechaActualizacion?.ToString("dd/MM/yyyy");
                obj.atrib4 = item.Titulo;
                obj.atrib5 = item.Contrato;
                obj.atrib6 = item.CorreoEnvioPostulaciones;
                TotalRegistros = item.Postulante.Where(x => x.Estado != "Cancelado").Count();
                obj.atrib7 = TotalRegistros.ToString() + " ";
                if (TotalRegistros != 0)
                {
                    obj.atrib7 += "<a class='tooltip-test' title='POSTULANTES' href='" + baseUrl + "Administradores/PostulantesByEmpleo?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib8 = item.FechaExpiracion?.ToString("dd/MM/yyyy HH:mm");
                string activ = item.Estado == "Activo" ? "selected" : "";
                string inactiv = item.Estado == "Inactivo" ? "selected" : "";
                string vencid = item.Estado == "Expirado" ? "selected" : "";
                obj.atrib9 += @"
                            <select class='custom-select' id='Empleo" + item.Id + @"' name='Empleo[]' onchange='ActualizarEstadoEmpleo(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activo'>Activo</option>
                                <option " + inactiv + @" value='Inactivo'>Inactivo</option>
                                <option disabled " + vencid + @" value='Expirado'>Expirado</option>
                            </select>
                ";
                obj.atrib10 = @"
                <div class='d-flex flex-nowrap'>
                                <button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarEmpleo' onclick='CargarDatosEmpleo(" + item.Id + @")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>
                                <button type='button' class='btn tooltip-test px-1' title='ELIMINAR' onclick=EliminarEmpleo(" + item.Id + @")><i class='fas fa-trash ico-gray ico-animation fa-lg'></i></button>
                                <button type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpleo' onclick='VerEmpleo(" + item.Id + @")'><i class='fas fa-info-circle ico-blue ico-animation fa-lg'></i></button>
                            </div>
                ";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult getTableEmpleosByEstado(string Estado, int Id)
        {
            var empleos = db.Empleo.Where(em => em.IdEmpresa == Id && em.Estado == Estado).OrderBy(e => e.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            var TotalRegistros = 0;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in empleos)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.FechaActualizacion?.ToString("dd/MM/yyyy");
                obj.atrib4 = item.Titulo;
                obj.atrib5 = item.Contrato;
                obj.atrib6 = item.CorreoEnvioPostulaciones;
                TotalRegistros = item.Postulante.Where(x => x.Estado != "Cancelado").Count();
                obj.atrib7 = TotalRegistros.ToString() + " ";
                if (TotalRegistros != 0)
                {
                    obj.atrib7 += "<a class='tooltip-test' title='POSTULANTES' href='" + baseUrl + "Administradores/PostulantesByEmpleo?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib8 = item.FechaExpiracion?.ToString("dd/MM/yyyy HH:mm");
                string activ = item.Estado == "Activo" ? "selected" : "";
                string inactiv = item.Estado == "Inactivo" ? "selected" : "";
                string vencid = item.Estado == "Expirado" ? "selected" : "";
                obj.atrib9 += @"
                            <select class='custom-select' id='Empleo" + item.Id + @"' name='Empleo[]' onchange='ActualizarEstadoEmpleo(this," + item.Id + @")'> 
                                <option " + activ + @" value='Activo'>Activo</option>
                                <option " + inactiv + @" value='Inactivo'>Inactivo</option>
                                <option disabled " + vencid + @" value='Expirado'>Expirado</option>
                            </select>
                ";
                obj.atrib10 = @"
                <div class='d-flex flex-nowrap'>
                                <button type='button' class='btn btn-link tooltip-test' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarEmpleo' onclick='CargarDatosEmpleo(" + item.Id + @")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>
                                <button  type='button' class='btn btn-link tooltip-test' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpleo' onclick='VerEmpleo(" + item.Id + @")'><i class='fas fa-info-circle ico-blue ico-animation fa-lg'></i></button>
                            </div>
                ";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Administrador")]
        public ActionResult ActualizarEstadoEmpleoByEmpresa(int IdEmpleo, string Estado)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    Empleo empleo = bd.Empleo.SingleOrDefault(x => x.Id == IdEmpleo);
                    empleo.Estado = Estado;
                    bd.SaveChanges();

                    Correo o = new Correo();
                    string Asunto = Estado == "Activo" ? "Empleo Habilitado en Bolsa de Trabajo" : "Empleo Inhabilitado en Bolsa de Trabajo";
                    string estad = Estado == "Activo" ? "Habilitada" : "Inhabilitada por infringir las normas de la pagina";
                    string textMensaje = empleo.Empresa.NombreEmpresa + ": Su Empleo con Id: " + empleo.Id + " Titulo: '" + empleo.Titulo + "' a sido " + estad + ". Para más información escribanos al correo UPDS_BolsaDeTrabajo@outlook.com";
                    Mensaje m = new Mensaje();
                    var r = o.enviarCorreo(textMensaje, Asunto, empleo.CorreoEnvioPostulaciones, "", "");
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

        //[Authorize(Roles = "Administrador")]
        public ActionResult PostulantesByEmpleo(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    UPDS_BDTEntities db = new UPDS_BDTEntities();
                    ViewBag.IdEmpleo = Id;
                    var empleo = db.Empleo.Single(x => x.Id == Id);
                    ViewBag.IdEmpresa = empleo.IdEmpresa;
                    ViewBag.NombreEmpresa = empleo.Empresa.NombreEmpresa;
                    ViewBag.NombreEmpleo = empleo.Titulo;
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult ListaPostulantesByEmpleo(int IdEmpleo)
        {
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            Empleo emp = db.Empleo.Where(x => x.Id == IdEmpleo).SingleOrDefault();
            var postulantes = new List<Postulante>();
            if (emp.Estado == "Activo")
            {
                postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado" && x.Curriculum.Estado == "Activo").ToList();
            }
            else
            {
                postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado").ToList();
            }
            int i = 0;
            foreach (var item in postulantes)
            {
                i++;
                ObjectAnonimo obj = new ObjectAnonimo();
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.Candidato.Nombre + ' ' + item.Curriculum.Candidato.Apellido;
                obj.atrib4 = item.Curriculum.Candidato.Nacionalidad;
                obj.atrib5 = item.Curriculum.Candidato.Sexo == "Masculino" ? "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>" : "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                obj.atrib6 = item.Estado;
                obj.atrib7 = "<div class='d-flex flex-nowrap'><button  type='button'class='btn btn-sm btn-link' data-toggle='modal' data-target='#ModalPostulante' onclick='VerPostulante(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button> <button type='button' class='btn btn-sm btn-link' onclick='VerCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Administrador")]
        [HttpPost]
        public ActionResult ListaPostulantesByEstado(FormCollection form)
        {
            int IdEmpleo = int.Parse(form["IdEmpleo"]);
            string filtroEstado = form["Estado"];
            var Postulantes = db.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado != "Cancelado" && x.Estado == filtroEstado).ToList();
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            Empleo emp = db.Empleo.Where(x => x.Id == IdEmpleo).SingleOrDefault();
            string statusCheckbox = emp.Estado == "Inactivo" ? "disabled" : "";
            int i = 0;
            foreach (var item in Postulantes)
            {
                i++;
                ObjectAnonimo obj = new ObjectAnonimo();
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Curriculum.Candidato.Nombre + ' ' + item.Curriculum.Candidato.Apellido;
                obj.atrib4 = item.Curriculum.Candidato.Nacionalidad;
                obj.atrib5 = item.Curriculum.Candidato.Sexo == "Masculino" ? "<i class='fas fa-male ico-blue tooltip-test w-100 text-center' title='MASCULINO'></i>" : "<i class='fas fa-female ico-red tooltip-test w-100 text-center' title='FEMENINO'></i>";
                obj.atrib6 = item.Estado;
                obj.atrib7 = "<div class='d-flex flex-nowrap'><button  type='button'class='btn btn-sm btn-link' data-toggle='modal' data-target='#ModalPostulante' onclick='VerPostulante(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button> <button type='button' class='btn btn-sm btn-link' onclick='VerCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></i></button></div>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        //ADMINISTRAR CANDIDATOS------------------------------------------------------------------------------------------------

        //[Authorize(Roles = "Administrador")]
        public ActionResult CandidatoIndex()
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult getTableCandidatos()
        {
            var candidato = db.Candidato.OrderByDescending(x => x.Perfil.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in candidato)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Nombre + " " + item.Apellido;
                obj.atrib4 = item.NroDocumento;
                obj.atrib5 = item.Perfil.Ciudad;
                obj.atrib6 = "<button type='button' class='btn btn-Blue ml-4' data-toggle='modal' data-target='#MasInfoModal'  onclick='verdetallecandidato(" + item.Id + ")'><i class='fas fa-question - circle' ></ i ></button>";
                obj.atrib7 = "<div class='w-100 d-flex justify-content-center'><a href = '" + baseUrl + "Administradores/CurriculumsIndex?Id=" + item.Id + "' class='tooltip-test' title='Ver Invitación'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a></div>";
                if (item.Perfil.Estado == "Activo")
                {
                    obj.atrib8 = "<div class='d-flex flex-nowrap'><select class='custom-select' id='cambioestadoC" + item.Id + "' onchange='CambioEstado(this," + item.Id + ")'><option value=" + item.Perfil.Estado + ">" + item.Perfil.Estado + "</option><option value='Inactivo'>Inactivo</select></div>";
                }
                else
                {
                    obj.atrib8 = "<div class='d-flex flex-nowrap'><select class='custom-select' id='cambioestadoC" + item.Id + "' onchange='CambioEstado(this," + item.Id + ")'><option value=" + item.Perfil.Estado + ">" + item.Perfil.Estado + "</option><option value='Activo'>Activo</select></div>";
                }

                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult getCandidato(int Id)
        {
            Candidato can = db.Candidato.SingleOrDefault(x => x.Id == Id);
            CandidatoC candidato = new CandidatoC();
            candidato = candidato.cargarCandidato(can);
            var json = Json(candidato, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 5000000;
            return json;

        }
        //[Authorize(Roles = "Administrador")]
        public ActionResult CurriculumsIndex(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    UPDS_BDTEntities db = new UPDS_BDTEntities();
                    ViewBag.IdCurriculum = Id;
                    var candidato = db.Candidato.Single(x => x.Id == Id);
                    ViewBag.NombreCandidato = candidato.Nombre + " " + candidato.Apellido;
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult getCurriculums(int Id)
        {
            var curriculums = db.Curriculum.Where(x => x.IdCandidato == Id && x.Estado!="Eliminado").ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in curriculums)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Titulo;
                obj.atrib4 = item.Contrato;
                obj.atrib5 = item.PretencionSalarial.ToString();
                obj.atrib6 = "<div class='d-flex flex-nowrap justify-content-center' style='width:100%;'><button type='button' class='btn px-1' data-toggle='modal' data-target='#ModalCurriculum' title='Curriculums'   onclick='verdetallecurriculums(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><a class='btn px-1' href = '" + baseUrl + "Administradores/PostulacionesIndex?Id=" + item.Id + "' class='tooltip-test' title='Postulaciones'><i class='fas ico-animation ico-blue fa-users'></i></a><button type='button' class='btn px-1' title='Imprimir'   onclick='imprimirCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                if (item.Estado == "Activo")
                {
                    obj.atrib7 = "<div class='d-flex flex-nowrap'><select id='cambioCurriculums" + item.Id + "' onchange='CambioEstadoCurriculumCandidato(this," + item.Id + ")' class='custom-select' aria-label='.form-select-lg example'><option value = " + item.Estado + "> " + item.Estado + " </option><option value = 'Inactivo'> Inactivo </option></select></div>";
                }
                else
                {
                    obj.atrib7 = "<div class='d-flex flex-nowrap'><select id='cambioCurriculums" + item.Id + "'' onchange='CambioEstadoCurriculumCandidato(this," + item.Id + ")' class='custom-select' aria-label='.form-select-lg example'><option value = " + item.Estado + "> " + item.Estado + " </option><option value = 'Activo'> Activo </option></select></div>";
                }
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Administrador")]
        public ActionResult cambioEstado(int Id, string Estado)
        {
            status s = new status();
            try
            {
                Perfil per = db.Perfil.SingleOrDefault(x => x.Id == Id);
                per.Estado = Estado;
                db.SaveChanges();
                if (Estado == "Inactivo")
                {
                    Correo co = new Correo();
                    var datos = db.Candidato.SingleOrDefault(x => x.Id == Id);
                    string carta = "Sr. " + datos.Nombre + " " + datos.Apellido + " Su cuenta fue Inhabilitada por infringir las normas de la pagina. Para más información escribamos al correo UPDS_BolsaDeTrabajo@outlook.com";
                    co.enviarCorreo(carta, "Cuenta Inhabilitada ", datos.Perfil.Usuario.Correo, "", "");
                    s.Tipo = 1;
                    s.Msj = "Cambio Exito";
                }
                else
                {
                    Correo co = new Correo();
                    var datos = db.Candidato.SingleOrDefault(x => x.Id == Id);
                    string carta = "Sr. " + datos.Nombre + " " + datos.Apellido + " Su cuenta fue habilitada, ";
                    co.enviarCorreo(carta, "Cuenta habilitada ", datos.Perfil.Usuario.Correo, "", "");
                    s.Tipo = 1;
                    s.Msj = "Cambio Exito";
                }

            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult cambioEstadoCurriculum(int Id, string Estado)
        {
            status s = new status();
            try
            {
                Curriculum cur = db.Curriculum.SingleOrDefault(x => x.Id == Id);
                cur.Estado = Estado;
                db.SaveChanges();
                if (Estado == "Inactivo")
                {
                    // Correo co = new Correo();
                    var curriculo = db.Curriculum.SingleOrDefault(x => x.Id == Id);
                    string carta = "Sr. " + curriculo.DatosPersonales.Nombre + " " + curriculo.DatosPersonales.Apellido + " Su Curriculum " + curriculo.Titulo + "  fue Inhabilitad por infringir las normas de la pagina. Para más información escribamos al correo UPDS_BolsaDeTrabajo@outlook.com";
                    Notificacion notificacion = new Notificacion();
                    notificacion.Titulo = "Curriculum Inhabilitado";
                    notificacion.Descripcion = "El Curriculum <span>" + curriculo.Titulo + "</span> fue Inhabilitado, por lo tanto ya no estara disponible para posibles Empresas que requieran ver el curriculum.";
                    notificacion.Tipo = "Curriculum";
                    notificacion.FechaRegistro = DateTime.Now;
                    notificacion.FechaActualizacion = DateTime.Now;
                    notificacion.Estado = "Pendiente";
                    notificacion.Emisor = "Sistema";
                    notificacion.Receptor = "Candidato";
                    notificacion.IdCurriculum = curriculo.Id;
                    db.Notificacion.Add(notificacion);
                    db.SaveChanges();
                    // co.enviarCorreo("UPDS_BolsaDeTrabajo@outlook.com", "BDT2021upds", carta, "Curriculum Inhabilitad ", curriculo.Candidato.Perfil.Usuario.Correo, "", "");
                    s.Tipo = 1;
                    s.Msj = "Cambio Exito";
                }
                else
                {
                    //Correo co = new Correo();
                    var curriculo = db.Curriculum.SingleOrDefault(x => x.Id == Id);
                    string carta = "Sr. " + curriculo.DatosPersonales.Nombre + " " + curriculo.DatosPersonales.Apellido + " Su Curriculum " + curriculo.Titulo + "  fue habilitado.";
                    //co.enviarCorreo("UPDS_BolsaDeTrabajo@outlook.com", "BDT2021upds", carta, "Curriculum habilitado ", curriculo.Candidato.Perfil.Usuario.Correo, "", "");
                    Notificacion notificacion = new Notificacion();
                    notificacion.Titulo = "Curriculum Habilitado";
                    notificacion.Descripcion = "El Curriculum <span>" + curriculo.Titulo + "</span> fue habilitado, por lo tanto ya  estara disponible para posibles Empresas que requieran ver el curriculum.";
                    notificacion.Tipo = "Curriculum";
                    notificacion.FechaRegistro = DateTime.Now;
                    notificacion.FechaActualizacion = DateTime.Now;
                    notificacion.Estado = "Pendiente";
                    notificacion.Emisor = "Sistema";
                    notificacion.Receptor = "Candidato";
                    notificacion.IdCurriculum = curriculo.Id;
                    db.Notificacion.Add(notificacion);
                    db.SaveChanges();
                    s.Tipo = 1;
                    s.Msj = "Cambio Exito";

                }
                s.Tipo = 1;
                s.Msj = "Cambio Exito";
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult FiltrarCandidatos(string Filtro)
        {
            var candidato = db.Candidato.Where(x => x.Perfil.Estado == Filtro).OrderByDescending(x => x.Perfil.FechaRegistro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in candidato)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.Perfil.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Nombre + " " + item.Apellido;
                obj.atrib4 = item.NroDocumento;
                obj.atrib5 = item.Perfil.Ciudad;
                obj.atrib6 = "<button type='button' class='btn btn-Blue ml-4' data-toggle='modal' data-target='#MasInfoModal'  onclick='verdetallecandidato(" + item.Id + ")'><i class='fas fa-question - circle' ></ i ></button>";
                obj.atrib7 = "<div class='w-100 d-flex justify-content-center'><a href = '" + baseUrl + "Administradores/CurriculumsIndex?Id=" + item.Id + "' class='tooltip-test' title='Ver Invitación'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a></div>";
                if (item.Perfil.Estado == "Activo")
                {
                    obj.atrib8 = "<div class='d-flex flex-nowrap'><select class='custom-select' id='cambioestadoC" + item.Id + "' onchange='CambioEstado(this," + item.Id + ")'><option value=" + item.Perfil.Estado + ">" + item.Perfil.Estado + "</option><option value='Inactivo'>Inactivo</select></div>";
                }
                else
                {
                    obj.atrib8 = "<div class='d-flex flex-nowrap'><select class='custom-select' id='cambioestadoC" + item.Id + "' onchange='CambioEstado(this," + item.Id + ")'><option value=" + item.Perfil.Estado + ">" + item.Perfil.Estado + "</option><option value='Activo'>Activo</select></div>";
                }
                tabla.Add(obj);
            }

            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult FiltrarCurriculums(int Id, string Filtro)
        {
            var curriculums = db.Curriculum.Where(x => x.IdCandidato == Id && x.Estado == Filtro).ToList();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in curriculums)
            {
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.Titulo;
                obj.atrib4 = item.Contrato;
                obj.atrib5 = item.PretencionSalarial.ToString();
                obj.atrib6 = "<div class='ml-3' style='width:100%;margin:0;'><button type='button' class='btn  ml-3' data-toggle='modal' data-target='#ModalCurriculum' title='Curriculums'   onclick='verdetallecurriculums(" + item.Id + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button><a href = '" + baseUrl + "Administradores/PostulacionesIndex?Id=" + item.Id + "' class='tooltip-test' title='Postulaciones'><i class='fas ico-animation ico-blue fa-users'></i></a><button type='button' class='btn ml-3' title='Imprimir'   onclick='imprimirCurriculum(" + item.Id + ")'><i class='fas fa-print ico-gray ico-animation fa-lg'></i></button></div>";
                if (item.Estado == "Activo")
                {
                    obj.atrib7 = "<div class='d-flex flex-nowrap'><select id='cambioCurriculums" + item.Id + "' onchange='CambioEstadoCurriculumCandidato(this," + item.Id + ")' class='custom-select' aria-label='.form-select-lg example'><option value = " + item.Estado + "> " + item.Estado + " </option><option value = 'Inactivo'> Inactivo </option></select></div>";
                }
                else
                {
                    obj.atrib7 = "<div class='d-flex flex-nowrap'><select id='cambioCurriculums" + item.Id + "'' onchange='CambioEstadoCurriculumCandidato(this," + item.Id + ")' class='custom-select' aria-label='.form-select-lg example'><option value = " + item.Estado + "> " + item.Estado + " </option><option value = 'Activo'> Activo </option></select></div>";
                }
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
        //[Authorize(Roles = "Administrador")]
        public ActionResult PostulacionesIndex(int Id)
        {
            if (User.Identity.IsAuthenticated)
            {
                if ((db.Usuario.SingleOrDefault(x => x.Correo == User.Identity.Name && x.Rol == "Administrador")) != null)
                {
                    UPDS_BDTEntities db = new UPDS_BDTEntities();
                    var curri = db.Curriculum.Single(x => x.Id == Id);
                    ViewBag.IdCandidato = curri.Candidato.Id;
                    ViewBag.NombreCandidato = curri.Candidato.Nombre + " " + curri.Candidato.Apellido;
                    ViewBag.IdCurriculum = Id;
                    ViewBag.Nombrecurricumlu = curri.Titulo;
                    return View();
                }
                else
                {
                    return RedirectToAction("Login", "Home");
                }
            }
            else
            {
                return RedirectToAction("Login", "Home");
            }
        }
        [Authorize(Roles = "Administrador")]
        public ActionResult GetPostulaciones(int Id)
        {
            var Postulaciones = db.Postulante.Where(x => x.IdCurriculum == Id).ToList();
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
                obj.atrib5 = item.Empleo.Ciudad;
                obj.atrib6 = item.Aceptado;
                obj.atrib7 = "<button type='button' class='btn  ml-3' data-toggle='modal' data-target='#ModalEmpleo' title='Ver Empleo'   onclick='verdetalleEmpleo(" + item.IdEmpleo + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);

        }
        [Authorize(Roles = "Administrador")]
        public ActionResult GetPostulacionesByEstado(int Id, string Estado)
        {
            var Postulaciones = db.Postulante.Where(x => x.IdCurriculum == Id && x.Aceptado == Estado).ToList();
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
                obj.atrib5 = item.Empleo.Ciudad;
                obj.atrib6 = item.Aceptado;
                obj.atrib7 = "<button type='button' class='btn  ml-3' data-toggle='modal' data-target='#ModalEmpleo' title='Ver Empleo'   onclick='verdetalleEmpleo(" + item.IdEmpleo + ")'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></button>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);

        }

        public ActionResult StatisticsEmpresas()
        {
            int activa = db.Empresa.Count(x => x.Perfil.Tipo == "EMPRESA" && x.Perfil.Estado == "Activa");
            int desaprobada = db.Empresa.Count(x => x.Perfil.Tipo == "EMPRESA" && x.Perfil.Estado == "Inactiva");
            var o = new
            {
                activa,
                desaprobada
            };
            return Json(o, JsonRequestBehavior.AllowGet);
        }

        public ActionResult StatisticsCandidatos()
        {
            int activo = db.Candidato.Count(x => x.Perfil.Tipo == "CANDIDATO" && x.Perfil.Estado == "Activo");
            int inicativo = db.Candidato.Count(x => x.Perfil.Tipo == "CANDIDATO" && x.Perfil.Estado == "Inactivo");
            var o = new
            {
                activo,
                inicativo
            };
            return Json(o, JsonRequestBehavior.AllowGet);
        }

        public ActionResult StatisticsAdministradores()
        {
            int activo = db.Administrador.Count(x => x.Perfil.Tipo == "ADMINISTRADOR" && x.Perfil.Estado == "Activo");
            int inicativo = db.Administrador.Count(x => x.Perfil.Tipo == "ADMINISTRADOR" && x.Perfil.Estado == "Inactivo");
            var o = new
            {
                activo,
                inicativo
            };
            return Json(o, JsonRequestBehavior.AllowGet);
        }

        public ActionResult StatisticsTotal()
        {
            int empresas = db.Empresa.Count(x => x.Perfil.Tipo == "EMPRESA");
            int candidatos = db.Candidato.Count(x => x.Perfil.Tipo == "CANDIDATO");
            int administradores = db.Administrador.Count(x => x.Perfil.Tipo == "ADMINISTRADOR");
            int total = empresas + candidatos + administradores;
            var o = new
            {
                empresas,
                candidatos,
                administradores,
                total
            };
            return Json(o, JsonRequestBehavior.AllowGet);
        }

        //public JsonResult DashboardEmpresa()
        //{
        //    SqlConnection con = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa;Password=Control123+;");
        //    SqlCommand cmd = new SqlCommand();
        //    cmd.CommandText = "select COUNT(Estado) from Perfil where Perfil.Estado='activo' and  Perfil.Tipo='empresa';";
        //    cmd.CommandType = CommandType.Text;
        //    cmd.Connection= con;
        //    con.Open();
        //    SqlConnection co = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa;Password=Control123+;");
        //    SqlCommand cm = new SqlCommand();
        //    cm.CommandText = "select COUNT(Estado) from Perfil where Perfil.Estado='desaprobado' and  Perfil.Tipo='empresa';";
        //    cm.CommandType = CommandType.Text;
        //    cm.Connection = co;
        //    co.Open();

        //    DataTable a=new DataTable();
        //    a.Load(cmd.ExecuteReader());
        //    con.Close();
        //    DataTable b = new DataTable();
        //    b.Load(cm.ExecuteReader());
        //    co.Close();
        //    object[] data = new object[2];
        //    foreach (DataRow dr in a.Rows)
        //    {
        //        data[0]=new object[] { "Activos", dr[0] };
        //    }
        //    foreach (DataRow r in b.Rows)
        //    {
        //        data[1] = new object[] { "Inactivos", r[0] };
        //    }
        //    return Json(data, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult DashboardAdmin()
        //{
        //    SqlConnection con = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa; Password=Control123+;");
        //    SqlCommand cmd = new SqlCommand();
        //    cmd.CommandText = "select COUNT(Estado) from Perfil where Perfil.Estado='activo' and  Perfil.Tipo='administrador';";
        //    cmd.CommandType = CommandType.Text;
        //    cmd.Connection = con;
        //    con.Open();
        //    SqlConnection co = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa; Password=Control123+;");
        //    SqlCommand cm = new SqlCommand();
        //    cm.CommandText = "select COUNT(Estado) from Perfil where Perfil.Estado='inactivo' and  Perfil.Tipo='administrador';";
        //    cm.CommandType = CommandType.Text;
        //    cm.Connection = co;
        //    co.Open();

        //    DataTable a = new DataTable();
        //    a.Load(cmd.ExecuteReader());
        //    con.Close();
        //    DataTable b = new DataTable();
        //    b.Load(cm.ExecuteReader());
        //    co.Close();
        //    object[] data = new object[2];
        //    foreach (DataRow dr in a.Rows)
        //    {
        //        data[0] = new object[] { "Activos", dr[0] };
        //    }
        //    foreach (DataRow r in b.Rows)
        //    {
        //        data[1] = new object[] { "Inactivos", r[0] };
        //    }
        //    return Json(data, JsonRequestBehavior.AllowGet);
        //}

        //public JsonResult DashboardCand()
        //{
        //    SqlConnection con = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa; Password=Control123+;");
        //    SqlCommand cmd = new SqlCommand();
        //    cmd.CommandText = "select COUNT(Tipo) from Perfil where Perfil.Tipo='administrador';";
        //    cmd.CommandType = CommandType.Text;
        //    cmd.Connection = con;
        //    con.Open();
        //    SqlConnection co = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa; Password=Control123+;");
        //    SqlCommand cm = new SqlCommand();
        //    cm.CommandText = "select COUNT(Tipo) from Perfil where Perfil.Tipo='empresa';";
        //    cm.CommandType = CommandType.Text;
        //    cm.Connection = co;
        //    co.Open();
        //    SqlConnection c = new SqlConnection("Data Source=10.77.48.5;Initial Catalog=UPDS_BolsaDeTrabajo;User ID=sa; Password=Control123+;");
        //    SqlCommand ce = new SqlCommand();
        //    ce.CommandText = "select COUNT(Tipo) from Perfil where Perfil.Tipo='candidato';";
        //    ce.CommandType = CommandType.Text;
        //    ce.Connection = c;
        //    c.Open();

        //    DataTable a = new DataTable();
        //    a.Load(cmd.ExecuteReader());
        //    con.Close();
        //    DataTable b = new DataTable();
        //    b.Load(cm.ExecuteReader());
        //    co.Close();
        //    DataTable d = new DataTable();
        //    d.Load(ce.ExecuteReader());
        //    c.Close();
        //    object[] data = new object[3];
        //    foreach (DataRow dr in a.Rows)
        //    {
        //        data[0] = new object[] { "Administrador", dr[0] };
        //    }
        //    foreach (DataRow r in b.Rows)
        //    {
        //        data[1] = new object[] { "Empresas", r[0] };
        //    }
        //    foreach (DataRow re in d.Rows)
        //    {
        //        data[2] = new object[] { "Candidatos", re[0] };
        //    }
        //    return Json(data, JsonRequestBehavior.AllowGet);
        //}
    }
}




