import { LOGOS } from '../config';

// Photo source and licence are in the README ("Photo credit").
const PHOTO = {
  src: 'img/krishnapatnam-port.jpg',
  alt: 'Container cranes unloading a cargo ship at Krishnapatnam Port',
};

// Left half of the page: black-and-white port photo with the APMB emblem over it.
// On phones it becomes a short banner above the form (see styles.css).
export default function PhotoPanel() {
  return (
    <aside className="photo-panel">
      <img src={PHOTO.src} alt={PHOTO.alt} className="photo-panel-image" />

      <div className="photo-panel-content">
        <div className="photo-panel-org">
          <img src={LOGOS.apmb} alt="" className="photo-panel-emblem" />
          <div>
            <p className="photo-panel-org-name">Andhra Pradesh Maritime Board</p>
            <p className="photo-panel-org-sub">Government of Andhra Pradesh</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
