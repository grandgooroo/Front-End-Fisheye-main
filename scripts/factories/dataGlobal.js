class Api {
    constructor() {
        let dataGlobal;

        const getData2 = async () => {
        const response = await fetch("data/photographers.json");
        const data = await response.json();
        return data;
        };
    }
}

// Autre methode

class PhotographerService {
    constructor(jsonFile) {
      this.jsonFile = jsonFile;
      this.photographers = [];
      this.media = [];
    }
  
    async init() {
      const response = await fetch(this.jsonFile);
      const data = await response.json();
      this.photographers = data.photographers;
      this.media = data.media;
    }
  
    getPhotographer(id) {
      return this.photographers.find((photographer) => photographer.id === id);
    }
  
    getPhotographerMedias(id) {
      return this.media.filter((media) => media.photographerId === id);
    }
  
    createMedia(mediaData) {
      if (mediaData.image) {
        return new ImageMedia(mediaData);
      } else if (mediaData.video) {
        return new VideoMedia(mediaData);
      } else {
        throw new Error("Media type not supported");
      }
    }
  }