
import { DataService } from '../factories/dataService.js';
import { ContactFormModal } from '../utils/contactForm.js';
import { DropDown } from '../utils/dropdown.js';
import {Lightbox} from '../factories/lightBox.js';
import { MEDIA_FOLDER } from '../utils/mediasPath.js';

// const KEY_CODES = {
//   TAB: 9,
//   ENTER: 13,
//   SPACE: 32,
//   ESCAPE: 27,
//   UP_ARROW: 38,
//   DOWN_ARROW: 40,
// };

class PhotographerService { 
  constructor(lightbox = null) {
    this.jsonFile = "data/photographers.json";
    this.photographers = [];
    this.user = null;
    this.dropDownInstance = null;
    this.medias = [];
    this.lightbox = this.lightbox;
  }

  // Transforme la reponse json en data et data et décomposé en var photographers et media
  async init() {
    const dataService = new DataService(this.jsonFile);
    const data = await dataService.fetchData();
    this.photographers = data.photographers;
    this.medias = data.media;

    const { photographerData, medias } = await this.getUserAndMediasFromURL();
    
    // Créer le menu de tri
    this.createDropDownMenu();
    // Déclare l'écouteur sur le menu déroulant
    this.listenerSort();
    this.mainSection = document.querySelector("#main");
    this.divMediaSection = document.createElement("div");
    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
    
    this.countLikesDOM();
    // Header
    this.PhotographerProfil(photographerData);
    this.contactFormModal = new ContactFormModal();
    this.lightbox = new Lightbox(medias);
  }

  async fetchData() {
    const response = await fetch(this.jsonFile);
    const data = await response.json();
    this.photographers = data.photographers;
    this.medias = data.media;
    return data;
  }

  // Récupère l'ID de l'utilisateur à partir de l'URL de la page courante
  getURLId() {
    const params = new URLSearchParams(window.location.search);
    // console.log(params);
    const userId = Number(params.get("id"));
    return userId;
  }

  // Récup l'ID de l'utilisateur de l'OBJ photographers dans le JSON
  getPhotographerId(userId) {
    return this.photographers.find(
      (photographers) => photographers.id === userId
    );
  }

  // Filtre l'ID (Clé = photographerId) et retourne un nouveau tableau de la section Media du JSon de ce photographe
  getPhotographerMedias(userId) {
    let photographerMedias =  this.medias.filter((media) => media.photographerId === userId);
    // console.log(photographerMedias)
    return this.medias.filter((media) => media.photographerId === userId);
  }

  async getUserData(userId) {
    this.user = this.getPhotographerId(userId); // user
    // console.log(this.user.id)
  }
  
  async getUserAndMedias(userId) {
    await this.getUserData(userId);
    const medias = this.getPhotographerMedias(userId);
  
    this.currentUserId = userId;
  
    // Filtrez les médias en fonction de l'ID du photographe
    this.medias = medias.filter((media) => media.photographerId === userId);
  }
  
  async getUserAndMediasFromURL() {
    const currentUserId = this.getURLId(); // Recupère l'ID du photographe à partir de l'URL
    await this.getUserAndMedias(currentUserId); // Données et médias de l'utilisateur correspondant à l'ID de l'URL
  
    const photographerData = this.user;
  
    return {
      photographerData: photographerData, // doublon avec this.photographers & this.medias !?
      medias: this.medias,
    };
  }

// Classe pour le profil des photographes pour le Header et la page Index.html
  PhotographerProfil() {
    let photographerSection = document.querySelector(".photographer_section");
    const article = document.createElement("article");
    article.classList.add("container_photographer_profil");
    const pictureProfil = `assets/profil/${this.user.portrait}`;
  
    article.innerHTML = `
      <section class="photographer_profil">
        <div class="text-photographe-profil" aria-labelledby="photographer-name">
            <h2 id="photographer-name">${this.user.name}</h2>
            <h1>${this.user.city} ${this.user.country}</h1>
            <h3>${this.user.tagline}</h3>
        </div>
        <div>
        <button class="contact_button" aria-label="Contactez-moi, ">Contactez-moi</button>
        </div>
        <div>
            <img src=${pictureProfil} alt="${this.user.name}"></img>
        </div>
      </section>
          `;

    photographerSection.appendChild(article);

    const contactButton = article.querySelector('.contact_button');
    contactButton.addEventListener("click", () => {
      this.contactFormModal.displayModal(this.user.name);
    });
  } 
  
