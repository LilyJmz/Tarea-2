namespace Tarea2.Modelos
{
    public class Movimiento
    {
        public int id { get; set; }
        public int idEmpleado { get; set; }
        public int idTipoMovimiento { get; set; }
        public DateTime fecha { get; set; }
        public int monto { get; set; }
        public int nuevoSaldo { get; set; }
        public string idPostByUser { get; set; }
        public string postInIp { get; set; }
        public DateTime postTime { get; set; }


        public Movimiento()
        {
        }

        public Movimiento(int id, int idEmpleado, int idTipoMovimiento, DateTime fecha, int monto, int nuevoSaldo, string idPostByUser, string postInIp, DateTime postTime)
        {
            this.id = idEmpleado;
            this.idEmpleado = idEmpleado;
            this.idTipoMovimiento = idTipoMovimiento;
            this.fecha = fecha;
            this.monto = monto;
            this.nuevoSaldo = nuevoSaldo;
            this.idPostByUser = idPostByUser;
            this.postInIp = postInIp;
            this.postTime = postTime;
        }

        }
}