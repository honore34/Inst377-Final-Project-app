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

    fetch('https://api.jikan.moe/v4/genres/anime')
    .then(results => results.json())
    .then(data =>{ 

        const genreOption = document.getElementById('genre');

        data.data
        .filter(genre => genre.mal_id)
        .sort((a,b)=>b.count-a.count)
        .slice(0,10)
        .forEach(genre =>{

            genreOption.innerHTML +=`
            <option value="${genre.name}">${genre.name}</option>`;
            
            });
        });

}

if(document.getElementById('animeResults')){

    document.getElementById('animeResults').style.display ='none';

    window.findAnime = async function(){

        const genre = document.getElementById('genre').value;

        const episodeslength = document.getElementById('episodeLength').value;
        const genreFetch = await fetch('https://api.jikan.moe/v4/genres/anime')

        const genreData = await genreFetch.json();

        const foundG = genreData.data.find(g=>g.name===genre);
        
        const genreID = foundG.mal_id;
        const dataAPI = await fetch(`https://api.jikan.moe/v4/anime?genres=${genreID}&limit=25`)

        const data = await dataAPI.json();

        const container = document.getElementById('animeResults');

        container.innerHTML ='';

        const matches = data.data.filter(anime => {
        if(!anime.duration) return false;

        let durationEP;
        if(anime.duration.includes('hr')){
            durationEP = 60;
        }else {
        durationEP = parseInt(anime.duration);
        }
        let matchDuration = false;


        if( episodeslength === 'Short') {
            matchDuration = durationEP >= 5 && durationEP <= 20;
        }else if( episodeslength === 'Regular') {
            matchDuration = durationEP >= 20 && durationEP <= 30;
        }else if( episodeslength === 'Long') {
            matchDuration = durationEP >= 40 ;
        }
        return matchDuration;

        });

       const randomList = matches.sort(()=> Math.random()-.5);

       if(randomList.length === 0){
            container.innerHTML=`
            <div class = "animeFound">
            <h3>Match not Found.<h3>
            <p> Try a different genre or episode length.</p>
            </div>`;
            document.getElementById('animeResults').style.display = 'block';
            return;
       }

        randomList.slice(0,3).forEach(anime => {

            container.innerHTML +=`
            <div class = "animeFound">
                <img src="${anime.images.jpg.image_url}">
                <h3>${anime.title}</h3>
                <p> This show aired: ${anime.aired.string}</p>
                <p> Episodes : ${anime.episodes}</p>
                <p> Episodes Duration : ${anime.duration}</p>
                <p> Rated: ${anime.rating}</p>
                <p> Overall Score Rating : ${anime.score}</p>
                <p> Short Synopsis: ${anime.synopsis }</p>
                <p> If you want to explore more here is a link: 
                <a href ="${anime.url}" target="_blank"> View Anime</a></p>
                       
            </div>`;

        });
        document.getElementById('animeResults').style.display = 'block';
    };

}


// chatter page or community post page 

async function createNewPosts() {
  const response = await fetch(`/CommunityPost`, {
    method: 'POST',
    body: JSON.stringify({
      username: document.getElementById('Username').value,
      posted_comment: document.getElementById('postComment').value,
    }),
    headers: {
      'content-type': 'application/json',
    },
  });
   const data = await response.json();
   document.getElementById('Username').value ='';
   document.getElementById('postComment').value ='';

  await loadpostData();
}

async function loadpostData(){

    await fetch(`/CommunityPost`)
    .then((result)=> result.json())
    .then((resultjson)=>{

        const container = document.createElement('div');
        container.setAttribute('id','postContainer');

        resultjson.forEach((post)=>{
            const box = document.createElement('div');
            box.classList.add('postBox');

            const username = document.createElement('h3');
            username.innerHTML=post['username'];

            const commentPosted = document.createElement('p');
            commentPosted.innerHTML=post['posted_comment'];

            const likeButton = document.createElement('button');
            likeButton.innerHTML = `&#128077;${post.likes}`;

            likeButton.onclick = async ()=>{
                await fetch(`/CommunityPost/${post.id}/likes`,{
                    method:'PUT'
                });
                loadpostData();
            }

            const dislikeButton = document.createElement('button');
            dislikeButton.innerHTML = `&#128078;${post.dislikes}`;

            dislikeButton.onclick = async ()=>{
                await fetch(`/CommunityPost/${post.id}/dislikes`,{
                    method:'PUT'
                });
                loadpostData();
            }

            box.appendChild(username);
            box.appendChild(commentPosted);
            box.appendChild(likeButton);
            box.appendChild(dislikeButton);

            container.appendChild(box);
        });
        const preExisting = document.getElementById('postContainer');

        if (preExisting) {
        preExisting.remove();
      }

      document.getElementById('commentSection')
      .appendChild(container);
    });
}
loadpostData();
