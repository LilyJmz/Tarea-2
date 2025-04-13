using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tarea2.Modelos;

//Esta api controller se encarga de conectar la capa usuario con la capa de acceso a BD
//Es decir, ahora las stored procedures se pueden llamar desde la vista usuario, pero no se puede ver su contenido
//El api es de  ASP.NET Core , y expone por medio de https solicitudes a la capa de ususario

namespace Tarea2.Controllers
{
    [Route("api/BDController")]
    [ApiController]
    public class BDController : ControllerBase
    {
        [HttpPost("InsertarControlador")]
        public ActionResult<int> InsertarEmpleado([FromBody] Empleado empleado)
        {
            try
            {
                int result = AccesarBD.InsertarEmpleado(empleado.Puesto, empleado.ValorDocumentoIdentidad, empleado.Nombre, empleado.FechaContratacion, empleado.SaldoVacaciones, empleado.EsActivo);
                if (result == 0) // El stored procedure devuelve 0 todo está bien
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(new { message = "Error al insertar empleado", codigoError = result });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en servidor", exception = ex.Message });
            }
        }


        [AllowAnonymous]
        //Un controller de tipo GET para recibir la información de la lista de empleados
        [HttpGet("MostrarControlador")]
        public ActionResult<List<Empleado>> MostrarEmpleados()
        {
            try
            {
                var empleados = AccesarBD.MostrarEmpleados();
                if (empleados.Count == 0) //No hay empleados en la tabla
                {
                        return Ok(new { message = "La tabla está vacía", empleados = new List<Empleado>() });
                }
                return Ok(empleados);//El stored procedure devuelve la lista de empleados
            }
            catch
            {
                Console.WriteLine("No se muestra la tabla");
                return (null);
            }
        }




        //Un controller de tipo GET para recibir la información de la lista de Puestos
        [HttpGet("MostrarPuestoControlador")]
        public ActionResult<List<Puesto>> MostrarPuestos()
        {
            try
            {
                var puestos = AccesarBD.MostrarPuestos();
                if (puestos.Count == 0) 
                {
                    return Ok(new { message = "La tabla está vacía", empleados = new List<Puesto>() });
                }
                return Ok(puestos);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener los puestos: {ex.Message}");
                return StatusCode(500, new { message = "Error en el servidor" });
            }
        }



        [HttpGet("MostrarUsuarioControlador")]
        public ActionResult<List<Usuario>> MostrarUsuarios()
        {
            try
            {
                var Usuarios = AccesarBD.MostrarUsuarios();
                if (Usuarios.Count == 0) //No hay Usuarios en la tabla
                {
                    return BadRequest(new { message = "La tabla se encuentra vacía" });
                }
                return Ok(Usuarios);//El stored procedure devuelve la lista de Usuarios
            }
            catch
            {
                Console.WriteLine("No hay usuarios");
                return (null);
            }
        }

    }
}