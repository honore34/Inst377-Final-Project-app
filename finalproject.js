//home page 

if(document.getElementById('quote')){
    fetch('https://api.animechan.io/v1/quotes/random')
        .then(results =>results.json())
        .then(data =>{ 
            const quote = data.data.content;
            const anime = data.data.anime.name;
            const character = data.data.character.name;

            document.getElementById('quote').innerHTML =
            `
            "${quote}"
            <hr style ="width: 20px">
            <strong>${character} from ${anime} Anime</strong>
            `
        }) 

        .catch(error =>{
            document.getElementById('quote').innerHTML =
            `Failed to load to many requests`
        });

}

let chart;

if (document.getElementById('Chart')){
    document.getElementById('chart-container').style.display ='none';

    window.lookupAnime = async function (){

        const limit = document.getElementById('limit').value;

        const searchAPI = await fetch(`https://api.jikan.moe/v4/top/anime?limit=${limit}`);

        const animeData = await searchAPI.json();

        const labels = [];

        const ratings = [];

        animeData.data.forEach(anime =>{
            labels.push(anime.title);

            ratings.push(anime.score.toFixed(2));
        });
        if(chart){
            chart.destroy();
        }

        chart = new Chart(document.getElementById('Chart'),{
            type: 'line',

            data: {
                labels: labels,

                datasets: [{
                    label: `Top ${limit} Animes`,
                    data: ratings
                }]
            },
              
        });
        document.getElementById('chart-container').style.display = 'block';
    };

}

// slide show 

if(document.getElementById('animeImage')){

    fetch('https://api.jikan.moe/v4/top/anime?limit=25')
    .then(results => results.json())
    .then(data =>{
        const imgcontainer = document.getElementById('animeImage');

        const randomIMG = data.data.sort(() => Math.random()-0.5)

        randomIMG.slice(0,10).forEach(animeImg => {
            imgcontainer.innerHTML +=`
            <div class="swiper-slide">
                <img src="${animeImg.images.jpg.image_url}">
            </div>
            `;
        });
        new Swiper('.slideshow', {
            navigation:{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
        pagination:{
                el:'.swiper-pagination',
                clickable: true
            }
        });
    });

}


// anime find match 
if(document.getElementById('genre')){

    async function loadGenre(){
        const genreOption = document.getElementById('genre');

            const animeAPI = await fetch('https://api.jikan.moe/v4/top/anime?limit=50');

            const animeData = await animeAPI.json();
            const genreCount = {};

            animeData.data.forEach(anime =>{

                anime.genres.forEach(genre => {

                    if(!genreCount[genre.name]){
                        genreCount[genre.name]=0;
                    }
                    genreCount[genre.name]++;
                });
            });

            Object.keys(genreCount).forEach(gName => {
                if(genreCount[gName]>=3){
                    genreOption.innerHTML +=` 
                    <option value="${gName}">${gName}</option>`;
                }
            });
    }
    loadGenre();
}
    


if(document.getElementById('animeResults')){

    window.findAnime = async function(){

        const genre = document.getElementById('genre').value;

        const episodeslength = document.getElementById('episodeLength').value;

        const dataAPI = await fetch('https://api.jikan.moe/v4/top/anime?limit=20')

        const data = await dataAPI.json();

        const container = document.getElementById('animeResults');

        container.innerHTML ='';

        const matches = data.data.filter(anime => {

        const matchGenre = anime.genres.some( g => g.name === genre);

        const matchDuration = anime.duration.includes(episodeslength);
        return matchGenre && matchDuration;

        });

       const randomList = matches.sort(()=> Math.random()-.5);

        randomList.slice(0,3).forEach(anime => {

            container.innerHTML +=`
            <div class = "animeFound">
                <img src="${anime.images.jpg.image_url}">
                <h3>${anime.title}</h3>
                <p> Episodes : ${anime.episodes}</p>
                <p> Episodes Duration : ${anime.duration}</p>
                <p> Overall Rating : ${anime.score}</p>
                <p> Short background : ${anime.background}</p>
            </div>`;

        });
    };

}

