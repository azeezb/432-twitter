var script_tag = document.getElementById('gg4');
var redirectUrl4 = script_tag.getAttribute("redirectUrl4");


var obj = JSON.parse(redirectUrl4)


const fetchTweets = (event) => {
  
  const title = event.target.textContent;
  var selection = 12;

  for (let i = 0; i < 12; i++) {

    const titlecheck = (obj[i].title + " (" + obj[i].year + ")")
    
    if (JSON.stringify(titlecheck.trim()) == JSON.stringify(title.trim())) {
      selection = i
    }
  }


  fetch(`/apitwitter/twitter/${title}`)
    .then((res) => res.json())
    .then((data) => {
      const parent = event.target.parentElement;

      tweet1.innerHTML = "<br><img class=\"ui avatar image\" src=\"https://www.flaticon.com/svg/static/icons/svg/145/145812.svg\"><br>" + data.rsp4.statuses[0].text 
      tweet2.innerHTML = "<br><img class=\"ui avatar image\" src=\"https://www.flaticon.com/svg/static/icons/svg/145/145812.svg\"><br>" + data.rsp4.statuses[1].text
      tweet3.innerHTML = "<br><img class=\"ui avatar image\" src=\"https://www.flaticon.com/svg/static/icons/svg/145/145812.svg\"><br>" + data.rsp4.statuses[2].text
      tweet4.innerHTML = "<br><img class=\"ui avatar image\" src=\"https://www.flaticon.com/svg/static/icons/svg/145/145812.svg\"><br>" + data.rsp4.statuses[3].text + "<br><br>"

    })
    .catch((error) => console.log(error));
};

// Add an event listener to each button
const Titles4 = document.getElementsByClassName("Title");


for (let title of Titles4) {
  title.addEventListener("click", (event) => fetchTweets(event));
}






