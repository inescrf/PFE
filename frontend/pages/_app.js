import Layout from "../components/layout";
import "../styles/globals.css"; // Assure-toi d’avoir tes styles globaux

export default function MyApp({ Component, pageProps }) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
