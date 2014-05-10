
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
          metadata = metadata === undefined ? '' : metadata; 
          setSearchResults(result, metadata);
        });
  };

  function setSearchResults(result, metadata) {
    var members = result.people.values || [];
    searchHTML = "Search Results (" + result.numResults + "):<ul>";
    // console.log('length', members.length);
    // console.log('member 0: ', members[0]);
    // console.log('Members', members);
    // debugger;
    if(members != null || members != [] || members[0] !== undefined || members[0] !== null) {
      if(members[0].positions !== undefined || members.length <= 10){
        var user_profession; 
        if(members[0].positions !== 0){
          user_profession = members[0].positions.values[0].title; 
          person['profession'] = user_profession;
          person['profession_confidence'] = 1 / members.length;  
          // console.log('user profession: ', user_profession);
        }
        var user_pictureUrl; 
        if (members[0].pictureUrl !== undefined){
          user_picture = members[0].pictureUrl;
          person['picture'] = user_picture;
          // console.log('picture url', user_picture);  
        }
        
        hasLinkedin = true;
        console.log('hasLinkedin: ', hasLinkedin);
        checkData();
        return person;
        // if(hasLinkedin === true && hasBetaface === true){
        //   fortune_generator();
        // }
      } else {
        hasLinkedin = true;
        checkData();
        return person;
        
      } 
    } else {
      hasLinkedin = true;
      console.log('2');
      checkData();
      console.log('else - if')
      return person;
    }



    return person;

  };

  return {
   "searchClick" : searchClick,
   "setSearchResults" : setSearchResults 
  }

})();



