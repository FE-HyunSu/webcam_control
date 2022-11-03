// 카메라 및 웹캠을 시작하는 함수 입니다.
// 사용자에게 미디어 입력 장치 사용 권한을 체크하고(mediaDevices.getDisplayMedia), 
// 권한이 있다면, video 태그에 stream을 적용하고, videoCanvas 함수를 통해 canvas로 복사합니다.
// 권한이 없다면 알럿 메세지와 로딩모션, 재시작 버튼을 노출합니다.
function webCamStart(tagName){
	const screenVideo = document.getElementById('screenVideo');
	const msgPermission = '카메라 사용 권한이 없습니다.\n카메라 및 마이크 권한을 허용하고 다시 시도해 주세요:)'; // 사용권한 없을때 오류 메세지

	if(navigator.mediaDevices.getDisplayMedia){
		navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }, audio:true})
		.then((stream) => {
			screenVideo.srcObject = stream;
			document.getElementById('screenBox').classList.remove('type-ready');
			videoCanvas(tagName);
		}).catch((error) => {
			console.log(error);
			document.getElementById('screenBox').classList.add('type-ready');
			alert(msgPermission);
		});
	} else {
		alert(msgPermission);
	}
}

// screenVideo에 출력되는 영상을 canvas로 복사합니다. 매개변수로 canvas의 tagName값을 갖습니다.
// tagName을 인자값으로 함수를 호출하여 원하는 canvas 영역에 영상을 복사하는 역할을 하는 함수입니다.
let canvasInterval;
function videoCanvas(tagName){
	let targetTag = document.querySelector(tagName);
	let screenVideo = document.getElementById('screenVideo');
	canvasInterval = setInterval(() => {
		targetTag.getContext('2d').drawImage(screenVideo, 0, 0, 640, 480);
		targetTag.parentElement.classList.add('active');
	}, 10);
}

// 영상을 캡처하는 함수입니다.
// 캡처된 이미지를 클릭하면 'img_capture_{userName}_yyyy_mm_dd_hh_min.png' 파일명 타입으로 이미지를 다운로드 처리 하는 함수입니다.
// 과제 내용에는 없는 내용이지만, 기능을 추가해 보았습니다.
function videoCapture(){
	let nowTime = new Date();
	const screenCanvas = document.getElementById('screenCanvas');
	const localUrl = screenCanvas.toDataURL('image/png');
	const link = document.createElement('a');
	const captureBox = document.querySelector('#captureBox');
	const captureSound = new Audio('../sound/sound_capture.mp3');

	captureSound.play();
	link.href = localUrl;
	link.innerHTML = '<img src="' + localUrl + '" alt="" />';
	link.setAttribute('download', 'img_capture_' + localStorage.getItem('userName') + '_' + nowTime.getFullYear() + '_' + (nowTime.getMonth() + 1) + '_' + nowTime.getDate() + '_' + nowTime.getHours() + '_' + nowTime.getMinutes());
	captureBox.innerHTML = '';
	captureBox.appendChild(link, captureBox.firstChild);
	localStorage.setItem('imgBox', captureBox.innerHTML);
}

// 이름값 validation 체크하는 함수입니다.
// 해당 input value 값의 앞뒤 공백을 제외 글자 수 1이상 일때 && 비디오 및 마이크 권한이 있을때, 입장 버튼이 활성화 됩니다.
function validationName(){
	let userName = document.getElementById('userName');
	if(userName.value.trim().length > 0 && navigator.mediaDevices.getDisplayMedia){
		userName.parentElement.querySelector('button').classList.add('active');
	} else {
		userName.parentElement.querySelector('button').classList.remove('active');
	}
}

// 입장하기 버튼 클릭 시 실행되는 로그인 함수 입니다. 
// 이름값을 localStorage에 저장하고, 로그인 처리 후 필요한 정보를 셋팅하는 setUser 함수를 호출합니다.
function login(){
	let userName = document.getElementById('userName');
	if(userName.value.trim().length <= 0){
		alert('이름을 입력해 주세요.');
		userName.focus();
	} else if(navigator.mediaDevices.getDisplayMedia){
		localStorage.setItem('userName', userName.value);
		userName.value = '';
		validationName();
		setUser();
	} else {
		alert('카메라 사용 권한이 없습니다.\n카메라 및 마이크 권한을 허용하고 다시 시도해 주세요:)');
	}
}

// 로그인이 된 경우, 유저의 이름을 셋팅하고, 입장 버튼영역을 제거합니다.
function setUser(){
	let headerIntro = document.getElementById('headerIntro');
	if(localStorage.getItem('userName')){
		document.querySelector('.section-homework').classList.add('join-mode');
		document.querySelectorAll('.user-name').forEach(item => {
			item.innerHTML = '<span>' + localStorage.getItem('userName') + '</span>';
		});
		headerIntro.innerHTML = '안녕하세요 <em>' + localStorage.getItem('userName') + '</em>님. \n' +
		'<button type="button" class="btn-header" onclick="videoCanvas(\'#screenCanvasCopy\');">복사</button>' +
		'<button type="button" class="btn-header" onclick="videoCapture();">캡처</button>' +
		'<button type="button" class="btn-header" onclick="captureSend();">전송</button>' +
		'<button type="button" class="btn-header logout" onclick="logout();">로그아웃</button>' ;
	}
}

// 캡처된 사진을 새창으로 띄웁니다. 이미지 클릭 시 다운로드 가능합니다.
// 캡처된 사진이 없는 상태로 전송 시 캡처 동작 후 새창을 띄웁니다.
function captureSend(){
	let options = 'toolbar=no,scrollbars=no,resizable=yes,status=no, menubar=no, width=640, height=480, top=0, left=0';
	if(!document.querySelector('#captureBox').querySelector('a')){
		videoCapture();
	}
	window.open('capture.html','capturePop',options);
}

// 로그아웃 시 실행되는 함수 입니다.
// localStorage에 저장된 이름값을 삭제하고, 페이지를 새로고침 합니다.
function logout(){
	localStorage.removeItem('userName');
	localStorage.removeItem('imgBox');
	location.reload();
}

// canvas에 복사된 영상을 초기화 하는 함수입니다. 
// 로그아웃 처리 시 복사된 canvas가 있다면, 초기화합니다. tagName을 매개변수로 갖습니다.
function clearCanvas(tagName){
	let targetItem = document.querySelector(tagName);
	if(targetItem.classList.contains('active')){
		clearInterval(canvasInterval);
		targetItem.getContext('2d').clearRect(0, 0, targetItem.width, targetItem.height);
		targetItem.classList.remove('active');
	}
}

// 마이크 소리를 제어하는 토글 함수 입니다.
function audioToggle(){
	const btnAudio = document.getElementById('btnAudio');
	let targetAudio = document.getElementById('screenVideo').srcObject.getAudioTracks()[0];
	if(targetAudio.enabled){
		targetAudio.enabled = false;
		btnAudio.classList.remove('active');
	} else {
		targetAudio.enabled = true;
		btnAudio.classList.add('active');
	}
}