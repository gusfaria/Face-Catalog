
var linkedin_app = (function(){
  var searchClick = function(fName, lName) {
// if (!IN.ENV.auth.oauth_token) {
//   alert("You must login w/ LinkedIn to use the Search functionality!");
//   return;
// }

    IN.API.PeopleSearch()
        .fields( "id", "firstName", "lastName", "positions", "pictureUrl")
        .params({
          "first-name": fName,
          "last-name": lName,
          "picture-url": "",
        })
        .result(function(result, metadata) {
          setSearchResults(result, metadata);
        });
  };

  function setSearchResults(result, metadata) {
    var members = result.people.values;
    searchHTML = "Search Results (" + result.numResults + "):<ul>";
    console.log('length', members.length);
    console.log('Members', members);

    if(members.length <= 10){
      if(members[0].positions != 0){
        user_profession = members[0].positions.values[0].title;
        person['profession'] = user_profession;
        console.log('Profession: ', user_profession);  
      } else {
        person['profession'] = null;
      }
      if (members[0].pictureUrl != undefined){
        user_picture = members[0].pictureUrl;
        person['picture'] = user_picture;
        console.log('picture url', user_picture);  
      }
    } else {
      person['picture'] = null; 
    }

    // for (i in members) {
    //   searchHTML = searchHTML + "<li>";
    //   searchHTML = searchHTML + members[i].firstName + " ";
    //   searchHTML = searchHTML + members[i].lastName + " ";
    //   searchHTML = searchHTML + " (Image: " + members[i].pictureUrl + ")";

    //   //profession // picture url HERE!!!! 

    //   searchHTML = searchHTML  + "</li>";
    // }
    // searchHTML = searchHTML + "</ul>";
    
    // document.getElementById("searchresults").innerHTML = searchHTML;
    return person;
  };

  return {
   "searchClick" : searchClick,
   "setSearchResults" : setSearchResults 
  }

})();



