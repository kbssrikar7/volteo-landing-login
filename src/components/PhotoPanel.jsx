import { LOGOS } from '@/config';

// Photo source and licence are in the README ("Photo credit").
const PHOTO = {
  src: 'img/krishnapatnam-port.jpg',
  alt: 'Container cranes unloading a cargo ship at Krishnapatnam Port',
};

// Left half of the page: black-and-white port photo with the APMB emblem over it.
// Below the lg breakpoint it becomes a banner above the form.
export default function PhotoPanel() {
  return (
    <aside className="relative h-56 overflow-hidden bg-neutral-900 sm:h-72 lg:h-auto lg:min-h-screen">
      <img
        src={PHOTO.src}
        alt={PHOTO.alt}
        className="absolute inset-0 size-full object-cover object-[50%_45%] lg:object-[55%_50%]"
      />

      {/* Darkens the bottom of the photo so the text on it stays readable */}
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 via-40% to-transparent to-65%" />

      <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[calc(24rem+2rem)] items-center gap-4 px-4 pb-6 text-white lg:mx-0 lg:max-w-none lg:p-12">
        <img src={LOGOS.apmb} alt="" className="size-11 shrink-0 lg:size-16" />
        <div>
          <p className="text-lg leading-tight font-semibold tracking-tight lg:text-2xl">
            Andhra Pradesh Maritime Board
          </p>
          <p className="mt-0.5 text-sm text-white/70">Government of Andhra Pradesh</p>
        </div>
      </div>
    </aside>
  );
}
