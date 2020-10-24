var script_tag = document.getElementById('gg3');
var redirectUrl3 = script_tag.getAttribute("redirectUrl3");


var obj = JSON.parse(redirectUrl3)


const fetchSummary3 = (event) => {
  const title = event.target.textContent;
  var selection = 12;

  for (let i = 0; i < 12; i++) {

    const titlecheck = (obj[i].title + " (" + obj[i].year + ")")
    
    if (JSON.stringify(titlecheck.trim()) == JSON.stringify(title.trim())) {
      selection = i
    }
  }


  fetch(`/apinetflix/netflix/${obj[selection].title}`)
    .then((res) => res.json())
    .then((data) => {
      const parent = event.target.parentElement;

      if (data.rsp3.results[0] === undefined){
        available.innerHTML = "<br>Is it on Netflix?    " + "<br><br>" + "<a class=\"ui huge red label\">Nope!</a>"

      } else if (data.rsp3.results[0].locations[0].display_name = "Netflix" && data.rsp3.results[0].name == obj[selection].title){
        available.innerHTML = "<br>Is it on Netflix?    " + "<br><br>" + "<a class=\"ui huge green label\">Yes!</a>" +  "<a href=" + data.rsp3.results[0].locations[0].url + "\ target=\"_blank\">" + " Watch now!!" + "</a>" 
      } else {
        available.innerHTML = "<br>Is it on Netflix?    " + "<br><br>" + "<a class=\"ui huge red label\">Nope!</a>"
      }

    })
    .catch((error) => console.log(error));
};

// Add an event listener to each article title
const Titles3 = document.getElementsByClassName("Title");

for (let title of Titles3) {
  title.addEventListener("click", (event) => fetchSummary3(event));
}
