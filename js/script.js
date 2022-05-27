// let's select all required tags or elements

const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  msuicArtist = wrapper.querySelector(".song-details .artist"),
  mainAudio = wrapper.querySelector("#main-audio"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = wrapper.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  showMoreBtn = wrapper.querySelector("#more-music"),
  hideMusicBtn = musicList.querySelector("#close");

// 새로고침시 로드 랜덤뮤직 재생

let musicIndex = Math.floor(Math.random() * allMusic.length + 1);

window.addEventListener("load", () => {
  loadMusic(musicIndex); //뮤직 기능을 부른다 윈도우가 로드되었을때
  playingNow();
});
// load music function
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  msuicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
  mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}
// 플레이 뮤직 기능
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}
// 정지 뮤직 기능
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}
// 다음 뮤직 기능
function nextMusic() {
  // 1의 인덱스 증가
  musicIndex++;
  // 만약 musicIndex가 length보다 커지면 musicIndex는 1이된다. 그래서 첫번째 노래가 출력된다
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
// 이전 뮤직 기능
function prevMusic() {
  // 1의 인덱스 증가
  musicIndex--;
  // 만약 musicIndex가 1보다 작아지면 musicIndex will be array length 그래서 마지막 음악이 출력된다.
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
//플레이 뮤직 버튼 이벤트
playPauseBtn.addEventListener("click", () => {
  const isMusicPaused = wrapper.classList.contains("paused");
  //만약 isMusicPaused 가 true 라면 call pauseMusic 아니면 call PlayMusic
  isMusicPaused ? pauseMusic() : playMusic();
  playingNow();
});

// 다음 뮤직 버튼
nextBtn.addEventListener("click", () => {
  nextMusic();
});

// 이전뮤직버튼
prevBtn.addEventListener("click", () => {
  prevMusic();
});

// 업데이트 progress bar 길이 음악의 최근시간에따라서
mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //음악최근시간 받기
  const duration = e.target.duration; //음악 전체 시간 받기
  let progresWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progresWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");
  mainAudio.addEventListener("loadeddata", () => {
    //.이랑 loadeddate 스펠링 잘쓰기`

    // 업데이트 전체 음악길이
    let audioDuration = mainAudio.duration;
    let totalMin = Math.floor(audioDuration / 60); //이거 분과 초 계산한거임
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding 0 만약 초가 10보다작으면
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });
  // 업데이트 playing song current time
  let currentMin = Math.floor(currentTime / 60); //이거 분과 초 계산한거임
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    //adding 0 만약 초가 10보다작으면
    currentSec = ` 0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
// 업데이이트 playing song current time 진행하는 바의 길이에 따라서
progressArea.addEventListener("click", (e) => {
  let progressWidthval = progressArea.clientWidth; // getting 프로그래스 바 width
  let clickedOffSetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; // getting song total duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

// 반복 셔플송
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  // 1. get the innetText of the icon then we'll change accordingly
  let getText = repeatBtn.innerText; //getting 아이콘의 innerText
  //  let's do different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then change it to repeat_one
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute = ("title", "Song looped");
      break;
    case "repeat_one": //if icon icon is repeat_one then change it to shuffle
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute = ("title", "Playback shuffle");
      break;
    case "shuffle": //if icon icon is shuffle then change it to repeat
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute = ("title", "Playlist looped");
      break;
  }
});

// above we just changed the icon, now let's work on what to do
//after the song ended

mainAudio.addEventListener("ended", () => {
  //we'll do according to the icon means if user ha set icon to loop song then we'll repeat
  //the current song and will do further accordingly

  let getText = repeatBtn.innerText; //getting 아이콘의 innerText

  //  let's do different changes on different icon click using switch
  switch (getText) {
    case "repeat": //if this icon is repeat then simply we call the nextMusic function so th next song will play
      nextMusic();
      break;
    case "repeat_one": //if icon icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beginning
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle": //if icon icon is shuffle then change it to repeat
      //generation random index between the max range of array length
      let randIndex = Math.floor(Math.random() * allMusic.length + 1);
      do {
        randIndex = Math.floor(Math.random() * allMusic.length + 1);
      } while (musicIndex == randIndex); // this loop run until the next random number won't be the same of current music index
      musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
      loadMusic(musicIndex); // calling loadMusic function
      playMusic(); //calling playMusic function
      playingNow();
      break;
  }
});

// 숨겨진 목록 버튼
showMoreBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
hideMusicBtn.addEventListener("click", () => {
  showMoreBtn.click();
});
const ulTag = wrapper.querySelector("ul");

// let's creat li according to the array length
for (let i = 0; i < allMusic.length; i++) {
  // let's pass the song name, artist from the array to li
  let liTag = `<li li-index = "${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <audio class="${allMusic[i].src}" src="songs/${
    allMusic[i].src
  }.mp3"></audio>
                  <span id="${
                    allMusic[i].src
                  }" class="audio-duration">3:40</span>
                </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag);
  // array length  가 6 이라 6개의 li 생성

  let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let audioDuration = liAudioTag.duration;
    let totalMin = Math.floor(audioDuration / 60); //이거 분과 초 계산한거임
    let totalSec = Math.floor(audioDuration % 60);
    if (totalSec < 10) {
      //adding 0 만약 초가 10보다작으면
      totalSec = `0${totalSec}`;
    }
    liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
    //adding t duration attribute which we'll use below
    liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

// let's add onclick attribute on all li

const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    // let's remove playing class rom all other li expect the last one which is clicked
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      //let's get that audio duration value and pass to. audio-duration innertext
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration; //passing t-duration value to audio duration innerText
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
      //if there is an li tag which li-index is equal to musicIndex
      //then this music is playing now and we'll style it
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    // adding onclick attribute on all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}
// let's play song on lu click
function clicked(element) {
  // getting li index of particular clicked li tag
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //passing that liindex to musicIndex
  loadMusic(musicIndex);
  playMusic();
  playingNow();
}
