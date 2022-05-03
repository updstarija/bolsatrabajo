using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace BolsaDeTrabajo.Models
{
    public class Img
    {
        public byte[] GetBytess(Stream imageIn)
        {
            //Usamos la clase Stream para ver el contenido de la imagen
            Stream stream = imageIn;
            //Lector de binario
            BinaryReader binaryReader = new BinaryReader(stream);
            return binaryReader.ReadBytes((int)stream.Length);
        }
        //public MemoryStream ConvertirImagen(byte[] img)
        //{
        //    MemoryStream memoryStream = new MemoryStream();
        //    Image image = Image.FromStream(memoryStream);
        //    memoryStream = new MemoryStream();
        //    image.Save(memoryStream, ImageFormat.Jpeg);
        //    memoryStream.Position = 0;
        //    return memoryStream;
        //}
        public Bitmap ConvertirImagen(byte[] img)
        {
            MemoryStream memoryStream = new MemoryStream(img);
            return (Bitmap)Bitmap.FromStream(memoryStream);
            //return File(img, "Imagenes/jpg");
        }
    }
}