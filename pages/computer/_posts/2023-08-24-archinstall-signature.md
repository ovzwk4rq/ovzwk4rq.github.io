---
layout: post
title: arch linux 설치시 signature verification에 관하여
---

내가 보안에 굉장한 관심이나 불안감을 갖고 있어서 이런 것에 신경쓰는 것은 아니고, 그저 arch linux를 설치할 때 installation guide에서 하라는 것들은 다 해야 안심이 되는데 내가 뭘 하고 있는건지는 대략적으로라도 알고 싶을 뿐이다.

현재 기준 archwiki의 installation guide에 이런 말이 적혀 있다.

> The signature itself could be manipulated if it is downloaded from a mirror site, instead of from archlinux.org as above. In this case, ensure that the public key, which is used to decode the signature, is signed by another, trustworthy key. The gpg command will output the fingerprint of the public key. Another method to verify the authenticity of the signature is to ensure that the public key's fingerprint is identical to the key fingerprint of the Arch Linux developer who signed the ISO-file.

이것을 봤을 때, installation guide에서는 archlinux.org에서 제공하는 정보들은 신뢰할 수 있는 것으로 가정하고, 미러 사이트들에서 iso이미지 파일을 받는 것을 신뢰할 수 없다고 판단하는 듯하다.

한편 arch linux가 없고 윈도우만 있는 상황에서 arch linux를 설치하고자 하는 상황이라면, gpg를 사용하기 위해 먼저 gpg4win을 설치해야 하는데, gnupg.org의 integrity check 라는 문서에는 현재 기준 이런 말이 적혀 있다.

> If you are not able to use an old version of GnuPG, you can still verify the file's SHA-1 checksum. This is less secure, because if someone modified the files as they were transferred to you, it would not be much more effort to modify the checksums that you see on this webpage. As such, if you use this method, you should compare the checksums with those in release announcement. This is sent to the gnupg-announce mailing list (among others), which is widely mirrored. Don't use the mailing list archive on this website, but find the announcement on several other websites and make sure the checksum is consistent. This makes it more difficult for an attacker to trick you into installing a modified version of the software.

이미 윈도우에 gpg4win이 설치되어 있고 버전 업데이트를 하려는 경우라면, 이미 있는 gpg를 이용해 새로운 gpg4win 설치 프로그램의 pgp signature를 검증할 수 있지만, 여기서는 gpg4win을 처음 설치하는 거라서 어쩔 수 없이 덜 안전하더라도 checksum을 사용해야 하는 경우에 대해 말하고 있다. 이 웹페이지에 있는 파일을 변조할 수 있다면 이 웹페이지에 있는 체크섬을 변조할 수도 있다는 말을 하는 것으로 보아 여기서는 gnupg.org에서 제공하는 정보들도 신뢰할 수 없다고 판단하고 있다는 것을 알 수 있다. 그렇기 때문에 인터넷 여기저기에 있는 gnupg-announce mailing list의 미러 사이트들을 많이 찾아서 모든 곳에 있는 checksum이 일치하는지 확인하라고 한다.

윈도우에서 체크섬을 확인할 수 있는 툴은 다행히 기본으로 설치되어 있는데, 명령 프롬프트에
```
certutil -hashfile <확인하고자 하는 파일> <체크섬 알고리즘>
```
을 입력하면 체크섬을 알 수 있다.
