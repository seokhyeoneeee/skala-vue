# Vue 날씨 대시보드

판교 4반 | P129 | 채석현

Vue 3를 배우면서 날씨 화면을 단계별로 발전시킨 실습 프로젝트입니다. 처음에는 정적인 Mock 데이터로 시작했고, Composition API, 컴포넌트 분리, Vue Router, Pinia, Axios, Element Plus를 차례로 적용했습니다.

완성된 화면에서는 OpenWeather API를 사용해 서울·수원·부산·제주의 날씨를 불러오고, 한글이나 영문으로 다른 국내외 도시도 검색할 수 있습니다.

## 과제 진행 요약

| 구분 | 학습 주제 | 구현한 핵심 기능 |
| --- | --- | --- |
| 과제 1 | 날씨 Mockup | 정적 도시 데이터와 조건부 날씨 표시 |
| 과제 2 | Composition API | 반응형 검색, 즐겨찾기, 감시 함수 |
| 과제 3 | 컴포넌트 | Props, Emits, Slot을 이용한 역할 분리 |
| 과제 4 | Vue Router | 목록·상세·소개·안내 페이지 이동 |
| 과제 5 | Store | Pinia로 섭씨·화씨 상태 공유 |
| 과제 6 | Axios | OpenWeather API 실시간 데이터 호출 |
| 과제 7 | Element Plus | UI 컴포넌트 라이브러리 적용 |
| 최종 완성본 | 기능 통합 | 한글 도시 검색, 즐겨찾기, 상세 날씨, 반응형 UI |

## 프로젝트 파일 구조

아래 구조는 Git에 커밋되어 실제 프로젝트에서 사용하는 파일을 기준으로 정리했습니다.

```text
weather-project/
├── public/
│   └── favicon.ico                 # 브라우저 탭 아이콘
├── src/
│   ├── assets/
│   │   ├── base.css                # 색상 변수와 body 기본 스타일
│   │   ├── exercise.css            # 과제 화면 공통 스타일
│   │   ├── main.css                # 앱 전체 크기와 반응형 레이아웃
│   │   └── logo.svg                # 기본 이미지 에셋
│   ├── components/
│   │   ├── exercise/               # 과제 1~6에서 단계별로 만든 컴포넌트
│   │   │   ├── BaseDashboardCard.vue
│   │   │   ├── FavoriteFilter.vue
│   │   │   ├── SearchBar.vue
│   │   │   ├── UnitToggler.vue
│   │   │   ├── WeatherCard.vue
│   │   │   ├── WeatherCardafterStore.vue
│   │   │   ├── WeatherComposition.vue
│   │   │   ├── WeatherHomeView.vue
│   │   │   ├── WeatherMockup.vue
│   │   │   └── WeatherParent.vue
│   │   ├── library/                # Element Plus 기반 최종 UI 컴포넌트
│   │   │   ├── ElementFavoriteFilter.vue
│   │   │   ├── ElementSearchBar.vue
│   │   │   └── ElementWeatherCard.vue
│   │   └── WeatherAppShell.vue     # 날씨 메뉴와 RouterView 공통 셸
│   ├── router/
│   │   └── index.js                # URL 경로와 View 컴포넌트 연결
│   ├── services/
│   │   └── weatherApi.js           # Geocoding 및 날씨 API 요청·응답 변환
│   ├── stores/
│   │   └── configStore.js          # 온도 단위와 갱신 시간 공통 상태
│   ├── views/
│   │   ├── WeatherHomeView.vue     # 최종 날씨 대시보드
│   │   ├── WeatherDetailView.vue   # 도시별 상세 날씨
│   │   ├── WeatherAboutView.vue    # 서비스 소개
│   │   ├── WeatherGuideView.vue    # 서비스 이용 안내
│   │   └── NotFoundView.vue        # 존재하지 않는 경로의 404 화면
│   ├── App.vue                     # 과제/최종본 탭과 2×2 과제 레이아웃
│   └── main.js                     # Vue, Router, Pinia, Element Plus 등록
├── .env.example                    # 필요한 환경변수 이름 예시
├── .gitignore                      # Git에서 제외할 파일 설정
├── index.html                      # Vite가 사용하는 HTML 진입점
├── package.json                    # 의존성 및 npm 명령 정의
├── package-lock.json               # 설치 패키지 버전 고정
├── vercel.json                     # SPA 경로 rewrite를 포함한 Vercel 설정
├── vite.config.js                  # Vue 플러그인과 @ 경로 별칭 설정
└── README.md                       # 프로젝트 설명과 학습 내용
```

