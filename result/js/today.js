import Weather from "./app.js";

export default class Today {
    #api = '2d96a45db884057ffb45802af7c3a2e3';
    constructor() {
        this.city = document.querySelector('.search .area input');
        this.header_p = document.querySelectorAll('.header .left p');
        this.head_info = document.querySelector('.head_info');
        this.today = document.querySelector('.today .hours');
        this.wrap = document.querySelector('.wrapper');
        this.current_city = 'Кременчук';
        this.mobile_arrow = 0;
        this.info = {};
        this.image = {
            200: '11d.png',
            201: '11d.png',
            202: '11d.png',
            210: '11d.png',
            211: '11d.png',
            212: '11d.png',
            221: '11d.png',
            230: '11d.png',
            231: '11d.png',
            232: '11d.png',
            300: '09d.png',
            301: '09d.png',
            302: '09d.png',
            310: '09d.png',
            311: '09d.png',
            312: '09d.png',
            313: '09d.png',
            314: '09d.png',
            321: '09d.png',
            500: '10d.svg',
            501: '10d.svg',
            502: '10d.svg',
            503: '10d.svg',
            504: '10d.svg',
            511: '13d.png',
            520: '09d.png',
            521: '09d.png',
            522: '09d.png',
            531: '09d.png',
            600: '13d.png',
            601: '13d.png',
            602: '13d.png',
            611: '13d.png',
            612: '13d.png',
            613: '13d.png',
            615: '13d.png',
            616: '13d.png',
            620: '13d.png',
            621: '13d.png',
            622: '13d.png',
            700: '01d.svg',
            711: '01d.svg',
            721: '01d.svg',
            731: '01d.svg',
            741: '01d.svg',
            751: '01d.svg',
            761: '01d.svg',
            762: '01d.svg',
            771: '01d.svg',
            781: '01d.svg',
            800: '01d.svg',
            801: '02d.png',
            802: '03d.png',
            803: '04d.svg',
            804: '04d.svg'
        }
    }

    get_date() {
        function zero_first_format(value) {
            if (value < 10) {
                value = '0' + value;
            }
            return value;
        }
        let current_datetime = new Date();
        let day = zero_first_format(current_datetime.getDate());
        let month = zero_first_format(current_datetime.getMonth() + 1);
        let year = current_datetime.getFullYear();
        let hours = zero_first_format(current_datetime.getHours());
        let minutes = zero_first_format(current_datetime.getMinutes());
        let seconds = zero_first_format(current_datetime.getSeconds());

        return day + "." + month + "." + year;
    }

    get_city() {
        if (this.city.value === '') {
            this.current_city = this.city.placeholder
        } else {
            this.current_city = this.city.value
        }
    }

    get_city_info() {
        this.get_city();
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.current_city}&limit=1&appid=${this.#api}`
        fetch(url)
            .then(response => response.json())
            .then(response => {
                this.get_weather(response[0].lat, response[0].lon);
            })
            .catch(() => {
                if (window.outerWidth > 431) {
                    this.wrap.style.backgroundImage = 'url(/result/img/404.png)';
                    this.wrap.style.backgroundRepeat = 'no-repeat';
                } else {
                    this.wrap.style.backgroundImage = 'url(/result/img/404_430.png)';
                }
                this.wrap.style.backgroundSize = '100%';
                this.wrap.style.display = 'flex';
                this.wrap.innerHTML = `
                <div class="error">
                    <img src="/result/img/404_2.png" alt="">
                    <div class="text">
                        <h1>OOPS!</h1>
                        <p>${this.city.value} не знайдено</p>
                        <p>Будь ласка введіть інше місце розташування</p>
                    </div>
                    <div class="button">
                        <p>Повернутися на головну</p>
                    </div>
                </div>
                `;
                let btn = document.querySelector('.button');
                btn.addEventListener('click', function () { location.reload() });
            })
    }

