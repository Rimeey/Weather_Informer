import Weather from "./app.js";
import Today from "./today.js";

export default class Days {
    #api = '2d96a45db884057ffb45802af7c3a2e3';
    constructor() {
        this.today = new Today;
        this.wrap = document.querySelector('.wrapper');
        this.current_city = this.today.current_city;
    }

    get_city() {
        if (this.city.value === '') {
            this.current_city = this.today.current_city;
        } else {
            this.current_city = this.city.value;
        }
    }

    get_city_info() {
        this.get_city();
        let url = `http://api.openweathermap.org/geo/1.0/direct?q=${this.current_city}&limit=1&appid=${this.#api}`
        fetch(url)
            .then(response => response.json())
            .then(response => {
                this.get_weather_days(response[0].lat, response[0].lon);
            })
            .catch(()=>{this.today.get_404()});
    }

    get_weather_days(lat,lon) {
        this.days6.innerHTML = '';
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&lang=ua&units=metric&appid=${this.#api}`
        fetch(url)
            .then(response => response.json())
            .then(response => {
                for(let i = 0; i < 39; i = i+8) {
                    let info = {
                        'temp': +response.list[i].main.temp.toFixed(0),
                        'feels': +response.list[i].main.feels_like.toFixed(0),
                        'description': response.list[i].weather[0].description,
                        'wind': Math.ceil(response.list[i].wind.speed),
                        'temp_min': +response.list[i].main.temp_min.toFixed(0),
                        'temp_max': +response.list[i].main.temp_max.toFixed(0),
                        'id': +response.list[i].weather[0].id,
                        'humidity': response.list[i].main.humidity,
                        'probability': response.list[i].pop,
                        'date': response.list[i].dt_txt
                    };
                    this.set_days6(info, i);
                }
                this.temp_obj = response.list;
                this.set_info_for_day_of_week(0);
                this.days6.children[0].style.backgroundColor = '#1B1F29';
                this.mobile_version();
            })
    }

    get_day_of_week(obj) {
        let date = new Date(obj)
        let week = {
            6: 'Неділя',
            0: 'Понеділок',
            1: 'Вівторок',
            2: 'Середа',
            3: 'Четвер',
            4: 'П’ятниця',
            5: 'Субота'
        }
        return week[date.getDay()];
    }

    set_info_for_day_of_week(id) {
        this.time_day.innerHTML = '<th class="day_of_week">Понеділок</th>';
        this.weather_img.innerHTML = '<th></th>';
        this.description_weather.innerHTML = '<th>Погода</th>';
        this.temperature.innerHTML = '<th>Температура</th>';
        this.feels_like_temp.innerHTML = '<th>Відчувається</th>';
        this.wind_weather.innerHTML = '<th>Вітер м/сек</th>';
        this.date_day.textContent = new Date(`${this.temp_obj[id].dt_txt}`).toLocaleDateString('en-GB').replace(/\//g, '.');
        for(let i = 0; i <= 6; i++) {
            id++
            this.time_day.insertAdjacentHTML('beforeend', `<td><p>${this.temp_obj[id].dt_txt.split(' ')[1].slice(0, 5)}</p></td>`);
            this.weather_img.insertAdjacentHTML('beforeend', `<td><img src="./img/weather/${this.today.image[this.temp_obj[id].weather[0].id]}" alt=""></td>`);
            this.description_weather.insertAdjacentHTML('beforeend', `<td>${this.temp_obj[id].weather[0].description}</td>`);
            this.temperature.insertAdjacentHTML('beforeend', `<td>${this.temp_obj[id].main.temp.toFixed(0)}°</td>`);
            this.feels_like_temp.insertAdjacentHTML('beforeend', `<td>${this.temp_obj[id].main.feels_like.toFixed(0)}°</td>`);
            this.wind_weather.insertAdjacentHTML('beforeend', `<td><img src="./img/short_right.svg" alt="" style="transform: rotate(${this.temp_obj[id].wind.deg-90}deg)"> ${this.temp_obj[id].wind.speed.toFixed(1)}</td>`);
        }
    }

    set_days6(obj, i) {
        const [year, month, day] = obj.date.split(' ')[0].split('-');
        const date = `${day}.${month}`;
        let str = `
        <div class="day_week" id="${i}">
            <div class="name">${this.get_day_of_week(obj.date)}</div>
                <img src="/result/img/weather/${this.today.image[`${obj.id}`]}" alt="">
            <div class="weather">${obj.description}</div>
            <div class="degrees">
                <p class="today_date">${date}</p>
                <p class="deg">${obj.temp_min}° ${obj.temp_min}°</p>
            </div>
        </div>
        `
        this.days6.insertAdjacentHTML('beforeend', str);
    }

    click_info_for_day_of_week(e) {
        if(e.target.classList.contains('day_week')) {
            for(let i = 0; i <= this.days6.children.length-1; i++) {
                this.days6.children[i].style.backgroundColor = null;
            }
            e.target.style.backgroundColor = '#1B1F29';
            if(window.outerWidth < 431) {
                this.mobile_day_click(e.target.id);
                this.mobile_date(`${e.target.children[0].textContent}: ${this.temp_obj[e.target.id].dt_txt.split(' ')[0].split('-').slice(1, 3).reverse().join('.')}`);
            } else if(window.outerWidth > 430) {
                this.set_info_for_day_of_week(e.target.id);
                this.time_day.children[0].textContent = e.target.children[0].textContent;
            }
        } else if(e.target.localName === 'img') {
            for(let i = 0; i <= this.days6.children.length-1; i++) {
                this.days6.children[i].style.backgroundColor = null;
            }
            e.target.parentElement.style.backgroundColor = '#1B1F29';
            if(window.outerWidth < 431) {
                this.mobile_day_click(e.target.parentElement.id);
                this.mobile_date(`${e.target.parentElement.children[0].textContent}: ${this.temp_obj[e.target.parentElement.id].dt_txt.split(' ')[0].split('-').slice(1, 3).reverse().join('.')}`);
            } else if(window.outerWidth > 430) {
                this.set_info_for_day_of_week(e.target.parentElement.id);
                this.time_day.children[0].textContent = e.target.parentElement.children[0].textContent;
            }
        }
    }

    mobile_day_click(id) {
        this.day_click_mobile.innerHTML = '';
        for(let i = 0; i <= 6; i++) {
            id++
            let str = 
            `
            <div class="hour_element">
                <p class="hour_description">${this.temp_obj[id].weather[0].description}</p>
                <p class="hour_time">${this.temp_obj[id].dt_txt.split(' ')[1].slice(0, 5)}</p>
                <img src="/result/img/weather/${this.today.image[`${this.temp_obj[id].weather[0].id}`]}" alt="">
                <div class="hour_min_max">
                    <p class="_hour_min">${this.temp_obj[id].main.temp_min.toFixed(0)}°</p>
                    <p class="_hour_max">${this.temp_obj[id].main.temp_max.toFixed(0)}°</p>
                </div>
            </div>
            `
            this.day_click_mobile.insertAdjacentHTML('beforeend', str);
        }
    }

    mobile_date(date) {
        let str = `
        <p>${date}</p>
        <img src="./img/calendar.svg" alt="">
                  `
        this.statements.innerHTML = str;
    }

    mobile_version() {
        if (window.outerWidth < 431) {
            this.mobile_day_click(0);
            this.statements.children[0].textContent = `Понедiлок: ${this.temp_obj[0].dt_txt.split(' ')[0].split('-').slice(1, 3).reverse().join('.')}`;
        } else if (window.outerWidth > 430) {
            this.desktop();
        }
    }

    desktop() {
        this.statements.style.display = 'none';
        this.day_click_mobile.style.display = 'none';
    }

    init_html() {
        let str = `
        <div class="search">
            <div class="area">
                <img src="/result/img/search.png" alt="">
                <input type="text" placeholder="${this.today.current_city}">
                <img src="/result/img/location_outline.png" alt="">
            </div>
            <div class="logo">
                <img src="./img/logo_search.png" alt="">
            </div>
        </div>

        <div class="days6"></div>

        <div class="day_click">
            <table>
                <tr>
                    <th class="date_day"></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th><img src="./img/calendar.svg" alt=""></th>
                </tr>
                <tr class="time_day">
                    <th class="day_of_week"></th>
                </tr>
                <tr class="weather_img">
                    <th></th>
                </tr>
                <tr class="left_info description_weather">
                    <th>Погода</th>
                </tr>
                <tr class="left_info temperature">
                    <th>Температура</th>
                </tr>
                <tr class="left_info feels_like_temp">
                    <th>Відчувається</th>
                </tr>
                <tr class="left_info wind_weather">
                    <th>Вітер м/сек</th>
                </tr>
            </table>
        </div>

        <div class="statements">
            <p></p>
            <img src="./img/calendar.svg" alt="">
        </div>

        <div class="day_click_mobile"></div>
        `;
        this.wrap.classList.replace('wrapper', 'wrapper2');
        this.wrap.innerHTML = str;

        this.days6 = document.querySelector('.days6');
        this.city = document.querySelector('.search .area input');
        this.statements = document.querySelector('.statements');
        this.day_click_mobile = document.querySelector('.day_click_mobile');

        this.time_day = document.querySelector('.day_click .time_day');
        this.date_day = document.querySelector('.day_click .date_day');
        this.weather_img = document.querySelector('.day_click .weather_img');
        this.description_weather = document.querySelector('.day_click .description_weather');
        this.temperature = document.querySelector('.day_click .temperature');
        this.feels_like_temp = document.querySelector('.day_click .feels_like_temp');
        this.wind_weather = document.querySelector('.day_click .wind_weather');

        this.city.addEventListener('change', this.get_city_info.bind(this));
        this.days6.addEventListener('click', this.click_info_for_day_of_week.bind(this));
    }

    init() {
        new Weather().click_days();
    }
}