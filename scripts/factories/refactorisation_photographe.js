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
  }
  
  // Récupérer l'URL de la page courante
  getURLId() {
    const params = new URLSearchParams(window.location.search);
    console.log(params);
    const userId = Number(params.get("id"));
    return userId;
  } 

  // Récup l'ID du photographe dans le JSON
  getPhotographerId(userId) { 
    return this.photographers.find((photographers) => photographers.id === userId);
  }

  // Filtre l'ID (Clé = photographerId) du photographe dans la section Media du JSon
  getPhotographerMedias(userId) { 
    return this.medias.filter((media) => media.photographerId === userId);
  }

  // Récup l'ID du media
  getMediaId(id) {
    return this.medias.filter((photographers) => photographers.photographerId === id);
  }

  async getUserAndMedias(userId) {
    // Récupérer les données de l'utilisateur correspondant à cet ID
    this.user = this.getPhotographerId(userId);
    console.log(this.user);
    // Récupérer les médias associés à cet utilisateur
    this.medias = await this.getPhotographerMedias(userId);
    // console.table(this.medias)

    // Triez les médias par défaut (par popularité)
    this.sort("likes", this.medias);

    // Affichez les médias triés
    console.table(this.medias);

    // Créer le menu de tri
    this.createDropDownMenu();

    // Mettre en place l'écouteur sur le menu déroulant
    this.listenerSort();
    console.table(this.medias);

  }

  async getUserAndMediasFromURL() {
    const currentuserId = this.getURLId();
    console.log(currentuserId);
    await this.getUserAndMedias(currentuserId);
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

  // Fonction qui cible le déclancheur du trie sur le menu DropDown
  listenerSort() {
    let SelectValue = document.querySelector("#monselect");
  
    SelectValue.addEventListener("change", () => {
      console.log("You selected: ", SelectValue.value);
      const value = SelectValue.value;
      console.log(value);
      this.sort(value, this.medias);
    });
  }

  // Sort Media by Date, Title, Popularity
  sort(value) {
    /* Avec switch */
    switch (value) {
      case "likes":
        /* Trier par "likes" */
        this.medias.sort((a, b) => b.likes - a.likes);
        console.log("trie like OK");
        // console.table(media);
        break;

      case "date":
        /* Trier par "date" */

        this.medias.sort((a, b) => new Date(a.date) - new Date(b.date));
        console.log("trie date OK");
        break;
        // console.table(media);

      case "title":
        /* Trier par "title" */

        this.medias.sort((a, b) => a.title.localeCompare(b.title));
      break;
    }
  }

  // Ajoute +1 Like sur le media cliqué
  incrementLike(mediaItem) {
    let clickCount = 0;
    const buttonIncrementLike = mediaItem.querySelector("button");
    

    buttonIncrementLike.addEventListener("click", function() {
      if (mediaItem.id === buttonId && clickCount < 1) { 
        this.medias.likes += 1, // sum += 1;

        sum = countLikes(like);
        sum++;
        console.log(sum);
        
        mediaItem.querySelector("span").innerHTML = media.likes;
        
        buttonIncrementLike.classList.remove("btn-likes");
        buttonIncrementLike.classList.add("btn-likes-red");

        buttonIncrementLike.disabled = true; // pour empecher de liker encore une fois apres le trie ?

        clickCount++;
        console.log("plus");
      }
    });
  }

  // Crée un media en fonction de la nature du média (Image ou Vidéo)
  createMedia(media) {
    const { id, photographerId, title, image, video, likes, date, price } = media;

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
    this.divMediaSection = document.createElement("media-section");
    this.mainSection = document.querySelector("#main");
    this.mediaItem = document.createElement("article");
  }

  render() {
    const mediaFolder = `/assets/medias/${this.photographerId}`;

    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
    this.mediaItem.classList.add("media-item");
    this.mediaItem.id = 'img-id-' + this.id;

    let buttonId = this.mediaItem.id;
    this.mediaItem.innerHTML = `
      <p>${this.title}</p><span>${this.likes}</span>
      <a href="">
      <img src="${mediaFolder}/${this.image}" alt="Image de ${this.name}" class="img"></img>
      </a>
      <div class="likes">
      <button id="${buttonId}" type="button" class="btn-likes"><i class="fas fa-heart"></i></button></div>
    `;

    this.divMediaSection.appendChild(this.mediaItem);
    return this.mediaItem;
  }
}

class VideoMedia extends Media {
  constructor(media) {
    super(media);
    this.video = media.video;
    this.divMediaSection = document.createElement("media-section");
    this.mainSection = document.querySelector("#main");
    this.mediaItem = document.createElement("article");
  }

  render() {
    const mediaFolder = `/assets/medias/${this.photographerId}`;

    this.divMediaSection.classList.add("media-section");
    this.mainSection.appendChild(this.divMediaSection);
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

// Classe pour les likes
class LikesCounter {
  constructor(mediaItems) {
    this.mediaItems = mediaItems;
    this.likesCount = mediaItems.reduce((acc, media) => acc + media.likes, 0);
  }

  render() {
    const likesCounterSection = document.createElement("article");
    likesCounterSection.innerHTML = `
      <div class="likes-section">
        <div>
          <span>${this.likesCount}</span><i class="fas fa-heart"></i>
        </div>
        <div>
          <p>${this.mediaItems[0].price}€/jour</p>
        </div>
      </div>
    `;
    return likesCounterSection;
  }
}

// Classe pour le profil des photographes pour le Header et la page Index.html
class Photographer {
  constructor(photographers) {
    const { name, id, city, country, tagline, price, portrait } = photographers;
    this.id = id;
    this.name = name;
    this.city = city;
    this.country = country;
    this.tagline = tagline;
    this.pictureProfil = pictureProfil;
    const pictureProfil = `assets/profil/${portrait}`;
  }

  render() {
    // Récupérer l'ID de l'utilisateur dans l'URL
    const userId = this.getURLId();

    // Récupérer les données de l'utilisateur correspondant à cet ID
    const user = this.getPhotographersId(userId);

    // Récupérer les médias associés à cet utilisateur
    const medias = this.getPhotographersMedia(userId);

    let photographersSection = document.querySelector(".photographer_section");
    const article = document.createElement("article");
    const pictureProfil = `assets/profil/${photographer.portrait}`;

    article.innerHTML = `
          <h2>${photographer.name}</h2>
          <h1>${photographer.city} ${photographer.country}</h1>
          <h3>${photographer.tagline}</h3>
          <img src=${pictureProfil}></img>
          `;

    image.src = `assets/medias/${photographer.name}`;

    photographersSection.appendChild(article);
  }
} 

// Appel de la factory

const photographerService = new PhotographerService();
// const photographerHeader = new Photographer();

photographerService.init().then(() => {
  photographerService.getUserAndMediasFromURL().then(() => {
    // photographerService.createDropDownMenu();
    // photographerService.listenerSort();
    // photographerService.sort();

    for (const media of photographerService.medias) {
      const mediaItem = photographerService.createMedia(media);

      // Appeler la méthode "render" pour afficher chaque élément dans le DOM
      const mediaItemRender = mediaItem.render(media);
      // Ajouter l'élément au DOM
      document.querySelector("media-section").appendChild(mediaItemRender);
    }
  });
});