using Microsoft.Data.SqlClient;
using System.Data;
using Tarea2.Modelos;

public class AccesarBD
{
    //public static int InsertarEmpleado(string nombre, decimal salario)
    //{
    //    //String de conexión a BD
    //    string StringConexion = "Server=25.55.61.33;" +
    //        "Database=Tarea2;" +
    //        "Trusted_Connection=True;" +
    //        "TrustServerCertificate=True;";

    //    try
    //    {
    //        using (SqlConnection con = new SqlConnection(StringConexion))
    //        {
    //            //Abre conexión y se crea el comando insertar
    //            con.Open();

    //            using (SqlCommand insertar = new SqlCommand("InsertarEmpleado", con))
    //            {
    //                //Envia parámetros de entrada
    //                insertar.CommandType = CommandType.StoredProcedure;
    //                insertar.Parameters.Add("@inNombre", SqlDbType.VarChar, 64).Value = nombre;
    //                insertar.Parameters.Add("@inSalario", SqlDbType.Money).Value = salario;

    //                //Recibe el código de error
    //                SqlParameter outCodigoError = new SqlParameter("@outCodigoError", SqlDbType.Int)
    //                {
    //                    Direction = ParameterDirection.Output
    //                };
    //                insertar.Parameters.Add(outCodigoError);

    //                //Se ejecuta el Stored procedure
    //                insertar.ExecuteNonQuery();

    //                //Devuelve el código de error
    //                return (int)outCodigoError.Value;
    //            }
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        //Error en capa lógica
    //        Console.WriteLine("Error en accesar BD");
    //        return 50005;
    //    }
    //}


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
}
