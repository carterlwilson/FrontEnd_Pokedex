const pokedex = document.getElementById("pokedex");
const P = new Pokedex.Pokedex();
const Poke_cache =[];

var getAllPokemons = () => {
  for (let i = 1; i <= 807; ++i) {
    P.getPokemonByName(i) // with Promise
      .then(function(response) {
        //console.log(response);
        const Pokemon = {
          name: response.name,
          default: response.sprites["front_default"],
          shiny: response.sprites["front_shiny"],
          back_default: response.sprites["back_default"],
          back_shiny: response.sprites["back_shiny"],
          display: response.sprites["front_default"],
          type :response.types.map((type)=>type.type.name).join(','),
          height:response.height,
          weight:response.weight,
          ability:response.abilities.map((ability)=>ability.ability.name).join(','),
          speed:response.stats[0].base_stat,
          special_defense:response.stats[1].base_stat,
          special_attack:response.stats[2].base_stat,
          defense:response.stats[3].base_stat,
          attack:response.stats[4].base_stat,
          hp:response.stats[5].base_stat,
        };
        displayPokemon(Pokemon);
      });
  }
};

var displayPokemon = Pokemon => {
  var pokemonHTMLString = `
    <div class="card-flip">
      <div class="card-front">
        <img class="card-image default" src="${Pokemon.display}"  >
        <h2 class="card-title" onclick ="getinfo(${Pokemon.id})" >${Pokemon.name} </h2>
        <img id="volume_logo" src="/resources/volume-high.svg" onclick="playaudio(${Pokemon.id})">
        <audio id="audio${Pokemon.id}" src="../FrontEnd_Pokedex/sound/${Pokemon.id}.wav" ></audio>
      </div>

      <div class="card-back">
        <div class="img-row">
          <img class="card-image " src="${Pokemon.default}">
          <img class="card-image " src="${Pokemon.back_default}">
          <img class="card-image " src="${Pokemon.shiny}"/>
          <img class="card-image " src="${Pokemon.back_shiny}"/>
        </div>
        <h2 class="card-title"  >${Pokemon.name} </h2>
        <div class="info">
          <div class="info-column">
            <div class="info-label-column">
              <p>Height:</p>
              <p>Weight:</p>
              <p>Type:</p>
              <p>Abilities:</p>
              <p>Speed:</p>
              <p>Special Defense:</p>
            </div>
            <div class="info-data-column">
              <p>${Pokemon.height}</p>
              <p>${Pokemon.weight}</p>
              <p>${Pokemon.type}</p>
              <p>${Pokemon.ability}</p>
              <p>${Pokemon.speed}</p>
              <p>${Pokemon.special_defense}</p>
            </div>
          </div>
          <div class="info-column">
            <div class="info-label-column">
              <p>Special Attack:</p>
              <p>Defense:</p>
              <p>Attack:</p>
              <p>Hp:</p>
            </div>
            <div class="info-data-column">
              <p>${Pokemon.special_attack}</p>
              <p>${Pokemon.defense}</p>
              <p>${Pokemon.attack}</p>
              <p>${Pokemon.hp}</p>
            </div>
          </div>
        </div>
        <div class="audio-buttons">
          <img id="volume_logo" src="/resources/volume-high.svg" onclick="playaudio(${Pokemon.id})">
          <audio id="audio${Pokemon.id}" src="../FrontEnd_Pokedex/sound/${Pokemon.id}.wav" ></audio>
        </div> 
      </div>
    </div>
    `;
  pokedex.insertAdjacentHTML("beforeend", pokemonHTMLString);
};

var playaudio = id => {
  var audio = document.getElementById("audio" + id);
  audio.play();
};

//Search Feature
var Filter = () => {
  var input = document.getElementById("Input");
  input = input.value.toUpperCase();

  var list = document.getElementById("pokedex");
  var list_element = document.getElementsByClassName("card-flip");

  for (var i = 0; i < list_element.length; ++i) {
    a = list_element[i].getElementsByTagName("h2")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(input) > -1) {
      list_element[i].style.display = "";
    } else {
      list_element[i].style.display = "none";
    }
  }
};


//PopUp Feature
var getinfo =(id)=>
{
  if(!Poke_cache[id])
  {
    P.getPokemonByName(id) // with Promise
    .then(function(response) {
      //console.log(response);
      var Pokemon = {
        name: response.name,
        default: response.sprites["front_default"],
        shiny: response.sprites["front_shiny"],
        back_default: response.sprites["back_default"],
        back_shiny: response.sprites["back_shiny"],
        display: response.sprites["front_default"],
        type :response.types.map((type)=>type.type.name).join(','),
        height:response.height,
        weight:response.weight,
        ability:response.abilities.map((ability)=>ability.ability.name).join(','),
        speed:response.stats[0].base_stat,
        special_defense:response.stats[1].base_stat,
        special_attack:response.stats[2].base_stat,
        defense:response.stats[3].base_stat,
        attack:response.stats[4].base_stat,
        hp:response.stats[5].base_stat,
      };
      Poke_cache[id]= Pokemon;
      PopUpInfo(Pokemon);
  });
  }
  else{
    PopUpInfo(Poke_cache[id]);
  }
}

var PopUpInfo= (Pokemon)=>
{
  var pokemonHTMLString = `
  <div class ="popup" >
    <button id="CloseButton" onclick ="Close()">Close</button>
    <div class="card" >
        <div class="img-row">
          <img class="card-image " src="${Pokemon.default}">
          <img class="card-image " src="${Pokemon.back_default}">
          <img class="card-image " src="${Pokemon.shiny}"/>
          <img class="card-image " src="${Pokemon.back_shiny}"/>
        </div>
        <h2 class="card-title"  >${Pokemon.name} </h2>
        <p>Height: ${Pokemon.height}</p>
        <p>Weight: ${Pokemon.weight}</p>
        <p>Type: ${Pokemon.type}</p>
        <p>Abilities: ${Pokemon.ability}</p>
        <p>Speed: ${Pokemon.speed}</p>
        <p>Special Defense: ${Pokemon.special_defense}</p>
        <p>Special Attack: ${Pokemon.special_attack}</p>
        <p>Defense: ${Pokemon.defense}</p>
        <p>Attack: ${Pokemon.attack}</p>
        <p>Hp: ${Pokemon.hp}</p>
        <img id="volume_logo" src="/resources/volume-high.svg" onclick="playaudio(${Pokemon.id})">
        <audio id="audio${Pokemon.id}" src="../FrontEnd_Pokedex/sound/${Pokemon.id}.wav" ></audio>
    </div>
  </div>
    `;
  pokedex.innerHTML= pokemonHTMLString+pokedex.innerHTML;
}

var Close = ()=>{
   var remove = document.querySelector(".popup");
   remove.parentElement.removeChild(remove);
}





getAllPokemons();
