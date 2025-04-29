using Microsoft.Data.SqlClient;
using System.Data;
using Tarea2.Modelos;

public class AccesarBD
{
    public static int InsertarEmpleado(string puesto, string ValorDocumentoIdentidad, string nombre, DateTime fechaContratacion, int saldoVacaciones, bool esActivo)
    {
        //String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                //Abre conexión y se crea el comando insertar
                con.Open();

                using (SqlCommand insertar = new SqlCommand("InsertarEmpleado", con))
                {
                    insertar.CommandType = CommandType.StoredProcedure;

                    //Envia parámetros de entrada
                    insertar.Parameters.Add("@inPuesto", SqlDbType.VarChar, 128).Value = puesto;
                    insertar.Parameters.Add("@inValorDocumentoIdentidad", SqlDbType.NChar, 32).Value = ValorDocumentoIdentidad;
                    insertar.Parameters.Add("@inNombre", SqlDbType.VarChar, 128).Value = nombre;
                    insertar.Parameters.Add("@inFechaContratacion", SqlDbType.Date).Value = fechaContratacion;
                    insertar.Parameters.Add("@inSaldoVacaciones", SqlDbType.Int).Value = saldoVacaciones;
                    insertar.Parameters.Add("@inEsActivo", SqlDbType.Bit).Value = esActivo;


                    //Recibe el código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    insertar.Parameters.Add(outCodigoError);

                    //Se ejecuta el Stored procedure
                    insertar.ExecuteNonQuery();

                    //Devuelve el código de error
                    return (int)outCodigoError.Value;
                }
            }
        }
        catch (Exception ex)
        {
            //Error en capa lógica
            Console.WriteLine($"Error al intentar conectar o ejecutar la consulta: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            return 50025;
        }
    }

    public static async Task<int> InsertarMovimiento(
        int idEmpleado,
        int idTipoMovimiento,
        DateTime fecha,
        int monto,
        int nuevoSaldo,
        int idPostByUser,
        string postInIp,
        DateTime postTime)
    {
        string connectionString = "Server=25.55.61.33;Database=Tarea2;Trusted_Connection=True;TrustServerCertificate=True;";

        try
        {
            using (var con = new SqlConnection(connectionString))
            {
                await con.OpenAsync();

                using (var cmd = new SqlCommand("InsertarMovimiento", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada (ajustados al SP)
                    cmd.Parameters.Add("@idEmpleado", SqlDbType.Int).Value = idEmpleado;
                    cmd.Parameters.Add("@idTipoMovimiento", SqlDbType.Int).Value = idTipoMovimiento;
                    cmd.Parameters.Add("@Fecha", SqlDbType.DateTime).Value = fecha;
                    cmd.Parameters.Add("@Monto", SqlDbType.Money).Value = Convert.ToDecimal(monto); // Conversión explícita
                    cmd.Parameters.Add("@NuevoSaldo", SqlDbType.Money).Value = Convert.ToDecimal(nuevoSaldo);
                    cmd.Parameters.Add("@idPostByUser", SqlDbType.Int).Value = idPostByUser;
                    cmd.Parameters.Add("@PostInIp", SqlDbType.VarChar, 128).Value = postInIp;
                    cmd.Parameters.Add("@PostTime", SqlDbType.DateTime).Value = postTime; // Ya es DateTime

                    // Parámetro de salida
                    var outParam = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outParam);

                    await cmd.ExecuteNonQueryAsync();
                    return (int)outParam.Value;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al insertar movimiento: {ex.Message}");
            return 50025;
        }
    }

    public static int ContarLoginsFallidos(
    string username,
    string password,
    string ipAddress,
    out int outConteo,
    out int outFueUsuario,
    out int outCodigoError)
    {
        // String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Inicializar parámetros de salida
        outConteo = 0;
        outFueUsuario = 0;
        outCodigoError = 0;

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();

                using (SqlCommand cmd = new SqlCommand("ContarLoginsFallidos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada
                    cmd.Parameters.Add("@inUsername", SqlDbType.VarChar, 128).Value = username;
                    cmd.Parameters.Add("@inPassword", SqlDbType.VarChar, 128).Value = password;
                    cmd.Parameters.Add("@inIPAddress", SqlDbType.VarChar, 32).Value = ipAddress;

                    // Parámetros de salida
                    SqlParameter paramConteo = new SqlParameter("@outConteo", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramConteo);

                    SqlParameter paramFueUsuario = new SqlParameter("@outFueUsuario", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramFueUsuario);

                    SqlParameter paramCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramCodigoError);

                    // Ejecutar SP
                    cmd.ExecuteNonQuery();

                    // Obtener valores de salida
                    outConteo = (int)paramConteo.Value;
                    outFueUsuario = (int)paramFueUsuario.Value;
                    outCodigoError = (int)paramCodigoError.Value;

                    return outCodigoError;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al contar logins fallidos: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            outCodigoError = 50005;
            return outCodigoError;
        }
    }


    public static int ManejarError(
    int codigoError,
    out string outDescripcion,
    out int outCodigoError)
    {
        // String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Inicializar parámetros de salida
        outDescripcion = string.Empty;
        outCodigoError = 0;

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();

                using (SqlCommand cmd = new SqlCommand("ManejarErrores", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada
                    cmd.Parameters.Add("@inCodigoError", SqlDbType.Int).Value = codigoError;

                    // Parámetros de salida
                    SqlParameter paramDescripcion = new SqlParameter("@outDescripcion", SqlDbType.VarChar, -1) // -1 = MAX
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramDescripcion);

                    SqlParameter paramCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramCodigoError);

                    // Ejecutar SP
                    cmd.ExecuteNonQuery();

                    // Obtener valores de salida
                    outDescripcion = paramDescripcion.Value?.ToString() ?? "Descripción no disponible";
                    outCodigoError = (int)paramCodigoError.Value;

                    return outCodigoError;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al manejar error: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            outCodigoError = 50200;
            outDescripcion = "Error al procesar la solicitud";
            return outCodigoError;
        }
    }

    public static int VerificarDeshabilitado(
    string username,
    out bool outDeshabilitado,
    out int outCodigoError)
    {
        // String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Inicializar parámetros de salida
        outDeshabilitado = false;
        outCodigoError = 0;

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();

                using (SqlCommand cmd = new SqlCommand("VerificarDeshabilitado", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetros de entrada
                    cmd.Parameters.Add("@inUserName", SqlDbType.VarChar, 128).Value = username;

                    // Parámetros de salida
                    SqlParameter paramDeshabilitado = new SqlParameter("@outDeshabilitado", SqlDbType.Bit)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramDeshabilitado);

                    SqlParameter paramCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(paramCodigoError);

                    // Ejecutar SP
                    cmd.ExecuteNonQuery();

                    // Obtener valores de salida
                    outDeshabilitado = (bool)paramDeshabilitado.Value;
                    outCodigoError = (int)paramCodigoError.Value;

                    return outCodigoError;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al verificar estado deshabilitado: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            outCodigoError = 50005;
            return outCodigoError;
        }
    }


    public static int InsertarBitacora(int idTipoEvento, string Descripcion, int idPostByUser, string PostInIp, DateTime PostTime)
    {
        //String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                //Abre conexión y se crea el comando insertar
                con.Open();

                using (SqlCommand insertar = new SqlCommand("InsertarBitacora", con))
                {
                    insertar.CommandType = CommandType.StoredProcedure;

                    //Envia parámetros de entrada
                    insertar.Parameters.Add("@inIdTipoEvento", SqlDbType.Int).Value = idTipoEvento;
                    insertar.Parameters.Add("@inDescripcion", SqlDbType.VarChar, 300).Value = Descripcion;
                    insertar.Parameters.Add("@inIdPostByUser", SqlDbType.Int).Value = idPostByUser;
                    insertar.Parameters.Add("@inPostInIp", SqlDbType.VarChar, 32).Value = PostInIp;
                    insertar.Parameters.Add("@inPostTime", SqlDbType.DateTime).Value = PostTime;


                    //Recibe el código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    insertar.Parameters.Add(outCodigoError);

                    //Se ejecuta el Stored procedure
                    insertar.ExecuteNonQuery();

                    //Devuelve el código de error
                    return (int)outCodigoError.Value;
                }
            }
        }
        catch (Exception ex)
        {
            //Error en capa lógica
            Console.WriteLine($"Error al intentar conectar o ejecutar la consulta: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            return 50025;
        }
    }



    public static int UpdateEmpleado(int id, string puesto, string ValorDocumentoIdentidad, string nombre)
    {
        //String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                //Abre conexión y se crea el comando insertar
                con.Open();

                using (SqlCommand insertar = new SqlCommand("UpdateEmpleado", con))
                {
                    insertar.CommandType = CommandType.StoredProcedure;

                    //Envia parámetros de entrada
                    insertar.Parameters.Add("@inId", SqlDbType.Int).Value = id;
                    insertar.Parameters.Add("@inPuesto", SqlDbType.VarChar, 128).Value = puesto;
                    insertar.Parameters.Add("@inValorDocumentoIdentidad", SqlDbType.NChar, 32).Value = ValorDocumentoIdentidad;
                    insertar.Parameters.Add("@inNombre", SqlDbType.VarChar, 128).Value = nombre;


                    //Recibe el código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    insertar.Parameters.Add(outCodigoError);

                    //Se ejecuta el Stored procedure
                    insertar.ExecuteNonQuery();

                    //Devuelve el código de error
                    return (int)outCodigoError.Value;
                }
            }
        }
        catch (Exception ex)
        {
            //Error en capa lógica
            Console.WriteLine($"Error al intentar conectar o ejecutar la consulta: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            return 50025;
        }
    }


    public static int DeleteEmpleado(int id)
    {
        //String de conexión a BD
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                //Abre conexión y se crea el comando insertar
                con.Open();

                using (SqlCommand insertar = new SqlCommand("DeleteEmpleado", con))
                {
                    insertar.CommandType = CommandType.StoredProcedure;

                    //Envia parámetros de entrada
                    insertar.Parameters.Add("@inId", SqlDbType.Int).Value = id;


                    //Recibe el código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    insertar.Parameters.Add(outCodigoError);

                    //Se ejecuta el Stored procedure
                    insertar.ExecuteNonQuery();

                    //Devuelve el código de error
                    return (int)outCodigoError.Value;
                }
            }
        }
        catch (Exception ex)
        {
            //Error en capa lógica
            Console.WriteLine($"Error al intentar conectar o ejecutar la consulta: {ex.Message}");
            Console.WriteLine($"Detalles: {ex.StackTrace}");
            return 50025;
        }
    }

    public static List<Empleado> MostrarEmpleados()
    {
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Crea una lista de empleados vacía
        List<Empleado> empleados = new List<Empleado>();

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();
                using (SqlCommand mostrar = new SqlCommand("MostrarEmpleados", con))
                {
                    mostrar.CommandType = CommandType.StoredProcedure;

                    // Añadir el parámetro de salida para código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    mostrar.Parameters.Add(outCodigoError);

                    using (SqlDataReader reader = mostrar.ExecuteReader())
                    {
                        // Mientras haya registros en la tabla, los va almacenando como empleados
                        while (reader.Read())
                        {
                            empleados.Add(new Empleado(
                                reader.GetInt32(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetDateTime(4).Date,
                                reader.GetInt32(5),
                                reader.GetBoolean(6)
                            ));
                        }
                    }

                    // Obtener el código de error 
                    int errorCod = (int)outCodigoError.Value;
                    if (errorCod != 0)
                    {
                        // Error en capa lógica
                        Console.WriteLine("Error al mostrar empleados: " + errorCod);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Error en capa lógica
            Console.WriteLine("Error al mostrar empleados");
        }

        return empleados.OrderBy(e => e.Nombre).ToList(); //Orden ascendente por nombre
    }

    public static List<Movimiento> MostrarMovimientos(int idEmpleado)
    {
        string connectionString = "Server=25.55.61.33;Database=Tarea2;Trusted_Connection=True;TrustServerCertificate=True;";
        List<Movimiento> movimientos = new List<Movimiento>();

        try
        {
            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();
                using (SqlCommand cmd = new SqlCommand("MostrarMovimientos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@IdEmpleadoBuscado", idEmpleado);

                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outCodigoError);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            movimientos.Add(new Movimiento
                            {
                                Id = reader.GetInt32(0),
                                IdEmpleado = reader.GetInt32(1),
                                IdTipoMovimiento = reader.GetInt32(2),
                                Fecha = reader.GetDateTime(3),
                                Monto = reader.GetInt32(4),
                                NuevoSaldo = reader.GetInt32(5),
                                IdPostByUser = reader.GetInt32(6),
                                PostInIp = reader.GetString(7),
                                PostTime = reader.GetDateTime(8)
                            });
                        }
                    }

                    int errorCode = (int)outCodigoError.Value;
                    if (errorCode != 0)
                    {
                        Console.WriteLine($"Código de error del SP: {errorCode}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en BD: {ex.Message}");
        }

        return movimientos.OrderByDescending(m => m.Fecha).ToList();
    }
    public static int CargarDatos()
    {
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        try
        {
            using (var con = new SqlConnection(StringConexion))
            {
                con.Open();
                using (var cmd = new SqlCommand("CargarDatos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    var outParam = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outParam);

                    cmd.ExecuteNonQuery();

                    return (int)outParam.Value;
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Database Error: " + ex.Message);
            return 50005;
        }
    }


    public static List<Empleado> FiltrarEmpleados(string inBusqueda, int inTipo)
    {
        string StringConexion = "Server=25.55.61.33;Database=Tarea2;Trusted_Connection=True;TrustServerCertificate=True;";
        List<Empleado> empleados = new List<Empleado>();

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();
                using (SqlCommand filtrar = new SqlCommand("FiltrarEmpleados", con))
                {
                    filtrar.CommandType = CommandType.StoredProcedure;

                    filtrar.Parameters.AddWithValue("@inBusqueda", inBusqueda);
                    filtrar.Parameters.AddWithValue("@inTipo", inTipo);

                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    filtrar.Parameters.Add(outCodigoError);

                    using (SqlDataReader reader = filtrar.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            empleados.Add(new Empleado(
                                reader.GetInt32(0),
                                reader.GetString(1),
                                reader.GetString(2),
                                reader.GetString(3),
                                reader.GetDateTime(4).Date,
                                reader.GetInt32(5),
                                reader.GetBoolean(6)
                            ));
                        }
                    }

                    int errorCod = (int)outCodigoError.Value;
                    if (errorCod != 0)
                    {
                        Console.WriteLine("Error al filtrar empleados: " + errorCod);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Error al filtrar empleados: " + ex.Message);
        }

        return empleados.OrderBy(e => e.Nombre).ToList(); ;
    }




    public static List<Puesto> MostrarPuestos()
    {
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Crea una lista de Puestos vacía
        List<Puesto> Puestos = new List<Puesto>();

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();
                using (SqlCommand mostrar = new SqlCommand("MostrarPuestos", con))
                {
                    mostrar.CommandType = CommandType.StoredProcedure;

                    // Añadir el parámetro de salida para código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    mostrar.Parameters.Add(outCodigoError);

                    using (SqlDataReader reader = mostrar.ExecuteReader())
                    {
                        // Mientras haya registros en la tabla, los va almacenando como Puestos
                        while (reader.Read())
                        {
                            Puestos.Add(new Puesto(
                                reader.GetInt32(0),
                                reader.GetString(1),
                                reader.GetDecimal(2)
                            ));
                        }
                    }

                    // Obtener el código de error 
                    int errorCod = (int)outCodigoError.Value;
                    if (errorCod != 0)
                    {
                        // Error en capa lógica
                        Console.WriteLine("Error al mostrar Puestos: " + errorCod);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Error en capa lógica
            Console.WriteLine("Error al mostrar Puestos");
        }

        return Puestos;
    }



    public static List<Usuario> MostrarUsuarios()
    {
        string StringConexion = "Server=25.55.61.33;" +
            "Database=Tarea2;" +
            "Trusted_Connection=True;" +
            "TrustServerCertificate=True;";

        // Crea una lista de Usuarios vacía
        List<Usuario> Usuarios = new List<Usuario>();

        try
        {
            using (SqlConnection con = new SqlConnection(StringConexion))
            {
                con.Open();
                using (SqlCommand mostrar = new SqlCommand("MostrarUsuarios", con))
                {
                    mostrar.CommandType = CommandType.StoredProcedure;

                    // Añadir el parámetro de salida para código de error
                    SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    mostrar.Parameters.Add(outCodigoError);

                    using (SqlDataReader reader = mostrar.ExecuteReader())
                    {
                        // Mientras haya registros en la tabla, los va almacenando como Usuarios
                        while (reader.Read())
                        {
                            Usuarios.Add(new Usuario(
                                reader.GetInt32(0),
                                reader.GetString(1),
                                reader.GetString(2)
                            ));
                        }
                    }

                    // Obtener el código de error 
                    int errorCod = (int)outCodigoError.Value;
                    if (errorCod != 0)
                    {
                        // Error en capa lógica
                        Console.WriteLine("Error al mostrar Usuarios: " + errorCod);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            // Error en capa lógica
            Console.WriteLine("Error al mostrar Usuarios");
        }

        return Usuarios;
    }

    public static List<TipoMovimiento> MostrarTiposMovimientos(out int codigoError)
    {
        string connectionString = "Server=25.55.61.33;Database=Tarea2;Trusted_Connection=True;TrustServerCertificate=True;";
        var tipos = new List<TipoMovimiento>();
        codigoError = 0;

        try
        {
            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                using (var cmd = new SqlCommand("MostrarTipoMovimientos", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    // Parámetro de salida
                    var outParam = new SqlParameter("@outCodigoError", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outParam);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            tipos.Add(new TipoMovimiento
                            {
                                id = reader.GetInt32(0),
                                nombre = reader.GetString(1),
                                tipoAccion = reader.GetBoolean(2)
                            });
                        }
                    }

                    codigoError = (int)outParam.Value;
                }
            }
        }
        catch
        {
            codigoError = 50005; // Error de sistema
        }

        return tipos;
    }
}
