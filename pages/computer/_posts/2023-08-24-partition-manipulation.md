---
layout: post
title: 파티션 조작과 관련된 정보들
---

파티션의 백업과 복구는 그냥 cat, cp 같은 명령어로 가능하다. dd가 무언가 특별한 기능을 하는것은 아니라고 한다.
```
cat /dev/sda1 > backupfile
cp /dev/sda1 backupfile
dd if=/dev/sda1 of=backupfile
```
다만 dd가 끝나고 나서 몇 바이트가 옮겨졌는지, 시간이 얼마나 걸렸는지 등을 알려주기는 한다.

파티션 조작은 cfdisk 명령어를 이용하여 할 수 있다.

파티션의 크기를 늘리는 것은 내부 데이터에 영향을 주지 않는다.

내부 데이터에 영향을 주지 않고 파티션의 크기를 줄이는 것에 대해서는 잘 모르겠다. resize2fs, dumpe2fs 에 대해 찾아봐야 할 것 같다.

윈도우가 들어있는 파티션을 그냥 옮기기만 하면 부팅이 되지 않는다. EFI 파티션을 포맷하고 부팅 usb를 통해 복구 모드로 들어가서 이것저것 명령어를 입력해야 한다.
