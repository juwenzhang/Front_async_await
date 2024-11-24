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