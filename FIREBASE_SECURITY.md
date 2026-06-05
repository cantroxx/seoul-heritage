# Firebase Security Setup

관리자 삭제 기능을 공개 배포에서 유지하려면 Firebase Auth와 Realtime Database Rules가 함께 설정되어야 합니다.

## 1. Google 로그인 제공자 켜기

Firebase Console에서:

1. Authentication
2. Sign-in method
3. Google
4. Enable
5. 저장

## 2. 관리자 UID 확인

테스트 사이트에서 관리자 Google 계정으로 로그인한 뒤, 브라우저 콘솔에서 실행합니다.

```js
firebase.auth().currentUser.uid
```

출력된 UID를 복사합니다.

## 3. 코드의 관리자 UID 교체

`data/admin_config.js`에서 아래 값을 실제 UID로 바꿉니다.

```js
"REPLACE_WITH_FIREBASE_AUTH_UID"
```

## 4. Realtime Database Rules 적용

`firebase-rtdb.rules.json`의 `REPLACE_WITH_FIREBASE_AUTH_UID`도 같은 UID로 바꾼 뒤 Firebase Console에 붙여넣습니다.

Firebase Console:

1. Realtime Database
2. Rules
3. JSON 붙여넣기
4. Publish

## 5. 확인 기준

- 일반 사용자는 관리자 메뉴에서 Google 로그인을 하지 않으면 삭제 버튼을 누를 수 없습니다.
- 관리자 UID가 아닌 Google 계정은 로그인해도 삭제 버튼이 비활성화됩니다.
- Realtime Database Rules에서 관리자 UID가 아닌 요청은 `users`, `rankings`, `rankings/{week}` 전체 삭제가 거부됩니다.
- 일반 사용자는 개별 `users/{userKey}`, `rankings/{week}/{diff}/{userKey}` 기록 생성/수정만 가능합니다.

주의: 클라이언트 UI는 편의 기능입니다. 최종 보안은 `firebase-rtdb.rules.json`을 실제 Firebase Console에 적용해야 완성됩니다.
