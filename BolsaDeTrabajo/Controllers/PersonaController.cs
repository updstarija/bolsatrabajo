using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BolsaDeTrabajo.Models;

namespace BolsaDeTrabajo.Controllers
{
    public class PersonaController : Controller
    {
        // GET: Persona
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Buscar(string texto)
        {
            SAADSTJEntities dbS = new SAADSTJEntities();
            var existeEstudinate = dbS.Persona.SingleOrDefault(x => x.DocumentoIdentidad == texto);
            if (existeEstudinate != null)
            {
                UPDS_BDTEntities db = new UPDS_BDTEntities();
                var existePostulante = db.Candidato.SingleOrDefault(x => x.IdEstudiante == existeEstudinate.Id);
                if (existePostulante != null)
                {
                    string correo = db.Usuario.Single(x => x.Id == existePostulante.Id).Correo;
                    var o = new
                    {
                        Existe = 2,
                        Id = existeEstudinate.Id,
                        Email1 = correo
                    };
                    return Json(o, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var pais = dbS.Pais.Single(x => x.Id == existeEstudinate.IdNacionalidad);
                    var ciudad = dbS.Ciudad.Single(x => x.Id == existeEstudinate.IdCiudad);
                    var provincia = dbS.Provincia.Single(x => x.Id == ciudad.IdProvincia);
                    var departamento = dbS.Departamento.Single(x => x.Id == provincia.IdDepartamento);
                    var planEstudio = dbS.InscripcionCarrera.OrderByDescending(x=> x.Fecha).First(x => x.IdEstudiante == existeEstudinate.Id).PlanEstudio;
                    var o = new
                    {
                        Existe = 1,
                        Id = existeEstudinate.Id,
                        DocumentoIdentidad = existeEstudinate.DocumentoIdentidad,
                        Nombre = existeEstudinate.Nombre,
                        ApellidoPaterno = existeEstudinate.ApellidoPaterno,
                        ApellidoMaterno = existeEstudinate.ApellidoMaterno,
                        FechaNacimiento = existeEstudinate.FechaNacimiento,
                        Email1 = existeEstudinate.Email1,
                        TelefonoCelular = existeEstudinate.Celular,
                        TelefonoFijo = existeEstudinate.TelefonoDomicilio,
                        Nacionalidad = pais.Nacionalidad,
                        Pais = pais.Nombre,
                        Departamento = departamento.Nombre,
                        Provincia = provincia.Nombre,
                        Ciudad = ciudad.Nombre,
                        IdCarrera = planEstudio.Carrera.Id,
                        Carrera = planEstudio.Carrera.Nombre,
                    };
                    return Json(o, JsonRequestBehavior.AllowGet);
                    //using (SAADSTJEntities bd = new SAADSTJEntities())
                    //{
                    //    var person = (from p in bd.Persona
                    //              join e in bd.Estudiante on p.Id equals e.Id
                    //              join c in bd.Ciudad on p.IdCiudad equals c.Id
                    //              join prov in bd.Provincia on c.IdProvincia equals prov.Id
                    //              join dep in bd.Departamento on prov.IdDepartamento equals dep.Id
                    //              join pais in bd.Pais on p.IdNacionalidad equals pais.Id
                    //              join ic in bd.InscripcionCarrera on p.Id equals ic.IdEstudiante
                    //              join pe in bd.PlanEstudio on ic.IdPlanEstudio equals pe.Id
                    //              join carr in bd.Carrera on pe.IdCarrera equals carr.Id
                    //              where p.DocumentoIdentidad == texto
                    //              select new
                    //              {
                    //                  Id = p.Id,
                    //                  DocumentoIdentidad = p.DocumentoIdentidad,
                    //                  Nombre = p.Nombre,
                    //                  ApellidoPaterno = p.ApellidoPaterno,
                    //                  ApellidoMaterno = p.ApellidoMaterno,
                    //                  FechaNacimiento = p.FechaNacimiento,
                    //                  Email1 = p.Email1,
                    //                  TelefonoCelular = p.Celular,
                    //                  TelefonoFijo = p.TelefonoDomicilio,
                    //                  Nacionalidad = pais.Nacionalidad,
                    //                  Pais = pais.Nombre,
                    //                  Departamento = dep.Nombre,
                    //                  Provincia = prov.Nombre,
                    //                  Ciudad = c.Nombre,
                    //                  IdCarrera = carr.Id,
                    //                  Carrera = carr.Nombre,
                    //              }).ToList();
                    //    return Json(person, JsonRequestBehavior.AllowGet);
                    //}
                }
            }
            else
            {
                var o = new
                {
                    Existe = 3,
                };
                return Json(o, JsonRequestBehavior.AllowGet);
            }
        }
    }
}