---
layout: post
title: permutation
---
```
function genPermutations(arr) {
    let permutations = [];

    function genSubPermutations(n) {
        if (n === 1)
            permutations.push([...arr]);
        else {
            genSubPermutations(n-1);
            let start = arr.length - n;
            for (let i = start+1; i < arr.length; i++) {
                let tmp = arr[start];
                arr[start] = arr[i];
                arr[i] = tmp;
                genSubPermutations(n-1);
            }
            let tmp = arr[start];
            for (let i = start+1; i < arr.length; i++)
                arr[i-1] = arr[i];
            arr[arr.length - 1] = tmp;
        }
    }

    genSubPermutations(arr.length);
    return permutations;
}
```
genSubPermutations(n): arr의 뒷부분 원소 n개의 자리만 이동시켜서 나올수 있는 모든 경우를 permutations 의 뒤에 추가하고, arr은 변화시키지 않음.
