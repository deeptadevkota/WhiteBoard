var channel = 'draw_channel';

var pubnub = PUBNUB.init({
    publish_key: 'pub-c-c7242916-3a0c-4a4f-a486-f4a1ddb420eb',
    subscribe_key: 'sub-c-79dbfcf4-625f-11eb-8f08-92456e14fb5a',
    ssl: true
});


pubnub.subscribe({
    channel: channel,
    callback: drawFromStream,
});

function publish(data) {
    pubnub.publish({
        channel: channel,
        message: data
    });
}


const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
//array to collect coordinates
var plots = [];

window.addEventListener('load', () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
})

let drawing = false;
function startDrawing(e) {
    drawing = true;
    draw(e);
}

function finishDrawing() {
    drawing = false;
    plots = [];
}

function draw(e) {
    if (drawing == false)
        return;
    let x = e.clientX, y = e.clientY;
    let z = null;
    if (plots.length >= 1)
        z = plots[plots.length - 1];
    plots = [];
    plots.push(z);
    plots.push({ x: x, y: y });
    drawOnCanvas(plots);
    publish({
        plots: plots
    });
}

function drawOnCanvas(plots) {
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    if (plots.length >= 2)
        ctx.moveTo(plots[plots.length - 2].x, plots[plots.length - 2].y);
    ctx.lineTo(plots[plots.length - 1].x, plots[plots.length - 1].y);
    ctx.stroke();
}
function drawFromStream(message) {
    if (!message) return;

    ctx.beginPath();
    drawOnCanvas(message.plots);
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', finishDrawing);
canvas.addEventListener('mousemove', draw);
