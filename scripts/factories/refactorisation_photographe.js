class PhotographerService {
  constructor() {
    this.jsonFile = "data/photographers.json";
    this.photographers = [];
    this.user = null;
    this.medias = [];
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
    // Mettre en place l'écouteur sur le menu déroulant
    this.listenerSort();
    this.mainSection = document.querySelector("#main");
    this.divMediaSection = document.createElement("div");
    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
    

    // Header
    this.PhotographerProfil(this.user);
    // this.incrementLikes();
    this.countLikesDOM();
  }

  // Récupère l'ID de l'utilisateur à partir de l'URL de la page courante
  getURLId() {
    const params = new URLSearchParams(window.location.search);
    // console.log(params);
    const userId = Number(params.get("id"));
    return userId;
  }

  // Récup l'ID de l'utilisateur de l'OBJ photographe dans le JSON
  getPhotographerId(userId) {
    return this.photographers.find(
      (photographers) => photographers.id === userId
    );
  }

  // getPhotographerId(userId) {
  //   const photographer = this.photographers.find(
  //     (photographer) => photographer.id === userId
  //   );
  //   photographer.likes = [];
  //   return photographer;
  // }

  // Filtre l'ID (Clé = photographerId) et retourne un nouveau tableau de la section Media du JSon de ce photographe
  getPhotographerMedias(userId) {
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

// async photographerData(userId) {
//   this.user = this.getPhotographerId(userId);
//   this.data = this.photographers(userId);
// }

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
    const pictureProfil = `assets/profil/${this.user.portrait}`;
  
    article.innerHTML = `
          <h2>${this.user.name}</h2>
          <h1>${this.user.city} ${this.user.country}</h1>
          <h3>${this.user.tagline}</h3>
          <img src=${pictureProfil}></img>
          `;

    photographerSection.appendChild(article);
  } 

  // Creation du menu de trie
  createDropDownMenu() {
    const mainSection = document.querySelector("#main");
    const menuSection = document.createElement("dropdown-menu__container");
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

  // Total Likes DOM
  countLikesDOM() {
    
    const likesCounterSection = document.createElement("article");

    likesCounterSection.innerHTML = `
          <div class="likes-section">
                      <div>    
                          <span>${this.countLikes()} </span><i class="fas fa-heart"></i>
                      </div>
                      <div>
                          <p>${this.user.price}€/jour></p>
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

  // Increment Like
  // Fonction qui incrémente le nombre de likes
  incrementLikes(e) {
    const mediaId = e.target.getAttribute("data-id");
    console.log(mediaId);
    const media = this.medias.find((m) => m.id === parseInt(mediaId));
    // const media = this.medias.find((m) => m.id === mediaId);
    console.log(media);
    media.likes++;
  
    this.countLikesDOM();
  }
  
  // Ajouter un écouteur d'événements à tous les boutons de likes
  addLikesEventListeners() {
    const likeButtons = document.querySelectorAll(".btn-likes");
    likeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.incrementLikes(e);
      });
    });
  }

  // Fonction qui cible le déclancheur du trie sur le menu DropDown
  listenerSort() {
    const SelectValue = document.querySelector("#monselect");

    SelectValue.addEventListener("change", () => {
      console.log("You selected: ", SelectValue.value);
      const value = SelectValue.value;
      // console.log(value);
      this.sort(value, this.medias);
      // Actualiser le rendu ici ?
      // console.table(this.medias);
      // Appeler la fonction RenderMedias ici !?
      // this.getSortedMedias();
      this.renderHTML();
    });
  }

  getSortedMedias() {
    this.sort(this.medias);
    // console.table(this.medias);
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

  renderHTML() {
    const sortedMedias = this.getSortedMedias();
    // console.table(sortedMedias);
    this.divMediaSection.innerHTML="";

    for (const media of sortedMedias) {
      
      // Creer les médias
      const mediaItem = this.createMedia(media);
      
      // Appeler la méthode "render" pour afficher chaque élément dans le DOM
      const mediaItemRender = mediaItem.render(media);
      // Ajouter l'élément au DOM
      document.querySelector(".media-section").appendChild(mediaItemRender);
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

  createArticle() {
    // Create and add elements to mediaItem here:
    const titleEl = document.createElement("h3");
    titleEl.innerText = this.title;
    mediaItem.appendChild(titleEl);
    // Return mediaItem element
    return mediaItem;
  }
}

class ImageMedia extends Media {
  constructor(media) {
    super(media);
    this.image = media.image;
    // this.divMediaSection = document.createElement("media-section");
    this.mainSection = document.querySelector("#main");
    this.mediaItem = document.createElement("article");
    this.mediaItem.setAttribute("data-id", `${this.id}`);
    // this.likeCounter = this.mediaItem.querySelector(".likes-count");
  }

  render() {
    const mediaFolder = `/assets/medias/${this.photographerId}`;

    this.mediaItem.classList.add("media-item");
    this.mediaItem.id = '' + this.id;

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p><span>${this.likes}</span>
      <a href="">
      <img src="${mediaFolder}/${this.image}" alt="Image de ${this.name}" class="img"></img>
      </a>
      <div class="likes">
      <button data-id="${buttonId}" type="button" class="btn-likes"><i class="fas fa-heart"></i></button></div>
    `;
    
    return this.mediaItem;
  }
}

class VideoMedia extends Media {
  constructor(media) {
    super(media);
    this.video = media.video;
    // this.divMediaSection = document.createElement("media-section");
    this.mainSection = document.querySelector("#main");
    this.mediaItem = document.createElement("article");
  }

  render() {
    const mediaFolder = `/assets/medias/${this.photographerId}`;

    // this.divMediaSection.classList.add("media-section");
    // this.mainSection.appendChild(this.divMediaSection);
    this.mediaItem.id = 'vid-id-' + this.id;

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p>
      <video src="${mediaFolder}/${this.video}" alt="Image de ${this.name}" type=video/mp4 class="video"></video>
      <div class="likes">
      <button id="${buttonId}" type="button" class="btn-likes"><i class="fas fa-heart"></i></button></div>
    `;
    return this.mediaItem;
  }
}

// LightBox Prototype

// Launch LightBox event
function lightbox() {
  mediaItem.forEach((media) => media.addEventListener("click", openLightbox));

  // Launch modal LightBox
  function openLightbox() {
    const nbSlide = mediaItem.lenght;
    // const btnLeft = ;
    // const btnRight =;
  const divLightboxContainer = document.createElement("div");
  divLightboxContainer.style.display = "block"; // Masquer pour clore la lightB
  divLightboxContainer.className = "lightbox-body";
  divLightboxContainer.innerHTML = `
  <p>Toto</p>
  `
  }
}

// Appel de la factory

const photographerService = new PhotographerService();
// const photographerHeader = new Photographer();

photographerService.init().then(() => {
  photographerService.getUserAndMediasFromURL().then(() => {
    photographerService.renderHTML();
    // photographerService.incrementLike();
    photographerService.addLikesEventListeners();
    
  });
});

