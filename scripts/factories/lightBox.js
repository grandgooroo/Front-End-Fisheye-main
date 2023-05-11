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

    // Accesibilité pour les boutons
    // this.prevButton.setAttribute("role", "button");
    this.prevButton.setAttribute("aria-label", "Précédent");

    // this.nextButton.setAttribute("role", "button");
    this.nextButton.setAttribute("aria-label", "Suivant");
  
    this.closeButton.setAttribute("aria-label", "Fermer");
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
    document.addEventListener("keydown", this.handleKeyDown);

    this.lightboxContainer.classList.remove("hidden");
    // Ajouter ici le aria-hidden du la page "main"
    this.mainSection.setAttribute('aria-hidden', 'true');
    console.log(this.mainSection)
    this.closeButton.focus();
    this.disableBackgroundFocus();
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
    // this.updateFocus();
  }

  next() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.medias.length - 1;
    } else {
      this.currentIndex--;
    }
    this.currentMedia = this.medias[this.currentIndex];

    this.displayMedia();
    // this.updateFocus();
  }

  close() {
    this.lightboxContainer.classList.add("hidden");

    this.closeButton.removeEventListener("click", this.close);
    this.nextButton.removeEventListener("click", this.next);
    this.prevButton.removeEventListener("click", this.previous);
    document.removeEventListener("keydown", this.boundManageKeyboardEvents);
    document.removeEventListener("keydown", this.handleKeyDown);
    this.enableBackgroundFocus();
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

  handleKeyDown = (e) => {
    if (this.lightboxContainer && this.lightboxContainer.contains(document.activeElement)) {
      const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const firstFocusableElement = this.lightboxContainer.querySelectorAll(focusableElements)[0];
      const focusableContent = this.lightboxContainer.querySelectorAll(focusableElements);
      const lastFocusableElement = focusableContent[focusableContent.length - 1];

      let isTabPressed = e.key === "Tab" || e.keyCode === 9;

      if (!isTabPressed) {
        return;
      }

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  disableBackgroundFocus() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const backgroundFocusableElements = this.mainSection.querySelectorAll(focusableElements);

    backgroundFocusableElements.forEach((element) => {
      // Vérifiez si l'élément fait partie du menu déroulant
      if (!element.closest(".dropdown-menu")) {
        element.setAttribute('tabindex', '-1');
      }
    });
  }

  enableBackgroundFocus() {
    const disabledFocusableElements = this.mainSection.querySelectorAll('[tabindex="-1"]');

    disabledFocusableElements.forEach((element) => {
      // Vérifiez si l'élément fait partie du menu déroulant
      if (!element.closest(".dropdown-menu")) {
        element.removeAttribute('tabindex');
      }
    });
  }

}

