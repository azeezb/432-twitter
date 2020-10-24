var script_tag = document.getElementById('gg2');
var redirectUrl2 = script_tag.getAttribute("redirectUrl2");




var obj = JSON.parse(redirectUrl2)


const fetchDescription = (event) => {
  
  const title = event.target.textContent;
  var selection = 12;

  for (let i = 0; i < 12; i++) {

    const titlecheck = (obj[i].title + " (" + obj[i].year + ")")
    
    if (JSON.stringify(titlecheck.trim()) == JSON.stringify(title.trim())) {
      selection = i
    }
  }


  fetch(`/apiimdb/description/${obj[selection].imdb_id}`)
    .then((res) => res.json())
    .then((data) => {
      const parent = event.target.parentElement;

      if (selection > 11) {
        boot.innerHTML = "<h1>About the movie!<br><\h1><h2>" + "Strange :/ Seems like there's no info here. Try another!";
      } 

      if (data.rsp2.description != "nothing"){

        shoe.innerHTML = "<h2>Starring: " + data.rsp2.stars[0] +", "+ data.rsp2.stars[1] +" and " + data.rsp2.stars[2] + "!<\h2><div style=\"max-width:900px;font-size:40px;font-family:'Lato',sans-serif;\"><br>About " + obj[selection].title + ":<br>" + "</div>";
        boot.innerHTML = "<br>" + "<div style=\"max-width:900px;font-size:28px;font-family:'Lato',sans-serif;\">" + data.rsp2.description + "</div>";

      } else if (data.rsp2.description = "nothing") {
        parent.append("\naint nuthin here")
      }


    })
    .catch((error) => console.log(error));
};

// Add an event listener to each button
const Titles2 = document.getElementsByClassName("Title");


for (let title of Titles2) {
  title.addEventListener("click", (event) => fetchDescription(event));
}













