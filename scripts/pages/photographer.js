
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
            // console.log(params);
            const userId = Number(params.get('id'));

            const user = data.media.find(data => data.photographerId === userId);

            {
                for (const media of data.media)
                {
                    gallerie(user)
                    console.log(gallerie);
                }
            }
        });
    };   

function gallerie(media)
    {
        let mainSection = document.querySelector("#main");
        const mediaSection = document.createElement("article");
        const mediaFolder = `/assets/medias/${media.photographerId}`;

        mediaSection.innerHTML = `
            <h2>${media.photographerId}</h2>
            <img src="${mediaFolder}/${media.image}" alt="Image de ${media.name}">
        `;

        mainSection.appendChild(mediaSection);
    };


  // Afficher le profil du photographe
getPhotographersId();  
mediaFactory();

// let getPhotographers = fetch("data/photographers.json")
//         .then(resp => resp.json())
//         .then(data =>
//         {
//             for (const photographerMedia of data.media) 
//             {
        
//                 function mediaLink(media, photographerMedia)
//                 {
//                     const pictureLink = `/assets/medias/${photographerMedia.name}/${media.photographerId}`; 
                    
//                     const mediaSection = document.createElement('section');
//                     const img = document.createElement("img");

//                     console.log(mediaLink)
//                     // imageIndexes.forEach((i) => {
//                     //     const image = document.createElement('img');
//                     //     image.src = `${pictureLink}`;
//                     //     mediaSection.appendChild(image);
//                     //     });
//                 }
//             };
//         });



