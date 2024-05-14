const startBtn = document.getElementById('startBtn');
const preview = document.getElementById('preview');

const handleStartRecordClick = async function() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    console.log(stream);

    preview.srcObject = stream;
    preview.play();
}

startBtn.addEventListener('click', handleStartRecordClick);