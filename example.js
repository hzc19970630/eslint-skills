// Example file with ESLint issues for demonstration

function badlyFormatted( ){
var x = "double quotes"
  const y = 'single quotes'
    const z = { a:1,b:2 }

if(x){
console.log(x)
}

  return y
}

const arrow = ()=>{
  return "no spacing"
}

module.exports = { badlyFormatted, arrow }