### 폴더별 역할

| 폴더 | 역할 |
| --- | --- |
| `components/exercise` | 과제가 발전하는 과정을 확인하기 위해 단계별 컴포넌트를 보관합니다. |
| `components/library` | 최종 화면에서 사용하는 Element Plus 기반 UI를 모아 둡니다. |
| `views` | Vue Router가 URL에 따라 보여주는 페이지 단위 컴포넌트입니다. |
| `services` | 화면에서 API 세부 구현을 분리하고 응답 데이터를 공통 형태로 변환합니다. |
| `stores` | 여러 컴포넌트가 함께 사용하는 전역 상태를 관리합니다. |
| `router` | 경로, 동적 파라미터, 404 페이지를 설정합니다. |
| `assets` | 전역 CSS, 과제 공통 CSS, 이미지 같은 정적 리소스를 관리합니다. |

`node_modules/`, `dist/`, `.env.local`은 각각 설치 패키지, 빌드 결과, 실제 API 키를 담기 때문에 Git에 커밋하지 않습니다.

## 과제 1: 날씨 Mockup

첫 번째 과제에서는 서버 통신 없이 배열에 작성한 서울, 수원, 부산, 제주 날씨를 화면에 출력했습니다. Vue 템플릿 문법이 HTML과 어떻게 연결되는지 익히는 단계였습니다.

### 구현 기능

- `v-for`로 날씨 배열을 카드 목록으로 출력
- `v-if`, `v-else`로 기온에 따라 더움·선선함 표시
- `@click`으로 카드 선택 및 상세보기 알림 실행
- `:class`, `:key`와 같은 동적 바인딩 사용

### 사용한 함수와 특징

| 함수 또는 문법 | 사용 목적 | 배우면서 이해한 특징 |
| --- | --- | --- |
| `ref()` | 날씨 목록, 검색어, 선택된 도시 상태 저장 | 값이 바뀌면 연결된 화면도 자동으로 다시 그려집니다. JavaScript에서는 `.value`로 접근합니다. |
| `showDetail()` | 도시명과 날씨 상태를 알림으로 표시 | 템플릿의 클릭 이벤트와 JavaScript 함수를 연결할 수 있습니다. |
| `v-for` | 도시 수만큼 카드 반복 생성 | 각 항목에 고유한 `:key`를 지정해야 Vue가 변경된 요소를 효율적으로 찾습니다. |
| `v-if` | 온도에 따라 배지 변경 | 조건이 참인 요소만 실제 DOM에 렌더링합니다. |

## 과제 2: Composition API

두 번째 과제에서는 화면 데이터를 단순히 보여주는 것에서 벗어나 검색과 즐겨찾기 상태를 반응형으로 계산했습니다. Composition API의 주요 함수가 각각 어떤 역할을 하는지 실습했습니다.

### 구현 기능

- 도시 이름 검색
- 즐겨찾기 추가 및 해제
- 즐겨찾기 도시만 보기
- 즐겨찾기 개수 계산
- 즐겨찾기를 `localStorage`에 저장

### 사용한 함수와 특징

