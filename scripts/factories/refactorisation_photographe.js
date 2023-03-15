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
    // launchLightbox();
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

  // Total Likes DOM
  countLikesDOM() {
    const likesCounterSection = document.createElement("article");
    likesCounterSection.innerHTML = `
      <div class="likes-section">
        <div class="like-button">
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

  // Fonction qui incrémente le nombre de likes
  incrementLikes(event) {
    const mediaDataId = event.target.parentElement.getAttribute("data-id");// mediaDataId = retroune le data-id de l'item
    console.log(event.target); // pourquoi le coeur et le target alors que dans HTML c'est le div ?
    console.log(mediaDataId)
    const media = this.medias.find((media) => media.id === parseInt(mediaDataId));
    // const media = this.medias.find((m) => m.id === mediaId);
    console.log(media.likes);
    
    // Condition qui vérifie si la cible a déjà la classe "Liked" sinon l'incrementation de +1 est permise
    const likeButton = document.querySelector(".likes[data-id]");
    console.log(likeButton)
    if (!likeButton.classList.contains("btn-likes-red")) {
      
      likeButton.classList.remove("likes")

      event.target.removeEventListener("click", this.incrementLikes);
      event.target.removeEventListener('click', this.addLikesEventListeners());

      media.likes++;
      
      // this.addLikesEventListeners.disabled = true;
      this.countLikesDOM();
      likeButton.classList.add("btn-likes-red");
      

      // event.target.classList.remove("likes");
    }
    this.renderHTML(); // Lui qui controle la mise à jour de l'affichage
  }
  
  // Ajouter un écouteur d'événements à tous les boutons de likes Peut être ajouté directement dans la méthode "render" ?
  addLikesEventListeners() {
    const likeButton = document.querySelectorAll(".likes[data-id]");
    let likedButton = null;
    
    likeButton.forEach((button) => {
      button.addEventListener("click", (event) => {
        this.incrementLikes(event);
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
}

class Media {
  constructor(media) {
    this.id = media.id;
    this.photographerId = media.photographerId;
    this.title = media.title;
    this.likes = media.likes;
    this.date = media.date;
    this.price = media.price;
    // console.log(this.likes);
  }

  getLikes() {
    return this.likes;
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
    // this.likeCounter = this.mediaItem.querySelector(".likes-count");
  }

  render() {
    const mediaFolder = `/assets/medias/${this.photographerId}`;

    this.mediaItem.classList.add("media-item");
    this.mediaItem.setAttribute("data-id", `${this.id}`);
    this.mediaItem.id = '' + this.id;

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p><span>${this.likes}</span>
      <a href="">
      <img src="${mediaFolder}/${this.image}" alt="Image de ${this.name}" class="img" data-id="${buttonId}"></img>
      </a>
      <div class="likes" data-id="${buttonId}">
      <i class="fas fa-heart"></i>
      </div>
      <!-- <button class="btn-likes"><i class="fas fa-heart"></i></button></div>-->
    `;
    // console.log(this.mediaItem);
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

// LightBox

// class Lightbox {

//     constructor(medias) {
//       this.currentElement = null;
//       this.medias = medias;
//     }

//     show(id) {
//       console.log(id);
//       this.currentMedia = this.medias(id);
//     }

//     next() {

//     }

//     previous() {
      
//     }

//     manageEvent() {
      
//     }
    
//     getElementById(id) {
//       return this.currentMedia.find(medias => medias.id = id);
//     }
      
// }

function eventlightbox(userId) {
  const mediaElements = document.querySelectorAll(".img");
  console.log(mediaElements);
  mediaElements.forEach(mediaItem => {
    mediaItem.addEventListener("click", (event) => {
      event.preventDefault();
      
      console.log("toto a cliqué sur une image !")
      // Récupérez l'URL de l'image ou de la vidéo
      const mediaUrl = mediaElements.find((img) => img.dataId === userId);
      console.log(mediaUrl)
      // Affichez la Lightbox avec l'élément sélectionné
      launchLightbox(mediaUrl);
    })
  });
}

// Affichez la Lightbox avec l'élément sélectionné
function launchLightbox(mediaUrl) {
  const mediaFolder = `/assets/medias/${this.photographerId}`;
  // Créez un élément "div" pour la Lightbox
  const lightbox = document.createElement("div");
  // const lightboxBg = document.querySelector(".bground");
  lightbox.classList.add("lightbox");
  lightbox.style.display = "block"; // Masquer pour clore la lightB
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <div class="bground">
      <button class="lightbox__close"></button>
      <button class="lightbox__next"></button>
      <button class="lightbox__prev"></button>
        <div class="lightbox__container">
          <img src="${mediaFolder}/${this.image}" alt="Image de ${this.name}" class="img">
          </img>
            <p>Toto</p>
        </div>
    </div>
  `
  console.log("block")
  // Ajoutez la Lightbox à la page
  document.body.appendChild(lightbox);
}

// Appel de la factory

const photographerService = new PhotographerService();

photographerService.init().then(() => {
  photographerService.getUserAndMediasFromURL().then(() => {
    photographerService.renderHTML();
    // photographerService.incrementLike();
    photographerService.addLikesEventListeners();

    // let lightbox = new Lightbox();
    // console.log(lightbox)
    //   lightbox.getUserAndMediasFromURL();
    eventlightbox();
  });
});


