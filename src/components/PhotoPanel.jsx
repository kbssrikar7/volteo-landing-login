import { LOGOS } from '../config';

// The photo is CC BY-SA 4.0, so the credit below must stay visible.
const PHOTO = {
  src: 'img/krishnapatnam-port.jpg',
  alt: 'Container cranes unloading a cargo ship at Krishnapatnam Port',
  place: 'Krishnapatnam Port',
  author: 'Rahmanuddin',
  sourceUrl: 'https://commons.wikimedia.org/wiki/File:Krishnapatnam_port_cranes_unloadng_a_ship.jpg',
  licence: 'CC BY-SA 4.0',
  licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
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

        <p className="photo-panel-credit">
          {PHOTO.place} · Photo:{' '}
          <a href={PHOTO.sourceUrl} target="_blank" rel="noreferrer">
            {PHOTO.author}
          </a>
          ,{' '}
          <a href={PHOTO.licenceUrl} target="_blank" rel="noreferrer">
            {PHOTO.licence}
          </a>
        </p>
      </div>
    </aside>
  );
}
