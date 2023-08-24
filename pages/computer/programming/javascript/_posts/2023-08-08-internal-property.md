---
layout: post
title: internal property
---
자바스크립트에서 객체의 internal property란, 객체가 실제로 갖고있는 property가 아니고, 자바스크립트 명세서에서 명세의 편의를 위해 도입된 개념이다. 예를 들면, obj.foo(value)가 prop이라는 internal property의 값을 value로 만들고, obj.bar()가 prop의 값을 리턴한다는 식으로 각 멤버 함수들의 명세가 적혀 있다고 하더라도, 실제로 코드에서 obj.prop 에 접근할 수는 없다.

internal property는 두개의 대괄호를 이용하여 [[prop]]과 같이 표기한다. 크롬 개발자도구에서 console.log()를 이용해 객체를 출력하려고 하면 internal property들이 그렇게 두개의 대괄호로 둘러싸여서 출력되는 것을 볼 수 있다.
