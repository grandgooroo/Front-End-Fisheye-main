import { MEDIA_FOLDER } from '../utils/mediasPath.js';

export class Media {
    constructor(media) {
        this.id = media.id;
        this.photographerId = media.photographerId;
        this.title = media.title;
        this.likes = media.likes;
        this.date = media.date;
        this.price = media.price;
    }

    getLikes() {
    return this.likes;
    }

    createArticle() {
        const titleEl = document.createElement("h3");
        titleEl.innerText = this.title;
        mediaItem.appendChild(titleEl);
        return mediaItem;
    }
}

export class ImageMedia extends Media {
    constructor(media) {
        super(media);
        this.image = media.image;
        this.mainSection = document.querySelector("#main");
        this.mediaItem = document.createElement("article");
        this.likesEl = null;
    }
    
        render() {
            const mediaFolder = `${MEDIA_FOLDER}/${this.photographerId}`;
        
            this.mediaItem.classList.add("media-item");
            this.mediaItem.setAttribute("data-id", `${this.id}`);
            this.mediaItem.id = '' + this.id;
            this.likesEl = this.mediaItem.querySelector(".likes-count");
        
            let mediaElementId = this.mediaItem.id;
            this.mediaItem.innerHTML = `
            <button class="media-button" data-id="${mediaElementId}" tabindex="0" aria-label="${this.title}">
                <img src="${mediaFolder}/${this.image}" alt="nom de l'image, ${this.title}" class="img" data-id="${mediaElementId}"></img>
            </button>
            <div class="media-item-txt">
                <p>${this.title}</p><span class="likes-count" aria-label="Likes">${this.likes}</span>
                <button class="likes" data-id="${mediaElementId}" tabindex="0" role="button" aria-label="Aimer">
                <i class="fas fa-heart like-icon"></i>
                </button>
            </div>
            `;
            return this.mediaItem;
        }
}

export class VideoMedia extends Media {
    constructor(media) {
        super(media);
        this.video = media.video;
        this.mainSection = document.querySelector("#main");
        this.mediaItem = document.createElement("article");
    }
    
        render() {
            const mediaFolder = `${MEDIA_FOLDER}/${this.photographerId}`;
        
            this.mediaItem.classList.add("media-item");
            this.mediaItem.setAttribute("data-id", `${this.id}`);
            this.mediaItem.id = '' + this.id;
            this.likesEl = this.mediaItem.querySelector(".likes-count");
        
            let mediaElementId = this.mediaItem.id;
            this.mediaItem.innerHTML = `
            <button class="media-button" data-id="${mediaElementId}" tabindex="0" aria-label="${this.title}">
                <video src="${mediaFolder}/${this.video}" alt="nom de la vidéo, ${this.title}" type=video/mp4 class="video" data-id="${mediaElementId}"></video>
            </button>
            <div class="media-item-txt">
                <p>${this.title}</p><span class="likes-count" aria-label="Likes">${this.likes}</span>
                <button class="likes" data-id="${mediaElementId}" tabindex="0" role="button" aria-label="Aimer">
                <i class="fas fa-heart like-icon"></i>
                </button>
            </div>
            `;
            return this.mediaItem;
        }
}