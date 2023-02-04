// import * as monModule from '/modules/mon-module.js';

// créer une variable globale
const getData2 = async () => {
  const response = await fetch("data/photographers.json");
  const data = await response.json();
  // console.table(data.media);

  return data;
};

/* Datas de photographers.json */
let dataGlobal;
let media;
let user;
let like;
let sum;
let price;

async function init() {
  dataGlobal = await getData2();

  mainSection.appendChild(divMediaSection);
  listenerSort();

  const id = getURLId();
  const photographer = getPhotographersId(id);
  media = getPhotographersMedia(id);

  createHTMLPhotographer(photographer);
  // photographerFactory(photographer);

  displayMedia();
  sort(media);

  like = getPhotographersLikes(id);
  sum = countLikes(like);
  price = getPrice(id);


  factoryCountLikesDOM(media, photographer, sum);
}

function getURLId() {
  // Récupére l'ID dans l'URL du profil du photographe
  const params = new URLSearchParams(window.location.search);
  console.log(params);
  const userId = Number(params.get("id"));
  return userId;
}

function getPhotographersId(userId) {
  // Compare l'ID de l'URL à celui du tableau photographers.photographe
  const user = dataGlobal.photographers.find((data) => data.id === userId);
  // console.table(user);
  return user;
}

function getPhotographersMedia(userId) {
  // Récupère les médias du tableau photographers.media
  const medias = dataGlobal.media.filter(
    (data) => data.photographerId === userId
  );
  // console.log(medias);
  return medias;
}

function getPhotographersLikes(id) {
  let filteredMedia = dataGlobal.media.filter((m) => m.photographerId === id);
  let likes = filteredMedia.map((m) => m.likes);
  return likes;
}

// Add function sum Likes
function countLikes(like) {
  let sum = like.reduce((acc, cur) => acc + cur, 0);
  console.log(sum); // Total of user likes
  return sum;
}

function getPrice(id) {
  let fPrice = dataGlobal.photographers.filter((p) => p.id === id);
  let priceD = fPrice.map((p) => p.price);
  return priceD;
}

const params = new URLSearchParams(window.location.search);
const userId = Number(params.get("id"));
const mainSection = document.querySelector("#main");
const divMediaSection = document.createElement("media-section");
divMediaSection.classList.add("media-section");
const menuSection = document.createElement("dropdown-menu__container");
menuSection.classList.add("select-menu");
let changeMenuValue = document.querySelector("#monselect");
const image = document.createElement("img");
const video = document.createElement("video");

/// Factory ///
// Factory Likes //

function factoryCountLikesDOM(media, photographer, sum) {
  const { id, photographerId, title, image, video, likes, date, price } = media;
  //récup le "Price" de dataGlobal
  // console.table(user);

  const likesCounterSection = document.createElement("article");

  divMediaSection.appendChild(likesCounterSection);

  likesCounterSection.innerHTML = `
        <div class="likes-section">
                    <div>    
                        <span>${sum} </span><i class="fas fa-heart"></i>
                    </div>
                    <div>
                        <p>${photographer.price}€/jour></p>
                    </div>
                </div>
        `;
}

function factoryMedia(media, type) {
  // Prend en paramètre le type de média : image ou vidéo
  const { id, photographerId, title, image, video, likes, date, price } = media;
  const mediaItem = document.createElement("article");
  const mediaFolder = `/assets/medias/${media.photographerId}`;
  divMediaSection.appendChild(mediaItem);

  // console.log(media.image);
  // console.log(mediaFolder);

  if (image) {
    mediaItem.innerHTML = `
                <!-- <h2>${media.photographerId}</h2> -->
                <p>${media.title}</p><span>${media.likes}</span>
                <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}" class="img"></img>
                <div class="likes">
                <button id="like" onclick="incrementLikes()"><i class="fas fa-heart"></i></button></div>
                `;
  } else {
    mediaItem.innerHTML = `
                <p>${media.title}</p>
                <video src="${mediaFolder}/${media.video}" alt="Image de ${media.name}" type=video/mp4 class="video"></video>
                <div class="likes"><i class="fas fa-heart"></i></div>
            `;
    // console.log("video");
  }

  // switch(type)
  // {
  //     case 'image':

  //         //logique//
  //         mediaItem.innerHTML = `
  //         <h2>${media.photographerId}</h2>
  //         <p>${media.title}</p>
  //         <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}" class="img">
  //         `;
  //         return new image();

  //     case 'video':
  //         mediaItem.innerHTML = `<source src="${mediaFolder}/${media.video}" alt="Image de ${media.name}" class="img">
  //         `;
  //         return new video();
  // }
  // return {id, photographerId, title, image, video, date, price}
}

