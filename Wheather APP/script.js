var label = document.getElementById("cityname");
const error = document.getElementById("error");
const hide = document.getElementById("esconder");
const forecastContainer = document.getElementById("forecast"); // container da previsão

function buscarCidade() {
    var nomecidade = label.value;

    // -------- CLIMA ATUAL --------
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${nomecidade}&units=metric&appid=cd53305bcf3e5dbd40595af17d20f7a0&lang=pt_br`,
        function (data) {
            if (data.cod === "404") { }
            else {
                preencherCidade(data);
                buscarPrevisao(nomecidade); // ← chama a previsão
            }
        }
    )
    .fail(function () {
        error.classList.remove("hide");
        hide.classList.add("hide");
    });
}

// -------- PREVISÃO DO TEMPO --------
function buscarPrevisao(cidade) {
    $.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&units=metric&appid=cd53305bcf3e5dbd40595af17d20f7a0&lang=pt_br`,
        function (data) {
            preencherPrevisao(data);
        }
    );
}

// PREENCHE CLIMA ATUAL
function preencherCidade(data) {
    const city = document.getElementById("city");
    const temp = document.getElementById("temp");
    const img = document.getElementById("main-img");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");

    hide.classList.remove("hide");
    error.classList.add("hide");

    city.innerText = data.name;
    temp.innerText = `${parseInt(data.main.temp)}°C`;

    let clima = data.weather[0].main;
    const icons = {
        Clouds: "clouds",
        Clear: "clear",
        Drizzle: "drizzle",
        Rain: "rain",
        Mist: "mist",
        Snow: "snow"
    };

    img.setAttribute("src", `images/${icons[clima] || "clouds"}.png`);

    humidity.innerText = `${data.main.humidity}%`
    wind.innerText = `${data.wind.speed} km/h`
}

// ----------- PREVISÃO HTML -----------
function preencherPrevisao(data) {
    forecastContainer.innerHTML = ""; // limpar antes

    // pegar 1 previsão por dia (12:00)
    const previsoes = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    previsoes.forEach(item => {
        let date = new Date(item.dt_txt);
        let dia = date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric" });

        let icon = item.weather[0].main;
        const icons = {
            Clouds: "clouds",
            Clear: "clear",
            Drizzle: "drizzle",
            Rain: "rain",
            Mist: "mist",
            Snow: "snow"
        };

        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <p>${dia}</p>
                <img src="images/${icons[icon]}.png">
                <span>${parseInt(item.main.temp)}°C</span>
            </div>
        `;
    });
}

label.addEventListener("keyup", (e) => {
    if (e.code === "Enter") {
        buscarCidade();
    }
});
