---
layout: post
title: C로 소켓 프로그래밍 할 때 기억할 것들
---
서버 쪽 코드
```
#include <sys/socket.h>
#include <netinet/in.h>

int listensock = socket(AF_INET, SOCK_STREAM, 0);

/*
int optval = 1;
setsockopt(listensock, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval));
*/

struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_port = htons(/* uint16_t 타입의 포트번호 */);
addr.sin_addr.s_addr = /* network byte order로 되어있는 ip주소 */;

bind(listensock, (struct sockaddr *)&addr, sizeof(addr));
listen(listensock, /* backlog */);

struct sockaddr_in clientaddr;
socklen_t len = sizeof(clientaddr);

int connsock = accept(listensock, (struct sockaddr *)&clientaddr, &len);
```

setsockopt 부분은 서버를 종료했다가 너무 빨리 다시 켰을 때 bind를 못하게 되는 상황을 막아주지만, TCP의 reliability에 영향을 주므로 간단히 실험해볼때 사용한다.

backlog는 accept되지 못해서 대기중인 connection들의 최대 갯수와 관련있는 값이라고 하는데, 정확히는 이해가 되지 않지만 128정도면 적당하다고 한다.

클라이언트 쪽 코드
```
#include <sys/socket.h>
#include <netinet/in.h>

int sock = socket(AF_INET, SOCK_STREAM, 0);

struct sockaddr_in addr;
addr.sin_family = AF_INET;
addr.sin_port = htons(/* uint16_t 타입의 포트번호 */);
addr.sin_addr.s_addr = /* network byte order로 되어있는 ip주소 */;

connect(sock, (struct sockaddr *)&addr, sizeof(addr));
```

network byte order로 되어있는 ip주소는 INADDR_LOOPBACK, INADDR_ANY, INADDR_BROADCAST에 htonl()을 적용하거나 ip주소에 inet_addr()을 적용하는 등의 방법으로 얻을 수 있다. INADDR...이 각각 무엇을 의미하는지는 man 7 ip에 나와있다.

각 시스템 콜들의 man page이외에, man 7 ip, man 7 socket에 유용한 정보들이 있다. 특히 man 7 socket에는 소켓 관련 이벤트에 대응되는 poll flag가 적혀 있다.

netstat -t 명령어를 이용하면 tcp 소켓들의 상태를 확인할 수 있다.

tcp 연결을 끊으려고 할 때, 소켓을 먼저 닫은 쪽이 TIME_WAIT 상태가 되어서 꽤 오랜 시간이 지난 후에 소켓이 사라진다는 사실에 주의해야 한다. 예를 들면, 웹 서버의 경우에 TIME_WAIT 상태가 되어서 당장 쓰지 못하는 소켓들이 많아지면 동시에 처리할 수 있는 연결의 수가 줄어들기 때문에, 먼저 소켓을 닫지 않고 클라이언트가 먼저 닫기를 기다렸다가 닫는 것이 좋다. http request 헤더에 connection: close가 있다고 하더라도, 이것은 클라이언트가 해당 request에 대한 response를 받은 후 연결을 닫을 것이라는 사실을 알려주는 용도이지, 서버가 response를 보낸 후 바로 연결을 닫으라는 의미는 아닌 것 같다. (rfc 7230 6.1절 참고).
