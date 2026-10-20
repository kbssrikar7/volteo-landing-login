// Photo source and licence are in the README ("Photo credit").
const PHOTO = {
  src: 'img/container-ship.jpg',
  alt: 'Container ship at sea, seen from above, with its wake behind it',
};

// Photo of a container ship at sea.
// - Large screens: fills the page; the sign-in card sits on the open water
//   to the right of the ship.
// - Phones and tablets: shown at full width at the top so the whole ship is
//   visible, then fades into the page colour where the card starts.
// The photo drifts very slowly toward the ship's heading, unless the visitor
// prefers reduced motion.
export default function OceanBackground() {
  return (
    <div className="absolute inset-x-0 top-0 overflow-hidden lg:inset-0 lg:-left-[16vw] xl:left-0" aria-hidden="true">
      <img
        src={PHOTO.src}
        alt={PHOTO.alt}
        className="-ml-[5vw] block h-auto w-[135vw] max-w-none motion-safe:animate-drift sm:ml-0 sm:w-full lg:size-full lg:object-cover lg:object-[30%_45%]"
      />

      {/* Darken the top for the logos */}
      <div className="absolute inset-0 bg-linear-to-b from-black/35 to-transparent to-30%" />

      {/* On phones and tablets, fade the bottom of the photo into the page colour */}
      <div className="absolute inset-0 bg-linear-to-t from-ocean via-ocean/0 via-30% lg:hidden" />
    </div>
  );
}
