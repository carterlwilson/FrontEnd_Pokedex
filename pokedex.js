var pokedex = document.getElementById("pokedex");
var P = new Pokedex.Pokedex();
var Poke_cache = [];
var maximum = 1;

var display20Poke = () => {
  getAllPokemons(maximum);
  maximum += 200;
  console.log(maximum);
};

var getAllPokemons = input => {
  for (let i = input; i < input + 200 && i <= 807; ++i) {
    P.getPokemonByName(i) // with Promise
      .then(function(response) {
        const Pokemon = {
          id: response.id,
          name: response.name.replace("-", " "),
          default: response.sprites["front_default"],
          shiny: response.sprites["front_shiny"],
          display: response.sprites["front_default"],
          type: response.types.map(type => type.type.name).join(","),
          height: response.height,
          weight: response.weight,
          ability: response.abilities
            .map(ability => ability.ability.name)
            .join(","),
          speed: response.stats[0].base_stat,
          special_defense: response.stats[1].base_stat,
          special_attack: response.stats[2].base_stat,
          defense: response.stats[3].base_stat,
          attack: response.stats[4].base_stat,
          hp: response.stats[5].base_stat,
          species: response.species.name,
          moves: response.moves
        };
        displayPokemon(Pokemon);
      });
  }
};

var displayPokemon = Pokemon => {
  var pokemonHTMLString = `
    <div class="flip-card">
      <div class="card-front">
        <p class="card-title" onclick ="getinfo(${Pokemon.id})" >${Pokemon.name} </p>
        <img class="card-image default" src="${Pokemon.display}">
      </div>
      <div class="card-back">
        <div class="img-row">
          <img class="card-image " src="${Pokemon.default}">
          <img class="card-image " src="${Pokemon.shiny}"/>
        </div>
        <div class="audio-buttons">
          <img id="volume_logo" src="../FrontEnd_Pokedex/resources/volume-high.svg" onclick="playaudio(${Pokemon.id})">
          <audio id="audio${Pokemon.id}" src="../FrontEnd_Pokedex/sound/${Pokemon.id}.wav" ></audio>
        </div> 
        <div class="section-title">Info</div>
        <table class="info">
          <tr>
            <td>Height</td>
            <td>${Pokemon.height}</td>
          </tr>
          <tr>
            <td>Weight</td>
            <td>${Pokemon.weight}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>${Pokemon.type}</td>
          </tr>
          <tr>
            <td>Ability</td>
            <td>${Pokemon.ability}</td>
          </tr>
        </table>
        <div class="section-title">Stats</div>
        <div class="stat-bars">
          <div class="bar-label">HP</div>
          <div class="bar" style="--bar-value:${(Pokemon.hp/200) * 100}%;">${Pokemon.hp}</div>
          <div class="bar-label">Attack</div>
          <div class="bar" style="--bar-value:${(Pokemon.attack/200) * 100}%;">${Pokemon.attack}</div>
          <div class="bar-label">Defense</div>
          <div class="bar" style="--bar-value:${(Pokemon.defense/200) * 100}%;">${Pokemon.defense}</div>
          <div class="bar-label">Speed</div>
          <div class="bar" style="--bar-value:${(Pokemon.speed/200) * 100}%;">${Pokemon.speed}</div>
          <div class="bar-label">Special Attack</div>
          <div class="bar" style="--bar-value:${(Pokemon.special_attack/200) * 100}%;">${Pokemon.special_attack}</div>
          <div class="bar-label">Special Defense</div>
          <div class="bar" style="--bar-value:${(Pokemon.special_defense/200) * 100}%;">${Pokemon.special_defense}</div>
        </div>
        <div class="section-title">Other Forms</div>
        <div id = "extra-info${Pokemon.id}" class="extra-info"></div>
        <div class="section-title">Moves</div>
        <div id="move-info${Pokemon.id}" class="move-info"></div>
      </div>
    </div>
    `;
  pokedex.insertAdjacentHTML("beforeend", pokemonHTMLString);
  var moves = Pokemon.moves;

  //Getting additional form
  P.getPokemonSpeciesByName(Pokemon.species) // with Promise
    .then(function(response) {
      const PokemonSpecies = {
        varieties: response.varieties
      };
      for (var k = 0; k < PokemonSpecies.varieties.length; k++) {
        if (k > 0) {
          P.getPokemonByName(PokemonSpecies.varieties[k].pokemon.name).then(
            function(response) {
              const PokemonVariety = {
                sprite: response.sprites.front_default,
                name: response.name.replace("-", " ")
              };
              var VarietyHTMLString = `
                <div class="variety">
                  <p id="variety-name" class="variety-name"> 
                    ${PokemonVariety.name}
                  </p>
                  <img id="variety-pic class="variety-pic" src ="${PokemonVariety.sprite}"> 
                </div>
                `;
              var variety_display = document.getElementById(
                "extra-info" + Pokemon.id
              );
              variety_display.insertAdjacentHTML(
                "beforeend",
                VarietyHTMLString
              );
            }
          );
        }
      }
    });

    for (var i = 0; i < moves.length; ++i) {
      var movesElement = document.getElementById("move-info" + Pokemon.id);
      var MoveHTMLString = `
        <p>${moves[i].move.name.replace("-"," ")}</p>
      `;
      movesElement.insertAdjacentHTML("beforeend", MoveHTMLString);
    }

  //Getting additional moves
//   for (var m = 0; m < Pokemon.moves.length; m++) {
//     P.getMoveByName(Pokemon.moves[m].move.name).then(function(response) {
//       const Move = {
//         name: response.name.replace("-", " "),
//         power: response.power,
//         accuracy: response.accuracy,
//         pp: response.pp,
//         type: response.damage_class.name,
//         damage_type: response.type.name,
//         effect: response.effect_entries[0].effect,
//         effect_chance: response.effect_chance,
//         description: response.flavor_text_entries[2].flavor_text
//       };
//       if (Move.power == null) {
//         Move.power = 0;
//       }
//       if (Move.accuracy == null) {
//         Move.power = 0;
//       }
//       Move.damage_type_icon = "resources/" + Move.damage_type + ".png";
//       Move.effect = Move.effect.replace("$effect_chance", Move.effect_chance);
//       var move_display = document.getElementById("extra-info" + Pokemon.id);
//       var MoveHTMLString = `
//       <div id ="move-card" class="card" >
//           <h2 class="card-title"  >${Move.name} </h2>
//           <p>Power: ${Move.power}</p>
//           <p>Accuracy: ${Move.accuracy}</p>
//           <p>PP: ${Move.pp}</p>
//           <p>Type: ${Move.type}</p>
//           <p>Damage Type: ${Move.damage_type} <img class ="damage_type_icon" src="${Move.damage_type_icon}"> </p>
//       </div>
//       `;
//       move_display.insertAdjacentHTML("beforeend", MoveHTMLString);
//     });
//   }
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
  var list_element = document.getElementsByClassName("flip-card");

  for (var i = 0; i < list_element.length; ++i) {
    a = list_element[i].getElementsByClassName("card-title")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(input) > -1) {
      list_element[i].style.display = "";
    } else {
      list_element[i].style.display = "none";
    }
  }
};

