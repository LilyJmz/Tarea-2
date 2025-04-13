namespace Tarea2.Modelos
{
    public class Puesto
    {
        public int id { get; set; }
        public string Nombre { get; set; }
        public decimal SalarioxHora { get; set; }

        public Puesto()
        {
        }

        public Puesto(int id, string Nombre, decimal SalarioxHora)
        {
            this.id = id;
            this.Nombre = Nombre;
            this.SalarioxHora = SalarioxHora;
        }
    }
}
