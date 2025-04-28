using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
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


        [HttpPost("ContarLoginsFallidos")]
        public ActionResult<LoginFallidosResponse> ContarLoginsFallidos([FromBody] LoginReq request)
        {
            try
            {
                int conteo = 0;
                int fueUsuario = 0;
                int codigoError = 0;

                int result = AccesarBD.ContarLoginsFallidos(
                    request.Username,
                    request.Password,
                    request.IPAddress,
                    out conteo,
                    out fueUsuario,
                    out codigoError
                );

                // Siempre devolvemos 200 OK, aunque haya error controlado
                return Ok(new LoginFallidosResponse
                {
                    Conteo = conteo,
                    FueUsuario = fueUsuario,
                    CodigoError = codigoError
                });
            }
            catch (Exception ex)
            {
                // Aquí sí error grave de servidor (excepción)
                return StatusCode(500, new
                {
                    message = "Error en servidor",
                    exception = ex.Message
                });
            }
        }



        [HttpPost("VerificarDeshabilitado")]
        public ActionResult<VerificacionDeshabilitadoResponse> VerificarDeshabilitado([FromBody] VerificacionDeshabilitadoRequest request)
        {
            try
            {
                bool deshabilitado = false;
                int codigoError = 0;

                int result = AccesarBD.VerificarDeshabilitado(
                    request.Username,
                    out deshabilitado,
                    out codigoError
                );

                if (codigoError == 0) // Todo está bien
                {
                    return Ok(new VerificacionDeshabilitadoResponse
                    {
                        Deshabilitado = deshabilitado,
                        CodigoError = codigoError
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        message = "Error al verificar estado de usuario",
                        codigoError = codigoError
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error en servidor",
                    exception = ex.Message
                });
            }
        }


        [HttpPost("InsertarBitacora")]
        public ActionResult<int> InsertarBitacora([FromBody] Bitacora bitacora)
        {
            try
            {
                int result = AccesarBD.InsertarBitacora(bitacora.idTipoEvento, bitacora.Descripcion, bitacora.idPostByUser, bitacora.PostInIp, bitacora.PostTime);
                if (result == 0) // El stored procedure devuelve 0 todo está bien
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(new { message = "Error al insertar evento", codigoError = result });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en servidor", exception = ex.Message });
            }
        }


        [HttpPost("UpdateControlador")]
        public ActionResult<int> UpdateEmpleado([FromBody] Empleado empleado)
        {
            try
            {
                int result = AccesarBD.UpdateEmpleado(empleado.id, empleado.Puesto, empleado.ValorDocumentoIdentidad, empleado.Nombre);
                if (result == 0) // El stored procedure devuelve 0 todo está bien
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(new { message = "Error al Update empleado", codigoError = result });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error en servidor", exception = ex.Message });
            }
        }

        [HttpPost("DeleteControlador")]
        public ActionResult<int> DeleteEmpleado([FromBody] int id)
        {
            try
            {
                int result = AccesarBD.DeleteEmpleado(id);
                if (result == 0)
                {
                    return Ok(result);
                }
                else
                {
                    return StatusCode(400, new { message = "Error al Delete empleado", codigoError = result });
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


        //[AllowAnonymous]
        //[HttpGet("MostrarMovimientosControlador")]
        //public ActionResult<List<Movimientos>> MostrarMovimientos()
        //{
        //    try
        //    {
        //        var empleados = AccesarBD.MostrarEmpleados();
        //        if (empleados.Count == 0) //No hay empleados en la tabla
        //        {
        //            return Ok(new { message = "La tabla está vacía", empleados = new List<Movimientos>() });
        //        }
        //        return Ok(empleados);//El stored procedure devuelve la lista de empleados
        //    }
        //    catch
        //    {
        //        Console.WriteLine("No se muestra la tabla");
        //        return (null);
        //    }
        //}

        [AllowAnonymous]
        [HttpGet("CargarControlador")]
        public IActionResult CargarControlador()
        {
            try
            {
                int result = AccesarBD.CargarDatos();

                return result switch
                {
                    0 => Ok(new { success = true, message = "Datos cargados exitosamente" }),
                    1 => Ok(new { success = true, message = "Los datos ya existían" }),
                    _ => BadRequest(new { success = false, message = $"Error al cargar datos (Código: {result})" })
                };
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error interno del servidor",
                    error = ex.Message
                });
            }
        }


        [AllowAnonymous]
        [HttpPost("FiltrarControlador")]
        public ActionResult<List<Empleado>> FiltrarEmpleados([FromBody] FiltroRequest filtro)
        {
            try
            {
                var empleados = AccesarBD.FiltrarEmpleados(filtro.inBusqueda, filtro.inTipo);
                return Ok(empleados);
            }
            catch (Exception ex)
            {
                Console.WriteLine("No se muestra la tabla: " + ex.Message);
                return StatusCode(500, "Error interno");
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