const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const score = document.getElementById("pontuacao");
let pontuacao = 0;
let jogoIniciado = false;
const threshold = 0.05;
let isJumping = false;

const data = ['', ];
const net = new brain.NeuralNetwork();

net.train(data);
const trainedNetwork = net.toFunction();

// Variável para controlar a verificação de shouldJump
let canCheckShouldJump = true;

function iniciarJogo() {
  let isAlive = setInterval(function () {
    if (!jogoIniciado) {
      clearInterval(isAlive);
    }

    // get current dino Y position
    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));

    // get current cactus X position
    let cactusLeft = parseInt(
      window.getComputedStyle(cactus).getPropertyValue("left")
    );

    if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
      // collision with cactus
      alert('Game over cacto');
      location.reload();
    } else {
      if (!isJumping) {
        isJumping = true; // Set the jumping flag
        jump();
        canCheckShouldJump = false; // Evitar verificação temporariamente
        setTimeout(() => {
          isJumping = false; // Reset the jumping flag after the jump
          canCheckShouldJump = true; // Permitir verificação novamente
        }, 100); // Limit jumping to every 100 milliseconds
      }
      pontuacao++;
      score.innerHTML = pontuacao;
      recordGameData();
    }
  }, 10);
}

function recordGameData() {
  if (!canCheckShouldJump) {
    return; // Evitar registro de dados temporariamente
  }

  const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
  const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

  // Define a threshold value for cactusLeft where the dino should jump
  const jumpThreshold = 150;
  const shouldJump = cactusLeft < jumpThreshold && dinoTop >= 140;

  data.push({
    input: { dinoTop, cactusLeft },
    output: { shouldJump: shouldJump ? 1 : 0 },
  });

  if (data.length > 10) {
    data.shift();
  }
}

function aiJump() {
  if (canCheckShouldJump) { // Verificar apenas se canCheckShouldJump for verdadeira
    const dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));
    const cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue("left"));

    // Use the trained model to make the decision
    const decision = trainedNetwork({ dinoTop, cactusLeft });

    if (decision.shouldJump > threshold) {
      jump();
    }
  }
}

function jump() {
  if (dino.classList != "jump") {
    dino.classList.add("jump");
    setTimeout(function () {
      dino.classList.remove("jump");
    }, 300);
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" && !jogoIniciado) {
    jogoIniciado = true;
    iniciarJogo();
  }
});