    get_weather(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=1&lang=ua&units=metric&appid=${this.#api}`
        fetch(url)
            .then(response => response.json())
            .then(response => {
                this.info = {
                    'temp': +response.list[0].main.temp.toFixed(0),
                    'feels': +response.list[0].main.feels_like.toFixed(0),
                    'description': response.list[0].weather[0].description,
                    'wind': Math.ceil(response.list[0].wind.speed),
                    'temp_min': +response.list[0].main.temp_min.toFixed(0),
                    'temp_max': +response.list[0].main.temp_max.toFixed(0),
                    'id': +response.list[0].weather[0].id,
                    'humidity': response.list[0].main.humidity,
                    'probability': response.list[0].pop

                };
                this.set_head_info();
                this.set_today(lat, lon);
                this.set_city_nears();
            })
    }

    set_head_info() {
        let str = `
        <div class="info">
            <h1>${this.info.temp}°</h1>
            <h2>${this.info.description}</h2>
            <h3>Відчувається як ${this.info.feels}°</h3>
            <div class="wind">
                <img src="/result/img/veterok.png" alt="">
                <p>${Math.ceil(this.info.wind)} km/h</p>
            </div>
        </div>
        <div class="image">
            <img src="/result/img/weather/${this.image[`${this.info.id}`]}" alt="">
        </div>
        `
        this.head_info.innerHTML = '';
        this.head_info.insertAdjacentHTML('afterbegin', str);
    }

    set_today(lat, lon) {
        this.today.innerHTML = '';
        document.querySelector('.today .date .today_date').textContent = this.get_date();
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=13&lang=ua&units=metric&appid=${this.#api}`)
            .then(response => response.json())
            .then(response => {
                for (let i = 1; i <= 12; i++) {
                    let time = response.list[i].dt_txt.split(' ')[1].slice(0, 5);
                    let min = +response.list[i].main.temp_min.toFixed(0);
                    let max = +response.list[i].main.temp_max.toFixed(0);
                    let id = response.list[i].weather[0].id;

                    let str = `
                    <div class="hours_item">
                        <p class="time">${time}</p>
                        <p class="part">${this.set_time_in_today(time)}</p>
                        <img src="/result/img/weather/${this.image[`${id}`]}" alt="">
                        <p class="weather">${response.list[i].weather[0].description}</p>
                        <p class="degrees">${min}° ${max}°</p>
                    </div>
                    `
                    this.today.insertAdjacentHTML('beforeend', str);
                }
                this.mobile_version();
            })
    }

    set_time_in_today(time) {
        let hour = parseInt(time.split(':')[0]);
        if (hour > 5 && hour < 12) {
            return 'Ранок'
        } else if (hour > 11 && hour < 18) {
            return 'День'
        } else if (hour >= 18 && hour <= 20) {
            return 'Вечір'
        } else {
            return 'Ніч'
        }
    }

    set_city_nears() { }

    mobile_today_hours() {
        for (let i = 0; i != this.today.children.length-1; i++) {
            this.today.children[i].style.display = 'none';
        }
        for (let i = this.mobile_arrow; i < this.mobile_arrow + 3; i++) {
            this.today.children[i].style.display = null;
        }
    }

    mobile_today_hours_arrows() {
        this.today.insertAdjacentHTML('beforebegin', `<div class="arrow"><img src="/result/img/chevron_right.svg" alt=""></div>`);
        document.querySelector('.arrow').addEventListener('click', function () {
            this.mobile_arrow = this.mobile_arrow + 1;
            if (this.mobile_arrow < 9) {
                this.mobile_today_hours();
            } else if (this.mobile_arrow > 8) {
                this.mobile_arrow = 0;
                this.mobile_today_hours();
            }
        }.bind(this));
    }

    mobile_statements() {
        let str = `
        <div class="statements">
            <div class="chance">
                <img src="./img/chance_icon.png" alt="">
                <p>6%</p>
            </div>
            <div class="humidity">
                <img src="./img/humidity_icon.png" alt="">
                <p>12%</p>
            </div>
            <div class="wind">
                <img src="./img/veterok.png" alt="">
                <p>19 km/h</p>
            </div>
        </div>
        `
        this.wrap.insertAdjacentHTML('afterbegin', str);

        let state = document.querySelector('.statements');
        state.children[0].children[1].textContent = `${(this.info.probability * 100).toFixed(0)}%`;
        state.children[1].children[1].textContent = `${this.info.humidity}%`;
        state.children[2].children[1].textContent = `${this.info.wind} km/h`;
    }

    desktop() {
        if(document.querySelector('.statements')) {
            document.querySelector('.statements').remove();
        }
        if(document.querySelector('.arrow')) {
            document.querySelector('.arrow').remove();
        }
        for (let i = 0; i != this.today.children.length - 1; i++) {
            this.today.children[i].style.display = null;
        }
    }

    mobile_version() {
        if (window.outerWidth < 431) {
            this.mobile_statements();
            this.mobile_today_hours();
            this.mobile_today_hours_arrows();
        } else if (window.outerWidth > 430) {
            this.desktop();
        }
    }

    init() {
        new Weather().click_today();
        this.city.addEventListener('change', this.get_city_info.bind(this));
    }
}