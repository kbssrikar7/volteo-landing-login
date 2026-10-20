import PhotoPanel from '@/components/PhotoPanel';
import LoginForm from '@/components/LoginForm';
import Footer from '@/components/Footer';
import { LOGOS } from '@/config';

// Two halves on large screens: port photo on the left, sign-in form on the right.
// On smaller screens the photo becomes a banner above the form.
export default function App() {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] lg:grid-cols-[1.1fr_1fr] lg:grid-rows-none">
      <PhotoPanel />

      <div className="flex min-w-0 flex-col">
        <header className="mx-auto w-full max-w-[calc(24rem+2rem)] px-4 pt-8 lg:mx-0 lg:max-w-none lg:px-12">
          <img src={LOGOS.smartport} alt="Smartport" className="h-6 lg:h-7" />
        </header>

        <main className="flex flex-1 justify-center px-4 py-8 lg:items-center lg:px-12">
          <LoginForm />
        </main>

        <Footer />
      </div>
    </div>
  );
}
