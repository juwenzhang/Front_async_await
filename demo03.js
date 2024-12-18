console.log("script start")

async function async1() {
    console.log("async1 start")
    await async2()
    console.log("async1 end")
}

async function async2() {
    console.log("async2")
}

console.log("script start")

setTimeout(function() {
    console.log("setTimeout")
})

async1()

new Promise((resolve, reject) => {
    console.log("Promise01")
    resolve()
}).then(function () {
    console.log("promise02")
})

console.log("script end")


/**
 * script start
 * script start
 * async1 start
 * async2
 * Promise01
 * script end
 * async1 end
 * promise02
 * setTimeout
 */