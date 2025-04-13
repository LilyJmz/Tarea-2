namespace Tarea2.Modelos
{
    public class Empleado
    {
        public int id { get; set; }
        public string Puesto { get; set; }
        public string ValorDocumentoIdentidad { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaContratacion { get; set; }
        public decimal SaldoVacaciones { get; set; }
        public bool EsActivo { get; set; }

        public Empleado()
        {
        }

        public Empleado(int id, string idPuesto, string valorDocumentoIdentidad, string nombre, DateTime fechaContratacion, decimal saldoVacaciones, bool esActivo)
        {
            this.id = id;
            this.Puesto = idPuesto;
            this.ValorDocumentoIdentidad = valorDocumentoIdentidad;
            this.Nombre = nombre;
            this.FechaContratacion = fechaContratacion;
            this.SaldoVacaciones = saldoVacaciones;
            this.EsActivo = esActivo;
        }
    }
}