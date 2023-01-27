
// Pour creer l'affichage des profils

// function photographerFactory(data) {
//     const {name, portrait, city, country, tagline, price} = data;
//     const picture = `asset/profil/${portrait}`;

//     function getUserCardDom() {
//         const article = document.createElement("article");
//         article.innerHTML = `
//         <h2>${name}</h2>
//         <p>${city}${country}</p>
//         <p>${tagline}</p>
//         <p>${price}</p>
//         <img src=${picture}>
//         `;
//         return (article);
//         }
//         return {name , picture, city, country, tagline, price, getUserCardDom}
//     }


// class LightBox()
//     {
//         constructor(medias,currentIndex)
//         {
//             next()
//             {
//             }
//             prev()
//             {
//             }
//         }    
//     }

// Pour vider le résultat du tri
function displayMedia()
    {
        document.getElementById("app").innerHTML = "";
            media.forEach(element =>
                {}
                )
                listenForLikes();
    }

/// Test ///
// function factoryTestElement(type, text, color)
// {
//     const el = document.createElement(type)
//     el.innerText = text
//     el.style.color = color
//     document.body.append(el)
//     return {
//         el,
//         setText(text) {
//             el.innerText = text
//         },
//         setColor(color) {
//             el.style.color = color
//         },
//     }
// }

// const h1 = factoryTestElement("h1", "Mon Titre", "Blue")
// console.log(h1)
// const p = factoryTestElement("p", "Mon Paragraphe", "pink")    