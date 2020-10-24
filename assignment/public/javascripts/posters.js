var script_tag = document.getElementById('gg');
var redirectUrl = script_tag.getAttribute("redirectUrl");

//var redirectUrl = script_tag.textContent;

var obj = JSON.parse(redirectUrl)



// Fetch the summary of the article from our Express API
const fetchSummary = (event) => {
  const title = event.target.textContent;
  var selection = 12;

  for (let i = 0; i < 12; i++) {

    const titlecheck = (obj[i].title + " (" + obj[i].year + ")")
    
    if (JSON.stringify(titlecheck.trim()) == JSON.stringify(title.trim())) {
      selection = i
    }
  }


  fetch(`/api/posters/${obj[selection].imdb_id}`)
    .then((res) => res.json())
    .then((data) => {
      const parent = event.target.parentElement;

      if (data.rsp.poster != "nothing"){

        image.innerHTML = "<img class=\"ui centered large image\" src='" + data.rsp.poster + "'></img>";


      } else if (data.rsp.poster = "nothing") {
        parent.append("\naint shit here")
      }
    })
    .catch((error) => console.log(error));
};

// Add an event listener to each article title
const Titles = document.getElementsByClassName("Title");

for (let title of Titles) {
  title.addEventListener("click", (event) => fetchSummary(event));
}













