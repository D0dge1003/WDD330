import { renderListWithTemplate } from "./utils.mjs";

function alertTemplate(alert) {
  return `<p style="background-color: ${alert.background}; color: ${alert.color};">${alert.message}</p>`;
}

export default class Alert {
  constructor() {
    this.path = "/WDD330/json/alerts.json";
    this.mainElement = document.querySelector("main");
    this.alertElement = null;
  }

  async init() {
    const alerts = await this.getAlerts();
    if (alerts && alerts.length > 0) {
      this.alertElement = document.createElement("section");
      this.alertElement.classList.add("alert-list");
      this.mainElement.prepend(this.alertElement);
      renderListWithTemplate(alertTemplate, this.alertElement, alerts);
    }
  }

  async getAlerts() {
    try {
      const response = await fetch(this.path);
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Bad Response");
      }
    } catch (error) {
      // console.log(error);
    }
  }
}
