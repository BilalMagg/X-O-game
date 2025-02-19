const circleIcon = "<i class='bx bx-circle'></i>";
const xIcon = "<i class='bx bx-x'></i>";
let playerVSFriendCount = 0;
let playerVSComputerCount = 0;
const friendlyBtn = document.querySelector('.friendly');
let friendCount = 0;
const computerBtn = document.querySelector('.computer');
let computerCount = 0;
const resetBtn = document.querySelector('.reset');
const difficulty = document.querySelector('.difficulty');
let turnPlayer = 1;
let opponent = 2;
const table = [[0,0,0],[0,0,0],[0,0,0]];

function switchPlayer(opponent) {
  return (turnPlayer===1)? ((opponent===2)? 2 : 3) : 1;
}

function fillBox(id,icon) {
  const box = document.getElementById(`${id}`);
  
  if (box.classList.contains('marked')) {
    // turnPlayer = switchPlayer(opponent);
    return;

  } else {
    box.classList.add('marked');
    box.innerHTML = (icon === 'x')? xIcon : circleIcon;
    table[Math.floor((id-1)/3)][(id-1)%3] = turnPlayer;
    turnPlayer = switchPlayer(opponent);
  }

  if(isBoardFull()) {
    // turnPlayer = 1;
    if (opponent === 2) {
      friendlyBtn.innerHTML = 'Play Again';
    } else {
      computerBtn.innerHTML = 'Play Again';
    }
  }

  const result = test();
  if(result) {
    const check = test2();
    document.getElementById(`${check[0]}`).classList.add('win');
    document.getElementById(`${check[1]}`).classList.add('win');
    document.getElementById(`${check[2]}`).classList.add('win');
    // turnPlayer = 1;
    if (opponent === 2) {
      friendlyBtn.innerHTML = 'Play Again';
    } else {
      computerBtn.innerHTML = 'Play Again';
    }
    score(result);
    return;
  }
}

document.querySelectorAll('.box').forEach((box) => {
  box.addEventListener('click', () => {
    if(test()) {
      return;
    }
    
    if (box.classList.contains('marked')) {
      return;
    }
    fillBox(box.id,(turnPlayer===1)? 'x':'circle');

    if(test() || isBoardFull()) {
      return;
    }

    if(opponent===3) {
      // debugger;
      setTimeout(() => {

        const move = (difficultyLevel==1)? findBestMove() : findRandomMove();
        if (move.row=== -1 || move.col=== -1) {
          turnPlayer = switchPlayer(opponent);
          return;
        }
        fillBox(move.row*3 + move.col + 1, 'circle');
      }, 500);
    }
  })
})

function test2(board=table) {
  for (let i = 0; i < 3; i++) {
      if (board[i][0]===board[i][1] && board[i][1]===board[i][2] && board[i][2]!==0) {
        return [3*i+1,3*i+2,3*i+3];
      }
      if(board[0][i]===board[1][i] && board[1][i]===board[2][i] && board[2][i]!==0) {
        return [i+1,3+i+1,6+i+1];
      }
  }

  if(board[0][0]===board[1][1] && board[1][1]===board[2][2] && board[2][2]!==0) {
    return [1,5,9];
  }
  if(board[0][2]===board[1][1] && board[1][1]===board[2][0] && board[2][0]!==0) {
    return [3,5,7];
  }
  return 0;
}

function test(board=table) {
  for (let i = 0; i < 3; i++) {
      if (board[i][0]===board[i][1] && board[i][1]===board[i][2] && board[i][2]!==0) {
        return board[i][1];
      }
      if(board[0][i]===board[1][i] && board[1][i]===board[2][i] && board[2][i]!==0) {
        return board[0][i];
      }
  }

  if(board[0][0]===board[1][1] && board[1][1]===board[2][2] && board[2][2]!==0) {
    return board[0][0];
  }
  if(board[0][2]===board[1][1] && board[1][1]===board[2][0] && board[2][0]!==0) {
    return board[0][2];
  }
  return 0;
}

function reset() {
  resetButtons();
  document.querySelectorAll('.box').forEach((box) => {
    box.innerHTML = '';
    box.classList.remove('marked');
    box.classList.remove('win');
    for (let i = 0; i < 3; i++) 
      for (let j = 0; j < 3; j++)
        table[i][j] = 0;
  })
}

resetBtn.addEventListener('click',reset);

function score(Player) {
  if (Player===1) {
    document.querySelector('.count-1').innerHTML = (opponent===2)? ++playerVSFriendCount : ++playerVSComputerCount;
  } else if(Player===2) {
    document.querySelector('.count-2').innerHTML = ++friendCount;
  } else if(Player===3){ 
    document.querySelector('.count-2').innerHTML = ++computerCount;
  }
}

friendlyBtn.addEventListener('click',() => {
  turnPlayer = 1;
  difficulty.innerHTML = ``;
  opponent = 2;
  reset();
  document.querySelector('.player2').innerHTML = 'Player 2:';
  document.querySelector('.count-2').innerHTML = friendCount;
  document.querySelector('.player1').innerHTML = playerVSFriendCount;
});

let difficultyLevel = 0;
computerBtn.addEventListener('click',() => {
  turnPlayer = 1;
  difficulty.innerHTML = `
      <button class="difficulty-easy">Easy</button>
      <button class="difficulty-hard">Hard</button>
    `

  document.querySelector('.difficulty-easy').addEventListener('click', ()=> {
    difficultyLevel = 0;
    difficulty.innerHTML = ``;
  })
  
  document.querySelector('.difficulty-hard').addEventListener('click', ()=> {
    difficultyLevel = 1;
    difficulty.innerHTML = ``;
  })

  reset();
  document.querySelector('.player2').innerHTML = 'Computer:';
  document.querySelector('.count-2').innerHTML = computerCount;
  document.querySelector('.count-1').innerHTML = playerVSComputerCount;
  opponent = 3;
});

function miniMax(board, depth, isMaximazing) {
  const score = test(board);
  if(score===1) return -10 + depth;
  if(score===3) return 10 - depth;
  if(isBoardFull(board)) return 0;

  let bestScore = isMaximazing ? -Infinity : Infinity;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (!board[i][j]) {
        board[i][j] = isMaximazing ? 3 : 1;
  
        // console.log(depth);
        
        const currentScore = miniMax(board,depth + 1,!isMaximazing);
        board[i][j] = 0;
        if (isMaximazing) {
          bestScore = Math.max(currentScore,bestScore);
        } else {
          bestScore = Math.min(currentScore,bestScore);
        }
      }  
    }
  }

  return bestScore;
}

function isBoardFull(board=table) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j]===0) {
        return false;
      }
    }
  }
  return true;
}

function findBestMove(board=table) {
  let bestVal = -Infinity;
  let bestMove = {row:-1,col:-1};

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j]===0) {
        board[i][j] = 3;
        let moveVal = miniMax(board,0,false);
        board[i][j] = 0;

        if (moveVal > bestVal) {
          bestMove.row = i;
          bestMove.col = j;
          bestVal = moveVal;
        }
      }
    }
  }

  return bestMove;
}

function findRandomMove(board = table) {
  const valideMove = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j]===0) {
        valideMove.push({row : i,col : j});
      }
    }
  }
  randomIndex = (Math.floor((Math.random())*valideMove.length)%valideMove.length);
  
  return valideMove[randomIndex];
}

function resetButtons() {
  friendlyBtn.innerHTML = 'Friendly';
  computerBtn.innerHTML = 'Computer';
}