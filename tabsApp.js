class Tab {
    constructor(tab){
      this.tab = tab;
    }
    showTab(){
      this.tab.setAttribute('aria-selected', 'true');
      this.tab.removeAttribute('tabindex');
    }
    hideTab(){
      this.tab.setAttribute('aria-selected', 'false');
      this.tab.setAttribute('tabindex', '-1');
    }
    focusTab(){
      this.tab.focus();
    }
  }
  
  class Panel {
    constructor(panel){
      this.panel = panel;
    }
    showPanel(){
      this.panel.removeAttribute('hidden');
    }
    hidePanel(){
      this.panel.setAttribute('hidden', 'pizza');
    }
  }
  
  
  class Tablist {
    constructor(id, dir){
      this.id = id;
      this.dir = dir || 'horizontal';
      this.tabs = this.initializeTabs();
      this.panels = this.initializePanels();
      this.addListeners();
    }
  
    initializeTabs(){
      if(!this.id){
        throw new Error('You must pass an ID when initializing');
      }
      return [...document.querySelectorAll(`#${this.id} [role="tab"]`)].map((t) => new Tab(t));
    }
    
    initializePanels(){
      return [...document.querySelectorAll(`#${this.id} [role="tabpanel"]`)].map((p) => new Panel(p));
    }
  
    activatePanel(e){
      if(e.target === e.currentTarget){return}
      this.tabs.forEach((t) => {
        e.target.id === t.tab.id ? t.showTab() : t.hideTab();
      });
      this.panels.forEach((p) => {
        e.target.getAttribute('aria-controls') === p.panel.id ? p.showPanel() : p.hidePanel();
      });
    }
  
    moveKeyboardFocus(currentIndex){
      const getIndexOfActiveElement = (el) => el.tab.id === document.activeElement.id;
      if(currentIndex === 'first'){
        document.activeElement.id === this.tabs[0].tab.id
          ? this.tabs[this.tabs.length - 1].focusTab()
          : this.tabs[this.tabs.findIndex(getIndexOfActiveElement) - 1].focusTab();
      } else {
        document.activeElement.id === this.tabs[this.tabs.length - 1].tab.id
          ? this.tabs[0].focusTab()
          : this.tabs[this.tabs.findIndex(getIndexOfActiveElement) + 1].focusTab();
      }
    }
  
    addListeners() {
      const tablist = document.querySelector(`#${this.id} [role="tablist"]`);
  
      // Click
      tablist.addEventListener('click', (e) => {this.activatePanel(e)})
  
      // Keyboard Events
      tablist.addEventListener('keydown', (e) => {
        if(!tablist.contains(document.activeElement)){return}
        switch(e.key){
          case 'Home':
            e.preventDefault();
            this.tabs[0].focusTab();
            break;
          case 'End':
            e.preventDefault();
            this.tabs[this.tabs.length - 1].focusTab();
            break;
          case ' ':
          case 'Spacebar':  
          case 'Enter':  
            this.activatePanel(e)
            break;
          case 'ArrowUp':  
            e.preventDefault();
            this.dir !== 'horizontal' ? this.moveKeyboardFocus('first') : null;
            break;
          case 'ArrowRight':  
            this.dir === 'horizontal' ? this.moveKeyboardFocus('last') : null;
            break;
          case 'ArrowDown':  
            e.preventDefault();
            this.dir !== 'horizontal' ? this.moveKeyboardFocus('last') : null;
            break;
          case 'ArrowLeft':  
            this.dir === 'horizontal' ? this.moveKeyboardFocus('first') : null;
            break;
            
        }
      })
    }
  }
  
  export default function initTabsApp(){
    document.querySelectorAll('.tabs-wrapper').forEach((tabgroup) => {
      new Tablist(tabgroup.id, tabgroup.dataset.direction);
    })
  }