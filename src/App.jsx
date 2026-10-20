import Header from './components/Header';
import LoginForm from './components/LoginForm';
import Footer from './components/Footer';

// Page layout: slim header with logos, centred sign-in form, footer.
export default function App() {
  return (
    <div className="page">
      <Header />
      <main className="page-main">
        <LoginForm />
      </main>
      <Footer />
    </div>
  );
}
