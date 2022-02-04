import { createApp } from "vue";
import App from "./App.vue";

import "@/assets/index.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faDiceD20,
} from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-svg-core/styles.css";

library.add(
  faDiceOne,
  faDiceTwo,
  faDiceThree,
  faDiceFour,
  faDiceFive,
  faDiceSix,
  faDiceD20
);

const app = createApp(App)
  .component("font-awesome", FontAwesomeIcon)
  .mount("#app");

class ClickOutside extends HTMLElement {
  onClickOutside = new CustomEvent("clickoutside");
  clickOutside(e) {
    this.dispatchEvent(this.onClickOutside);
  }

  clickInside(e) {
    e.stopPropagation();
  }

  constructor() {
    super();

    this.clickOutside = this.clickOutside.bind(this);
    this.clickInside = this.clickInside.bind(this);
  }

  connectedCallback() {
    document.addEventListener("click", this.clickOutside);
    this.addEventListener("click", this.clickInside);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.clickOutside);
    this.removeEventListener("click", this.clickInside);
  }
}

customElements.define("click-outside", ClickOutside);
