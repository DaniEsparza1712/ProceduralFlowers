class flower{
  constructor() {
    this.hue = randomBetweenNumbers(40, 60);
    this.hueB = randomBetweenNumbers(0, 360);
    this.petalCount = randomBetweenNumbers(5, 10)*4;
    this.rowCount = randomBetweenNumbers(4, 7);
    this.len = randomBetweenNumbers(40, 60);
    this.width = randomBetweenNumbers(90, 110) / 10;
    this.rotation = randomBetweenNumbers(0, 60);
  }
}

function randomBetweenNumbers(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function download(){
  var link = document.createElement('a');
  link.download = 'flowers.png';
  link.href = document.getElementById('canvas').toDataURL()
  link.click();
}

async function main(){
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  var flowers = 120;

  await new Promise(r => setTimeout(r, 500));
  for(var i = 0; i < flowers; i++){
    var x = randomBetweenNumbers(0, canvas.width);
    var y = randomBetweenNumbers(0, canvas.height);
    var wait = -1;
    if(i === 0)
      wait = 10;
    await drawFlower(context, x, y, wait)
    await new Promise(r => setTimeout(r, 100));
  }
}

async function drawFlower(ctx, spawnX, spawnY, waitTime) {
  var flowerInstance = new flower();
  var iterations = flowerInstance.petalCount;
  var petalLen = flowerInstance.len;

  var hue;
  var chance = randomBetweenNumbers(0, 100);
  if(chance >= 40){
    hue = flowerInstance.hue;
  }
  else{
    hue = flowerInstance.hueB;
  }

  ctx.beginPath();
  ctx.fillStyle = `hsl(35, 56%, 38%)`;
  ctx.ellipse(spawnX, spawnY, 40, 40, 0, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();

  for (var r = 0; r < flowerInstance.rowCount; r++) {
    for (var i = 0; i < iterations; i++) {
      ctx.beginPath();

      var radius = petalLen * 1.75;
      var radians = (2 * Math.PI / iterations * i);

      var vertical = Math.sin(radians);
      var horizontal = Math.cos(radians);

      var x = spawnX + horizontal * radius;
      var y = spawnY + vertical * radius;
      var gradientX0 = spawnX + horizontal * radius;
      var gradientY0 = spawnY + vertical * radius;


      let gradient = ctx.createLinearGradient(gradientX0, gradientY0, spawnX, spawnY);
      gradient.addColorStop(0, `hsl(${(hue + r * 20) % 360}, 100%, 50%)`);
      gradient.addColorStop(0.5, `hsl(${(hue + r * 20) % 360}, 100%, 0%)`)
      ctx.fillStyle = gradient;

      var baseAngle = 90 + (i * 360 / iterations) + (flowerInstance.rotation * Math.PI / 180);
      ctx.ellipse(x, y, flowerInstance.width, petalLen, baseAngle * Math.PI / 180, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      if(waitTime > 0)
        await new Promise(r => setTimeout(r, waitTime));
    }
    petalLen *= (1 - 2.3 / flowerInstance.rowCount);
  }
}