  createDropDownMenu() {
    const mainSection = document.querySelector("#main");
    const menuSection = document.createElement("div");
    menuSection.classList.add("select-menu-container");

    menuSection.innerHTML = `
      <span class="js-select">Trier par :</span>
      <nav class="dropdown">
        <button class="dropdown-toggle" type="button" id="dropdownMenuButton" aria-haspopup="true" aria-label="Trier par">
          Popularité
        </button>
        <ul class="dropdown-menu" role="listbox" aria-labelledby="dropdownMenuButton" aria-label="menu de trie des médias" aria-expanded="false">
          <li role="option" tabindex="0" data-value="likes" class="dropdown-menu-border">Popularité</li>
          <li role="option" tabindex="0" data-value="title" class="dropdown-menu-border">Titre</li>
          <li role="option" tabindex="0" data-value="date">Date</li>
        </ul>
      </nav>
          `;
    mainSection.appendChild(menuSection);
    this.initializeDropDown();
    this.listenerSort();
  }

  initializeDropDown() {
    const dropDown = document.querySelector('.dropdown');
    // Assigne l'instance de la classe DropDown à la propriété de classe this.dropDownInstance
    this.dropDownInstance = new DropDown(dropDown);
    
    this.dropDownInstance.element.addEventListener('change', e => {
      console.log('changed', this.dropDownInstance.value);
    });
  
    this.dropDownInstance.element.addEventListener('opened', e => {
      console.log('opened', this.dropDownInstance.value);
    });
  
    this.dropDownInstance.element.addEventListener('closed', e => {
      console.log('closed', this.dropDownInstance.value);
    });
  }
  
  // Gestion des Likes
  // Total Likes DOM
  countLikesDOM() {
    const likesCounterSection = document.createElement("article");
    likesCounterSection.innerHTML = `
      <div class="likes-section">
        <div class="like-button">
          <span>${this.countLikes()} </span><i class="fas fa-heart"></i>
        </div>
        <div>
          <p>${this.user.price}€ / jour</p>
        </div>
      </div>
    `;
    this.mainSection.appendChild(likesCounterSection);
  }
  
  // Add function sum Likes
  countLikes() {
    return this.medias.reduce((totalLikes, media) => {
      return totalLikes + media.likes;
    }, 0);
  }

  // Fonction qui incrémente le nombre de likes
  incrementLikes = (event) => {
    
    const button = event.target.closest(".likes[data-id]");
    const mediaDataId = button.getAttribute("data-id");
    const media = this.medias.find((media) => media.id === parseInt(mediaDataId));
    const likesSpan = button.closest(".media-item").querySelector("span");
  
    // Incrémentation du nombre de likes pour le bouton actuellement cliqué
    if (!button.classList.contains("btn-likes-red")) {
      media.likes++;
      console.log("Likes après incrémentation:", media.likes); // log control
      likesSpan.textContent = media.likes;
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
      likedMedias.push(media);
      localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
      button.classList.add("btn-likes-red");
    } else {
      // Si le bouton a déjà été "liké", on le "délike"
      media.likes--;
      console.log("Likes après décrémentation:", media.likes); // log control
      likesSpan.textContent = media.likes;
      
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
      const index = likedMedias.findIndex((m) => m.id === media.id);
      if (index !== -1) {
        likedMedias.splice(index, 1);
        localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
      }
      button.classList.remove("btn-likes-red");
    }
  
    // Mise à jour du nombre de likes dans l'interface utilisateur
    this.countLikesDOM();
  
    // Mise à jour du bouton précédemment cliqué
    this.lastClickedButton = button;
    console.log(this.lastClickedButton);
  }
  