| 함수 | 사용 목적 | 특징 |
| --- | --- | --- |
| `ref()` | 검색어, 즐겨찾기 ID, 체크박스 상태 저장 | 원시 값과 배열을 반응형 데이터로 만들 수 있습니다. |
| `computed()` | 검색 결과와 즐겨찾기 개수 계산 | 의존하는 값이 바뀔 때만 다시 계산하며, 계산 결과를 캐시합니다. 원본 상태를 직접 수정하지 않는 파생 값에 적합합니다. |
| `watch()` | 선택 상태 출력, 즐겨찾기 저장 | 지정한 반응형 값이 변경됐을 때 `localStorage` 저장처럼 부수 효과가 있는 작업을 실행합니다. |
| `watchEffect()` | 현재 검색어 변화 확인 | 함수 안에서 사용한 반응형 값을 Vue가 자동으로 추적합니다. 어떤 값을 감시할지 직접 지정하지 않아도 됩니다. |
| `toggleFavorite()` | 즐겨찾기 배열에 도시 ID 추가·삭제 | 기존 배열을 확인한 뒤 새 배열로 교체하여 상태 변화를 명확하게 만들었습니다. |

## 과제 3: 컴포넌트 분리

세 번째 과제에서는 한 파일에 있던 화면을 작은 컴포넌트로 나눴습니다. 처음에는 파일이 많아져 복잡해 보였지만, 각 컴포넌트가 한 가지 역할만 담당하니 수정할 위치를 찾기 쉬워졌습니다.

### 분리한 컴포넌트

- `BaseDashboardCard.vue`: 공통 카드 레이아웃
- `SearchBar.vue`: 도시 검색 입력
- `FavoriteFilter.vue`: 즐겨찾기 필터와 개수
- `WeatherCard.vue`: 도시별 날씨 카드
- `WeatherParent.vue`: 전체 상태 관리 및 자식 컴포넌트 연결

### 사용한 함수와 특징

| 함수 | 사용 목적 | 특징 |
| --- | --- | --- |
| `defineProps()` | 부모의 도시 데이터와 즐겨찾기 여부를 자식에게 전달 | 데이터는 부모에서 자식 방향으로 전달됩니다. 자식이 전달받은 값을 직접 수정하지 않는 것이 원칙입니다. |
| `defineEmits()` | 카드 선택, 상세보기, 즐겨찾기 이벤트를 부모로 전달 | 자식은 상태를 직접 바꾸는 대신 이벤트를 보내고 부모가 실제 상태를 변경하게 만들 수 있습니다. |
| `<slot>` | 공통 카드 안에 서로 다른 내용을 삽입 | 레이아웃은 재사용하면서 내부 콘텐츠만 교체할 수 있습니다. |
| `computed()` | 검색과 즐겨찾기 조건을 함께 적용 | 여러 상태로부터 화면에 필요한 최종 목록을 만들었습니다. |

## 과제 4: Vue Router 적용

네 번째 과제에서는 버튼을 눌렀을 때 알림만 띄우는 방식에서 실제 URL이 변경되는 페이지 이동 방식으로 발전시켰습니다.

### 구성한 경로

| URL | 화면 |
| --- | --- |
| `/` | 날씨 대시보드 |
| `/weather/:cityId` | 도시 상세 날씨 |
| `/about` | 서비스 소개 |
| `/guide` | 이용 안내 |
| 그 외 경로 | 404 페이지 |

### 사용한 함수와 특징

| 함수 | 사용 목적 | 특징 |
| --- | --- | --- |
| `createRouter()` | 애플리케이션의 경로 목록 생성 | URL과 렌더링할 Vue 컴포넌트를 연결합니다. |
| `createWebHistory()` | 일반적인 브라우저 URL 사용 | 주소에 `#`이 붙지 않는 대신 배포 서버에서 SPA rewrite 설정이 필요합니다. |
| `useRouter()` | 코드에서 다른 경로로 이동 | `router.push()` 또는 `router.replace()`를 호출할 수 있습니다. |
| `useRoute()` | 현재 URL 정보 읽기 | 경로 파라미터인 `cityId`와 검색 query 값을 읽는 데 사용했습니다. |
| `router.push()` | 상세 화면 및 홈 화면 이동 | 브라우저 방문 기록을 추가하면서 이동합니다. |
| `router.replace()` | 검색어 query 갱신 | 방문 기록을 계속 추가하지 않고 현재 기록을 교체합니다. |
| 동적 `import()` | 페이지 컴포넌트 지연 로딩 | 해당 경로에 접근할 때 필요한 파일을 불러와 초기 로딩 파일을 나눌 수 있습니다. |

