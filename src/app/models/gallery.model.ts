export interface Gallery {
  _id: string;
  name: string;
  teaser: string;
  description: string;
  images: GalleryImage[];
}

export interface GalleryImage {
  image: string;
  caption: string;
}
