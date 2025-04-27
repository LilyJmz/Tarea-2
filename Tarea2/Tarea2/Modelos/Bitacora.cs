namespace Tarea2.Modelos
{
    public class Bitacora
    {
        public int id { get; set; }
        public int idTipoEvento { get; set; }
        public string Descripcion { get; set; }
        public int idPostByUser { get; set; }
        public string PostInIp { get; set; }
        public DateTime PostTime { get; set; }

        public Bitacora()
        {
        }

        public Bitacora(int idTipoEvento, string Descripcion, int idPostByUser, string PostInIp, DateTime PostTime)
        {
            this.idTipoEvento = idTipoEvento;
            this.Descripcion = Descripcion;
            this.idPostByUser = idPostByUser;
            this.PostInIp = PostInIp;
            this.PostTime = PostTime;
        }
    }
}
