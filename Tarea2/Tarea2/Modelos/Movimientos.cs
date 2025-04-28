namespace Tarea2.Modelos
{
    public class Movimientos
    {
        public int id { get; set; }
        public idEm
        public string Puesto { get; set; }
        public string ValorDocumentoIdentidad { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaContratacion { get; set; }
        public int SaldoVacaciones { get; set; }
        public bool EsActivo { get; set; }

        public Empleado()
        {
        }

        public Empleado(string Puesto, string valorDocumentoIdentidad, string nombre, DateTime fechaContratacion, int saldoVacaciones, bool esActivo)
        {
            this.Puesto = Puesto;
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

        public Empleado(int id, string Puesto, string valorDocumentoIdentidad, string nombre)
        {
            this.id = id;
            this.Puesto = Puesto;
            this.ValorDocumentoIdentidad = valorDocumentoIdentidad;
            this.Nombre = nombre;
        }
    }
}