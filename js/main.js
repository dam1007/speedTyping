const typingText = document.querySelector('.typing-text p'),
inputField = document.querySelector('.wrapper .input-field'),
mistakeTag = document.querySelector('.mistake span'),
timeTag = document.querySelector('.time b'),
wpmTag = document.querySelector('.wpm span'),
cpmTag = document.querySelector('.cpm span'),
tryAgainBtn = document.querySelector('button');


let timer,
maxTime = 60,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function randomParagraph(){
    //console.log(paragraphs[0]);
    //paragraphs의 길이보다 작은 index 숫자 랜덤으로 가져오기
    let randomIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = ''; //paragraphLoad
    //랜덤으로 선택된 문장을 쪼개 span으로 감싼 뒤 p 태그 안에 출력 
    paragraphs[randomIndex].split('').forEach(span => {
        let spanTag = `<span>${span}</span>`;
        typingText.innerHTML += spanTag;
    });
    typingText.querySelectorAll('span')[0].classList.add('active'); //첫 단어 blink 효과
    //keydown, click 이벤트 시 input field에 포커스
    document.addEventListener('keydown', () => inputField.focus());
    typingText.addEventListener('click', () => inputField.focus());
   
}
function initTyping(){
    const characters = typingText.querySelectorAll('span');
    //console.log(characters);
    //input 이벤트 일어날 때 value값을 쪼갠 뒤 해당 인덱스값 
    let typedChar = inputField.value.split('')[charIndex];
    if(charIndex < characters.length - 1 && timeLeft > 0){
        if(!isTyping) {
            //시간제한
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        
        //사용자가 아무 단어로 입력하지 않거나 backspace를 눌렀을 때
        if(typedChar == null){
            charIndex--; //charIndex 감소
            //charIndex span이 incorrect class를 가지고 있을 때만 오타 감소
            if(characters[charIndex].classList.contains('incorrect')) {
                mistakes--; //지우면 오타 없애기
            }
            characters[charIndex].classList.remove('correct','incorrect');
        } else {
            //입력한 인덱스의 값과 제시 문장의 인덱스의 값 비교하기
            if(characters[charIndex].innerText === typedChar){
                //console.log('correct');
                characters[charIndex].classList.add('correct');
            } else {
                //console.log('incorrect');
                mistakes++;
                characters[charIndex].classList.add('incorrect');
            }
            charIndex ++;
        }
        //진행중인 타자 active 효과
        characters.forEach(span => span.classList.remove('active'));
        characters[charIndex].classList.add('active');
    
        let wpm = Math.round((((charIndex - mistakes) / 5) / (maxTime - timeLeft))* 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm; //wpm값이 0이거나, 무한일 때 값을 0으로 설정
        mistakeTag.innerText = mistakes;
        wpm.innerText = wpm;
        cpmTag.innerText = charIndex - mistakes; // cpm will not count mistakes
        
    } else {
        inputField.value = '';
        clearInterval(timer);
    }
}

//타이머. 그러나 인풋에 이벤트가 일어날 때마다 초가 감소하는 문제 발생. so 처음 한 번만 카운트다운 될 수 있도록.
function initTimer(){
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
    }
}

//게임리셋 함수
function resetGame(){
    //loadParagrapn 함수 부르기,
    //각 변소와 요소들의 값 기본으로 리셋 시키기
    randomParagraph();
    inputField.value = ''; //input 내용 리셋
    clearInterval(timer); //시간 리셋
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;    
    timeTag.innerText = timeLeft;
    mistakeTag.innerText = mistakes;
    wpm.innerText = 0;
    cpmTag.innerText = 0;
}

randomParagraph();
inputField.addEventListener('input', initTyping);
tryAgainBtn.addEventListener('click', resetGame); //버튼 클릭 시 게임 리셋