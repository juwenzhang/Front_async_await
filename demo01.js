console.log("111111111")
console.log("222222222")
console.log("333333333")


// 开始实现书写我们的会添加到事件队列中的代码
setTimeout(() => {
    console.log("444444444")
}, 0)

// 实现书写会添加到事件队列中的 Promise.then
new Promise((resolve, reject) => {
    console.log("cdoisfjhcjdsafc")
    console.log("cnduwsihfcdiads")
    resolve("vdfgsfgvsdg")
    console.log("cdoisfjhcjdsafc")
}).then(res => {
    console.log(res)
})


console.log("6666666666")
console.log("7777777777")
console.log("8888888888")


/**
 * 333333333
 * cdoisfjhcjdsafc
 * cnduwsihfcdiads
 * cdoisfjhcjdsafc
 * 6666666666
 * 7777777777
 * 8888888888
 * vdfgsfgvsdg
 * 444444444
 */

/**
 * 上面代码的执行流程就是先把我们的没有被添加到事件队列中的代码先实现执行
 * 然后依次执行我们的微任务和宏任务队列
 *
 * 但是需要注意的是我们的 Promise 的 then 回调函数是会被添加到队列中的，
 * 其他的代码的话是不会的，还是同步执行完
 *
 * 定时器的话一般是添加到我们的宏任务中去进行执行的: macrotask
 * Promise 的 then 回调是我们的微任务: microtask
 *
 * 宏任务会被添加到宏任务队列中去  macrotask queue: ajax setTimeout DOM监听 UI Rendering
 * 微任务会被添加到微任务对列中去  microtask queue
 */