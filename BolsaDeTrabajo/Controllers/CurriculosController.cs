using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using BolsaDeTrabajo.Models;
using System.Data;
using System.Data.Entity;
using System.Net;
using Newtonsoft.Json;
//using System.Web.UI;

namespace BolsaDeTrabajo.Controllers
{
    public class CurriculosController : Controller
    {
        // GET: Curriculos
        private UPDS_BDTEntities db = new UPDS_BDTEntities();
        private int _RegistrosPorPaginas = 4;
        private int _TotalRegistrosFiltrados = 0;
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Index()
        {
            //var curriculum = db.Curriculum.Include(c => c.Candidato).Include(c => c.DatosPersonales).Include(c => c.Educacion);
            return View();
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult Curriculo()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);
            var Candidato = db.Candidato.Where(c => c.Id == us.Id).SingleOrDefault();
            ViewBag.tDepartamentos = db.DepartamentoBDT.ToList();
            ViewBag.tCarreras = db.CarreraBDT.ToList();
            return View(Candidato);
        }
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getCurriculos()
        {
            UsuarioActivo ua = new UsuarioActivo();
            ua = ua.getUser(User);
            var us = db.Usuario.SingleOrDefault(u => u.Correo == ua.Email && u.Rol == ua.Rol);

            listCurriculums ListaCur = new listCurriculums();
            var listCurriculums = db.Curriculum.Where(x => x.IdCandidato == us.Id && x.Estado == "Activo").ToList();
            ListaCur.TotalRegistro = listCurriculums.Count();
            ListaCur.curriculums = ListaCur.CargarLista(listCurriculums);
            foreach (var item in ListaCur.curriculums)
            {
                item.DatosPersonalesC.imagenDP = "";
            }
            var json = Json(ListaCur, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 5000000;
            return json;
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult getCurriculum(int Id)
        {
            //UPDS_BDTEntities bd = new UPDS_BDTEntities();
            var obj = db.Curriculum.Include(c => c.Candidato).Include(c => c.DatosPersonales).Include(c => c.Educacion).Where(c => c.Id == Id).SingleOrDefault();
            //bd.Configuration.ProxyCreationEnabled = false;
            //bd.Configuration.LazyLoadingEnabled = false;
            Curriculum curriculum = new Curriculum();
            curriculum.Contrato = obj.Contrato;
            curriculum.IdCarrera = obj.IdCarrera;
            curriculum.CarreraBDT = new CarreraBDT();
            curriculum.CarreraBDT.Id = obj.CarreraBDT.Id;
            curriculum.CarreraBDT.Nombre = obj.CarreraBDT.Nombre;

            curriculum.Privacidad = obj.Privacidad;
            curriculum.DatosPersonales = new DatosPersonales();
            curriculum.DatosPersonales.TipoDeDocumento = obj.DatosPersonales.TipoDeDocumento;
            curriculum.DatosPersonales.Sexo = obj.DatosPersonales.Sexo;
            curriculum.DatosPersonales.EstadoCivil = obj.DatosPersonales.EstadoCivil;
            for (int i = 0; i < obj.ExperienciaLaboral.Count(); i++)
            {
                ExperienciaLaboral xl = new ExperienciaLaboral();
                xl.Pais = obj.ExperienciaLaboral.ElementAt(i).Pais;
                xl.TrabajoActual = obj.ExperienciaLaboral.ElementAt(i).TrabajoActual;
                curriculum.ExperienciaLaboral.Add(xl);
            }
            for (int i = 0; i < obj.Habilidad.Count(); i++)
            {
                Habilidad hab = new Habilidad();
                hab.AniosExperiencia = obj.Habilidad.ElementAt(i).AniosExperiencia;
                curriculum.Habilidad.Add(hab);
            }
            curriculum.Educacion = new Educacion();
            for (int i = 0; i < obj.Educacion.Idioma.Count(); i++)
            {
                Idioma id = new Idioma();
                id.Escritura = obj.Educacion.Idioma.ElementAt(i).Escritura;
                id.Nivel = obj.Educacion.Idioma.ElementAt(i).Nivel;
                id.Lectura = obj.Educacion.Idioma.ElementAt(i).Lectura;
                curriculum.Educacion.Idioma.Add(id);
            }
            for (int i = 0; i < obj.Educacion.Lista.Count(); i++)
            {
                Lista list = new Lista();
                list.EstudiandoActualmente = obj.Educacion.Lista.ElementAt(i).EstudiandoActualmente;
                curriculum.Educacion.Lista.Add(list);
            }
            curriculum.IdCarrera = obj.IdCarrera;
            curriculum.EstadoRegion = obj.EstadoRegion;
            //var list = JsonConvert.SerializeObject(curriculo, Formatting.None, new JsonSerializerSettings() { ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore });
            //var json = Json(list, JsonRequestBehavior.AllowGet);
            //json.MaxJsonLength = 500000000;
            //return json;
            return Json(curriculum, JsonRequestBehavior.AllowGet);
        }
        [Authorize(Roles = "Candidato,Administrador")]
        [HttpPost]
        public ActionResult Guardar(CurriculoC DataForms)
        {
            //DeserializeObject(DataForms.DatosPersonalesC.imagenDP);
            byte[] ImagenDP = new JavaScriptSerializer().Deserialize<byte[]>(DataForms.DatosPersonalesC.imagenDP);
            //var modelo = DataForms;

            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    var user = bd.Usuario.Where(u => u.Correo == User.Identity.Name).SingleOrDefault();
                    Colegio colegio = new Colegio();
                    Educacion educacion = new Educacion();
                    //Idioma idioma = new Idioma();
                    //Lista educacionSuperior = new Lista();
                    DatosPersonales datosPersonales = new DatosPersonales();
                    Curriculum curriculo = new Curriculum();
                    //Img img = new Img();
                    if (DataForms.DatosPersonalesC.idCurriculum == "-1")
                    {
                        colegio.Nombre = DataForms.EducacionSecundaria.ColegioInstitucionED;
                        colegio.Nivel = DataForms.EducacionSecundaria.nivelEstudioED;
                        colegio.Pais = DataForms.EducacionSecundaria.paisED;
                        colegio.EstadoRegion = DataForms.EducacionSecundaria.estadoRegionED;
                        colegio.Ciudad = DataForms.EducacionSecundaria.ciudadED;
                        colegio.FechaInicio = Convert.ToDateTime(DataForms.EducacionSecundaria.fechaInicioED);
                        colegio.FechaFin = Convert.ToDateTime(DataForms.EducacionSecundaria.fechaFinED);
                        bd.Colegio.Add(colegio);
                        bd.SaveChanges();
                        educacion.IdColegio = colegio.Id;
                        bd.Educacion.Add(educacion);
                        bd.SaveChanges();

                        if (DataForms.ListIdiomaSuperior.Count() != 0)
                        {
                            foreach (var item in DataForms.ListIdiomaSuperior)
                            {
                                Idioma idioma = new Idioma();
                                idioma.Nombre = item.nombreIS;
                                idioma.Nivel = item.nivelOralIS;
                                idioma.Lectura = item.lecturaIS;
                                idioma.Escritura = item.escrituraIS;
                                idioma.IdEducacion = educacion.Id;
                                bd.Idioma.Add(idioma);
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListEducacionSuperior.Count() != 0)
                        {
                            foreach (var item in DataForms.ListEducacionSuperior)
                            {
                                Lista educacionSuperior = new Lista();
                                educacionSuperior.Institucion = item.universidadInstitucionES;
                                educacionSuperior.CarreraCursoSeminario = item.ccsES;
                                educacionSuperior.Nivel = item.nivelEstudioES;
                                educacionSuperior.Pais = item.paisES;
                                educacionSuperior.EstadoRegion = item.estadoRegionES;
                                educacionSuperior.Ciudad = item.ciudadES;
                                educacionSuperior.FechaInicio = Convert.ToDateTime(item.fechaInicioES);
                                educacionSuperior.FechaFin = Convert.ToDateTime(item.fechaFinES);
                                educacionSuperior.EstudiandoActualmente = item.estudioActualES == "True" ? true : false;
                                educacionSuperior.IdEducacion = educacion.Id;
                                bd.Lista.Add(educacionSuperior);
                                bd.SaveChanges();
                            }
                        }

                        datosPersonales.Nombre = DataForms.DatosPersonalesC.nombreDP;
                        datosPersonales.Apellido = DataForms.DatosPersonalesC.apellidoDP;
                        datosPersonales.Nacionalidad = DataForms.DatosPersonalesC.nacionalidadDP;
                        datosPersonales.TipoDeDocumento = DataForms.DatosPersonalesC.tipoDocumentoDP;
                        datosPersonales.NroDocumento = DataForms.DatosPersonalesC.nroDocumentoDP;
                        datosPersonales.FechaNacimiento = Convert.ToDateTime(DataForms.DatosPersonalesC.fechaNacimientoDP);
                        datosPersonales.Sexo = DataForms.DatosPersonalesC.sexoDP;
                        datosPersonales.Direccion = DataForms.DatosPersonalesC.direccionDP;
                        datosPersonales.EstadoCivil = DataForms.DatosPersonalesC.estadoCivilDP;
                        datosPersonales.LicenciaVehiculo = DataForms.DatosPersonalesC.licenciaVehiculoDP;
                        datosPersonales.LicenciaMotocicleta = DataForms.DatosPersonalesC.licenciaMotocicletaDP;
                        datosPersonales.Movil = DataForms.DatosPersonalesC.movilDP;
                        datosPersonales.Telefono = DataForms.DatosPersonalesC.telefonoDP;
                        datosPersonales.Correo = DataForms.DatosPersonalesC.correoDP;
                        datosPersonales.Foto = ImagenDP;
                        bd.DatosPersonales.Add(datosPersonales);
                        bd.SaveChanges();
                        curriculo.FechaRegistro = DateTime.Now;
                        curriculo.FechaActualizacion = DateTime.Now;
                        curriculo.Titulo = DataForms.InformacionGeneral.tituloIG;
                        //curriculo.Categoria = DataForms.InformacionGeneral.categoriaIG;
                        curriculo.Contrato = DataForms.InformacionGeneral.contratoIG;
                        curriculo.PretencionSalarial = Convert.ToInt32(DataForms.InformacionGeneral.pretencionSalarialIG);
                        curriculo.PresentacionBiografica = DataForms.InformacionGeneral.presentacionBiografiaIG;
                        curriculo.PaisResidencia = DataForms.InformacionGeneral.paisIG;
                        curriculo.EstadoRegion = DataForms.InformacionGeneral.estadoRegionIG;
                        curriculo.Ciudad = DataForms.InformacionGeneral.ciudadIG;
                        curriculo.Privacidad = DataForms.InformacionGeneral.privacidadIG == "0" ? 0 : 1;
                        curriculo.Estado = "Activo";
                        curriculo.IdCandidato = user.Perfil.Candidato.Id;
                        curriculo.IdEducacion = educacion.Id;
                        curriculo.IdDatosPersonales = datosPersonales.Id;
                        curriculo.IdCarrera = int.Parse(DataForms.InformacionGeneral.IdCarrera);
                        bd.Curriculum.Add(curriculo);
                        bd.SaveChanges();

                        if (DataForms.ListExperienciaLaboral.Count() != 0)
                        {
                            foreach (var item in DataForms.ListExperienciaLaboral)
                            {
                                ExperienciaLaboral expLaboral = new ExperienciaLaboral();
                                expLaboral.NombreEmpresa = item.nombreEmpresaEL;
                                expLaboral.CargoEnEmpresa = item.cargoEmpresaEL;
                                expLaboral.ContactoEmpresa = item.contactoEL;
                                expLaboral.Industria = item.industriaEL;
                                expLaboral.Descripcion = item.descripcionEL;
                                expLaboral.FechaInicio = Convert.ToDateTime(item.fechaInicioEL);
                                expLaboral.FechaFin = Convert.ToDateTime(item.fechaFinEL);
                                expLaboral.TrabajoActual = item.ActualTrabajo == "True" ? true : false;
                                expLaboral.NroPersonasAlCargo = Convert.ToInt32(item.personasAlCargoEL);
                                expLaboral.Pais = item.paisEL;
                                expLaboral.EstadoRegion = item.estadoRegionEL;
                                expLaboral.Ciudad = item.ciudadEL;
                                expLaboral.IdCurriculum = curriculo.Id;
                                bd.ExperienciaLaboral.Add(expLaboral);
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListHabilidades.Count() != 0)
                        {
                            foreach (var item in DataForms.ListHabilidades)
                            {
                                Habilidad habilidad = new Habilidad();
                                habilidad.Nombre = item.nombreH;
                                habilidad.AniosExperiencia = Convert.ToInt32(item.aniosExperienciaH);
                                habilidad.IdCurriculum = curriculo.Id;
                                bd.Habilidad.Add(habilidad);
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListInformacionAdicional.Count() != 0)
                        {
                            foreach (var item in DataForms.ListInformacionAdicional)
                            {
                                InformacionAdicional infAdicional = new InformacionAdicional();
                                infAdicional.Titulo = item.tituloIA;
                                infAdicional.Descripcion = item.descripcionIA;
                                infAdicional.IdCurriculum = curriculo.Id;
                                bd.InformacionAdicional.Add(infAdicional);
                                bd.SaveChanges();
                            }
                        }
                    }
                    s.Tipo = 1;
                    s.Msj = "Registro Exitoso";
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
        public ActionResult Editar(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Curriculum curriculum = db.Curriculum.Include(c => c.Candidato).Include(c => c.DatosPersonales).Include(c => c.Educacion).Where(c => c.Id == id).SingleOrDefault();
            if (curriculum == null)
            {
                return HttpNotFound();
            }
            ViewBag.tCarreras = db.CarreraBDT.ToList();
            return View(curriculum);
        }

        // POST: Curriculums/Editar
        // Para protegerse de ataques de publicación excesiva, habilite las propiedades específicas a las que quiere enlazarse. Para obtener 
        // más detalles, vea https://go.microsoft.com/fwlink/?LinkId=317598.
        [Authorize(Roles = "Candidato,Administrador")]
        [HttpPost]
        public ActionResult Editar(CurriculoC DataForms)
        {
            //DeserializeObject(DataForms.DatosPersonalesC.imagenDP);
            byte[] ImagenDP = DataForms.DatosPersonalesC.imagenDP == null ? null : new JavaScriptSerializer().Deserialize<byte[]>(DataForms.DatosPersonalesC.imagenDP);
            //var modelo = DataForms;
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    //Img img = new Img();
                    if (DataForms.DatosPersonalesC.idCurriculum != "-1")
                    {
                        int IdCurriculo = int.Parse(DataForms.DatosPersonalesC.idCurriculum);
                        //Curriculum curriculum = bd.Curriculum.Include(c => c.Candidato).Include(c => c.DatosPersonales).Include(c => c.Educacion).Where(c => c.Id == IdCurriculo).SingleOrDefault();
                        Colegio colegio = new Colegio();
                        Educacion educacion = new Educacion();
                        Curriculum curriculo = new Curriculum();
                        curriculo = bd.Curriculum.SingleOrDefault(x => x.Id == IdCurriculo);

                        colegio = curriculo.Educacion.Colegio;
                        colegio.Nombre = DataForms.EducacionSecundaria.ColegioInstitucionED;
                        colegio.Nivel = DataForms.EducacionSecundaria.nivelEstudioED;
                        colegio.Pais = DataForms.EducacionSecundaria.paisED;
                        colegio.EstadoRegion = DataForms.EducacionSecundaria.estadoRegionED;
                        colegio.Ciudad = DataForms.EducacionSecundaria.ciudadED;
                        colegio.FechaInicio = Convert.ToDateTime(DataForms.EducacionSecundaria.fechaInicioED);
                        colegio.FechaFin = Convert.ToDateTime(DataForms.EducacionSecundaria.fechaFinED);
                        bd.SaveChanges();
                        educacion = curriculo.Educacion;

                        if (DataForms.ListIdiomaSuperior.Count() != 0)
                        {
                            foreach (var item in DataForms.ListIdiomaSuperior)
                            {
                                int IdIdioma = int.Parse(item.idIS);
                                Idioma idioma = item.idIS == "-1" ? new Idioma() : bd.Idioma.SingleOrDefault(x => x.Id == IdIdioma);
                                idioma.Nombre = item.nombreIS;
                                idioma.Nivel = item.nivelOralIS;
                                idioma.Lectura = item.lecturaIS;
                                idioma.Escritura = item.escrituraIS;
                                idioma.IdEducacion = educacion.Id;
                                if (item.idIS == "-1")
                                {
                                    bd.Idioma.Add(idioma);
                                }
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListEducacionSuperior.Count() != 0)
                        {
                            foreach (var item in DataForms.ListEducacionSuperior)
                            {
                                int IdLista = int.Parse(item.idES);

                                Lista educacionSuperior = item.idES == "-1" ? new Lista() : bd.Lista.SingleOrDefault(x => x.Id == IdLista);
                                educacionSuperior.Institucion = item.universidadInstitucionES;
                                educacionSuperior.CarreraCursoSeminario = item.ccsES;
                                educacionSuperior.Nivel = item.nivelEstudioES;
                                educacionSuperior.Pais = item.paisES;
                                educacionSuperior.EstadoRegion = item.estadoRegionES;
                                educacionSuperior.Ciudad = item.ciudadES;
                                educacionSuperior.FechaInicio = Convert.ToDateTime(item.fechaInicioES);
                                educacionSuperior.FechaFin = Convert.ToDateTime(item.fechaFinES);
                                educacionSuperior.EstudiandoActualmente = item.estudioActualES == "True" ? true : false;
                                educacionSuperior.IdEducacion = educacion.Id;
                                if (item.idES == "-1")
                                {
                                    bd.Lista.Add(educacionSuperior);
                                }
                                bd.SaveChanges();
                            }
                        }

                        var IdDP = int.Parse(DataForms.DatosPersonalesC.idDP);
                        DatosPersonales datosPersonales = DataForms.DatosPersonalesC.idDP == "-1" ? new DatosPersonales() : bd.DatosPersonales.SingleOrDefault(x => x.Id == IdDP);
                        datosPersonales.Nombre = DataForms.DatosPersonalesC.nombreDP;
                        datosPersonales.Apellido = DataForms.DatosPersonalesC.apellidoDP;
                        datosPersonales.Nacionalidad = DataForms.DatosPersonalesC.nacionalidadDP;
                        datosPersonales.TipoDeDocumento = DataForms.DatosPersonalesC.tipoDocumentoDP;
                        datosPersonales.NroDocumento = DataForms.DatosPersonalesC.nroDocumentoDP;
                        datosPersonales.FechaNacimiento = Convert.ToDateTime(DataForms.DatosPersonalesC.fechaNacimientoDP);
                        datosPersonales.Sexo = DataForms.DatosPersonalesC.sexoDP;
                        datosPersonales.Direccion = DataForms.DatosPersonalesC.direccionDP;
                        datosPersonales.EstadoCivil = DataForms.DatosPersonalesC.estadoCivilDP;
                        datosPersonales.LicenciaVehiculo = DataForms.DatosPersonalesC.licenciaVehiculoDP;
                        datosPersonales.LicenciaMotocicleta = DataForms.DatosPersonalesC.licenciaMotocicletaDP;
                        datosPersonales.Movil = DataForms.DatosPersonalesC.movilDP;
                        datosPersonales.Telefono = DataForms.DatosPersonalesC.telefonoDP;
                        datosPersonales.Correo = DataForms.DatosPersonalesC.correoDP;
                        if (ImagenDP != null)
                        {
                            datosPersonales.Foto = ImagenDP;
                        }
                        bd.SaveChanges();
                        curriculo.FechaActualizacion = DateTime.Now;
                        curriculo.Titulo = DataForms.InformacionGeneral.tituloIG;
                        curriculo.Contrato = DataForms.InformacionGeneral.contratoIG;
                        curriculo.PretencionSalarial = Convert.ToInt32(DataForms.InformacionGeneral.pretencionSalarialIG);
                        curriculo.PresentacionBiografica = DataForms.InformacionGeneral.presentacionBiografiaIG;
                        curriculo.PaisResidencia = DataForms.InformacionGeneral.paisIG;
                        curriculo.EstadoRegion = DataForms.InformacionGeneral.estadoRegionIG;
                        curriculo.Ciudad = DataForms.InformacionGeneral.ciudadIG;
                        curriculo.Privacidad = DataForms.InformacionGeneral.privacidadIG == "0" ? 0 : 1;
                        curriculo.IdCarrera = int.Parse(DataForms.InformacionGeneral.IdCarrera);
                        bd.SaveChanges();

                        if (DataForms.ListExperienciaLaboral.Count() != 0)
                        {
                            foreach (var item in DataForms.ListExperienciaLaboral)
                            {
                                var IdEL = int.Parse(item.idEL);
                                ExperienciaLaboral expLaboral = item.idEL == "-1" ? new ExperienciaLaboral() : bd.ExperienciaLaboral.SingleOrDefault(x => x.Id == IdEL);
                                expLaboral.NombreEmpresa = item.nombreEmpresaEL;
                                expLaboral.CargoEnEmpresa = item.cargoEmpresaEL;
                                expLaboral.ContactoEmpresa = item.contactoEL;
                                expLaboral.Industria = item.industriaEL;
                                expLaboral.Descripcion = item.descripcionEL;
                                expLaboral.FechaInicio = Convert.ToDateTime(item.fechaInicioEL);
                                expLaboral.FechaFin = Convert.ToDateTime(item.fechaFinEL);
                                expLaboral.TrabajoActual = item.ActualTrabajo == "True" ? true : false;
                                expLaboral.NroPersonasAlCargo = Convert.ToInt32(item.personasAlCargoEL);
                                expLaboral.Pais = item.paisEL;
                                expLaboral.EstadoRegion = item.estadoRegionEL;
                                expLaboral.Ciudad = item.ciudadEL;
                                expLaboral.IdCurriculum = curriculo.Id;
                                if (item.idEL == "-1")
                                {
                                    bd.ExperienciaLaboral.Add(expLaboral);
                                }
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListHabilidades.Count() != 0)
                        {
                            foreach (var item in DataForms.ListHabilidades)
                            {
                                var IdH = int.Parse(item.idH);
                                Habilidad habilidad = item.idH == "-1" ? new Habilidad() : bd.Habilidad.SingleOrDefault(x => x.Id == IdH);
                                habilidad.Nombre = item.nombreH;
                                habilidad.AniosExperiencia = Convert.ToInt32(item.aniosExperienciaH);
                                habilidad.IdCurriculum = curriculo.Id;
                                if (item.idH == "-1")
                                {
                                    bd.Habilidad.Add(habilidad);
                                }
                                bd.SaveChanges();
                            }
                        }
                        if (DataForms.ListInformacionAdicional.Count() != 0)
                        {
                            foreach (var item in DataForms.ListInformacionAdicional)
                            {
                                var IdIA = int.Parse(item.idIA);
                                InformacionAdicional infAdicional = item.idIA == "-1" ? new InformacionAdicional() : bd.InformacionAdicional.SingleOrDefault(x => x.Id == IdIA);
                                infAdicional.Titulo = item.tituloIA;
                                infAdicional.Descripcion = item.descripcionIA;
                                infAdicional.IdCurriculum = curriculo.Id;
                                if (item.idIA == "-1")
                                {
                                    bd.InformacionAdicional.Add(infAdicional);
                                }
                                bd.SaveChanges();
                            }
                        }
                    }
                    s.Tipo = 1;
                    s.Msj = "Exito al guardar.";
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
        [HttpPost]
        public ActionResult EditarPrivacidad(FormCollection form)
        {
            status s = new status();
            try
            {
                using (UPDS_BDTEntities bd = new UPDS_BDTEntities())
                {
                    int IdCurriculo = int.Parse(form["IdCurriculum"]);
                    string privacidad = form["privacidad"];
                    Curriculum curriculo = bd.Curriculum.SingleOrDefault(x => x.Id == IdCurriculo);
                    curriculo.Privacidad = privacidad == "0" ? 0 : 1;
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
        [HttpPost]
        public ActionResult EliminarRegistroDeCurriculum(FormCollection form)
        {
            status s = new status();
            var objName = form["id"];
            int id = Convert.ToInt32(form["value"]);
            s.Msj = "Eliminado";
            s.Tipo = 1;
            switch (objName)
            {
                case "idEL":
                    ExperienciaLaboral objEL = db.ExperienciaLaboral.Find(id);
                    db.ExperienciaLaboral.Remove(objEL);
                    break;
                case "idH":
                    Habilidad objH = db.Habilidad.Find(id);
                    db.Habilidad.Remove(objH);
                    break;
                case "idIA":
                    InformacionAdicional objIA = db.InformacionAdicional.Find(id);
                    db.InformacionAdicional.Remove(objIA);
                    break;
                case "idES":
                    Lista objES = db.Lista.Find(id);
                    db.Lista.Remove(objES);
                    break;
                case "idIS":
                    Idioma objIS = db.Idioma.Find(id);
                    db.Idioma.Remove(objIS);
                    break;
                default:
                    s.Msj = "Error";
                    s.Tipo = 3;
                    break;
            }
            db.SaveChanges();
            return Json(s, JsonRequestBehavior.AllowGet);
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getCurriculums(int Pagina)
        {
            listCurriculums ListaCur = new listCurriculums();
            ListaCur.TotalRegistro = db.Curriculum.Where(x => x.Privacidad == 1).Count();
            var listCurriculums = db.Curriculum.Where(x => x.Privacidad == 1 && x.Estado == "Activo" && x.Candidato.Perfil.Estado == "Activo").OrderByDescending(x => x.FechaRegistro).Skip(Pagina).Take(_RegistrosPorPaginas).ToList();
            ListaCur.curriculums = ListaCur.CargarLista(listCurriculums);
            var json = Json(ListaCur, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 5000000;
            return json;
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult getCurriculumsByFiltros(Filtrar filtros)
        {
            listCurriculums ListaCur = new listCurriculums();
            status s = new status();
            try
            {
                List<Curriculum> curriculums = new List<Curriculum>();
                string query = "select * from Curriculum cur, Candidato ca, Perfil p where ";
                if (filtros.ListaDepartamentos != null)
                {
                    string str = "',";
                    for (int i = 0; i < filtros.ListaDepartamentos.Length; i++)
                    {
                        str += filtros.ListaDepartamentos[i] + ",";
                    }
                    str += "' LIKE '%,' + CAST(cur.EstadoRegion AS VARCHAR(100)) + ',%' AND ";
                    query += str;
                }
                if (filtros.ListaCarreras != null)
                {
                    string str2 = "',";
                    for (int i = 0; i < filtros.ListaCarreras.Length; i++)
                    {
                        str2 += filtros.ListaCarreras[i] + ",";
                    }
                    str2 += "' LIKE '%,' + CAST(cur.IdCarrera AS VARCHAR(100)) + ',%' AND ";
                    query += str2;
                }
                //if (filtros.IdCarrera != "")
                //{
                //    string str = " cur.IdCarrera =" + int.Parse(filtros.IdCarrera) + " AND ";
                //    query += str;
                //}
                if (filtros.Contrato != null)
                {
                    string str = " cur.Contrato ='" + filtros.Contrato + "' AND ";
                    query += str;
                }
                if (filtros.PalabraClave != null)
                {
                    string str = " cur.Titulo like '%" + filtros.PalabraClave + "%' AND ";
                    query += str;
                }
                if (filtros.PublicadoDentroDe != 0)
                {
                    DateTime fechaInicio = DateTime.Today.AddDays(-filtros.PublicadoDentroDe);
                    //fechaInicio = fechaInicio.AddHours(01).AddMinutes(0).AddSeconds(0);
                    string str = " cur.FechaRegistro between '" + string.Format("{0:yyyy-MM-dd HH:mm:ss}", fechaInicio) + "' AND '" + string.Format("{0:yyyy-MM-dd HH:mm:ss}", DateTime.Now) + "' AND ";
                    query += str;
                }
                if (filtros.ListaDepartamentos != null || filtros.ListaCarreras != null || filtros.Contrato != null || filtros.PalabraClave != null || filtros.PublicadoDentroDe != 0)
                {
                    //query = query.Substring(0, query.Length - 5);
                    query += " cur.Privacidad=1 and cur.Estado='Activo' and cur.IdCandidato=ca.Id and ca.Id=p.Id and p.Estado='Activo'";
                    //string cad = " cur.Privacidad=1";
                    curriculums = db.Curriculum.SqlQuery(query).ToList();
                }
                _TotalRegistrosFiltrados = curriculums.Count();
                curriculums = curriculums.OrderByDescending(e => e.FechaRegistro).Skip(filtros.Pagina).Take(_RegistrosPorPaginas).ToList();
                ListaCur.curriculums = ListaCur.CargarLista(curriculums);
                ListaCur.TotalRegistro = _TotalRegistrosFiltrados;
                var json = Json(ListaCur, JsonRequestBehavior.AllowGet);
                json.MaxJsonLength = 5000000;
                return json;
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
                return Json(s, JsonRequestBehavior.AllowGet);
            }
        }

        [Authorize(Roles = "Empresa,Administrador")]
        public ActionResult DetalleCurriculo(int Id)
        {
            ViewBag.IdCurriculo = Id;
            return View();
        }

        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult verCurriculo(int Id)
        {
            ViewBag.IdCurriculo = Id;
            return View();
        }

        [Authorize(Roles = "Candidato,Empresa,Administrador")]
        public ActionResult getDetalleCurriculo(int Id)
        {
            CurriculoC curriculum = new CurriculoC();
            var curri = db.Curriculum.Where(x => x.Id == Id && x.Estado == "Activo").SingleOrDefault();
            curriculum = curriculum.CargarCurriculum(curri);
            var json = Json(curriculum, JsonRequestBehavior.AllowGet);
            json.MaxJsonLength = 2000000;
            return json;
        }
        [Authorize(Roles = "Candidato,Administrador")]
        public ActionResult EliminarCurriculo(int Id)
        {
            status s = new status();
            try
            {
                Curriculum cur = db.Curriculum.SingleOrDefault(x => x.Id == Id);
                cur.Estado = "Eliminado";
                db.SaveChanges();
                s.Tipo = 1;
                s.Msj = "Curriculum Eliminado";
            }
            catch (Exception ex)
            {
                s.Tipo = 3;
                s.Msj = ex.Message;
            }
            return Json(s, JsonRequestBehavior.AllowGet);
        }
    }
}