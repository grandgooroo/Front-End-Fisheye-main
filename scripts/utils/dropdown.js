
export class DropDown {
    constructor(dropDown) {
      // Récupère les enfants de l'élément déroulant: le bouton et le menu
      const [toggler, menu] = dropDown.children;
      // Gère le clic à l'extérieur du menu déroulant
      const handleClickOut = e => {
        // Si le menu déroulant n'existe pas, retire l'événement d'écoute du clic
        if(!dropDown) {
          return document.removeEventListener('click', handleClickOut);
        }
        // Si le clic est à l'extérieur du menu déroulant, ferme le menu
        if(!dropDown.contains(e.target)) {
          this.toggle(false);
        }
      };
      // Définit la valeur du menu déroulant
      const setValue = (item) => {
        // Récupère le texte et la valeur de l'élément du menu
        const val = item.textContent;
        const dataValue = item.getAttribute('data-value');
        // Met à jour le texte du bouton et la valeur du menu déroulant (première entré du menu)
        toggler.textContent = val;
        this.value = dataValue;
        // Ferme le menu et déclenche un événement de changement
        this.toggle(false);
        dropDown.dispatchEvent(new Event('change'));
    
        toggler.focus(); // Met le focus sur le bouton du menu déroulant
      }
      // Gère l'événement keydown sur les éléments du menu
      const handleItemKeyDown = (e) => {
        e.preventDefault();
        // Navigation dans le menu avec les touches fléchées haut et bas
        if(e.keyCode === 38 && e.target.previousElementSibling) { // up
          e.target.previousElementSibling.focus();
        } else if(e.keyCode === 40 && e.target.nextElementSibling) { // down
          e.target.nextElementSibling.focus();
        } else if(e.keyCode === 27) { // escape key
          // Ferme le menu avec la touche échappe
          this.toggle(false);
        } else if(e.keyCode === 13 || e.keyCode === 32) { // enter or spacebar key
          // Sélectionne un élément du menu avec la touche entrée ou espace
          setValue(e.target);
        }
      }
      // Ajoute des écouteurs d'événements pour le clic sur le bouton et les éléments du menu
      toggler.addEventListener('click', () => this.toggle());
      [...menu.children].forEach(item => {
        item.addEventListener('keydown', handleItemKeyDown);
        item.addEventListener('click', () => setValue(item));
      });
      // Initialise les propriétés de la classe
      this.element = dropDown; // l'element qui possède la class .dropdown
      this.value = toggler.textContent; // Le texte courant affiché dans le bouton assigné à this.value
      
      // Méthode pour ouvrir ou fermer le menu déroulant
      this.toggle = (expand = null) => {
        expand = expand === null // Initialise la valeur d'expend à null si aucune valeur (true/false) n'est trouvé
          ? menu.getAttribute('aria-expanded') !== 'true' // si different de true alors expand
          : expand;
          // if expand = null expand = getAttribute('aria-expanded') !== 'true', peut être créer une fonction isOpen
    
        menu.setAttribute('aria-expanded', expand); // Met à jout l'état d'expand 
        // Ajoute la classe active au bouton si le menu est ouvert, la retire sinon
        if(expand) {
          toggler.classList.add('active');
          menu.children[0].focus();
          // Ajoute un écouteur d'événement pour le clic à l'extérieur du menu
          document.addEventListener('click', handleClickOut);
          dropDown.dispatchEvent(new Event('opened'));
        } else {
          toggler.classList.remove('active');
          dropDown.dispatchEvent(new Event('closed'));
          document.removeEventListener('click', handleClickOut);
        }
      }
    }
  }