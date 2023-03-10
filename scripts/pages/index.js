
  // récupérer les photographes
  function getPhotographersData()  
  {
    let getPhotographers = fetch("data/photographers.json")
        .then(resp => resp.json())
        .then(data => 
        {
          
          for (const photographer of data.photographers)
          {
            // UserCardDom
            createHTMLPhotographer(photographer)
          }
        })
  };


  function createHTMLPhotographer(photographer) {
    let photographersSection = document.querySelector(".photographer_section")
    const pictureProfil = `assets/profil/${photographer.portrait}`;
    const article = document.createElement("article");

    article.innerHTML = `
    <a href="./photographer.html?id=${photographer.id}"><img src=${pictureProfil}></a>
    <h2>${photographer.name}</h2>
    <h1>${photographer.city} ${photographer.country}</h1>
    <h3>${photographer.tagline}</h3>
    <p>${photographer.price}€/jour</p>
    `;

    photographersSection.appendChild(article)
  }

  // afficher tous le photographes
  getPhotographersData();  


class photographer {
    constructor(name, id, city, country, price, portrait)
    {
      this.name = name;
      this.id = id;
      this.city = city;
      this.country = country;
      this.price = price;
      this.portrait = portrait;
    }
}

// Gallerie 
// Déclarer le chemin des images
const media = "../assets/Sample Photos";

// LIKES 
const likeButtons = document.querySelectorAll('.photographer-article-like-icon')
// Pour tous les boutons coeur
likeButtons.forEach(function (likeButton) {
    // je créé un event click
    likeButton.addEventListener('click', function (event) {
        // current target : sur quoi j'ai cliqué l'element qui a déclenché l'event donc recuperer tt ce qui a derrière
        const button = event.currentTarget
        const counter = button.closest('.photographer-article-like').querySelector('.likes')
        const totalCounter = document.querySelector('.photographer-nav-like-total')
        let likes = parseInt(counter.innerText)
        let totalLikes = parseInt(totalCounter.innerText)
        if (button.dataset.liked === "1") {
            button.dataset.liked = "0"
            likes--
            totalLikes--
        } else {
            button.dataset.liked = "1"
            likes++
            totalLikes++
        }
        counter.innerText = likes
        totalCounter.innerText = totalLikes
    })
})