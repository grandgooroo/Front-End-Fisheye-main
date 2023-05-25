
import { DataService } from '../factories/dataService.js';
import { Media, ImageMedia, VideoMedia } from '../utils/media.js';
import { ContactFormModal } from '../utils/contactForm.js';
import { DropDown } from '../utils/dropdown.js';
import {Lightbox} from '../factories/lightBox.js';
// import { MEDIA_FOLDER } from '../utils/mediasPath.js';

class PhotographerService { 
  constructor() {
    // Initialisation des propriétés 
    this.jsonFile = "data/photographers.json";
    this.photographers = []; // Tableau vide stock les datas une fois récup (rempli avec la méthode init)
    this.user = null; // Stock l'user courrant
    this.dropDownInstance = null; // Stok l'instance courrante du menu (option de tri)
    this.medias = []; // Stock les médias du photographe courrant (rempli avec la méthode init)
  }

  // initialise l'objet "photographerService"
  async init() { 
    const dataService = new DataService(this.jsonFile);
    const data = await dataService.fetchData(); // Transforme la reponse json en data et data et décomposé en variables photographers et media
    this.photographers = data.photographers;
    this.medias = data.media;

    // Créer le menu de tri
    this.createDropDownMenu();
    // Déclare l'écouteur sur le menu déroulant
    this.listenerSort();
    // Gestion du DOM
    this.mainSection = document.querySelector("#main");
    this.divMediaSection = document.createElement("div");
    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
    //Ajout de la modal de contact
    this.contactFormModal = new ContactFormModal();
  }

  // Récupère l'ID du photographe à partir de l'URL de la page courante
  getURLId() {
    const params = new URLSearchParams(window.location.search);
    const userId = Number(params.get("id"));
    return userId; // Stock l'ID de l'URL courante dans userId (passé en paramètre dans les autres méthodes)
  }

  // Les medias du photographe courant
  // Si la clé (Clé = photographerId) correspond à l'ID courant retourne l'objet Media (json) de ce photographe
  getPhotographerMedias(userId) {
    this.medias = this.medias.filter((media) => media.photographerId === userId);
  }

  // Les données du photographe courant
  // Assigne à this.user l'objet photographers correspondant à l'ID courant
  getPhotographerData(userId) {
    this.user = this.photographers.find((photographer) => photographer.id === userId);
    if (!this.user) {
      console.log('Aucun photographe trouvé avec cet ID');
    }
    return this.user;
  }
  
  async getPhotographerAndMediasFromURL(userId) {
    const currentUserId = this.getURLId(); // Recupère l'ID du photographe à partir de l'URL
    
    const photographerData = this.getPhotographerData(currentUserId);
    const medias = this.getPhotographerMedias(currentUserId)
    
    return { // Retourne un objet contenant les données de l'utilisateur actuel (this.user=photographerData) et ses médias associés.
      photographerData: photographerData, // objet sans nom avec 2 propriétés
      // medias: this.medias, Ensuite utilisées pour afficher le profil du photographe et initialiser la Lightbox avec ses médias.
      medias: medias,
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

  initializeDropDown() { // Vérifie l'état du menu dropdown
    const dropDown = document.querySelector('.dropdown');
    // Assigne l'instance de la classe DropDown à la propriété de classe this.dropDownInstance
    this.dropDownInstance = new DropDown(dropDown);
    
    // Ajoute des events à l'élément du menu
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
    const media = this.medias.find((media) => media.id === parseInt(mediaDataId)); // Compare l'ID à "data-id"
    const likesSpan = button.closest(".media-item").querySelector("span");
  
    // Incrémentation du nombre de likes pour le bouton actuellement cliqué
    if (!button.classList.contains("btn-likes-red")) {
      media.likes++;
      console.log("Likes après incrémentation:", media.likes); // log control
      likesSpan.textContent = media.likes;
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || []; // Stock le media liké dans le localStorage (si aucune liste existe une nouvelle liste est crée)
      likedMedias.push(media); // Ajoute le media liké à la fin du tableau stocké
      localStorage.setItem("likedMedias", JSON.stringify(likedMedias)); // Enregistre le tableau mis à jour dans le localStorage
      button.classList.add("btn-likes-red");
    } else {
      // Si le bouton a déjà été "liké", on le "délike"
      media.likes--;
      console.log("Likes après décrémentation:", media.likes); // log control
      likesSpan.textContent = media.likes;
      
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
      const index = likedMedias.findIndex((m) => m.id === media.id); // Trouve l'index du media dans le tableau en utilisant son id, si il n'est pas trouvé retourne -1
      if (index !== -1) {
        likedMedias.splice(index, 1); // Retire l'element du tableau
        localStorage.setItem("likedMedias", JSON.stringify(likedMedias)); // Met à jour le tableau
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
  
  listenerSort() { // Ajout un event pour déclencher le trie pour chaque option selectionnée
    this.dropDownInstance.element.addEventListener("change", () => {
      console.log("You selected: ", this.dropDownInstance.value);
      const value = this.dropDownInstance.value;
      this.sort(value, this.medias);
      this.renderHTML(this.user.id, this.lightbox);
    });
  }
  
  getSortedMedias(userId) { // Trie les médias selon l'option séléctrionnée
    this.sort(this.medias);
    // console.log(this.medias)
    return this.medias;
  }

  // Sort Media by Date, Title, Popularity (value=valeur de trie passée en paramètre)
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
    if(this.lightbox) {
      this.lightbox.updateMedias(this.medias);
    }
  }

  // Ajoute des event à tous les éléments médias (ouverture de la lightbox)
  addEventListenersToMedia(userId, lightbox) {
    const mediaElements = document.querySelectorAll(".media-button");
  
    for (const mediaElement of mediaElements) {
      mediaElement.addEventListener("click", (e) => {
        e.preventDefault();
        const mediaId = parseInt(mediaElement.dataset.id);
        if(lightbox) {
          lightbox.launchLightbox(mediaId, userId);
        }
      });
    }
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

  // Affiche la galerie des médias
  renderHTML(userId) {
    const sortedMedias = this.getSortedMedias(); // récup les médias triés
    this.divMediaSection.innerHTML=""; // vide la section médias precédente

    for (const media of sortedMedias) { // pour chaque média de la liste triée
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
    if(this.lightbox) {
      this.lightbox.updateMedias(sortedMedias);
    }
  }
}

// Appel de la factory
const photographerService = new PhotographerService();

photographerService.init().then(() => {
  photographerService.getPhotographerAndMediasFromURL().then(({ photographerData, medias }) => {
    const userId = photographerData.id;
    photographerService.lightbox = new Lightbox(medias);
    photographerService.renderHTML(userId, photographerService.lightbox);
    photographerService.countLikesDOM();
    photographerService.PhotographerProfil(photographerData);
  });
});