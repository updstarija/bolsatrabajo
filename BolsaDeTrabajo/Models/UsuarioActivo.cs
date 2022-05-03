using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.Security.Principal;
using System.Security.Claims;

namespace BolsaDeTrabajo.Models
{
    public class UsuarioActivo
    {
        public string Id { get; set; }
        public string Rol { get; set; }
        public string Email { get; set; }

        public UsuarioActivo getUser(IPrincipal User)
        {
            UsuarioActivo us = new UsuarioActivo();
            var userClaims = (ClaimsPrincipal)User;
            var claims = userClaims.Claims;
            var Datos = claims.ToList();
            us.Email = Datos[0].Value;
            us.Rol = Datos[1].Value;
            //var userIdentity = (ClaimsIdentity)User.Identity;
            //var claims = userIdentity.Claims;
            //var Datos = claims.ToList();
            //us.Email = Datos[0].Value;
            //us.Rol = Datos[1].Value;
            //us.Rol = Datos[2].Value;
            return us;
        }
    }
}