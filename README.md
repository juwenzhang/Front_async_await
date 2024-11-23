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


#### 如果需要对本仓库代码进行改动的话，请按照以下步骤实现 thanks
```
fork from my reps to your reps

git clone https://github.com/juwenzhang/Front_async_await.git

git add <need-commit-files>  ||  git add .

git commit -m "commitlint: desc"

git push -u <your-remote-name> <your-local-branch-name>

commit pull request merge to me
```