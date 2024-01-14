'use strict'
import Today from "./today.js";
import Days from "./days.js";

export default class Weather {
    constructor() {
        this.days = new Days();
        this.today = new Today();
        this.header_p = document.querySelectorAll('.header .left p');
    }

    click_today() {
        this.header_p[0].style.color = '#C8A0FC';
        this.today.get_city_info();
    }

    init() {
        this.today.init();
        this.header_p[0].addEventListener('click', this.click_today.bind(this));
    }
}
new Weather().init();