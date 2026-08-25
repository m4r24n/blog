export const categories = {
  Journal:{slug:'journal',art:'/category-art/journal.svg',description:'Personal notes, observations and whatever feels worth writing down.'},
  Projects:{slug:'projects',art:'/category-art/projects.svg',description:'Things I am building, testing, fixing or learning through making.'},
  Photography:{slug:'photography',art:'/category-art/photography.svg',description:'Photographs and the stories or details around them.'},
  Places:{slug:'places',art:'/category-art/places.svg',description:'Travel notes, walks, trains and places I want to remember.'},
  Learning:{slug:'learning',art:'/category-art/learning.svg',description:'Ideas, books, technical notes and things I recently understood.'},
  Work:{slug:'work',art:'/category-art/work.svg',description:'Selected professional notes and updates from ongoing work.'},
} as const;
export type CategoryName = keyof typeof categories;
export function categoryMeta(name:string){return categories[name as CategoryName] ?? categories.Journal;}