## 과제 5: Pinia Store 적용

다섯 번째 과제에서는 여러 컴포넌트가 함께 사용하는 온도 단위를 Pinia Store로 관리했습니다. 메인 카드와 상세 화면이 같은 단위 상태를 바라보기 때문에 한 번의 변경으로 두 화면이 함께 바뀝니다.

### Store 구성

| 분류 | 이름 | 역할 |
| --- | --- | --- |
| state | `unit` | 현재 단위인 `celsius` 또는 `fahrenheit` 저장 |
| state | `lastUpdated` | 마지막 API 갱신 시간 저장 |
| getter | `unitSymbol` | 현재 단위에 맞춰 `℃` 또는 `℉` 반환 |
| getter | `lastUpdatedLabel` | 갱신 시간을 화면용 문자열로 변환 |
| action | `toggleUnit()` | 섭씨와 화씨를 서로 전환 |
| action | `markWeatherUpdated()` | API 호출이 끝난 시간을 기록 |

### 사용한 함수와 특징

| 함수 | 사용 목적 | 특징 |
| --- | --- | --- |
| `defineStore()` | `configStore` 생성 | 컴포넌트 밖에서 공통 상태와 로직을 정의하고 여러 화면에서 재사용합니다. |
| `useConfigStore()` | 컴포넌트에서 Store 사용 | 같은 Pinia 인스턴스의 상태를 공유하므로 서로 떨어진 컴포넌트도 함께 반응합니다. |
| `computed()` | 섭씨를 화씨로 변환한 표시 온도 계산 | 원본 API 온도는 섭씨로 유지하고 화면에 표시할 값만 변경합니다. |
| `app.use(createPinia())` | Vue 앱에 Pinia 등록 | Store를 사용하기 전에 최상위 앱에 플러그인을 설치해야 합니다. |

화씨 변환에는 다음 공식을 사용했습니다.

```js
Math.round((celsius * 9) / 5 + 32)
```

## 과제 6: Axios API 연동

여섯 번째 과제에서는 Mock 데이터를 OpenWeather의 실시간 데이터로 교체했습니다. API 호출은 화면 컴포넌트와 분리하여 `services/weatherApi.js`에서 관리했습니다.

### 구현 기능

- 서울·수원·부산·제주 날씨 동시 조회
- 온도, 날씨 상태, 습도, 풍속 데이터 매핑
- 로딩, 오류, 재시도 상태 처리
- 상세 화면에서도 API 데이터 사용
- 환경변수를 통한 API 키 설정

### 사용한 함수와 특징

| 함수 | 사용 목적 | 특징 |
| --- | --- | --- |
| `axios.get()` | OpenWeather API에 GET 요청 | 응답 본문은 `response.data`에서 확인하며, `params` 옵션으로 query string을 구성할 수 있습니다. |
| `async/await` | 비동기 API 코드를 순서대로 작성 | Promise 기반 코드를 동기 코드처럼 읽기 쉽게 작성할 수 있습니다. |
| `Promise.all()` | 기본 네 도시를 동시에 요청 | 여러 요청을 순차 실행하지 않고 병렬로 처리합니다. 하나라도 실패하면 전체 Promise가 실패합니다. |
| `try/catch/finally` | 성공·실패·종료 상태 처리 | `catch`에서 오류 문구를 저장하고 `finally`에서 성공 여부와 상관없이 로딩 상태를 종료합니다. |
| `onMounted()` | 화면이 장착된 직후 API 호출 | DOM에 컴포넌트가 마운트된 다음 실행되는 생명주기 함수입니다. |
| `mapWeatherData()` | API 응답을 카드 규격으로 변환 | API 구조가 바뀌거나 화면 필드가 달라도 변환 함수를 한 곳에서 관리할 수 있습니다. |

