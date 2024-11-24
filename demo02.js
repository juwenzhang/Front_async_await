console.log("script start")

setTimeout(function() {
    console.log("setTimeout1")
    new Promise((resolve, reject) => {
        resolve()
    }).then(() => {
        new Promise((resolve, reject) => {
            resolve()
        }).then(() => {
            console.log("then4")
        })
        console.log("then2")
    })
})

new Promise((resolve, reject) => {
    console.log("Promise1")
    resolve()
}).then(() => {
    console.log("then1")
})

setTimeout(()=>{
    console.log("setTimeout2")
})

console.log(2)

queueMicrotask(() => {
    console.log("queueMicrotask1")
})

new Promise((resolve, reject) => {
    resolve()
}).then(() => {
    console.log("then3")
})

console.log("script end")


/**
 * 先实现分析我们的同步执行的代码有那些，把这些代码先实现执行
 * script start
 * Promise1
 * 2
 * script end
 *
 * 然后实现执行我们的微任务
 * then1
 * queueMicrotask1
 * then3
 *
 * 然后执行宏任务中的代码
 * setTimeout1
 * then2
 * then4
 * setTimeout2
 */