import LoginForm from '@/components/LoginForm';
import OceanBackground from '@/components/OceanBackground';
import { IS_DESIGN_PREVIEW, LOGOS } from '@/config';

// The photo of a ship at sea is the whole page. The sign-in card floats on
// the open water: to the right of the ship on large screens, below it on phones.
export default function App() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-ocean">
      <OceanBackground />

      <div className="relative flex min-h-svh flex-col">
        <header className="flex items-center gap-4 p-6 text-white lg:px-10 lg:pt-7">
          <img src={LOGOS.smartport} alt="Smartport" className="h-6 brightness-0 invert lg:h-7" />
          <span className="h-7 w-px bg-white/30" aria-hidden="true" />
          <img src={LOGOS.apmb} alt="" className="size-9" />
          <p className="hidden text-sm leading-tight text-white/85 sm:block">
            Andhra Pradesh
            <br />
            Maritime Board
          </p>

          {/* Shown everywhere except smartport.ap.gov.in, where sign-in really works */}
          {IS_DESIGN_PREVIEW && (
            <p className="ml-auto rounded-full bg-white/15 px-3 py-1 text-xs whitespace-nowrap text-white ring-1 ring-white/25 backdrop-blur-sm">
              Design preview<span className="hidden md:inline"> · sign-in works only on smartport.ap.gov.in</span>
            </p>
          )}
        </header>

        <main className="flex flex-1 items-start justify-center px-4 pt-[calc(66vw-5rem)] pb-10 sm:pt-[calc(48vw-3.5rem)] lg:items-center lg:justify-end lg:px-[3.5vw] lg:py-4 2xl:px-[7vw]">
          <div className="w-full max-w-md rounded-2xl lg:max-w-[26rem] 2xl:max-w-md bg-card p-7 shadow-[0_30px_80px_-20px_rgba(4,20,32,0.65)] sm:p-10 lg:p-9">
            <LoginForm />
          </div>
        </main>

        <footer className="flex flex-wrap justify-center gap-x-6 gap-y-1 px-6 pb-6 text-xs text-white/60 lg:justify-start lg:px-10">
          <span>© Andhra Pradesh Maritime Board</span>
          <span>Best viewed in Chrome or Edge</span>
        </footer>
      </div>
    </div>
  );
}
