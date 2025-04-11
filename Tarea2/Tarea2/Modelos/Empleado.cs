namespace Tarea2.Modelos
{
    public class Empleado
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public decimal Salario { get; set; }

        public Empleado()
        {
        }

        public Empleado(int id, string Nombre, decimal Salario)
        {
            this.id = id;
            this.Nombre = Nombre;
            this.Salario = Salario;
        }
    }
}