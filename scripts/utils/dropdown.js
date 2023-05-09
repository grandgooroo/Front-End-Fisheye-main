
export class DropDown {
    constructor(dropDown) {
      const [toggler, menu] = dropDown.children;
      
      const handleClickOut = e => {
        if(!dropDown) {
          return document.removeEventListener('click', handleClickOut);
        }
        
        if(!dropDown.contains(e.target)) {
          this.toggle(false);
        }
      };
      
      const setValue = (item) => {
        const val = item.textContent;
        const dataValue = item.getAttribute('data-value');
        toggler.textContent = val;
        this.value = dataValue;
        this.toggle(false);
        dropDown.dispatchEvent(new Event('change'));
    
        toggler.focus(); // Met le focus sur le bouton du menu déroulant
      }
      
      const handleItemKeyDown = (e) => {
        e.preventDefault();
    
        if(e.keyCode === 38 && e.target.previousElementSibling) { // up
          e.target.previousElementSibling.focus();
        } else if(e.keyCode === 40 && e.target.nextElementSibling) { // down
          e.target.nextElementSibling.focus();
        } else if(e.keyCode === 27) { // escape key
          this.toggle(false);
        } else if(e.keyCode === 13 || e.keyCode === 32) { // enter or spacebar key
          setValue(e.target);
        }
      }

      toggler.addEventListener('click', () => this.toggle());
      [...menu.children].forEach(item => {
        item.addEventListener('keydown', handleItemKeyDown);
        item.addEventListener('click', () => setValue(item));
      });
      
      this.element = dropDown;
      
      this.value = toggler.textContent;
      
      this.toggle = (expand = null) => {
        expand = expand === null
          ? menu.getAttribute('aria-expanded') !== 'true'
          : expand;
    
        menu.setAttribute('aria-expanded', expand);
        
        if(expand) {
          toggler.classList.add('active');
          menu.children[0].focus();
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