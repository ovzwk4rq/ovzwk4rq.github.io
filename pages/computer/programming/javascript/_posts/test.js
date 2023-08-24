async function f() {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => reject("done"), 1000);
    });
    let result = await promise;
    console.log("sdfsfsdfsdf");
}

f().catch((error) => console.log(error));
