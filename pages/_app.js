// pages/_app.js
import "./styles/globals.css";
import Layout from "../components/General/Layout";
import { Provider } from 'next-auth/client'

function MyApp({ Component, pageProps }) {
  return (
    <Provider
    options={{
      clientMaxAge: 0,
      keepAlive: 0
    }}
    session={pageProps.session} >
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </Provider>
  );
}

export default MyApp;