  addLikesEventListeners() {
    console.log("addLikesEventListeners")
    const likeButtons = document.querySelectorAll(".likes[data-id]");
    likeButtons.forEach((button) => {
      // Ajout d'un écouteur d'événement pour le clic
      button.addEventListener("click", this.incrementLikes);
  
      // Ajout d'un écouteur d'événement pour la touche "Entrée"
      button.addEventListener("keypress", (event) => {
        console.log(event.keyCode)
        event.preventDefault();
        if (event.key === "Enter" || event.keyCode === 13) {
          this.incrementLikes(event);
        }
    });
    
    });
  }
  
  listenerSort() {
    this.dropDownInstance.element.addEventListener("change", () => {
      console.log("You selected: ", this.dropDownInstance.value);
      const value = this.dropDownInstance.value;
      this.sort(value, this.medias);
      this.renderHTML(this.user.id, this.lightbox);
    });
  }
  
  getSortedMedias(userId) {
    this.sort(this.medias);
    // console.log(this.medias)
    return this.medias;
  }

  // Sort Media by Date, Title, Popularity
  sort(value) {
    /* Avec switch */
    switch (value) {
      case "likes":
        /* Trier par "likes" */
        this.medias.sort((a, b) => b.likes - a.likes);
        console.log("trie Likes OK");
        // console.table(media);
        break;

      case "date":
        /* Trier par "date" */

        this.medias.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log("trie Date OK");
        break;
        // console.table(media);

      case "title":
        /* Trier par "title" */
        this.medias.sort((a, b) => a.title.localeCompare(b.title));
        console.log("trie Titres OK");
        break;
    }
    // Met à jour les médias dans la lightbox
    this.lightbox.updateMedias(this.medias);
  }

  addEventListenersToMedia(userId, lightbox) {
    const mediaElements = document.querySelectorAll(".media-button");
  
    for (const mediaElement of mediaElements) {
      mediaElement.addEventListener("click", (e) => {
        e.preventDefault();
        const mediaId = parseInt(mediaElement.dataset.id);
        lightbox.launchLightbox(mediaId, userId);
      });
    }
  }
  
  // Affiche la galerie des médias
  renderHTML(userId) {
    const sortedMedias = this.getSortedMedias();
    this.divMediaSection.innerHTML="";

    for (const media of sortedMedias) {
      // Creer les médias
      const mediaItem = this.createMedia(media);
      // Appeler la méthode "render" pour afficher chaque élément dans le DOM
      const mediaItemRender = mediaItem.render(media);
      // Ajouter l'élément au DOM
      document.querySelector(".media-section").appendChild(mediaItemRender);
    } 
    // Ajout des écouteurs pour les likes
    this.addLikesEventListeners();
    // Ajoutez les écouteurs d'événements aux éléments médias
    this.addEventListenersToMedia(userId, this.lightbox);
    // console.log(userId)
    // Mise à jour des médias dans la Lightbix
    this.lightbox.updateMedias(sortedMedias);
  }

  // Crée un media en fonction de la nature du média (Image ou Vidéo)
  createMedia(media) {
    const { id, photographerId, title, image, video, likes, date, price } =
      media;

    if (image) {
      return new ImageMedia(media);
    } else if (video) {
      return new VideoMedia(media);
    } else {
      throw new Error("Media type not supported");
    }
  }
}

class Media {
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

class ImageMedia extends Media {
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

class VideoMedia extends Media {
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

// Appel de la factory
const photographerService = new PhotographerService();

photographerService.init().then(() => {
  photographerService.getUserAndMediasFromURL().then(({ photographerData, medias }) => {
    const userId = photographerData.id;
    photographerService.renderHTML(userId, photographerService.lightbox);
  });
});