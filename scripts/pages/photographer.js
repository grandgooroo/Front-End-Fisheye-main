// créer une variable globale
const photographersData = getPhotographersData();


function createHTMLPhotographer(photographer) 
    {
        let photographersSection = document.querySelector(".photographer_section")
        const article = document.createElement("article");
        const pictureProfil = `assets/profil/${photographer.portrait}`;
        

        article.innerHTML = `
        <h2>${photographer.name}</h2>
        <h1>${photographer.city} ${photographer.country}</h1>
        <h3>${photographer.tagline}</h3>
        <img src=${pictureProfil}></img>
        `;

        const image = document.createElement("img");
        image.src = `assets/medias/${photographer.name}`;

        // article.innerHTML = `<img src=""></img>`

        photographersSection.appendChild(article)
    };

    function getPhotographersId()  
    {
        let getPhotographers = fetch("data/photographers.json")
            .then(resp => resp.json())
            .then(data => 
        {
            const params = new URLSearchParams(window.location.search);
            // console.log(params);
            const userId = Number(params.get('id'));

            const user = data.photographers.find(data => data.id === userId);
            // console.log(user);
                
            createHTMLPhotographer(user)
        });
    }

function createImage()
    {
        const mediaSection = document.createElement('section');
        const img = document.createElement("img");
        {
            article.innerHTML = `
            <img src=${mediaPictures}></img>
            `;
        }
    };   

function mediaFactory()
    
    {
        // Requête HTTP pour récup les données du photographe
        let getPhotographers = fetch("data/photographers.json")
        .then(resp => resp.json())
        .then(data => 
        {
            const params = new URLSearchParams(window.location.search);
            const userId = Number(params.get('id'));
            const user = data.media.find(data => data.photographerId === userId);
            console.log(user);
            const medias = data.media.filter(data => data.photographerId === userId);
            // console.log(medias);

            const { id, title, country, image, video, likes, date, price } = data.media;
            // const {photographerId} = data.media.photographerId;

            let mainSection = document.querySelector("#main");
            const divMediaSection = document.createElement("media-section");
            divMediaSection.innerHTML = `<div class="media-section"</div>`;
            mainSection.appendChild(divMediaSection);
            // data.media.forEach(image => {
            //     createItem(image);
            // });

                for (const image of medias)
                {
                    createItem(image);
                    console.log(createItem);
                }
        });
    };   

function createItem(media)
    {

        let mainSection = document.querySelector("#main");
        const mediaSection = document.createElement("article");
        const mediaFolder = `/assets/medias/${media.photographerId}`;
        // let mediaElement = document.createElement("");
        
        console.table(mediaFolder); // Faire une condition si "Video" alors...ou "Switch" !?
        
        // if (media.type === "image")
        // {
        //     mediaElement = document.createElement("img");
        // } else if (media.type === "video");
        //     {
        //         mediaElement = document.createElement("video");
        //     }
        mediaSection.innerHTML = `
            <h2>${media.photographerId}</h2>
            <p>${media.title}</p>
            <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}" class="img">
        `;

        mainSection.appendChild(mediaSection);
    };

    function createMenuSelect()
    {

    }
    
    function sort()
    {
        let getPhotographers = fetch("data/photographers.json")
        .then(resp => resp.json())
        .then(data => 
        {
            const { title, likes, date, price } = data.media; // Utiliser un switch pour les différents cas ?
            /* Trier par "likes" */

            // const likesCounter = data.media;
            // const byValue = (a,b) => b.likes - a.likes;
            // const sorted = [...likesCounter].sort(byValue);
            // console.table(sorted);

            /* Trier par "date" */

            // const dateSort = data.media.slice().sort((a, b) => b.date - a.date);
            // console.table(dateSort);

            /* Trier par "title" */

            function titleSort(media)
            {
                return media.sort(function(x, y)
    
                {
                    console.log(x);
                    return x.title.localeCompare(y.title);
                });
            }
            titleSort(data.media);

        });
    };

  // Afficher le profil du photographe
getPhotographersId();  
mediaFactory();
sort();



