using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Data.Entity;
using System.Net;
using System.Collections.ObjectModel;


namespace BolsaDeTrabajo.Controllers
{
    public class EmpleosController : Controller
    {
        private readonly int _RegistrosPorPagina = 4;
        private int _TotalRegistros = 0;

        private UPDS_BDTEntities db = new UPDS_BDTEntities();
        // GET: Empleos
        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Index()
        {
            ViewBag.tCategoria = db.CategoriaBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            ViewBag.Usuario = ua;
            return View();
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getAll()
        {
            UsuarioActivo ua = new UsuarioActivo();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var empleos = db.Empleo.Where(em => em.Empresa.Perfil.Id == us.Id && em.Estado != "Eliminado").ToList();
            var TotalRegistros = 0;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in empleos)
            {
                //TotalRegistros = item.Postulante.Count();
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.FechaExpiracion?.ToString("dd/MM/yyyy");
                obj.atrib4 = item.Titulo;
                obj.atrib5 = item.Contrato;
                obj.atrib6 = item.CorreoEnvioPostulaciones;
                obj.atrib7 = item.Estado;
                TotalRegistros = item.Postulante.Where(x => x.Estado != "Cancelado").Count();
                obj.atrib8 = TotalRegistros.ToString() + " ";
                if (TotalRegistros != 0)
                {

                    obj.atrib8 += "<a href='" + baseUrl + "Postulantes/Lista?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib9 = @"<div class='d-flex flex-nowrap'>
                        <button type='button' class='btn tooltip-test px-1' title='EDITAR' data-toggle='modal' data-target='#ModalRegistrarEmpleo' onclick='CargarDatosEmpleo(" + item.Id + @")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></button>
                        <button type='button' class='btn tooltip-test px-1' title='ELIMINAR' onclick=EliminarEmpleo(" + item.Id + @")><i class='fas fa-trash ico-gray ico-animation fa-lg'></i></button>
                        <button type='button' class='btn tooltip-test px-1' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpleo' onclick='VerEmpleo(" + item.Id + @")'><i class='fas fa-info-circle ico-blue ico-animation fa-lg'></i></button>
                        </div";
                tabla.Add(obj);
            }

            //var json = Json(tabla, JsonRequestBehavior.AllowGet);
            //json.MaxJsonLength = 5000000;
            //return json;
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getByEstado(string estado)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var empleos = db.Empleo.Where(em => em.Empresa.Perfil.Id == us.Id && em.Estado == estado).ToList();
            var TotalRegistros = 0;
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            List<ObjectAnonimo> tabla = new List<ObjectAnonimo>();
            int i = 0;
            foreach (var item in empleos)
            {
                TotalRegistros = item.Postulante.Count();
                ObjectAnonimo obj = new ObjectAnonimo();
                i++;
                obj.atrib1 = i.ToString();
                obj.atrib2 = item.FechaRegistro.ToString("dd/MM/yyyy");
                obj.atrib3 = item.FechaExpiracion?.ToString("dd/MM/yyyy");
                obj.atrib4 = item.Titulo;
                obj.atrib5 = item.Contrato;
                obj.atrib6 = item.CorreoEnvioPostulaciones;
                obj.atrib7 = item.Estado;
                obj.atrib8 = TotalRegistros.ToString() + " ";
                if (TotalRegistros != 0)
                {
                    obj.atrib8 += "<a href='" + baseUrl + "Postulantes/Lista?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib9 = @"
                        <a href='" + baseUrl + "Empleos/Editar?id=" + item.Id + @"'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></a>
                        <button type='button' class='btn btn-link tooltip-test' title='INFORMACIÓN' data-toggle='modal' data-target='#ModalEmpleo' onclick='VerEmpleo(" + item.Id + @")'><i class='fas fa-info-circle ico-blue ico-animation fa-lg'></i></button>
                        ";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult Empleo()
        {
            ViewBag.tCategoria = db.CategoriaBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            ViewBag.Usuario = ua;
            return View();
        }
        //EDICION EMPLEO
        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult getEmpleo(int Id)
        {
            Empleo emp = db.Empleo.Where(e => e.Id == Id).SingleOrDefault();
            EmpleoC empleoC = new EmpleoC();
            empleoC = empleoC.cargarEmpleoC(emp);
            return Json(empleoC, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult detalleEmpleo(int Id)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            Empleo empleo = db.Empleo.Where(e => e.Id == Id).SingleOrDefault();
            ViewBag.Curriculums = db.Curriculum.Where(c => c.IdCandidato == us.Id && c.Estado != "Eliminado").ToList();
            int valEstado = empleo.Postulante.Where(x => x.Curriculum.IdCandidato == us.Id && x.Estado != "Cancelado").Count();
            ViewBag.Estado = valEstado == 0 ? "0" : "Registrado";
            return View(empleo);
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getEmpleos(int Pagina)
        {
            listEmpleosC lista = new listEmpleosC();
            lista.TotalRegistros = db.Empleo.Where(x => x.Estado == "Activo" && x.Empresa.Perfil.Estado != "Desaprobado").Count();
            //var listEmpleos = db.Empleo.ToList();
            var listEmpleos = db.Empleo.Where(x => x.Estado == "Activo" && x.Empresa.Perfil.Estado != "Desaprobado").OrderByDescending(x => x.FechaRegistro)
                                                 .Skip(Pagina)
                                                 .Take(_RegistrosPorPagina)
                                                 .ToList();
            lista.empleos = lista.CargarLista(listEmpleos);
            var json = Json(lista, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 5000000;
            return json;
            //return Json(lista, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        [HttpPost]
        public ActionResult Guardar(Empleo obj)
        {
            status s = new status();
            try
            {
                UsuarioActivo ua = new UsuarioActivo();
                Usuario us = new Usuario();
                if (obj.IdEmpresa == -1)
                {
                    ua = ua.getUser(User);
                    us = db.Usuario.SingleOrDefault(x => x.Correo == ua.Email);
                }

                Empleo emp = obj.Id == -1 ? new Empleo() : db.Empleo.SingleOrDefault(x => x.Id == obj.Id);
                emp.Titulo = obj.Titulo;
                emp.Contrato = obj.Contrato;
                emp.Descripcion = obj.Descripcion;
                emp.RangoSueldos = obj.RangoSueldos;
                emp.ExperienciaMinima = obj.ExperienciaMinima;
                emp.Periodo = obj.Periodo;
                emp.Pais = obj.Pais;
                emp.EstadoRegion = obj.EstadoRegion;
                emp.Ciudad = obj.Ciudad;
                emp.CorreoEnvioPostulaciones = obj.CorreoEnvioPostulaciones;
                emp.FechaActualizacion = DateTime.Now;
                emp.FechaExpiracion = obj.FechaExpiracion;
                emp.Teletrabajo = obj.Teletrabajo;
                //emp.Estado = "Activo";

                if (obj.Id == -1)
                {
                    emp.FechaRegistro = DateTime.Now;
                    emp.Estado = "Activo";
                    emp.IdEmpresa = obj.IdEmpresa == -1 ? us.Id : obj.IdEmpresa;
                    foreach (var item in obj.CategoriaBDT)
                    {
                        CategoriaBDT cat = db.CategoriaBDT.SingleOrDefault(c => c.Id == item.Id);
                        emp.CategoriaBDT.Add(cat);
                    }
                    db.Empleo.Add(emp);
                    db.SaveChanges();
                }
                else
                {
                    ICollection<CategoriaBDT> listCategoriaBDT = new Collection<CategoriaBDT>();
                    foreach (var item in obj.CategoriaBDT)
                    {
                        CategoriaBDT cat = db.CategoriaBDT.Where(c => c.Id == item.Id).SingleOrDefault();
                        listCategoriaBDT.Add(cat);
                    }
                    emp.CategoriaBDT.Clear();
                    db.SaveChanges();
                    foreach (var item in listCategoriaBDT)
                    {
                        emp.CategoriaBDT.Add(item);
                    }
                    db.SaveChanges();
                }
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
        public ActionResult Editar(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Empleo empleo = db.Empleo.Where(c => c.Id == id).SingleOrDefault();
            if (empleo == null)
            {
                return HttpNotFound();
            }
            ViewBag.tCategoria = db.CategoriaBDT.ToList();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            return View(empleo);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult EliminarEmpleo(int Id)
        {
            status s = new status();
            try
            {
                Empleo emp = db.Empleo.SingleOrDefault(x => x.Id == Id);
                emp.Estado = "Eliminado";
                db.SaveChanges();
                s.Tipo = 1;
                s.Msj = "Empleo Eliminado";
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
        //FILTROS

        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult getEmpleosByFiltros(Filtrar filtros)
        {
            listEmpleosC ListaObjects = new listEmpleosC();
            status s = new status();
            try
            {
                List<Empleo> results = new List<Empleo>();
                string query = "select * from Empleo emp, Empresa empresa,Perfil perf where ";
                if (filtros.ListaDepartamentos != null)
                {
                    string str = "',";
                    for (int i = 0; i < filtros.ListaDepartamentos.Length; i++)
                    {
                        str += filtros.ListaDepartamentos[i] + ",";
                    }
                    str += "' LIKE '%,' + CAST(emp.EstadoRegion AS VARCHAR(100)) + ',%' AND ";
                    query += str;
                }
                if (filtros.ListaCategorias != null)
                {
                    string strPrincipal = "emp.Id in(select empC.IdEmpleo as Id from EmpleoCategoria empC, CategoriaBDT cat WHERE empC.IdCategoria=cat.Id AND ";
                    string str = "',";
                    for (int i = 0; i < filtros.ListaCategorias.Length; i++)
                    {
                        str += filtros.ListaCategorias[i] + ",";
                    }
                    strPrincipal += str + "' ";
                    strPrincipal += "LIKE '%,' + CAST(cat.Nombre AS VARCHAR(150)) + ',%' group by empC.IdEmpleo)  AND ";
                    query += strPrincipal;
                }
                if (filtros.Contrato != null)
                {
                    string str = " emp.Contrato ='" + filtros.Contrato + "' AND ";
                    query += str;
                }
                if (filtros.PalabraClave != null)
                {
                    string str = " emp.Titulo like '%" + filtros.PalabraClave + "%' AND ";
                    query += str;
                }
                if (filtros.PublicadoDentroDe != 0)
                {
                    DateTime fechaInicio = DateTime.Today.AddDays(-filtros.PublicadoDentroDe);
                    //fechaInicio = fechaInicio.AddHours(01).AddMinutes(0).AddSeconds(0);
                    string str = " emp.FechaRegistro between '" + string.Format("{0:yyyy-MM-dd HH:mm:ss}", fechaInicio) + "' AND '" + string.Format("{0:yyyy-MM-dd HH:mm:ss}", DateTime.Now) + "' AND ";
                    query += str;
                }

                if (filtros.ListaDepartamentos != null || filtros.ListaCategorias != null || filtros.Contrato != null || filtros.PalabraClave != null || filtros.PublicadoDentroDe != 0)
                {
                    //query = query.Substring(0, query.Length - 5);
                    query += " emp.Estado='Activo' and emp.IdEmpresa=empresa.Id and empresa.Id=perf.Id and perf.Estado!='Desaprobado'";
                    results = db.Empleo.SqlQuery(query).ToList();
                }
                _TotalRegistros = results.Count();
                results = results.OrderByDescending(e => e.FechaRegistro).Skip(filtros.Pagina).Take(_RegistrosPorPagina).ToList();
                ListaObjects.empleos = ListaObjects.CargarLista(results);
                ListaObjects.TotalRegistros = _TotalRegistros;
                var json = Json(ListaObjects, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = 5000000;
                return json;
                //return Json(ListaObjects, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
                return Json(s, JsonRequestBehavior.AllowGet);
            }
        }
        [Authorize(Roles = "Empresa,Administrador")]
        [HttpPost]
        public ActionResult ActualizarEstado(FormCollection form)
        {
            status s = new status();
            //bool verif = true;
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    int IdEmpleo = int.Parse(form["IdEmpleo"]);
                    string estado = form["Estado"];
                    Empleo empleo = bd.Empleo.SingleOrDefault(x => x.Id == IdEmpleo);
                    empleo.Estado = estado;

                    string EnviarCorreo = form["EnviarCorreo"];
                    if (EnviarCorreo != "No")
                    {
                        UsuarioActivo ua = new UsuarioActivo();
                        ua = ua.getUser(User);
                        var us = bd.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);

                        Correo o = new Correo();
                        string Asunto = form["Asunto"];
                        string textMensaje = form["Mensaje"];
                        var listpostulantes = bd.Postulante.Where(x => x.IdEmpleo == IdEmpleo && x.Estado == "Aceptado" && x.Curriculum.Estado == "Activo").ToList();
                        ListaPostulantes Listpostulantes = new ListaPostulantes();
                        Listpostulantes.Postulantes = Listpostulantes.CargarLista(listpostulantes);
                        var TotalPostulantes = Listpostulantes.Postulantes.Count();
                        for (int i = 0; i < TotalPostulantes; i++)
                        {
                            var item = Listpostulantes.Postulantes.ElementAt(i);
                            Mensaje m = new Mensaje();
                            var r = o.enviarCorreo(textMensaje, Asunto + ": " + item.Curriculum.DatosPersonalesC.nombreDP + " " + item.Curriculum.DatosPersonalesC.apellidoDP, item.Curriculum.DatosPersonalesC.correoDP, "", "");
                            if (r == true)
                            {
                                m.FechaRegistro = DateTime.Now;
                                m.Intermediario = "UPDS_BolsaDeTrabajo@outlook.com";
                                m.Emisor = us.Correo;
                                m.Destinatario = item.Curriculum.DatosPersonalesC.correoDP;
                                m.Asunto = Asunto;
                                m.Texto = textMensaje;
                                m.Estado = "Pendiente";
                                bd.Mensaje.Add(m);
                                bd.SaveChanges();

                                Postulante p = bd.Postulante.SingleOrDefault(x => x.Id == item.Id);
                                p.IdMensaje = m.Id;
                                p.Aceptado = "Aceptado";
                                bd.SaveChanges();

                                Notificacion notificacion = new Notificacion();
                                var nombreEmisor = db.Empresa.SingleOrDefault(u => u.Id == us.Id);
                                var empleoTitulo = db.Empleo.SingleOrDefault(x => x.Id == IdEmpleo);
                                notificacion.Titulo = "Postulación Aceptada";
                                notificacion.Descripcion = "La Empresa <span>" + nombreEmisor.NombreEmpresa + "</span> a aceptado tu postulación al empleo <span>" + empleoTitulo.Titulo + "</span>.";
                                notificacion.Tipo = "Postulacion";
                                notificacion.FechaRegistro = DateTime.Now;
                                notificacion.FechaActualizacion = DateTime.Now;
                                notificacion.Estado = "Pendiente";
                                notificacion.Emisor = "Empresa";
                                notificacion.Receptor = "Candidato";
                                notificacion.IdPostulante = p.Id;
                                db.Notificacion.Add(notificacion);
                                db.SaveChanges();
                            }
                        }
                    }
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

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult listEmpleos()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            listEmpleosC listaempleos = new listEmpleosC();
            var empleo = db.Empleo.Where(x => x.IdEmpresa == us.Id && x.Estado == "Activo").ToList();
            listaempleos.empleos = listaempleos.CargarLista(empleo);
            var json = Json(listaempleos, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 5000000;
            return json;
        }


        //LISTAR EMPLEOS QUE TENGAN POSTULACIONES
        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getTableEmpleos()
        {
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var empleos = db.Empleo.Where(em => em.Empresa.Perfil.Id == us.Id && em.Estado != "Eliminado").ToList();
            //var invitaciones = db.Invitado.Where(em => em.IdEmpresa == us.Id).ToList();
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
                obj.atrib7 = item.Estado;
                //obj.atrib8 = db.Invitado.Where(em => em.IdEmpresa == us.Id && em.IdEmpleo == item.Id).ToList().Count().ToString() + " ";
                obj.atrib8 = item.Invitado.Count() + " ";
                if (item.Invitado.Count() != 0)
                {
                    obj.atrib8 += "<a href='" + baseUrl + "Invitaciones/listaInvitados?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib9 = "<a class='btn' onclick='CargarDatosEmpleo(" + item.Id + ")'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></a>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Candidato,Administrador")]
        public ActionResult getByEstadoInvitado(string estado)
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var empleos = db.Empleo.Where(em => em.Empresa.Perfil.Id == us.Id && em.Estado == estado).ToList();
            var TotalRegistros = empleos.Count();
            string baseUrl = new Uri(Request.Url, Url.Content("~")).AbsoluteUri;
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
                obj.atrib7 = item.Estado;
                obj.atrib8 = db.Invitado.Where(em => em.IdEmpresa == us.Id && em.IdEmpleo == item.Id).ToList().Count().ToString() + " ";
                if (TotalRegistros != 0)
                {
                    obj.atrib8 += "<a href='" + baseUrl + "Postulantes/Lista?Id=" + item.Id + "'><i class='fas fa-eye ico-blue ico-animation fa-lg'></i></a>";
                }
                obj.atrib9 = "<a href='" + baseUrl + "Empleos/Editar?id=" + item.Id + "'><i class='fas fa-edit ico-gray ico-animation fa-lg'></i></a>";
                tabla.Add(obj);
            }
            return Json(tabla, JsonRequestBehavior.AllowGet);
        }
    }
}