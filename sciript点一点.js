// 定义全局变量
var canvas, ctx, score, balloons;
var balloonColors = ['red', 'blue', 'green']; // 气球颜色数组，可根据需要进行扩展
var balloonClicks = {}; // 气球点击次数记录对象

// Balloon函数用于创建气球对象
function Balloon(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.visible = true;
  this.clicks = 0; // 记录小球的点击次数
}

// 清除画布内容
function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 绘制游戏界面
function drawScreen() {
  clearScreen();

  ctx.font = "24px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("点一点", 10, 30);
  ctx.fillText("得分: " + score, 10, 60);
  // 绘制气球
  for (var i = 0; i < balloons.length; i++) {
    var balloon = balloons[i];
    if (balloon.visible) {
      ctx.beginPath();
      ctx.arc(balloon.x, balloon.y, balloon.radius, 0, 2 * Math.PI);
      ctx.fillStyle = balloon.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}

// 更新游戏逻辑
function updateLogic() {
  // 遍历气球数组，将已显示的气球状态设置为隐藏
  for (var i = 0; i < balloons.length; i++) {
    var balloon = balloons[i];
    if (balloon.visible) {
      balloon.visible = false;
    }
  }

  // 生成新的气球对象
  var x = Math.random() * canvas.width;
  var y = Math.random() * canvas.height;
  var radius = Math.random() * 50 + 20; // 气球半径范围可根据需要进行调整
  var color = getRandomColor();
  var newBalloon = new Balloon(x, y, radius, color);
  balloons.push(newBalloon);

  drawScreen();

  // 检查游戏状态
  checkGameStatus();
}
// 判断游戏是否结束并重新开始
function checkGameStatus() {
  // 检查上一个气球是否被点击消除
  if (balloons.length > 1 && balloons[balloons.length - 2].visible) {
    endGame(); // 游戏结束
  }
}
// 判断点击位置是否与气球重叠，并更新得分和气球状态
function hit(event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;
  var hitBalloon = null;

  for (var i = 0; i < balloons.length; i++) {
    var balloon = balloons[i];
    if (balloon.visible) {
      var dx = mouseX - balloon.x;
      var dy = mouseY - balloon.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < balloon.radius) {
        // 点击位置与气球重叠
        hitBalloon = balloon;
        break;
      }
    }
  }

  if (hitBalloon) {
    // 更新小球的点击次数
    hitBalloon.clicks++;

    if (hitBalloon.clicks >= getColorClickLimit(hitBalloon.color)) {
      // 当点击次数达到颜色对应的点击限制时，气球消失
      hitBalloon.visible = false;
      score += getScoreIncrement(hitBalloon.color);
    }

    drawScreen();
  }

  // 下一个小球出现后重置点击次数
  if (balloons.length === 1) {
    resetBalloonClicks();
  }
}

// 初始化游戏
function init() {
  // 获取画布和上下文
  canvas = document.getElementById("screen");
  ctx = canvas.getContext("2d");

  // 设置初始得分和气球数组
  score = 0;
  balloons = [];

  // 添加点击事件监听器
  canvas.addEventListener("click", hit);

  // 定时调用绘制和逻辑更新函数
  setInterval(updateLogic, 1000); // 可根据需要调整更新间隔
}

// 生成随机颜色
function getRandomColor() {
  var randomIndex = Math.floor(Math.random() * balloonColors.length);
  return balloonColors[randomIndex];
}

// 获取颜色对应的点击限制
function getColorClickLimit(color) {
  // 可根据需要设定不同颜色对应的点击限制
  if (color === 'red') {
    return 1;
  } else if (color === 'blue') {
    return 2;
  } else if (color === 'green') {
    return 3;
  }
}

// 获取颜色对应的得分增量
function getScoreIncrement(color) {
  // 可根据需要设定不同颜色对应的得分增量
  if (color === 'red') {
    return 1;
  } else if (color === 'blue') {
    return 2;
  } else if (color === 'green') {
    return 3;
  }
}

// 重置气球点击次数
function resetBalloonClicks() {
  for (var i = 0; i < balloons.length; i++) {
    balloons[i].clicks = 0;
  }
}

// 判断游戏是否结束并重新开始
function checkGameStatus() {
  // 检查是否还有可见的气球
  var hasVisibleBalloons = balloons.some(balloon => balloon.visible);

  if (!hasVisibleBalloons) {
    endGame(); // 游戏结束
  }
}

// 重新开始游戏
function restartGame() {
  // 清除画布内容
  clearScreen();

  // 重新初始化游戏
  score = 0;
  balloons = [];
  resetBalloonClicks();
  updateLogic();
}

// 游戏结束
function endGame() {
  clearScreen();

  ctx.font = "36px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("游戏结束", canvas.width / 2 - 100, canvas.height / 2);

  // 添加重新开始的选项
  ctx.font = "24px Arial";
  ctx.fillText("按空格键重新开始", canvas.width / 2 - 130, canvas.height / 2 + 40);

  // 监听空格键按下事件，重新开始游戏
  document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
      restartGame();
    }
  });
}

// 在页面加载完成后初始化游戏
window.addEventListener("load", function () {
  init(); // 初始化游戏

  // 监听空格键按下事件，重新开始游戏
  document.addEventListener("keydown", function (event) {
    if (event.key === " ") {
      restartGame();
    }
  });
});