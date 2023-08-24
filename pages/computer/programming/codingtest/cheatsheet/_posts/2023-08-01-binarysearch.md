---
layout: post
title: 이진탐색
---
```
let start;
let end;
while (start !== end) {
    let mid = (start + end) / 2;
    if (찾는 위치가 mid 보다 크다면) {
        start = mid + 1;
    } else {
        end = mid;
    }
}
```
[start, end] 밖에는 찾는 위치가 없다는 사실이 유지됨.  
따라서 반복문이 끝나면 start 가 아닌 곳은 찾는 위치가 아니라는 사실이 보장됨.  

end - start >= 0 이 유지된다는 사실을 증명해야함.  
start = mid + 1 이 실행되는 경우, start' == (start + end) / 2 + 1, end' == end.  
end' - start' == end - (start + end) / 2 - 1.  
반복문 안으로 들어왔다는 것은 start != end, 즉 end - start > 0 임을 의미함.  
이 경우 start <= (start + end) / 2 < end.  
따라서 0 < end - (start + end) / 2 <= end - start.  
따라서 0 <= end - (start + end) / 2 - 1 < end - start.  
따라서 end' - start' >= 0 임과 동시에 end' - start' < end - start 임도 증명함.  
end = mid 가 실행되는 경우, start' == start, end' == (start + end) / 2.  
end' - start' == (start + end) / 2 - start.  
start <= (start + end) / 2 < end 였음을 상기.  
따라서 0 <= (start + end) / 2 - start < end - start.  
따라서 이번에도 end' - start' >= 0 임과 동시에 end' - start' < end - start 임도 증명함.  
end - start >= 0 이 유지되고 end - start 가 항상 줄어든다는 사실을 증명함.  
따라서 반복문의 종료가 증명됨.  
