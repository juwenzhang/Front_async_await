#### 我们先来看代码，这个实现的思路就是接下来需要进行分析实现的 async 以及 await 的基本使用流程
```javascript
// 开始实现补充我们的网络请求

const base_url = "http://localhost:8080"


/**
 * 开始实现模拟我们的发送网络请求的函数的处理
 * @param {string} request_url 设置发送网络请求的url
 * @returns {Promise} {Promise<unknown>} 设置异步操作
 */
function request_data(request_url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(request_url)  // 如果模拟的网络请求成功了，那就直接实现我们的修改状态为 fulfilled
        }, 3000)
    })
}

/**
 * 1.发送网络请求得到第一次网络请求的结果
 * 2.发送完了第二次的网络请求后再实现发送第二次的网络请求，并且等待其返回的结果
 * 以此类推...
 */

/**
 * 方式一使用回调地狱的形式实现我们的多次发送网络请求
 */
function get_request_data() {
    // 第一次的网络请求
    request_data(`${base_url}/get_request_data`).then((res) => {
        console.log("第一次网络请求返回的结果是: ", res)

        // 开始实现我们的第二次的请求
        request_data(`${base_url}/get_request_data_in_first_request`).then((res) => {
            console.log(res)
            // ...... 接下来的网络请求
        })
    })
}


// 方式二： 实现使用我们的 Promise 实现我们的解决这种回调地狱实现的网络请求
function _get_request_data() {
    request_data(`${base_url}/get_request_data_in_last_request`).then((res) => {
        console.log("第一次发送网络请求的结果为: ", res)
        return request_data(`${base_url}/get_request_data_in_last_request/two`)
    }).then(res => {
        console.log("第二次发送网络请求的结果为: ", res)
        res = res.split("/")
        res[res.length-1] = "three"
        return request_data(`${base_url}/get_request_data_in_last_request/${res[res.length-1]}`)
    }).then(res => {
        console.log("第三次发送网络请求的结果为: ", res)
        res = res.split("/")
        res[res.length-1] = "four"
        return request_data(`${base_url}/get_request_data_in_last_request/${res[res.length-1]}`)
    }).catch(err => {
        console.log("实现捕获到的网络请求过程中的错误是: ", err)
    })
}
_get_request_data()


// 方式三: 使用我我们的生成器实现我们的发送网络请求并且返回结果
function __get_request_data() {
    function* ___get_request_data() {
        let res = yield request_data(`${base_url}/get_request_data_in_last_request`)
        res = yield request_data(`${base_url}/get_request_data_in_last_request/two`)
        res = yield request_data(`${base_url}/get_request_data_in_last_request/three`)
        console.log(res)
    }

    // 但是我们通过代码结构我们又可以发现一点的是: 这里有出现了我们的回调地狱
    const request_generator = ___get_request_data()
    request_generator.next().value.then(res => {
        request_generator.next(res).value.then(res => {
            request_generator.next(res).value.then(res => {
                request_generator.next(`最后发送的网络请求的链接为: ${res}`)
            })
        })
    })
}
__get_request_data()


// 方案四: 使用我们的 async 和 await 关键字实现我们的进一步的优化的操作
async function ___get_request_data() {
    let res = await request_data(`${base_url}/get_request_data_in_last_request`)
    res = await request_data(`${base_url}/get_request_data_in_last_request/two`)
    res = await request_data(`${base_url}/get_request_data_in_last_request/three`)
    console.log(res)
}
___get_request_data()
```
***
***
#### async 和 await 的简单使用
##### 异步函数 async function
***
* 异步的实现的话在很多的编程语言中都是含有的: 比如说我们的 Python 中就具有 asyncio 异步处理的框架
* async 用来实现我们的声明一个异步函数
  * async 就是我们的 asynchronous 单词的缩写: 异步函数就是非同步发生的意思
  * sync 就是我们的 synchronous 单词缩写: 非异步就是同步发生的意思，同时性
* 异步函数的执行流程
  * 在异步函数内部代码的执行流程和普通的函数是一致的，同步的执行
  * 但是在我们的返回值方面的话就有所不同了
    * 情况一: 异步函数是具有返回值的,但是该对象是一个 Promise 对象
    * 情况二: 如果异步函数的返回值是 Promise, 状态会由 Promise 决定
    * 情况三: 异步函数实际上的返回值是一个对象，thenable 对象
  * 异步函数实际上的话就是对我们的生成器一种封装
  * 如果想要了解更多关于生成器的概念，请看: https://github.com/juwenzhang/Front_iterator_generator
  * 在异步函数中，如果所有的代码都是正常的执行的话，那返回的 Promise 的状态就是 fulfilled
  * 在异步函数中，如果代码有一句错误了，或者说主动抛出异常了，那么 Promise 的状态就是 rejected
