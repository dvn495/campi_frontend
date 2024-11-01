

export class GeneralChat extends HTMLElement {
    constructor(){
        super();
        this.render();
    }
    render() {
        this.innerHTML = /* html */ `
        
        
        `
    }
}
customElements.define("general-chat", GeneralChat);