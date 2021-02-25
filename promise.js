const { rejects } = require("assert");
const { resolve } = require("path");

const sumF = (a, b) => new Promise((resolve, rejects) => {
    setTimeout(() => {
        if(typeof a !== 'number' || typeof b !== 'number') return rejects('a or b is not number')
        resolve(a+b)
    }, 1000);
})

// sumF(10, 20)
// .then(sum => sumF(sum, 1))
// .then(sum => sumF(sum, 1))
// .then(sum => sumF(sum, 1))
// .then(sum => sumF(sum, 1))
// .then(sum2 => console.log(sum2))
// .catch(err => console.log({err}))

const totalSum = async () => {
    try{
        let sum = await sumF(10, 10)
        let sum2 = await sumF(sum, 10)
        console.log({sum, sum2});
    }catch(err){
        console.log({err})
    }

}

console.log(totalSum())