```javascript
// demo code 
async function demo() {
    console.log("===========1")
    console.log("===========2")
    console.log("===========3")
    throw new Error("error")
}

demo().then(res => {
    console.log(res)
}).catch(err => {
    console.log(err)
})
/**
 * 当我们的 throw 语句存在的时候，
 * 这个时候异步返回的 Promise 的状态就是 fulfilled
 * 
 * 当没有我们的 throw 语句存在的时候，
 * 这个时候异步函数返回的 Promise 状态是 rejected
 */
```
***


* 异步函数中的 await 关键字
  * 通过这个标题的命名，我们就可以知道一点的是： **await 关键字只是出现在我们的异步函数中**
  * 异步函数后面是会接上一个表达式的，这个表达式的话返回一个新的 Promise 对象
  * await 会等待我们的 Promise 的状态为 fulfilled 的时候，才继续运行接下来异步函数中的代码
    * **await 关键字**的底层的话实际上的话就是对我们的**生成器和生成器对象的next操作的封装**
```javascript
// demo code
const base_url = "http://localhost:8080"

function request_data(request_url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(request_url)  // 如果模拟的网络请求成功了，那就直接实现我们的修改状态为 fulfilled
        }, 3000)
    })
}

// 方式三: 使用我我们的生成器实现我们的发送网络请求并且返回结果
function __get_request_data() {
    function* ___get_request_data() {
        let res = yield request_data(`${base_url}/get_request_data_in_last_request`)
        res = yield request_data(`${base_url}/get_request_data_in_last_request/two`)
        res = yield request_data(`${base_url}/get_request_data_in_last_request/three`)
        console.log(res)
    }

    // 但是我们通过代码结构我们又可以发现一点的是: 这里有出现了我们的回调地狱
    const request_generator = ___get_request_data()
    request_generator.next().value.then(res => {
        request_generator.next(res).value.then(res => {
            request_generator.next(res).value.then(res => {
                request_generator.next(`最后发送的网络请求的链接为: ${res}`)
            })
        })
    })
}
__get_request_data()


// 接下来我们实现对生成器代码的优化的操作，同时实现自动化的执行
/**
 * 自动化运行我们的生成器函数的代码
 * @param {GeneratorFunction} get_request_data_func 传入的生成器函数
 */
function exec_get_request_data(get_request_data_func) {
    const generator = get_request_data_func()  // 获取生成器
    function exec(res) {  // 实现自动化运行函数
        const result = generator.next(res)
        if (result.done) return
        result.value.then(res => {
            exec(res)
        })
    }
    exec()
}
function* ___get_request_data() {
    let res = yield request_data(`${base_url}/get_request_data_in_last_request`)
    res = yield request_data(`${base_url}/get_request_data_in_last_request/two`)
    res = yield request_data(`${base_url}/get_request_data_in_last_request/three`)
    console.log(`最后发送的网络请求的链接为: ${res}`)
}

exec_get_request_data(___get_request_data)
```

***

#### 进程(Process) 和 线程(Thread)
* 进程: 计算机已经运行的程序，是操作系统的最小分配单位，操作系统资源管理程序的一种方式
  * 不存在资源掠夺的现象发生，每个进程之间资源是不共享的
  * 当我们的计算机等硬件的话启动一个程序的时候，就会开启一个进程(也可能是多个进程)
* 线程: 操作系统能够运行的运算调度的最小单位，包含在我们的进程中的
  * 存在资源掠夺的现象发生，每个线程之间是存在资源共享的，这个时候就需要资源加锁或者线程通讯
  * 每个进程中至少含有一个线程来实现运行我们的程序中的代码，该线程就是我们的主线程
* 可以简单的理解为一个进程中可能含有多个线程，进程就相当于是我们的线程的容器
  * 同时一些编程语言实现高并发就是实现的是合理的使用我们的线程来实现的
* JavaScript 是一个单线程的语言机制，就是因为这一个特点，所以说后面就会来实现讨论我们的其他相关的一些知识点了

***

#### 浏览器的事件循环


***

#### 如果需要对本仓库代码进行改动的话，请按照以下步骤实现 thanks
```
fork from my reps to your reps

git clone https://github.com/juwenzhang/Front_async_await.git

git add <need-commit-files>  ||  git add .

git commit -m "commitlint: desc"

git push -u <your-remote-name> <your-local-branch-name>

commit pull request merge to me
```