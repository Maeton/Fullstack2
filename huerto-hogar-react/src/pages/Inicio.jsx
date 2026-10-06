import videoHuerto from "../assets/vid/Huerto-Hogar-promocional.mp4";

export default function Inicio() {
  return (
    <main className="container huerto-main huerto-inicio">
      <section className="huerto-section">
        <div className="row align-items-start g-4">
          <div className="col-md-7">
            <h2>Bienvenidos a Nuestro Huerto</h2>

            <p className="huerto-descripcion">
              Productos 100% orgánicos, cultivados de manera natural
              y sostenible, sin pesticidas ni químicos. Frescura y
              calidad directamente del huerto a tu mesa.
            </p>
          </div>

          <div className="col-md-5 d-flex justify-content-center">
            <video
              src={videoHuerto}
              controls
              preload="metadata"
              className="huerto-video"
            >
              Tu navegador no puede reproducir este video.
            </video>
          </div>
        </div>
      </section>
    </main>
  );
}