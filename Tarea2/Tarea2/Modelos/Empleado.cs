namespace Tarea2.Modelos
{
    public class Empleado
    {
        public int id { get; set; }
        public int idPuesto { get; set; }
        public string Puesto { get; set; }
        public string ValorDocumentoIdentidad { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaContratacion { get; set; }
        public int SaldoVacaciones { get; set; }
        public bool EsActivo { get; set; }

        public Empleado()
        {
        }

        public Empleado(int idPuesto, string valorDocumentoIdentidad, string nombre, DateTime fechaContratacion, int saldoVacaciones, bool esActivo)
        {
            this.idPuesto = idPuesto;
            this.ValorDocumentoIdentidad = valorDocumentoIdentidad;
            this.Nombre = nombre;
            this.FechaContratacion = fechaContratacion;
            this.SaldoVacaciones = saldoVacaciones;
            this.EsActivo = esActivo;
        }

        public Empleado(int id, string Puesto, string valorDocumentoIdentidad, string nombre, DateTime fechaContratacion, int saldoVacaciones, bool esActivo)
        {
            this.id = id;
            this.Puesto = Puesto;
            this.ValorDocumentoIdentidad = valorDocumentoIdentidad;
            this.Nombre = nombre;
            this.FechaContratacion = fechaContratacion;
            this.SaldoVacaciones = saldoVacaciones;
            this.EsActivo = esActivo;
        }
    }
}