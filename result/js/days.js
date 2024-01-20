import Weather from "./app.js";
import Today from "./today.js";

export default class Days {
    #api = '2d96a45db884057ffb45802af7c3a2e3';
    constructor() {
        this.today = new Today;
        this.wrap = document.querySelector('.wrapper');
        this.current_city = 'Кременчук';
    }

    get_city() {
        if (this.city.value === '') {
            this.current_city = this.city.placeholder;
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
                    this.set_days6(info);
                }
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

    set_days6(obj) {
        const [year, month, day] = obj.date.split(' ')[0].split('-');
        const date = `${day}.${month}`;
        let str = `
        <div class="day_week">
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

    init_html() {
        let str = `
        <div class="search">
            <div class="area">
                <img src="/result/img/search.png" alt="">
                <input type="text" placeholder="Кременчук">
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
                    <th>20.01.2024</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th><img src="./img/calendar.svg" alt=""></th>
                </tr>
                <tr>
                    <th>Вівторок</th>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                    <td><p>6:00</p></td>
                </tr>
                <tr>
                    <th></th>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                    <td>
                        <img src="./img/weather/01d.svg" alt="">
                    </td>
                </tr>
                <tr class="left_info">
                    <th>Погода</th>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                    <td>Хмарно</td>
                </tr>
                <tr class="left_info">
                    <th>Температура</th>
                    <td>09°</td>
                    <td>09°</td>
                    <td>09°</td>
                    <td>09°</td>
                    <td>09°</td>
                    <td>09°</td>
                    <td>09°</td>
                </tr>
                <tr class="left_info">
                    <th>Відчувається</th>
                    <td>10°</td>
                    <td>10°</td>
                    <td>10°</td>
                    <td>10°</td>
                    <td>10°</td>
                    <td>10°</td>
                    <td>10°</td>
                </tr>
                <tr class="left_info">
                    <th>Вітер м/сек</th>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                    <td><img src="./img/short_right.svg" alt="">2.0</td>
                </tr>
            </table>
        </div>
        `;
        this.wrap.classList.replace('wrapper', 'wrapper2');
        this.wrap.innerHTML = str;
        this.days6 = document.querySelector('.days6');
        this.city = document.querySelector('.search .area input');
        this.city.addEventListener('change', this.get_city_info.bind(this));
    }

    init() {
        new Weather().click_days();
    }
}