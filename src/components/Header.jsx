import { LOGOS } from '../config';

// Slim top bar: Smartport wordmark on the left, APMB emblem and name on the right.
export default function Header() {
  return (
    <header className="header">
      <img src={LOGOS.smartport} alt="Smartport" className="header-wordmark" />
      <div className="header-org">
        <img src={LOGOS.apmb} alt="" className="header-emblem" />
        <span className="header-org-name">Andhra Pradesh Maritime Board</span>
      </div>
    </header>
  );
}
