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
            //var persona = bd.Persona.SingleOrDefault(x => x.Nombre != "").Nombre.Contains("sdf");
            //var Person = new {};
            using (SAADSTJEntities bd = new SAADSTJEntities())
            {
                var person = (from p in bd.Persona
                              join e in bd.Estudiante on p.Id equals e.Id
                              join c in bd.Ciudad on p.IdCiudad equals c.Id
                              join prov in bd.Provincia on c.IdProvincia equals prov.Id
                              join dep in bd.Departamento on prov.IdDepartamento equals dep.Id
                              join pais in bd.Pais on p.IdNacionalidad equals pais.Id
                              join ic in bd.InscripcionCarrera on p.Id equals ic.IdEstudiante
                              join pe in bd.PlanEstudio on ic.IdPlanEstudio equals pe.Id
                              join carr in bd.Carrera on pe.IdCarrera equals carr.Id
                              where p.DocumentoIdentidad == texto
                              select new
                              {
                                  Id = p.Id,
                                  DocumentoIdentidad = p.DocumentoIdentidad,
                                  Nombre = p.Nombre,
                                  ApellidoPaterno = p.ApellidoPaterno,
                                  ApellidoMaterno = p.ApellidoMaterno,
                                  FechaNacimiento = p.FechaNacimiento,
                                  Email1 = p.Email1,
                                  TelefonoCelular = p.Celular,
                                  TelefonoFijo = p.TelefonoDomicilio,
                                  Nacionalidad = pais.Nacionalidad,
                                  Pais = pais.Nombre,
                                  Departamento = dep.Nombre,
                                  Provincia = prov.Nombre,
                                  Ciudad = c.Nombre,
                                  IdCarrera = carr.Id,
                                  Carrera = carr.Nombre,
                              }).ToList();
                return Json(person, JsonRequestBehavior.AllowGet);
            }
            //var lista = bd.Persona.SqlQuery("Select p.Id, p.Nombre,p.ApellidoPaterno,p.ApellidoMaterno,p.Email1,pais.Nombre as Pais,pais.Nacionalidad as Nacionalidad,c.Nombre as Ciudad from Persona p, Estudiante e,Ciudad c,Pais pais where p.Id=e.Id and p.IdCiudad=c.Id and p.IdNacionalidad=pais.Id and p.DocumentoIdentidad=" + texto + "").ToList();
            //var persona = new
            //{
            //    Nombre = lista[0].Nombre,
            //    ApellidoPaterno = lista[0].ApellidoPaterno,
            //    ApellidoMaterno = lista[0].ApellidoMaterno,
            //    Email1 = lista[0].Email1,
            //    Pais = lista[0].IdNacionalidad,
            //    IdCiudad = lista[0].IdCiudad,
            //};
            //foreach (var item in lista)
            //{
            //    persona
            //    datos += "<a href='#' class='list-group-item list-group-item-action border'  onclick='SeleccionarPersona(" + item.Id + ")'>" + item.Nombre + ' ' + item.ApellidoPaterno + ' ' + item.ApellidoMaterno + " </li>";
            //}
        }
    }
}