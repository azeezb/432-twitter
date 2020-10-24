var script_tag = document.getElementById('ggg');
var redirectUrl5 = script_tag.getAttribute("redirectUrl5");
// var stopwords = require('nltk-stopwords')


//var redirectUrl = script_tag.textContent;

var obj = JSON.parse(redirectUrl5)
// var obj = redirectUrl5


console.log("this is workin")
console.log(obj)
// console.log(JSON.parse(obj))

// console.log(obj[1].text);
// console.log(obj[2].text);
// console.log(obj[3].text);
// console.log(obj[4].text);
// console.log(obj[5].text);
// console.log(obj[6].text);
// console.log(obj[7].text);
// console.log(obj[8].text);
// console.log(obj[9].text);



var superstring;
// for (let i = 0; i < obj.length; i++) {
//     const element = array[i];
    
// }
for (let i = 0; i < 4; i++) {
    // const element = array[i];
    superstring = superstring + ' ' + obj[i].text;
}    

console.log(superstring);

// var english = stopwords.load('english')

// stopwords.remove(superstring, english)
console.log(superstring);
