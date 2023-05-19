import { MEDIA_FOLDER } from '../utils/mediasPath.js';

export class Lightbox {
  constructor(medias) {
    this.medias = medias; // Tableau des médias
    // Les propriétés et index du média courant
    this.currentMedia = null;
    this.currentIndex = 0;
    // Elements du DOM
    this.lightboxContainer = document.querySelector(".lightbox");
    this.lightboxImg = document.querySelector(".lightbox__img");
    this.lightboxTitle = document.querySelector(".lightbox__title");
    this.lightboxCounter = document.querySelector(".lightbox__counter");
    this.closeButton = document.querySelector(".lightbox__close");
    this.nextButton = document.querySelector(".lightbox__next");
    this.prevButton = document.querySelector(".lightbox__prev");
    this.mainSection = document.querySelector("#main");

    // Liaison des méthodes d'événement aux instances pour gérer correctement le contexte `this`
    this.launchLightbox = this.launchLightbox.bind(this);// Lie this à la bonne méthode
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.close = this.close.bind(this);

    this.boundManageKeyboardEvents = this.manageKeyboardEvents.bind(this);

    // Accesibilité pour les boutons
    this.prevButton.setAttribute("aria-label", "Précédent");
    this.nextButton.setAttribute("aria-label", "Suivant");
    this.closeButton.setAttribute("aria-label", "Fermer");
  }
  // Met à jour le tableau des médias en fonction du tri selectionné 
  updateMedias(newMedias) { 
    this.medias = [...newMedias]; 
  }
  // Ouvre la lightbox avec le média spécifié par son ID
  launchLightbox(id, userId) {
    // Trouve le média et son index en fonction de l'ID
    this.currentMedia = this.medias.find((media) => media.id === parseInt(id));
    // console.log(this.currentMedia)
    this.currentIndex = this.medias.findIndex((media) => media.id === parseInt(id));
    // console.log(this.currentIndex)
    this.userId = userId;

    // Affiche le média et ajoute les écouteurs d'événements
    this.displayMedia();

    this.closeButton.addEventListener("click", this.close);
    this.nextButton.addEventListener("click", this.next);
    this.prevButton.addEventListener("click", this.previous);
    document.addEventListener("keydown", this.boundManageKeyboardEvents);
    document.addEventListener("keydown", this.handleKeyDown);
    
    // Fait apparaitre la lightbox et désactive le focus en arrière-plan
    this.lightboxContainer.classList.remove("hidden");
    this.mainSection.setAttribute('aria-hidden', 'true');
    console.log(this.mainSection)
    this.closeButton.focus();
    this.disableBackgroundFocus();
  }
  // Affiche le média actuel dans la lightbox
  displayMedia() {
    if (this.currentMedia.image) {
      this.lightboxImg.innerHTML = `<img src="${MEDIA_FOLDER}/${this.userId}/${this.currentMedia.image}" alt="${this.currentMedia.title}" class="lightbox__img"></img>`;
    } else if (this.currentMedia.video) {
      this.lightboxImg.innerHTML = `<video src="${MEDIA_FOLDER}/${this.userId}/${this.currentMedia.video}" alt="${this.currentMedia.title}" class="lightbox__img" controls></video>`;
    }
    // Met à jour le titre et le compteur de la lightbox
    this.lightboxTitle.textContent = this.currentMedia.title;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.medias.length}`;
  }
  // Passe au média précédent
  previous() {
    // Modifie l'index actuel et le média actuel, puis les affiche
    if (this.currentIndex === this.medias.length - 1) { // Vérifie si l'indice du média courant = l'indice du dernier média dans le tableau des médias
      this.currentIndex = 0; // Si à la fin l'indice correspond alors réinitialise à 0 & retour au début de la galerie
    } else {
      this.currentIndex++; // Si incrément pour passer au média suivant
    }
    this.currentMedia = this.medias[this.currentIndex]; // Met à jour l'indice du média courant

    this.displayMedia();
    // this.updateFocus();
  }
  // Passe au média suivant
  next() {
    // Modifie l'index actuel et le média actuel, puis les affiche
    if (this.currentIndex === 0) {
      this.currentIndex = this.medias.length - 1;
    } else {
      this.currentIndex--;
    }
    this.currentMedia = this.medias[this.currentIndex];

    this.displayMedia();
    // this.updateFocus();
  }
  // Ferme la lightbox
  close() {
    // Cache la lightbox et supprime les écouteurs d'événements
    this.lightboxContainer.classList.add("hidden");
    this.closeButton.removeEventListener("click", this.close);
    this.nextButton.removeEventListener("click", this.next);
    this.prevButton.removeEventListener("click", this.previous);
    document.removeEventListener("keydown", this.boundManageKeyboardEvents);
    document.removeEventListener("keydown", this.handleKeyDown);
    // Réactive le focus en arrière-plan
    this.enableBackgroundFocus();
    this.mainSection.setAttribute('aria-hidden', 'false');
  }
  // Gère les événements de clavier pour la lightbox
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

  // Gère le focus à l'intérieur de la lightbox
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
      // Gère le focus avec la touche Tab
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
  // Désactive le focus sur les éléments en arrière-plan de la lightbox
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
  // Réactive le focus sur les éléments en arrière-plan de la lightbox
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

