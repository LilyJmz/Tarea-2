namespace Tarea2.Modelos
{
    public class TipoMovimiento
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public bool tipoAccion { get; set; } // true = suma, false = resta

        public TipoMovimiento()
        {
        }

        public TipoMovimiento(int id, string nombre, bool tipoAccion)
        {
            this.id = id;
            this.nombre = nombre;
            this.tipoAccion = tipoAccion;
        }
    }

}