function incrementLikes() {
  
  let count = like;
  const likesButton = document.querySelectorAll("#like");

  // Add click event to button
  
  for (let button of likesButton) 
  {
    button.addEventListener("click", () => {
      count++;
    });
  }
  console.log(count);
}
// Pour creer l'affichage des profils

// function photographerFactory(photographer) // La paire Key/value serra remplie par les Datas.
// {
//   const { name, id, portrait, city, country, tagline, price } = photographer; // Propriétées de l'objet
//   const pictureProfil = `assets/profil/${portrait}`;
//   // console.table(photographer);

//     function getUserCardDom(photographer) //Façon d'utiliser les Propriétées de l'objet
//     {
//       const article = document.createElement("article");
//       let photographersSection = document.querySelector(".photographer_section");

//       article.innerHTML = `
//           <h2>${name}Toto</h2>
//           <h1>${city} ${country}</h1>
//           <h3>${tagline}</h3>
//           <img src=${pictureProfil}></img>
//           `;
//       image.src = `assets/medias/${name}`;
//       photographersSection.appendChild(article);
//       return article;
//     }
//     return { name, id, portrait, city, country, tagline, price, getUserCardDom };
// }

/// Factory End ///

function createHTMLPhotographer(photographer) {
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

function displayMedia() {
  divMediaSection.innerHTML = "";

  for (const image of media) {
    // createItem(image);
    factoryMedia(image, video, incrementLikes());
    ;
  }
}

function createItem(media) {
  const mediaItem = document.createElement("article");
  const mediaFolder = `/assets/medias/${media.photographerId}`;

  // Faire une condition si "Video" alors...ou "Switch"

  mediaItem.innerHTML = `
            <h2>${media.photographerId}</h2>
            <h2>${media.title}</h2>
            <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}" class="img">
            <div class="likes"><i class="fas fa-heart"></i></div>
        `;

  divMediaSection.appendChild(mediaItem);
}

function listenerSort() {
  let SelectValue = document.querySelector("#monselect");

  SelectValue.addEventListener("change", () => {
    console.log("You selected: ", SelectValue.value);
    const value = SelectValue.value;
    console.log(value);
    sort(value);
    displayMedia();
  });
}

function createDropdownMenu() {
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

// function createDropdownMenuBtn() // Avec Button
// {
//     menuSection.innerHTML = `
//         <label id="menuSelect" class="menuSelect">Trier par :</label>
//             <div class="js-select">
//                 <button id="current-order">Popularité</button> */Masquer avec display none/*
//                 <div id="options-order"> */Afficher avec display block/*
//                 <button data-order="date">Date</button>
//                 <button data-order="popularity">Popularité</button>
//                 <button data-order="title">Titre</button>
//             </div>
//     `;
//     mainSection.appendChild(menuSection)
// }

function sort(value) {
  /* Avec switch */
  switch (value) {
    case "likes":
      /* Trier par "likes" */
      media.sort((a, b) => b.likes - a.likes);
      console.log("trie like OK");
      // console.table(media);

      break;

    case "date":
      /* Trier par "date" */

      media.sort((a, b) => {
        return new Date(a.date) - new Date(b.date); // descending
      });
      console.log("trie date OK");
      // console.table(media);

      break;

    case "title":
      /* Trier par "title" */

      function titleSort(media) {
        return media.sort(function (a, b) {
          // console.log(x);
          return a.title.localeCompare(b.title);
        });
      }
      titleSort(media);
      console.log("trie titre OK");
      // console.table(media);
      break;
  }
}

// Afficher le profil du photographe

createDropdownMenu();
init();