## 과제 7: Element Plus 적용

일곱 번째 과제에서는 직접 만든 기본 HTML UI를 Element Plus 컴포넌트로 교체했습니다. 기능 로직은 유지하면서 화면의 디자인과 상태 표현을 통일했습니다.

### 적용한 UI 컴포넌트

| Element Plus 컴포넌트 | 사용 위치 |
| --- | --- |
| `el-card` | 검색, 즐겨찾기, 날씨 목록과 도시 카드 |
| `el-input` | API 도시 검색창 |
| `el-checkbox` | 즐겨찾기 도시만 보기 |
| `el-button` | 검색, 상세보기, 즐겨찾기, 단위 변경, 재시도 |
| `el-tag` | 더움·선선함 상태 배지 |
| `el-skeleton` | 날씨를 불러오는 동안 로딩 화면 |
| `el-alert` | 오류와 선택 상태 표시 |
| `el-empty` | 검색 결과가 없을 때 빈 상태 표시 |
| `el-steps` | 서비스 이용 안내 단계 |

### 사용한 함수와 특징

| 함수 또는 방식 | 사용 목적 | 특징 |
| --- | --- | --- |
| `app.use(ElementPlus)` | Element Plus 전역 등록 | 각 파일에서 UI 컴포넌트를 하나씩 import하지 않고 템플릿에서 사용할 수 있습니다. |
| `defineProps()` | Element UI 컴포넌트에 현재 상태 전달 | 검색어, 로딩 여부, 즐겨찾기 여부에 따라 UI가 자동 변경됩니다. |
| `defineEmits()` | 검색 및 버튼 이벤트를 부모로 전달 | UI 컴포넌트와 실제 데이터 처리 로직을 분리할 수 있습니다. |
| Scoped CSS와 `:deep()` | Element Plus 내부 스타일 일부 조정 | scoped 영역에서 라이브러리 내부 클래스에 스타일을 적용할 때 사용했습니다. |

## 최종 완성본

최종 완성본은 과제 1부터 7까지 배운 내용을 하나의 날씨 서비스로 통합한 화면입니다.

### 완성 기능

- 상단 메뉴에서 `과제 1 ~ 과제 7`과 `최종 완성본` 화면 전환
- 과제 화면을 2×2 형태로 배치
- 서울·수원·부산·제주의 실시간 날씨 자동 조회
- 한글·영문 국내외 도시 검색
- 검색 결과를 기존 카드 목록에 추가하고 중복 도시는 최신 데이터로 갱신
- OpenWeather Geocoding API로 도시 좌표 확인
- 날씨 코드에 맞는 이모티콘 표시
- 도시 카드를 한 행에 두 개씩 배치하고 모바일에서는 한 열로 변경
- 즐겨찾기 추가·해제 및 즐겨찾기 도시만 보기
- 즐겨찾기와 화면 모드를 `localStorage`에 저장
- 섭씨·화씨 단위 전환
- 상세 화면에서 기온, 상태, 습도, 풍속 확인
- 보라색 `#8445FF` 테마와 반응형 레이아웃

### 최종본의 주요 함수

