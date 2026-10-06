import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
export default function Catalogo() {
  return (<>
    <Header/>
    <main>
      <section>
        <h2>Sobre Nosotros</h2>

        <p>
          Somos un emprendimiento dedicado a la producción y
          distribución de alimentos 100% orgánicos en la zona
          central de Chile. Nuestro proyecto nace en Paine con
          la misión de promover un estilo de vida saludable
          y libre de químicos.
        </p>
      </section>
    </main>
    <Footer/>
    </>
  );
}