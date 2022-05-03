using BolsaDeTrabajo.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace BolsaDeTrabajo
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
        protected void Application_PostAuthenticateRequest(Object sender, EventArgs e)
        {
            UPDS_BDTEntities db = new UPDS_BDTEntities();
            string roles = string.Empty;
            if (User.Identity.IsAuthenticated)
            {
                var usuario = db.Usuario.SingleOrDefault(o => o.Correo == User.Identity.Name);
                if (usuario != null)
                {
                    roles = usuario.Rol;
                }
                HttpContext.Current.User = HttpContext.Current.User = new System.Security.Principal.GenericPrincipal(new System.Security.Principal.GenericIdentity(User.Identity.Name, "Forms"), roles.Split(';'));
            }
        }
    }
}
