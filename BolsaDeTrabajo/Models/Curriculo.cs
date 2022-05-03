using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class DatosPersonalesC
    {
        public string idDP { get; set; }
        public string idpersonaDP { get; set; }
        public string idCurriculum { get; set; }
        public string nombreDP { get; set; }
        public string apellidoDP { get; set; }
        public string tipoDocumentoDP { get; set; }
        public string nroDocumentoDP { get; set; }
        public string fechaNacimientoDP { get; set; }
        public string imagenDP { get; set; }
        public string nacionalidadDP { get; set; }
        public string estadoCivilDP { get; set; }
        public string direccionDP { get; set; }
        public string movilDP { get; set; }
        public string telefonoDP { get; set; }
        public string correoDP { get; set; }
        public string sexoDP { get; set; }
        public string licenciaVehiculoDP { get; set; }
        public string licenciaMotocicletaDP { get; set; }
    }
    public class ExperienciaLaboralC
    {
        public string idEL { get; set; }
        public string nombreEmpresaEL { get; set; }
        public string cargoEmpresaEL { get; set; }
        public string industriaEL { get; set; }
        public string descripcionEL { get; set; }
        public string paisEL { get; set; }
        public string estadoRegionEL { get; set; }
        public string ciudadEL { get; set; }
        public string fechaInicioEL { get; set; }
        public string fechaFinEL { get; set; }
        public string personasAlCargoEL { get; set; }
        public string ActualTrabajo { get; set; }
        public string contactoEL { get; set; }
    }
    public class HabilidadC
    {
        public string idH { get; set; }
        public string nombreH { get; set; }
        public string aniosExperienciaH { get; set; }
    }
    public class InformacionAdicionalC
    {
        public string idIA { get; set; }
        public string tituloIA { get; set; }
        public string descripcionIA { get; set; }
    }
    public class EducacionSecundariaC
    {
        public string idED { get; set; }
        public string ColegioInstitucionED { get; set; }
        public string nivelEstudioED { get; set; }
        public string paisED { get; set; }
        public string estadoRegionED { get; set; }
        public string ciudadED { get; set; }
        public string fechaInicioED { get; set; }
        public string fechaFinED { get; set; }
    }
    public class EducacionSuperiorC
    {
        public string idES { get; set; }
        public string universidadInstitucionES { get; set; }
        public string ccsES { get; set; }
        public string nivelEstudioES { get; set; }
        public string paisES { get; set; }
        public string estadoRegionES { get; set; }
        public string ciudadES { get; set; }
        public string fechaInicioES { get; set; }
        public string fechaFinES { get; set; }
        public string estudioActualES { get; set; }
    }
    public class IdiomaSuperiorC
    {
        public string idIS { get; set; }
        public string nombreIS { get; set; }
        public string escrituraIS { get; set; }
        public string nivelOralIS { get; set; }
        public string lecturaIS { get; set; }
    }
    public class CarreraBDTC
    {
        public string Id { get; set; }
        public string Nombre { get; set; }
    }
    //public class CategoriaBDTC
    //{
    //    public int Id { get; set; }
    //    public int IdCategoria { get; set; }
    //    public int IdCurriculum { get; set; }
    //    public string Nombre { get; set; }
    //}
    public class InformacionGeneralC
    {
        public string idIG { get; set; }
        public string tituloIG { get; set; }
        //public string categoriaIG { get; set; }
        public string contratoIG { get; set; }
        public string pretencionSalarialIG { get; set; }
        public string presentacionBiografiaIG { get; set; }
        public string paisIG { get; set; }
        public string estadoRegionIG { get; set; }
        public string ciudadIG { get; set; }
        public string privacidadIG { get; set; }
        public string FechaRegistro { get; set; }
        public string FechaActualizacion { get; set; }
        public string IdCarrera { get; set; }
        public CarreraBDTC Carrera { get; set; }
        //public List<CategoriaBDTC> Categorias { get; set; }
    }
    public class CurriculoC
    {
        public DatosPersonalesC DatosPersonalesC { get; set; }
        public List<ExperienciaLaboralC> ListExperienciaLaboral { get; set; }
        public List<HabilidadC> ListHabilidades { get; set; }
        public List<InformacionAdicionalC> ListInformacionAdicional { get; set; }
        public EducacionSecundariaC EducacionSecundaria { get; set; }
        public List<EducacionSuperiorC> ListEducacionSuperior { get; set; }
        public List<IdiomaSuperiorC> ListIdiomaSuperior { get; set; }
        public InformacionGeneralC InformacionGeneral { get; set; }
        public CurriculoC CargarCurriculum(Curriculum obj)
        {
            CurriculoC curriculum = new CurriculoC();
            curriculum.DatosPersonalesC = new DatosPersonalesC();
            curriculum.DatosPersonalesC.idCurriculum = obj.Id.ToString();
            curriculum.InformacionGeneral = new InformacionGeneralC();
            curriculum.InformacionGeneral.tituloIG = obj.Titulo;
            curriculum.InformacionGeneral.Carrera = new CarreraBDTC();
            curriculum.InformacionGeneral.IdCarrera = obj.CarreraBDT?.Id.ToString();
            curriculum.InformacionGeneral.Carrera.Id = obj.CarreraBDT?.Id.ToString();
            curriculum.InformacionGeneral.Carrera.Nombre = obj.CarreraBDT?.Nombre;

            curriculum.InformacionGeneral.contratoIG = obj.Contrato;
            curriculum.InformacionGeneral.pretencionSalarialIG = obj.PretencionSalarial.ToString();
            curriculum.InformacionGeneral.presentacionBiografiaIG = obj.PresentacionBiografica;
            curriculum.InformacionGeneral.paisIG = obj.PaisResidencia;
            curriculum.InformacionGeneral.estadoRegionIG = obj.EstadoRegion;
            curriculum.InformacionGeneral.ciudadIG = obj.Ciudad;
            curriculum.InformacionGeneral.privacidadIG = obj.Privacidad.ToString();
            curriculum.InformacionGeneral.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            curriculum.InformacionGeneral.FechaActualizacion = obj.FechaActualizacion?.ToString("dd/MM/yyyy");

            curriculum.DatosPersonalesC.idDP = obj.DatosPersonales.Id.ToString();
            curriculum.DatosPersonalesC.nombreDP = obj.DatosPersonales.Nombre;
            curriculum.DatosPersonalesC.apellidoDP = obj.DatosPersonales.Apellido;
            curriculum.DatosPersonalesC.nacionalidadDP = obj.DatosPersonales.Nacionalidad;
            curriculum.DatosPersonalesC.nroDocumentoDP = obj.DatosPersonales.NroDocumento;
            curriculum.DatosPersonalesC.fechaNacimientoDP = obj.DatosPersonales.FechaNacimiento.ToString("dd/MM/yyyy");
            curriculum.DatosPersonalesC.sexoDP = obj.DatosPersonales.Sexo;
            curriculum.DatosPersonalesC.direccionDP = obj.DatosPersonales.Direccion;
            curriculum.DatosPersonalesC.estadoCivilDP = obj.DatosPersonales.EstadoCivil;
            curriculum.DatosPersonalesC.licenciaVehiculoDP = obj.DatosPersonales.LicenciaVehiculo;
            curriculum.DatosPersonalesC.licenciaMotocicletaDP = obj.DatosPersonales.LicenciaMotocicleta;
            curriculum.DatosPersonalesC.imagenDP = Convert.ToBase64String(obj.DatosPersonales.Foto);
            curriculum.DatosPersonalesC.telefonoDP = obj.DatosPersonales.Telefono;
            curriculum.DatosPersonalesC.movilDP = obj.DatosPersonales.Movil;
            curriculum.DatosPersonalesC.correoDP = obj.DatosPersonales.Correo;
            curriculum.ListExperienciaLaboral = new List<ExperienciaLaboralC>();
            foreach (var item in obj.ExperienciaLaboral)
            {
                ExperienciaLaboralC xl = new ExperienciaLaboralC();
                xl.idEL = item.Id.ToString();
                xl.nombreEmpresaEL = item.NombreEmpresa;
                xl.cargoEmpresaEL = item.CargoEnEmpresa;
                xl.contactoEL = item.ContactoEmpresa;
                xl.industriaEL = item.Industria;
                xl.descripcionEL = item.Descripcion;
                xl.fechaInicioEL = item.FechaInicio?.ToString("dd/MM/yyyy");
                xl.fechaFinEL = item.FechaFin?.ToString("dd/MM/yyyy");
                xl.ActualTrabajo = item.TrabajoActual == true ? "Si" : "No";
                xl.personasAlCargoEL = item.NroPersonasAlCargo.ToString();
                xl.paisEL = item.Pais;
                xl.estadoRegionEL = item.EstadoRegion;
                xl.ciudadEL = item.Ciudad;
                curriculum.ListExperienciaLaboral.Add(xl);
            }
            curriculum.ListHabilidades = new List<HabilidadC>();
            foreach (var item in obj.Habilidad)
            {
                HabilidadC hab = new HabilidadC();
                hab.idH = item.Id.ToString();
                hab.nombreH = item.Nombre;
                hab.aniosExperienciaH = item.AniosExperiencia.ToString();
                curriculum.ListHabilidades.Add(hab);
            }
            curriculum.ListInformacionAdicional = new List<InformacionAdicionalC>();
            foreach (var item in obj.InformacionAdicional)
            {
                InformacionAdicionalC ia = new InformacionAdicionalC();
                ia.idIA = item.Id.ToString();
                ia.descripcionIA = item.Descripcion;
                ia.tituloIA = item.Titulo;
                curriculum.ListInformacionAdicional.Add(ia);
            }
            curriculum.EducacionSecundaria = new EducacionSecundariaC();
            curriculum.EducacionSecundaria.idED = obj.Educacion.Colegio.Id.ToString();
            curriculum.EducacionSecundaria.ColegioInstitucionED = obj.Educacion.Colegio.Nombre;
            curriculum.EducacionSecundaria.nivelEstudioED = obj.Educacion.Colegio.Nivel;
            curriculum.EducacionSecundaria.paisED = obj.Educacion.Colegio.Pais;
            curriculum.EducacionSecundaria.estadoRegionED = obj.Educacion.Colegio.EstadoRegion;
            curriculum.EducacionSecundaria.ciudadED = obj.Educacion.Colegio.Ciudad;
            curriculum.EducacionSecundaria.fechaInicioED = obj.Educacion.Colegio.FechaInicio.ToString("dd/MM/yyyy");
            curriculum.EducacionSecundaria.fechaFinED = obj.Educacion.Colegio.FechaFin.ToString("dd/MM/yyyy");
            curriculum.ListIdiomaSuperior = new List<IdiomaSuperiorC>();
            foreach (var item in obj.Educacion.Idioma)
            {
                IdiomaSuperiorC idioma = new IdiomaSuperiorC();
                idioma.idIS = item.Id.ToString();
                idioma.nombreIS = item.Nombre;
                idioma.nivelOralIS = item.Nivel;
                idioma.lecturaIS = item.Lectura;
                idioma.escrituraIS = item.Escritura;
                curriculum.ListIdiomaSuperior.Add(idioma);
            }
            curriculum.ListEducacionSuperior = new List<EducacionSuperiorC>();
            foreach (var item in obj.Educacion.Lista)
            {
                EducacionSuperiorC edSup = new EducacionSuperiorC();
                edSup.idES = item.Id.ToString();
                edSup.universidadInstitucionES = item.Institucion;
                edSup.ccsES = item.CarreraCursoSeminario;
                edSup.nivelEstudioES = item.Nivel;
                edSup.paisES = item.Pais;
                edSup.estadoRegionES = item.EstadoRegion;
                edSup.ciudadES = item.Ciudad;
                edSup.fechaInicioES = item.FechaInicio.ToString("dd/MM/yyyy");
                edSup.fechaFinES = item.FechaFin?.ToString("dd/MM/yyyy");
                edSup.estudioActualES = item.EstudiandoActualmente == true ? "Si" : "No";
                curriculum.ListEducacionSuperior.Add(edSup);
            }
            return curriculum;
        }
    }
    public class listCurriculums
    {
        public List<CurriculoC> curriculums { get; set; }
        public int TotalRegistro { get; set; }
        public List<CurriculoC> CargarLista(List<Curriculum> list)
        {
            List<CurriculoC> listCurriculums = new List<CurriculoC>();
            foreach (var obj in list)
            {
                CurriculoC curriculum = new CurriculoC();
                curriculum = curriculum.CargarCurriculum(obj);
                listCurriculums.Add(curriculum);
            }
            return listCurriculums;
        }
    }
}