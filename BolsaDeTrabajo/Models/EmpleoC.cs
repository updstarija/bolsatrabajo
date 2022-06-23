using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class UsuarioC
    {
        public int Id { get; set; }
        public string Correo { get; set; }
        public string Clave { get; set; }
        public string FechaActualizacion { get; set; }
        public string Rol { get; set; }
        public UsuarioC CargarUsuarioC(Usuario obj)
        {
            UsuarioC usuario = new UsuarioC();
            usuario.Id = obj.Id;
            usuario.Correo = obj.Correo;
            usuario.Clave = obj.Clave;
            usuario.FechaActualizacion = obj.FechaActualizacion?.ToString("dd/MM/yyyy");
            usuario.Rol = obj.Rol;
            return usuario;
        }
    }
    public class PerfilC
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public string TelefonoCelular { get; set; }
        public string TelefonoFijo { get; set; }
        public string Tipo { get; set; }
        public string Pais { get; set; }
        public string EstadoRegion { get; set; }
        public string Ciudad { get; set; }
        public string Foto { get; set; }
        public string FechaRegistro { get; set; }
        public string FechaActualizacion { get; set; }
        public string Estado { get; set; }
        public UsuarioC Usuario { get; set; }
        public PerfilC CargarPerfilC(Perfil obj)
        {
            PerfilC perfil = new PerfilC();
            perfil.Id = obj.Id;
            perfil.Descripcion = obj.Descripcion;
            perfil.TelefonoCelular = obj.TelefonoCelular;
            perfil.TelefonoFijo = obj.TelefonoFijo;
            perfil.Tipo = obj.Tipo;
            perfil.Pais = obj.Pais;
            perfil.EstadoRegion = obj.EstadoRegion;
            perfil.Ciudad = obj.Ciudad;
            perfil.Foto = Convert.ToBase64String(obj.Foto);
            perfil.FechaRegistro = obj.FechaRegistro.ToString("dd/MM/yyyy");
            perfil.FechaActualizacion = obj.FechaActualizacion?.ToString("dd/MM/yyyy");
            perfil.Estado = obj.Estado;
            perfil.Usuario = new UsuarioC();
            perfil.Usuario = perfil.Usuario.CargarUsuarioC(obj.Usuario);
            return perfil;
        }
    }
    public class EmpresaC
    {
        public int Id { get; set; }
        public string NIT { get; set; }
        public string NombreEmpresa { get; set; }
        public string NombrePersonaResponsable { get; set; }
        public string SitioWeb { get; set; }
        public string Direccion { get; set; }
        public PerfilC Perfil { get; set; }
        public EmpresaC CargarEmpresaC(Empresa obj)
        {
            EmpresaC empresaC = new EmpresaC();
            empresaC.Id = obj.Id;
            empresaC.NIT = obj.NIT;
            empresaC.NombreEmpresa = obj.NombreEmpresa;
            empresaC.NombrePersonaResponsable = obj.NombrePersonaResponsable;
            empresaC.SitioWeb = obj.SitioWeb;
            empresaC.Direccion = obj.Direccion;
            empresaC.Perfil = new PerfilC();
            empresaC.Perfil = empresaC.Perfil.CargarPerfilC(obj.Perfil);
            return empresaC;
        }
    }
    public class CategoriaC
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
    }
    public class EmpleoC
    {
        public string FechaRegistro { get; set; }
        public string FechaActualizacion { get; set; }
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Contrato { get; set; }
        public string Descripcion { get; set; }
        public string RangoSueldos { get; set; }
        public int ExperienciaMinima { get; set; }
        public string Periodo { get; set; }
        public string Pais { get; set; }
        public string EstadoRegion { get; set; }
        public string Ciudad { get; set; }
        public string CorreoEnvioPostulaciones { get; set; }
        public string Estado { get; set; }
        public int IdEmpresa { get; set; }
        public string FechaExpiracion { get; set; }
        public string FechaExpiracionHora { get; set; }
        public string Teletrabajo { get; set; }
        public EmpresaC Empresa { get; set; }
        public List<CategoriaC> Categorias { get; set; }
        public EmpleoC cargarEmpleoC(Empleo item)
        {
            EmpleoC emp = new EmpleoC();
            emp.FechaRegistro = item.FechaRegistro.ToString("dd/MM/yyyy");
            emp.FechaActualizacion = item.FechaActualizacion?.ToString("dd/MM/yyyy");
            emp.FechaExpiracion = item.FechaExpiracion?.ToString("dd/MM/yyyy HH:mm");
            emp.FechaExpiracionHora = item.FechaExpiracion?.ToString("yyyy-MM-ddTHH:mm");
            emp.Id = item.Id;
            emp.Titulo = item.Titulo;
            emp.Contrato = item.Contrato;
            emp.Descripcion = item.Descripcion;
            emp.RangoSueldos = item.RangoSueldos;
            emp.ExperienciaMinima = item.ExperienciaMinima;
            emp.Periodo = item.Periodo;
            emp.Pais = item.Pais;
            emp.EstadoRegion = item.EstadoRegion;
            emp.Ciudad = item.Ciudad;
            emp.CorreoEnvioPostulaciones = item.CorreoEnvioPostulaciones;
            emp.IdEmpresa = item.IdEmpresa;
            emp.Estado = item.Estado;
            emp.Teletrabajo = item.Teletrabajo == true ? "Si" : "No";
            emp.Empresa = new EmpresaC();
            emp.Empresa = emp.Empresa.CargarEmpresaC(item.Empresa);

            List<CategoriaC> listCategorias = new List<CategoriaC>();
            foreach (var obj in item.CategoriaBDT)
            {
                CategoriaC cat = new CategoriaC();
                cat.Id = obj.Id;
                cat.Nombre = obj.Nombre;
                listCategorias.Add(cat);
            }
            emp.Categorias = listCategorias;
            return emp;
        }
        public void ActualizarEstadosEmpleos()
        {
            UPDS_BDTEntities db = new UPDS_BDTEntities();
            var empleos = db.Empleo.Where(x => x.Estado == "Activo").ToList();
            foreach (var item in empleos)
            {
                //string strFechaActual = FechaActual.ToString("dd/MM/yyyy HH:mm");
                //string FechaExperacion = (DateTime.Now).ToString("dd/MM/yyyy HH:mm");

                if (item.FechaExpiracion != null)
                {
                    DateTime strFechaActual = Convert.ToDateTime(string.Format("{0:yyyy-MM-dd HH:mm}", DateTime.Now));
                    DateTime FechaExpiracion = Convert.ToDateTime(string.Format("{0:yyyy-MM-dd HH:mm}", item.FechaExpiracion));
                    //if (item.FechaExpiracion?.ToString("dd/MM/yyyy HH:mm").CompareTo(FechaActual.ToString("dd/MM/yyyy HH:mm")) >= 0)
                    var verif = DateTime.Compare(strFechaActual, FechaExpiracion);
                    if (verif >= 0)
                    {
                        item.Estado = "Expirado";
                        db.SaveChanges();

                        Notificacion notificacion = new Notificacion();
                        notificacion.Titulo = "Empleo Expirado";
                        notificacion.Descripcion = "El empleo <span>'" + item.Titulo + "'</span> con fecha de expiracion <span>" + item.FechaExpiracion + "</span> a vencido, por lo tanto ya no estara disponible para posibles candidatos. Por favor concluya el empleo.";
                        notificacion.Tipo = "Empleo";
                        notificacion.FechaRegistro = DateTime.Now;
                        notificacion.FechaActualizacion = DateTime.Now;
                        notificacion.Estado = "Pendiente";
                        notificacion.Emisor = "Sistema";
                        notificacion.Receptor = "Empresa";
                        notificacion.IdEmpresaReceptor = item.IdEmpresa;
                        db.Notificacion.Add(notificacion);
                        db.SaveChanges();

                        //Correo c = new Correo();
                        //string mensaje = "Empresa: " + item.Empresa.NombreEmpresa + "\n";
                        //mensaje += "Empleo: " + item.Titulo + "\n";
                        //mensaje += " A vencido, por lo tanto ya no estara disponible para posibles candidatos.";
                        //mensaje += "\n";
                        //mensaje += "Por favor concluya el empleo.";
                        //var r = c.enviarCorreo("UPDS_BolsaDeTrabajo@outlook.com", "BDT2021upds", mensaje, "Empleo Vencido" + ": " + item.Titulo, item.CorreoEnvioPostulaciones, "", "");
                    }
                }
            }
        }
    }
    public class listEmpleosC
    {
        public List<EmpleoC> empleos { get; set; }
        public int TotalRegistros { get; set; }

        public List<EmpleoC> CargarLista(List<Empleo> list)
        {
            List<EmpleoC> listEmpleos = new List<EmpleoC>();
            foreach (var item in list)
            {
                EmpleoC emp = new EmpleoC();
                listEmpleos.Add(emp.cargarEmpleoC(item));
            }
            return listEmpleos;
        }
    }
}