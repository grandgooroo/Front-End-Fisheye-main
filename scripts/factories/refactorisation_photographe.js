class PhotographerService {
  constructor() {
    this.jsonFile = "data/photographers.json";
    this.photographers = [];
    this.user = null;
    this.medias = [];
    this.lightbox = null;
  }

  // Transforme la reponse json en data et data et décomposé en var photographers et media
  async init() {
    const response = await fetch(this.jsonFile);
    const data = await response.json();
    this.photographers = data.photographers;
    this.medias = data.media;
    // console.log(this.photographers);
    // console.log(this.medias);
    await this.getUserAndMediasFromURL();

    // Créer le menu de tri
    this.createDropDownMenu();
    // Déclare l'écouteur sur le menu déroulant
    this.listenerSort();
    this.mainSection = document.querySelector("#main");
    this.divMediaSection = document.createElement("div");
    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
    await this.getUserAndMediasFromURL();
    
    this.countLikesDOM();
    // Header
    this.PhotographerProfil(this.user);
    this.lightbox = new Lightbox(this.medias);
  }

  static MEDIA_FOLDER = "assets/medias";
  
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

  // Récup l'ID du media
  getMediaId(id) {
    return this.medias.filter(
      (photographers) => photographers.photographerId === id
    );
  }

  async getUserData(userId) {
    this.user = this.getPhotographerId(userId);
  }

  async getUserAndMedias(userId) {
    // Récupérer les données de l'utilisateur correspondant à cet ID
    this.user = this.getPhotographerId(userId);
    // Récupérer les médias associés à cet utilisateur
    this.medias = await this.getPhotographerMedias(userId);
    // Triez les médias par défaut (par popularité)
    // this.sort("likes", this.medias);
  }
  
  async getUserAndMediasFromURL() {
    const currentUserId = this.getURLId(); // Recupère l'ID du photographe à partir de l'URL
    await this.getUserAndMedias(currentUserId); // Données et médias de l'utilisateur correspondant à l'ID de l'URL
  }

// Classe pour le profil des photographes pour le Header et la page Index.html
  PhotographerProfil() {
    
    let photographerSection = document.querySelector(".photographer_section");
    const article = document.createElement("article");
    article.classList.add("container_photographer_profil");
    const pictureProfil = `assets/profil/${this.user.portrait}`;
  
    article.innerHTML = `
      <section class="photographer_profil">
        <div class="text-photographe-profil">
            <h2>${this.user.name}</h2>
            <h1>${this.user.city} ${this.user.country}</h1>
            <h3>${this.user.tagline}</h3>
        </div>
        <div>
        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
        </div>
        <div style="background-color:#1c87c9;">
            <img src=${pictureProfil}></img>
        </div>
      </section>
          `;

    photographerSection.appendChild(article);
  } 

  // Creation du menu de trie
  createDropDownMenu() {
    const mainSection = document.querySelector("#main");
    const menuSection = document.createElement("dropdown-menu__container"); // remplacer par une div ?
    menuSection.classList.add("select-menu");
    let changeMenuValue = document.querySelector("#monselect");

    menuSection.innerHTML = `
          <label id="menuSelect" class="menuSelect">Trier par :</label>
              <div class="js-select">
                  <select id="monselect">
                      <option value="likes" selected>Popularité</option>
                      <option value="title">Titre</option>
                      <option value="date">Date</option> 
                  </select>
              </div>
          `;
    mainSection.appendChild(menuSection);
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
          <p>${this.user.price}€/jour</p>
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

  updateLocalStorage(media, isLiked) {
    const likedMediaIds = JSON.parse(localStorage.getItem("likedMediaIds")) || [];
  
    if (isLiked) {
      likedMediaIds.push(media.id);
    } else {
      const index = likedMediaIds.indexOf(media.id);
      if (index !== -1) {
        likedMediaIds.splice(index, 1);
      }
    }
  
    localStorage.setItem("likedMediaIds", JSON.stringify(likedMediaIds));
  }

  // Fonction qui incrémente le nombre de likes
  incrementLikesOld = (event) => {
    const mediaDataId = event.currentTarget.getAttribute("data-id");
    const media = this.medias.find((media) => media.id === parseInt(mediaDataId));
    const likesSpan = event.currentTarget.closest(".media-item").querySelector("span");
    const likeButtons = document.querySelectorAll(".likes");
    let lastClickedButton = null;

    // Condition qui vérifie si la cible a déjà la classe "btn-likes-red" sinon l'incrementation de +1 est permise
    if (!event.currentTarget.classList.contains("btn-likes-red"))// si btn n'a pas encore était liké
      {
        //  {#b52,3}
        media.likes++;
        likesSpan.textContent = media.likes; // mise à jour des likes du media
        // Ajout du média liké dans le localStorage
        const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
        likedMedias.push(media);
        localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
        event.currentTarget.classList.add("btn-likes-red");
        console.log(event.currentTarget)

      } else  // alors decrementer de -1
        { if (event.currentTarget.classList.contains("btn-likes-red"))
            {
              alert("déja liké")
            // Vérification si le bouton "like" a déjà été cliqué auparavant
              const alreadyLiked = JSON.parse(localStorage.getItem("likedMedias")).some(m => m.id === media.id);
              console.log(alreadyLiked)
              
                // if (alreadyLiked) 
                // {
                //   console.log(media.likes)
                //   media.likes--;
                //   console.log(media.likes)
                //   likesSpan.textContent = media.likes;
                //   event.currentTarget.classList.remove("btn-likes-red");
                //   console.log(event.currentTarget)
                
                //     // Suppression du média liké dans le localStorage
                //     const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
                //     const index = likedMedias.findIndex((m) => m.id === media.id);
                //     if (index !== -1) 
                //       {
                //         likedMedias.splice(index, 1);
                //         localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
                //       }
                // }
            }
          
        }
    // Mise à jour du nombre de likes dans l'interface utilisateur
    this.countLikesDOM();
  };

  incrementLikes = (event) => {
    const mediaDataId = event.currentTarget.getAttribute("data-id");
    const media = this.medias.find((media) => media.id === parseInt(mediaDataId));
    const likesSpan = event.currentTarget.closest(".media-item").querySelector("span");
    const likeButtons = document.querySelectorAll(".likes");
  
    // Réinitialisation du bouton précédemment cliqué
    // if (this.lastClickedButton) {
    //   const lastMedia = this.medias.find((media) => media.id === parseInt(this.lastClickedButton.getAttribute("data-id")));
    //   const lastLikesSpan = this.lastClickedButton.closest(".media-item").querySelector("span");
  
    //   if (this.lastClickedButton !== event.currentTarget && this.lastClickedButton.classList.contains("btn-likes-red")) {
    //     // si le dernier btn cliqué est différent que le currentTarget et qu'il possede la classe "btn-likes-red" alors
    //     lastMedia.likes--;
    //     lastLikesSpan.textContent = lastMedia.likes;
    //     this.lastClickedButton.classList.remove("btn-likes-red");
    //   }
    // }
  
    // Incrémentation du nombre de likes pour le bouton actuellement cliqué
    if (!event.currentTarget.classList.contains("btn-likes-red")) {
      media.likes++;
      likesSpan.textContent = media.likes;
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
      likedMedias.push(media);
      localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
      event.currentTarget.classList.add("btn-likes-red");
    } else {
      // Si le bouton a déjà été liké, on le délike
      media.likes--;
      likesSpan.textContent = media.likes;
      const likedMedias = JSON.parse(localStorage.getItem("likedMedias")) || [];
      const index = likedMedias.findIndex((m) => m.id === media.id);
      if (index !== -1) {
        likedMedias.splice(index, 1);
        localStorage.setItem("likedMedias", JSON.stringify(likedMedias));
      }
      event.currentTarget.classList.remove("btn-likes-red");
    }
  
    // Mise à jour du nombre de likes dans l'interface utilisateur
    this.countLikesDOM();
  
    // Mise à jour du bouton précédemment cliqué
    this.lastClickedButton = event.currentTarget;
    console.log(this.lastClickedButton)
  }
  

  // Ajouter un écouteur d'événements à tous les boutons de likes Peut être ajouté directement dans la méthode "render" ?
  addLikesEventListeners() {
    const likeButtons = document.querySelectorAll(".likes[data-id]");
    likeButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        // this.incrementLikes(event);
        for (let i = 0; i < likeButtons.length; i++) {
          likeButtons[i].addEventListener("click", this.incrementLikes);
        }
      });
    });
  }
  
  // Fonction qui cible le déclancheur du trie sur le menu DropDown
  listenerSort() {
    const SelectValue = document.querySelector("#monselect");

    SelectValue.addEventListener("change", () => {
      console.log("You selected: ", SelectValue.value);
      const value = SelectValue.value;
      this.sort(value, this.medias);
      this.renderHTML();
    });
  }

  getSortedMedias() {
    this.sort(this.medias);
    console.table(this.medias)
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
  }

  // Affiche la galerie des médias
  renderHTML() {
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
    this.addLikesEventListeners();
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

  //  {#9b1,5}
  showLightbox(mediaId) {
    const lightbox = new Lightbox(this.medias);
    console.log(this.medias)
    lightbox.launchLightbox(mediaId, this.user.id);
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
    const mediaFolder = `${PhotographerService.MEDIA_FOLDER}/${this.photographerId}`;

    this.mediaItem.classList.add("media-item");
    this.mediaItem.setAttribute("data-id", `${this.id}`);
    this.mediaItem.id = '' + this.id;
    this.likesEl = this.mediaItem.querySelector(".likes-count");

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p><span class="likes-count">${this.likes}</span>
      <a href="">
      <img src="${mediaFolder}/${this.image}" alt="Image de ${this.name}" class="img" data-id="${buttonId}"></img>
      </a>
      <div class="likes" data-id="${buttonId}">
      <i class="fas fa-heart like-icon"></i>
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
    const mediaFolder = `${PhotographerService.MEDIA_FOLDER}/${this.photographerId}`;

    this.mediaItem.classList.add("media-item");
    this.mediaItem.setAttribute("data-id", `${this.id}`);
    this.mediaItem.id = '' + this.id;
    this.likesEl = this.mediaItem.querySelector(".likes-count");

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p><span class="likes-count">${this.likes}</span>
      <a href="">
      <video src="${mediaFolder}/${this.video}" alt="Image de ${this.name}" type=video/mp4 class="video" data-id="${buttonId}"></video>
      </a>
      <div class="likes" data-id="${buttonId}">
      <i class="fas fa-heart like-icon"></i>
      </div>
    `;
    return this.mediaItem;
  }
}

// LightBox
class Lightbox {
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

    this.launchLightbox = this.launchLightbox.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.close = this.close.bind(this);
    // this.manageKeyboardEvents = this.manageKeyboardEvents.bind(this);
  }

  //  {#950,1}
  // Ouvre la Lightbox sur le media courant
  launchLightbox(id, userId) { // Methode "show"
    // Récupérer les éléments de la Lightbox dans le DOM
    const lightbox = document.querySelector(".lightbox");
    const closeButton = document.querySelector(".lightbox__close");
    const nextButton = document.querySelector(".lightbox__next");
    const prevButton = document.querySelector(".lightbox__prev");
    const mediaContainer = document.querySelector(".media__container");
    const lightboxImg = document.querySelector(".lightbox__image");
    const lightboxTitle = document.querySelector(".lightbox__title");
    const lightboxCounter = document.querySelector(".lightbox__counter");

    this.currentMedia = this.medias.find((media) => media.id === parseInt(id));
    this.currentIndex = this.medias.findIndex((media) => media.id === parseInt(id));
    this.userId = userId; // Pour initialiser this.userId
    //  {#263,1}
    // Affiche les medias dans la Lightbox
    if (this.currentMedia.image) {
      this.lightboxImg.innerHTML = `<img src="${PhotographerService.MEDIA_FOLDER}/${userId}/${this.currentMedia.image}" alt="Image de ${this.currentMedia.title}" class="lightbox__img"></img>`;
      console.log(this.lightboxImg.innerHTML)
    } else if (this.currentMedia.type === 'video') {
      this.lightboxImg.innerHTML = `<video src="${PhotographerService.MEDIA_FOLDER}/${userId}/${this.currentMedia.video}" class="lightbox__img" controls></video>`;
    }
    console.table(this.medias)
    this.lightboxTitle.textContent = this.currentMedia.title;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.medias.length}`;
      
    // Ajouter les écouteurs d'événements pour les boutons et la touche "Escape"
    closeButton.addEventListener("click", this.close.bind(this));
    // console.log(closeButton)
    nextButton.addEventListener("click", this.next.bind(this));
    prevButton.addEventListener("click", this.previous.bind(this));
    // nextButton.addEventListener("click", () => this.next(userId));
    // prevButton.addEventListener("click", () => this.previous(userId));

    document.addEventListener("keydown", this.manageKeyboardEvents.bind(this));

    this.lightboxContainer.classList.remove("hidden");
    // this.manageKeyboardEvents();
  }
  

  next() {
    if (this.currentIndex === this.medias.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    this.currentMedia = this.medias[this.currentIndex];

    if (this.currentMedia.image) {
      this.lightboxImg.innerHTML = `<img src="${PhotographerService.MEDIA_FOLDER}/${this.userId}/${this.currentMedia.image}" alt="Image de ${this.currentMedia.title}" class="lightbox__img"></img>`;
    } else if (this.currentMedia.type === 'video') {
      this.lightboxImg.innerHTML = `<video src="${PhotographerService.MEDIA_FOLDER}/${this.userId}/${this.currentMedia.video}" class="lightbox__img" controls></video>`;
    }

    this.lightboxTitle.textContent = this.currentMedia.title;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.medias.length}`;
  }
  
  previous() {
    if (this.currentIndex === 0) {
      this.currentIndex = this.medias.length - 1;
    } else {
      this.currentIndex--;
    }
    this.currentMedia = this.medias[this.currentIndex];
  
    if (this.currentMedia.image) {
      this.lightboxImg.innerHTML = `<img src="${PhotographerService.MEDIA_FOLDER}/${this.userId}/${this.currentMedia.image}" alt="Image de ${this.currentMedia.title}" class="lightbox__img"></img>`;
    } else if (this.currentMedia.type === 'video') {
      this.lightboxImg.innerHTML = `<video src="${PhotographerService.MEDIA_FOLDER}/${this.userId}/${this.currentMedia.video}" class="lightbox__img" controls></video>`;
    }
  
    this.lightboxTitle.textContent = this.currentMedia.title;
    this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.medias.length}`;
  }

  close() {
    this.lightboxContainer.classList.add("hidden");
    this.closeButton.removeEventListener("click", this.close);
    this.nextButton.removeEventListener("click", this.next);
    this.prevButton.removeEventListener("click", this.previous);
    document.removeEventListener("keydown", this.manageKeyboardEvents.bind(this));
  }

  manageKeyboardEvents(event) {
    switch (event.key) {
      case "Escape":
        this.close();
        break;
      case "ArrowRight":
        this.next(this.userId);
        break;
      case "ArrowLeft":
        this.previous(this.userId);
        break;
      default:
        break;
    }
  }

    eventLightbox(userId) {
      const mediaElements = document.querySelectorAll(".img");
      mediaElements.forEach(mediaItem => {
        mediaItem.addEventListener("click", (event) => {
          event.preventDefault();
          console.log("toto a cliqué sur une image !")
          // Récupére l'ID de l'image ou de la vidéo
          const mediaDataId = event.currentTarget.getAttribute("data-id");
          // Affichez la Lightbox avec l'élément sélectionné
          this.launchLightbox(mediaDataId, userId);
          // photographerService.showLightbox(mediaDataId);
          // document.addEventListener("keydown", this.lightbox.manageKeyboardEvents.bind(this.lightbox));
        })
      });
    }
    
}

// Appel de la factory
const photographerService = new PhotographerService();

photographerService.init().then(() => {
  photographerService.getUserAndMediasFromURL().then(() => {
    photographerService.renderHTML();
    photographerService.addLikesEventListeners();

    // Appel de la fonction eventLightbox pour gérer l'événement de clic sur une image
    const lightbox = new Lightbox(photographerService.medias);
    // console.log(lightbox)
    lightbox.eventLightbox(photographerService.user.id);

  });
});

