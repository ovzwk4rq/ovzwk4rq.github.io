---
layout: post
title: Go-Back-N과 Selective Repeat 프로토콜의 구현에 관한 생각
---

나는 Go-Back-N과 Selective Repeat 프로토콜이 '정확히' 무엇인지는 모른다. 나의 이전 글인 ['순서번호에 관한 생각'](/pages/computer/2023/09/22/on-sequence-number.html)에는 굉장히 추상적인 형태로 설명이 되어있는데, 그것들을 Go-Back-N과 Selective Repeat 프로토콜이라고 부를 수 있을까? 그런 것을 모른다는 뜻이다. 아마 중요하지 않을 것으로 생각된다. 어쨌든 나는 '순서번호에 관한 생각'에 Go-Back-N과 Selective Repeat 프로토콜이라고 설명되어 있는 것들의 구현에 대해 설명하려고 한다. 그래서 그 글을 읽어야 이 글을 이해할 수 있다.

먼저 앞으로의 설명에 쓰일 표기법 하나를 소개하고자 한다. `modeq(x, range, div)`는 range안에 있는 값 중 div로 나눈 나머지가 x인 값을 나타낸다. 예를 들어, `modeq(3, [20, 30), 10)`의 값은 23이다.

**Go-Back-N 프로토콜의 구현**

보내는 쪽에는 크기가 N인 버퍼와 0부터 N까지의 값을 가질 수 있는 변수(_base라고 부르자)를 가지고 있어서, 버퍼의 i번째 원소는 `modeq(i, [base, base+N), N+1)`번째 메시지이고, _base에는 `base mod N+1`이 들어있다. 그러면 보내는 쪽에서 하는 일들은 다음과 같이 구현된다.

* base번째부터 base+N-1번째까지의 패킷을 반복해서 보내는 행위:  
버퍼의 i번째 원소에 순서번호로 i를 붙여서 만든 패킷들을 반복해서 보낸다.
* base에 `modeq(ack, [base, base+N], N+1)`를 넣는 행위:  
버퍼의 _base번째부터 ack번째 전까지의 공간에 upper layer로부터 받은 메시지들을 채워넣고, _base에 ack를 넣는다.

받는 쪽에는 0부터 N까지의 값을 가질 수 있는 변수(_want라고 부르자)를 가지고 있어서, 거기에 `want mod N+1`이 들어있다. 그러면 받는 쪽에서 하는 일들은 다음과 같이 구현된다.

* 받은 메시지의 순서번호가 `want mod N+1`과 같을 때 메시지를 받아들이는 행위:  
받은 메시지의 순서번호가 _want와 같을 때 메시지를 받아들인다.
* ack에 `want mod N+1`을 넣어서 보내는 행위:  
ack에 _want를 넣어서 보낸다.

**Selective Repeat 프로토콜의 구현**

보내는 쪽에는 크기가 2N인 버퍼와 0부터 2N-1까지의 값을 가질 수 있는 변수 _base, 그리고 크기가 2N인, boolean값들을 담는 배열(_record라고 부르자)을 가지고 있다. 버퍼의 i번째 원소는 `modeq(i, [base-N, base+N), 2N)`번째 메시지이고, _base에는 `base mod 2N`이 들어있고, _record[i]는 `modeq(i, [base-N, base+N), 2N)`이 기록되었는지의 여부이다. 그러면 보내는 쪽에서 하는 일들은 다음과 같이 구현된다.

* base번째부터 base+N-1번째까지의 패킷을 반복해서 보내는 행위:  
_base에서 `_base+N-1 mod 2N`까지의 수 i에 대해, 버퍼의 i번째 원소에 순서번호로 i를 붙여서 만든 패킷들을 반복해서 보낸다.
* `modeq(ack, [base-N, base+N), 2N)`을 기록하는 행위:  
_record[ack]에 true를 넣고, _record[_base]가 true일 동안 _record[_base-N mod 2N]을 false로 바꾸고 _base에 `_base+1 mod 2N`을 넣는 것을 반복한다. 그리고 _record에서 false로 바꾼 부분에 대응되는 버퍼의 공간에 upper layer로부터 받은 메시지들을 채워 넣는다. (이 구현이 가능하다는 것을 알기 위해서는 이 행위를 할 때에 base+N이상의 수들은 모두 기록되지 않은 상태라는 사실을 알아야 한다).

받는 쪽에는 크기가 2N인 버퍼와 0부터 2N-1까지의 값을 가질 수 있는 변수 _want, 그리고 크기가 2N인, boolean값들을 담는 배열 _accepted를 가지고 있다. 받아들이지 않은 가장 작은 순서번호를 want라고 할 때, _want에는 `want mod 2N`이 들어있고, _accepted[i]는 `modeq(i, [want-N, want+N), 2N)`번째 메시지를 받아들였는지의 여부이고, 받아들였으면 버퍼의 i번째 원소가 그 메시지이다. 그러면 받는 쪽에서 하는 일은 다음과 같이 구현된다.

* 받은 패킷의 순서번호를 seq라고 할 때, 받은 메시지를 `modeq(seq, [want-N, want+N), 2N)`번째 메시지로써 받아들이고, ack에 seq를 넣어서 보내는 행위:  
_accepted[seq]에 true를 넣고, _accepted[_want]가 true일 동안 _accepted[_want-N mod 2N]을 false로 바꾸고 _want에 `_want mod 2N`을 넣는 것을 반복한다. 그리고 버퍼의 이전 _want번째부터 현재 _want번째 전까지의 공간에 있는 메시지들을 upper layer로 보낸다. ack에는 seq를 넣어서 보낸다. (이 구현이 가능하다는 것을 알기 위해서는 이 행위를 할 때에 want+N번째 이후의 메시지들은 모두 받아들이지 않은 상태라는 사실을 알아야 한다).

혹시나 Selective Repeat 프로토콜에서 버퍼의 크기가 N이어도 된다는 것을 아는 사람이라면, 왜 내가 굳이 버퍼의 크기를 2N으로 정했는지 궁금할 수 있다. 물론 버퍼의 크기가 N인 것이 메모리를 아끼므로 실용적인 측면에서 당연히 더 좋겠지만, 이 글은 그저 가능한 구현을 보여주고자 할 뿐이므로 글이 불필요하게 복잡해지지 않도록 최대한 단순한 구현을 선택하였다.
