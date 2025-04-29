namespace Tarea2.Modelos
{
    public class Movimiento
    {
        public int Id { get; set; }
        public int IdEmpleado { get; set; }
        public int IdTipoMovimiento { get; set; }
        public DateTime Fecha { get; set; }
        public int Monto { get; set; }
        public int NuevoSaldo { get; set; }
        public int IdPostByUser { get; set; }
        public string PostInIp { get; set; }
        public DateTime PostTime { get; set; }

        // Constructor sin parámetros
        public Movimiento()
        {
        }

        // Constructor completo
        public Movimiento(int id, int idEmpleado, int idTipoMovimiento, DateTime fecha,
                        int monto, int nuevoSaldo, int idPostByUser,
                        string postInIp, DateTime postTime)
        {
            this.Id = id;
            this.IdEmpleado = idEmpleado;
            this.IdTipoMovimiento = idTipoMovimiento;
            this.Fecha = fecha;
            this.Monto = monto;
            this.NuevoSaldo = nuevoSaldo;
            this.IdPostByUser = idPostByUser;
            this.PostInIp = postInIp;
            this.PostTime = postTime;
        }

        // Constructor para nuevos movimientos (sin ID)
        public Movimiento(int idEmpleado, int idTipoMovimiento, DateTime fecha,
                        int monto, int nuevoSaldo, int idPostByUser,
                        string postInIp, DateTime postTime)
        {
            this.IdEmpleado = idEmpleado;
            this.IdTipoMovimiento = idTipoMovimiento;
            this.Fecha = fecha;
            this.Monto = monto;
            this.NuevoSaldo = nuevoSaldo;
            this.IdPostByUser = idPostByUser;
            this.PostInIp = postInIp;
            this.PostTime = postTime;
        }
    }
}