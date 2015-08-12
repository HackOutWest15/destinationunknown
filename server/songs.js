getCity = function(cityName) {
  if (Cities.find({name: cityName}).count() != 0) {
    var city = Cities.findOne({name: cityName});
    var todaysDate = new Date();
    var updatedDate = new Date(city.updatedDate);
    if(updatedDate.setHours(0,0,0,0) == todaysDate.setHours(0,0,0,0)) {
      return city;
    } else {
      var newCity = updateCity(cityName);
      Cities.update(city._id, newCity);
      console.log("Updated city: " + cityName);
      return newCity;
    }
  } else {
    var newCity = updateCity(cityName);
    Cities.insert(newCity);    
    console.log("Inserted city: " + cityName);
    return newCity;
  }
}

function updateCity(cityName) {
  var artists = getArtistsForCity(cityName);
  var test = sortedArtists(artists);
  test = appendSongDataToArtists(test);
  var text = getTextsForCity(cityName);
  return {name: cityName, artists: test, texts:text, updatedDate: new Date()};
}

function getTextsForCity(cityName) {
  var result = Meteor.http.call("GET", "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+cityName+"");
  var jsonContent = JSON.parse(result.content);
  var keys = Object.keys(jsonContent);
  var pages = jsonContent.query.pages;
  var mypage = pages[Object.keys(pages)[0]];
  var extract = mypage.extract
  var replaced = replaceAll(cityName, "X", extract);

  var list = replaced.split(/[\n.]+/).slice(0,8).reverse();
  list.unshift("", "");  

  console.log(list);
  console.log(list.length);

  return list;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

// Returns a list of Artists (id, name) that belong to the specified city
// ( [{name, id},{name, id} ...] )
function getArtistsForCity(city) {
  var result = Meteor.http.call("GET", "http://developer.echonest.com/api/v4/artist/search?api_key=" + api_key + "&format=json&artist_location="+city+"&results=10&bucket=id:spotify&bucket=familiarity");
  return result.data.response.artists;
}

function appendSongDataToArtists(artists)
{
  for(i = 0; i < artists.length ; i++)
  {
      var spotifyId = artists[i].foreign_ids[0].foreign_id.split(":")[2];
      artists[i].songs = getSongsForSpotifyArtistId(spotifyId);
  }
  return artists;
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
