
export default class Media {
    constructor({id, photographerId, title, image, video, tags, likes, date, price}) {
    this.id = id;
    this.photographerId = photographerId;
    this.title = title;
    this.image = image;
    this.video = video;
    this.tags = tags;
    this.likes = likes;
    this.date = date;
    this.price = price;
    }

    // Crée un media en fonction de la nature du média (Image ou Vidéo)
    createMedia(image, video) {
    
    if (image) {
    return new ImageMedia(this.image);
    } else if (video) {
    return new VideoMedia(this.video);
    } else {
    throw new Error("Media type not supported");
    }
    }
}