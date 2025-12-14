import '../styles/globals.css';
import Sidebar from '../components/Sidebar';

export default function App({ Component, pageProps }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: 220, width: '100%' }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
