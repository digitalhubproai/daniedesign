/**
 * Static demo content for the "creative wall" gallery.
 *
 * These items are fallback/demo data: the API layer (`lib/api.ts`) returns them
 * when the backend is unavailable. Images are seeded placeholders and should be
 * replaced with real creative work.
 */

/** Shape of a single creative wall tile. */
export type CreativeItem = {
  label: string;
  image: string;
  category: string;
};

/** Demo creative tiles; `category` drives the gallery's filter tabs. */
export const creativeItems: CreativeItem[] = [
  { label: "Logo Design", image: "https://picsum.photos/seed/danie-creative-01/900/1100", category: "Identity" },
  { label: "Brand Design", image: "https://picsum.photos/seed/danie-creative-02/900/1100", category: "Identity" },
  { label: "Stationery Design", image: "https://picsum.photos/seed/danie-creative-03/900/1100", category: "Print" },
  { label: "Social Media Design", image: "https://picsum.photos/seed/danie-creative-04/900/1100", category: "Digital" },
  { label: "Brand Guidelines", image: "https://picsum.photos/seed/danie-creative-05/900/1100", category: "Identity" },
  { label: "Packaging Design", image: "https://picsum.photos/seed/danie-creative-06/900/1100", category: "Print" },
  { label: "Label Design", image: "https://picsum.photos/seed/danie-creative-07/900/1100", category: "Print" },
  { label: "UI/UX Design", image: "https://picsum.photos/seed/danie-creative-08/900/1100", category: "Digital" },
  { label: "App Design", image: "https://picsum.photos/seed/danie-creative-09/900/1100", category: "Digital" },
  { label: "Website Design", image: "https://picsum.photos/seed/danie-creative-10/900/1100", category: "Digital" },
  { label: "Website Development", image: "https://picsum.photos/seed/danie-creative-11/900/1100", category: "Digital" },
  { label: "Motion Graphics", image: "https://picsum.photos/seed/danie-creative-12/900/1100", category: "Motion" },
];

/** Just the labels, in order, for building the scrolling marquee version of the wall. */
export const marqueeItems = creativeItems.map((item) => item.label);
