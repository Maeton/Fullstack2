import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
export default function Inicio() {
  return (<>
    <Header/>
   <main> <section> <p> Productos 100% orgánicos, cultivados de manera natural y sostenible, sin pesticidas ni químicos. Frescura y calidad directamente del huerto a tu mesa. </p> <video src={videoHuerto} controls width="640"> Tu navegador no puede reproducir este video. </video> </section> </main>
   <Footer/>
    </>
  );
}