import { MEDIA_FOLDER } from '../utils/mediasPath.js';

console.log(MEDIA_FOLDER); // "assets/medias"


export class Lightbox {
  constructor(medias) {
    this.medias = medias;
    this.currentMedia = null;
    this.currentIndex = 0;
    this.lightboxContainer = document.querySelector(".lightbox");
    this.lightboxImg = document.querySelector(".lightbox__img");
    this.lightboxTitle = document.querySelector(".lightbox__title");
    this.lightboxCounter = document.querySelector(".lightbox__counter");
    this.closeButton = document.querySelector(".lightbox__close");
    this.nextButton = document.querySelector(".lightbox__next");
    this.prevButton = document.querySelector(".lightbox__prev");
    this.mainSection = document.querySelector("#main");

    this.launchLightbox = this.launchLightbox.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.close = this.close.bind(this);

    this.boundManageKeyboardEvents = this.manageKeyboardEvents.bind(this);
  }

  updateMedias(newMedias) {
    this.medias = [...newMedias];
  }

  launchLightbox(id, userId) {
    this.currentMedia = this.medias.find((media) => media.id === parseInt(id));
    this.currentIndex = this.medias.findIndex((media) => media.id === parseInt(id));
    this.userId = userId;

    this.displayMedia();

    this.closeButton.addEventListener("click", this.close);
    this.nextButton.addEventListener("click", this.next);
    this.prevButton.addEventListener("click", this.previous);
    document.addEventListener("keydown", this.boundManageKeyboardEvents);

    this.lightboxContainer.classList.remove("hidden");
    // Ajouter ici le aria-hidden du la page "main"
    this.mainSection.setAttribute('aria-hidden', 'true');
    console.log(this.mainSection)
    this.closeButton.focus();
  }

  displayMedia() {
    if (this.currentMedia.image) {
      this.lightboxImg.innerHTML = `<img src="${MEDIA_FOLDER}/${this.userId}/${this.currentMedia.image}" alt="${this.currentMedia.title}" class="lightbox__img"></img>`;
    } else if (this.currentMedia.video) {
      this.lightboxImg.innerHTML = `<video src="${MEDIA_FOLDER}/${this.userId}/${this.currentMedia.video}" alt="${this.currentMedia.title}" class="lightbox__img" controls></video>`;
    }

    this.lightboxTitle.textContent = this.currentMedia.title;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.medias.length}`;
  }

  previous() {
    if (this.currentIndex === this.medias.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.currentMedia = this.medias[this.currentIndex];

    this.displayMedia();
  }

  next() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.medias.length - 1;
    } else {
      this.currentIndex--;
    }
    this.currentMedia = this.medias[this.currentIndex];

    this.displayMedia();
  }

  close() {
    this.lightboxContainer.classList.add("hidden");

    this.closeButton.removeEventListener("click", this.close);
    this.nextButton.removeEventListener("click", this.next);
    this.prevButton.removeEventListener("click", this.previous);
    document.removeEventListener("keydown", this.boundManageKeyboardEvents);
    this.mainSection.setAttribute('aria-hidden', 'false');
  }

  manageKeyboardEvents(event) {
    switch (event.key) { // propriété qui permet de savoir quel touche est utilisée
      case "Escape":    // propriétée de l'obj "event"
        this.close();
        break;
      case "ArrowRight":
        this.previous();
        break;
      case "ArrowLeft":
        this.next();
        break;
      default:
        break;
    }
  }
}