//PopUp Feature
var getinfo = id => {
  if (!Poke_cache[id]) {
    P.getPokemonByName(id) // with Promise
      .then(function(response) {
        //console.log(response);
        var Pokemon = {
          id: response.id,
          name: response.name,
          default: response.sprites["front_default"],
          shiny: response.sprites["front_shiny"],
          back_default: response.sprites["back_default"],
          back_shiny: response.sprites["back_shiny"],
          display: response.sprites["front_default"],
          type: response.types.map(type => type.type.name).join(","),
          height: response.height,
          weight: response.weight,
          ability: response.abilities
            .map(ability => ability.ability.name)
            .join(","),
          speed: response.stats[0].base_stat,
          special_defense: response.stats[1].base_stat,
          special_attack: response.stats[2].base_stat,
          defense: response.stats[3].base_stat,
          attack: response.stats[4].base_stat,
          hp: response.stats[5].base_stat
        };
        Poke_cache[id] = Pokemon;
        PopUpInfo(Pokemon);
      });
  } else {
    PopUpInfo(Poke_cache[id]);
  }
};

var PopUpInfo = Pokemon => {
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
  pokedex.insertAdjacentHTML("beforeend", pokemonHTMLString);
};

var Close = () => {
  var remove = document.querySelector(".popup");
  remove.parentElement.removeChild(remove);
};

//getAllPokemons();
display20Poke();
