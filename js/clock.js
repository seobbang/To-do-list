const showDate = document.querySelector("#date");
const clock = document.querySelector("#clock");
const days = ["일", "월", "화", "수", "목", "금", "토"];

function getClock() {
    const dateInf = new Date();
    const year = dateInf.getFullYear();
    const month = dateInf.getMonth() + 1;
    const date = dateInf.getDate();
    const day = days[dateInf.getDay()];

    const hours = String(dateInf.getHours()).padStart(2,"0");
    const minutes = String(dateInf.getMinutes()).padStart(2,"0");

    showDate.innerText = year + "년 " + month + "월 " + date +"일 " + day +"요일"
    clock.innerText = hours+":"+minutes;
}

getClock();
setInterval(getClock, 1000); //1초마다 시간 갱신