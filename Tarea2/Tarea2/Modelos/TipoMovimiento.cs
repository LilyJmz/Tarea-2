namespace Tarea2.Modelos
{
    public class TipoMovimiento
    {
        public int id { get; set; }
        public string nombre { get; set; }
        
        public string tipoAccion  { get; set; }



        public TipoMovimiento()
        {
        }

        public TipoMovimiento(int id, string nombre, string tipoAccion)
        {
            this.id = id;
            this.nombre = nombre;
            this.tipoAccion = tipoAccion;
        }}
    }
}