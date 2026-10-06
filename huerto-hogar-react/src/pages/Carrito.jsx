import Header from "./components/header.jsx";
import Footer from "./components/Footer.jsx";
export default function Inicio() {
  return (<>
    <Header/>
     <main>
        <section>
            <h2>Tu Carrito de Compras</h2>
            <div>


            </div>
        </section>

        <section>
            <h3>Total: $0</h3>
            <div>
                <article>
                    <button>Finalizar Compra</button>
                </article>
            </div>
        </section>
    </main>

   <Footer/>
    </>
  );
}