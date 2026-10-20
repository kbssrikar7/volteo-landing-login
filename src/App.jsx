import PhotoPanel from './components/PhotoPanel';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';
import { LOGOS } from './config';

// Two halves: port photo on the left, sign-in form on the right.
// On phones the photo becomes a banner above the form.
export default function App() {
  return (
    <div className="layout">
      <PhotoPanel />

      <div className="form-column">
        <header className="form-header">
          <img src={LOGOS.smartport} alt="Smartport" className="form-wordmark" />
        </header>

        <main className="form-main">
          <LoginForm />
        </main>

        <Footer />
      </div>
    </div>
  );
}
