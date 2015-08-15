getCity = function(cityData) {
  var cityName = cityData.cityName;
  if (Cities.find({name: cityName}).count() != 0) {
    var city = Cities.findOne({name: cityName});
    var todaysDate = new Date();
    var updatedDate = new Date(city.updatedDate);
    if(updatedDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
      return city;
    } else {
      var newCity = updateCity(cityData);
      Cities.update(city._id, newCity);
      console.log("Updated city: " + cityName);
      return newCity;
    }
  } else {
    var newCity = updateCity(cityData);
    Cities.insert(newCity);    
    console.log("Inserted city: " + cityName);
    return newCity;
  }
}

function updateCity(cityData) {
  var cityName = cityData.cityName;
  var artists = getArtistsForCity(cityName);
  var test = sortedArtists(artists);
  test = appendSongDataToArtists(test);
  var text = getTextsForCity(cityData);
  return {name: cityName, artists: test, texts:text, updatedDate: new Date()};
}

function getTextsForCity(cityData) {
  var wikiName = cityData.wikiName;
  var cityName = cityData.cityName;
  var wikiCall = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+wikiName;
  console.log("Calling: " + wikiCall);
  var result = Meteor.http.call("GET", wikiCall);
  var jsonContent = JSON.parse(result.content);
  var keys = Object.keys(jsonContent);
  var pages = jsonContent.query.pages;
  var mypage = pages[Object.keys(pages)[0]];
  var extract = mypage.extract
  extract = replaceAll("U.S.", "U.S", extract);
  extract = replaceAll("St.", "St", extract);
  extract = replaceAll("Mt.", "Mt", extract);
  var replaced = replaceAll(cityName.split("+")[0], "X", extract);
  var replaced = replaceAll(wikiName, "X", replaced);

  var list = replaced.split(/\n|(\. )/).filter(function(e) {
    return e != ". " && e != "\n";
  }).slice(0,8).reverse();
  
  while(list.length < 10) {
    list.unshift("");
  }  

  return list;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// Returns a list of Artists (id, name) that belong to the specified city
// ( [{name, id},{name, id} ...] )
function getArtistsForCity(city) {
  var call = "http://developer.echonest.com/api/v4/artist/search?api_key=" + api_key + "&format=json&artist_location="+city+"&results=20&bucket=id:spotify&bucket=familiarity";
  console.log("Calling: " + call);
  var result = Meteor.http.call("GET", call);
  return result.data.response.artists;
}

function appendSongDataToArtists(artists)
{
  var returnArtists = [];
  for(i = 0; i < artists.length ; i++)
  {
      var spotifyId = artists[i].foreign_ids[0].foreign_id.split(":")[2];
      artists[i].songs = getSongsForSpotifyArtistId(spotifyId);
      if(artists[i].songs && artists[i].songs.length > 0) {
        returnArtists.push(artists[i]);
      }
  }
  return returnArtists.slice(Math.max(returnArtists.length - 10, 1))
}

// This gets the most popular tracks for a given artist. The retun data contains everything spotify knows about the track.
// Assumption: 'Most popular' is defined as most popular in sweden.
function getSongsForSpotifyArtistId(artistId)
{  
  var result = Meteor.http.call("GET", "https://api.spotify.com/v1/artists/"+artistId+"/top-tracks?country=SE");  
  return result.data.tracks;
}

function sortedArtists(artists) {
    artists.sort(function(a, b) {
      return a.familiarity - b.familiarity;
    });
  return artists;
}
