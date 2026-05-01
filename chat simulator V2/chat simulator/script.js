let trust = 0;
let current = 0;
let typingBubble = null;
let negStreak = 0;

const dialogue = [
  {
    message: "yo",
    choices: [
      { text: "what's up", effect: +1 },
      { text: "busy rn", effect: -2 }
    ]
  },
  {
    message: "idk man, just been feeling off lately",
    choices: [
      { text: "what do you mean?", effect: +2 },
      { text: "you'll be fine bro", effect: -2 }
    ]
  },
  {
    message: "like, ever since i dropped out everything feels weird",
    choices: [
      { text: "you had to do what was best for you", effect: +2 },
      { text: "you should've pushed through", effect: -2 }
    ]
  },
  {
    message: "i just feel like i'm falling behind everyone",
    choices: [
      { text: "you're not behind", effect: +2 },
      { text: "you kinda are though", effect: -2 }
    ]
  },
  {
    message: "especially seeing you still there",
    choices: [
      { text: "i didn't realize it felt like that", effect: +2 },
      { text: "i'm just focused on my stuff", effect: -1 }
    ]
  },
  {
    message: "i didn't wanna dump all this on you",
    choices: [
      { text: "you can talk to me", effect: +2 },
      { text: "i'm not good at this stuff", effect: -1 }
    ]
  },
  {
    message: "i just feel like i lost everything i was working toward",
    choices: [
      { text: "you didn't lose everything", effect: +2 },
      { text: "you can go back later", effect: 0 }
    ]
  },
  {
    message: "honestly i just feel stuck",
    choices: [
      { text: "what feels the worst?", effect: +2 },
      { text: "you're overthinking it", effect: -2 }
    ]
  },
  {
    message: "feels like i let everyone down",
    choices: [
      { text: "you didn't let anyone down", effect: +2 },
      { text: "people expected more", effect: -2 }
    ]
  },
  {
    message: "i didn't think you'd actually listen like this",
    choices: [
      { text: "i'm trying to", effect: +1 },
      { text: "i'm just being real", effect: -1 }
    ]
  },
  {
    message: "thanks",
    choices: [
      { text: "you can talk to me anytime", effect: +2 },
      { text: "just don’t rely on me too much", effect: -2 }
    ]
  },
  {
    message: () => getEnding(),
    choices: []
  }
];

/* REACTIONS */
function getReaction(effect) {
  if (negStreak >= 4) return "why do i even bother talking about this with you";
  if (negStreak === 3) return "dude you're not even listening to me";
  if (negStreak === 2) return "you're kinda brushing this off";

  const chance = Math.random();

  if (effect >= 2 && chance < 0.5) {
    return "yeah that helps";
  }

  if (effect <= -2 && chance < 0.5) {
    return "yeah";
  }

  return null;
}

/* ENDING */
function getEnding() {
  if (negStreak >= 4) return "whatever man. i'm done talking about this";
  if (trust >= 5) return "i'm really glad i talked to you, i needed that";
  if (trust >= 1) return "thanks for listening, it helped a bit";
  return "yeah, nevermind";
}

/* UI */
function updateBackground() {
  document.body.classList.remove("good", "bad");
  if (trust >= 1) document.body.classList.add("good");
  if (trust <= -1) document.body.classList.add("bad");
}

function addMessage(text, sender) {
  const chat = document.getElementById("chat");

  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = text;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* TYPING */
function showTyping() {
  const chat = document.getElementById("chat");

  typingBubble = document.createElement("div");
  typingBubble.className = "message simon typing";
  typingBubble.textContent = "Simon is typing...";

  chat.appendChild(typingBubble);
  chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
  if (typingBubble) {
    typingBubble.remove();
    typingBubble = null;
  }
}

/* CHOICES */
function showChoices(node) {
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  if (!node.choices.length) {
    const btn = document.createElement("button");
    btn.textContent = "Restart";
    btn.onclick = restartGame;
    choicesDiv.appendChild(btn);
    return;
  }

  node.choices.forEach((choice, i) => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.onclick = () => choose(i);
    choicesDiv.appendChild(btn);
  });
}

/* FLOW */
function showNode(index2) {
  const node = dialogue[index2];

  showTyping();

  setTimeout(() => {
    hideTyping();

    const text =
      typeof node.message === "function"
        ? node.message()
        : node.message;

    addMessage(text, "simon");
    showChoices(node);
  }, 900);
}

function choose(i) {
  const choice = dialogue[current].choices[i];

  trust += choice.effect;

  if (choice.effect < 0) negStreak++;
  else negStreak = 0;

  updateBackground();

  addMessage(choice.text, "isaac");

  const reaction = getReaction(choice.effect);

  if (reaction) {
    setTimeout(() => {
      addMessage(reaction, "simon");
      next();
    }, 500);
  } else {
    next();
  }
}

function next() {
  if (negStreak >= 4) {
    showNode(dialogue.length - 1);
    return;
  }

  current++;
  setTimeout(() => showNode(current), 700);
}

function restartGame() {
  document.getElementById("chat").innerHTML = "";
  trust = 0;
  current = 0;
  negStreak = 0;
  updateBackground();
  showNode(0);
}

/* START */
window.onload = () => showNode(0);