| 함수 | 역할 | 특징 |
| --- | --- | --- |
| `loadWeather()` | 기본 네 도시 날씨 조회 | 로딩과 오류 상태를 관리하고 완료 시 Store에 갱신 시간을 기록합니다. |
| `searchCity()` | 입력한 도시를 API로 검색 | 기존 도시와 `apiId`가 같으면 갱신하고 새로운 도시이면 목록 앞에 추가합니다. |
| `fetchWeatherByCity()` | 도시명을 좌표로 바꾼 뒤 날씨 조회 | 한글 별칭과 Geocoding API를 함께 사용해 한글 검색을 지원합니다. |
| `fetchWeatherList()` | 기본 네 도시 동시 조회 | `Promise.all()`로 네 요청을 병렬 처리합니다. |
| `fetchWeatherById()` | 상세 화면에 필요한 도시 조회 | 라우터의 도시 ID와 API 검색 결과를 연결합니다. |
| `getWeatherEmoji()` | 날씨 코드에 맞는 이모티콘 선택 | 맑음, 구름, 비, 눈, 안개, 천둥을 OpenWeather 코드 범위로 구분합니다. |
| `filteredWeatherList` | 즐겨찾기 조건을 적용한 목록 | `computed()`이므로 즐겨찾기 상태가 바뀌면 자동으로 다시 계산됩니다. |
| `toggleFavorite()` | 즐겨찾기 ID 추가 또는 제거 | 같은 함수를 추가와 해제에 모두 사용합니다. |
| `handleDetailJump()` | 선택한 도시의 상세 경로로 이동 | 동적 path parameter와 도시 query를 함께 전달합니다. |
| `watch(searchQuery)` | 검색어를 URL query와 동기화 | 새로고침하거나 URL을 공유해도 검색어를 복원할 수 있습니다. |
| `watch(favoriteCityIds)` | 즐겨찾기를 브라우저에 저장 | 배열이 변경될 때마다 `localStorage`에 JSON 문자열로 저장합니다. |

### 날씨 이모티콘 규칙

| 날씨 | 이모티콘 |
| --- | --- |
| 맑음 | ☀️ / 밤에는 🌙 |
| 약간 흐림 | 🌤️ |
| 구름·흐림 | ⛅️ |
| 비 | 🌧️ |
| 이슬비 | 🌦️ |
| 눈 | 🌨️ |
| 안개·박무 | 🌫️ |
| 천둥번개 | ⛈️ |

## 프로젝트 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 OpenWeather API 키를 입력합니다.

```env
VITE_OPENWEATHER_API_KEY=발급받은_API_KEY
```

`.env.local`에는 실제 키가 들어가므로 Git에 커밋하지 않습니다. 저장소에는 변수 이름만 안내하는 `.env.example`을 포함했습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 검사 및 프로덕션 빌드

```bash
npm run lint
npm run build
```

빌드 결과는 `dist/` 폴더에 생성됩니다.

## Vercel 배포 설정

| 항목 | 설정값 |
| --- | --- |
| Framework Preset | Vite |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` 또는 `npm ci` |

Vercel의 Environment Variables에는 다음 변수를 Production과 Preview 환경에 등록해야 합니다.

```text
VITE_OPENWEATHER_API_KEY
```

Vue Router의 직접 URL 접근과 새로고침을 지원하려면 프로젝트 루트의 `vercel.json`에 SPA rewrite 설정이 필요합니다.

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 프로젝트를 진행하며 배운 점

처음에는 화면에 값을 출력하는 것만으로도 복잡했지만, 과제를 단계별로 진행하면서 Vue의 역할을 조금씩 구분할 수 있었습니다.

- `ref`는 변경되는 원본 상태에 사용했습니다.
- `computed`는 원본 상태로부터 계산되는 값에 사용했습니다.
- `watch`는 저장이나 URL 변경 같은 부수 효과에 사용했습니다.
- Props와 Emits를 사용하면 부모와 자식의 역할을 분리할 수 있었습니다.
- Router는 화면 이동, Pinia는 공통 상태, Axios는 서버 통신을 담당했습니다.
- UI 라이브러리를 사용해도 데이터와 이벤트를 연결하는 Vue 로직은 직접 설계해야 한다는 점을 배웠습니다.

이 프로젝트를 통해 하나의 큰 화면을 만드는 것보다 상태, 컴포넌트, API, 라우터의 역할을 나누는 것이 유지보수에 더 중요하다는 것을 알게 되었습니다.
