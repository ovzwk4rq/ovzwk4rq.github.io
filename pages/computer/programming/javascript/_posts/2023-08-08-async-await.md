---
layout: post
title: async/await
---
async 키워드는 아래와 같이 함수 앞에 붙는 키워드이다.
```
async function f() {
    return 1;
}
```
async가 붙은 함수는 언제나 promise를 리턴한다. 위의 예시처럼 함수 안에서 return뒤에 promise가 아닌 것을 붙였을 때도, 실제로 리턴되는 것은 Promise.resolve(1) 이다.

async 함수 안에서는 await라는 키워드를 사용할 수 있다.
```
async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done"), 1000);
    });
    let result = await promise;
    return result;
}
```
위처럼 사용하게 되면, promise가 만들어지고 나서, 1초가 지나서 promise가 resolve될때까지 코드가 실행되지 않고 기다린다. 그러다가 resolve되고 나면, result에 "done"이 들어가게 된다. 그리고 다음과 같이 사용하게 되면,
```
f().then((result) => console.log(result));
console.log("doing other things...");
```
f() 함수에서 promise가 resolve되기를 '기다리는' 동안 `console.log("doing other things...")`가 실행되므로 코드를 실행하면
```
doing other things...
done
```
이 출력된다. 즉 f()가 '비동기적으로' 실행되었다고 할 수 있다. 똑같은 코드를 다음과 같이 쓸수도 있다.
```
async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve("done"), 1000);
    });
    let result = await promise;
    console.log(result);
}
f();
console.log("doing other things...");
```
이렇게 써야 좀더 f()가 '비동기적'이라는 것이 와닿는다.

한편, 만약 promise가 reject된다면 await promise의 동작은 다음 예시로 간단히 설명할 수 있다.
```
async function f() {
    await Promise.reject("error");
}
```
는
```
async function f() {
    throw "error";
}
```
와 같다.
