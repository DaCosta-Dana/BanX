// A native NodeJS module
const { exit } = require("process");
const { setTimeout } = require("timers/promises");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Convert rl's question method from a callback to a promise:
const getInput = (query) =>
  new Promise((resolve) => rl.question(query, resolve));
// Alternatively, you can instead import the promise-based readline module:
// const rl = require('readline/promises');

class Weapon {
  constructor(name, type, price) {
    this.name = name;
    this.type = type;
    this.price = price;
  }
}

var weapons = {
  stinger: new Weapon("Stinger", "SMG", 1100),
  spectre: new Weapon("Spectre", "SMG", 1600),
  bucky: new Weapon("Bucky", "Shotgun", 850),
  judge: new Weapon("Judge", "Shotgun", 1850),
  bulldog: new Weapon("Bulldog", "Rifle", 2050),
  guardian: new Weapon("Guardian", "Rifle", 2250),
  phantom: new Weapon("Phantom", "Rifle", 2900),
  vandal: new Weapon("Vandal", "Rifle", 2900),
  marshal: new Weapon("Marshal", "Sniper Rifle", 950),
  outlaw: new Weapon("Outlaw", "Sniper Rifle", 2400),
  operator: new Weapon("Operator", "Sniper Rifle", 4700),
  ares: new Weapon("Ares", "Machine Gun", 1600),
  odin: new Weapon("Odin", "Machine Gun", 3200),
};

var playerBalances = {};
var playerRequests = {};
var playerWeapons = {};
for (var i = 1; i < 6; i++) {
  playerBalances[i.toString()] = 1000 + Math.floor(Math.random() * 4000);
}

function purchase(name, buyer, recipient) {
  buyer = buyer.toString();
  recipient = recipient.toString();
  name = name.toLowerCase();
  return new Promise((resolve, reject) => {
    if (name in weapons) {
      const weapon = weapons[name];
      if (
        buyer !== recipient &&
        (!(recipient in playerBalances) ||
          !(recipient in playerRequests) ||
          playerRequests[recipient].name !== weapon.name)
      ) {
        reject(
          new Error(
            `Invalid request purchase: weapon ${weapon.name} is not requested by player #${recipient}!`
          )
        );
      } else if (buyer in playerBalances) {
        const balance = playerBalances[buyer];
        if (balance >= weapon.price) {
          playerBalances[buyer] = balance - weapon.price;
          playerWeapons[recipient] = weapon;
          delete playerRequests[recipient];
          resolve(
            `Purchased ${weapon.name} for player #${recipient}. (new balance: ${playerBalances[buyer]})`
          );
        } else {
          reject(
            new Error(
              `Insufficient credits to purchase weapon ${weapon.name} for player #${buyer}: ${weapon.price} (have: ${balance})`
            )
          );
        }
      } else {
        reject(new Error(`Invalid player number: ${buyer}`));
      }
    } else {
      reject(new Error(`Invalid weapon name: ${name}`));
    }
  });
}

function request(name, player) {
  player = player.toString();
  name = name.toLowerCase();
  return new Promise((resolve, reject) => {
    if (name in weapons) {
      const weapon = weapons[name];
      if (player in playerBalances) {
        if (
          player in playerRequests &&
          playerRequests[player].name === weapon.name
        ) {
          reject(
            new Error(
              `Player #${player} has already requested the weapon ${weapon.name}.`
            )
          );
        } else if (
          player in playerWeapons &&
          playerWeapons[player].name === weapon.name
        ) {
          reject(
            new Error(
              `Player #${player} already owns the weapon ${weapon.name} and cannot request it.`
            )
          );
        } else {
          playerRequests[player] = weapon;
          resolve(`Player #${player} has requested the weapon ${weapon.name}.`);
        }
      } else {
        reject(new Error(`Invalid player number: ${buyer}`));
      }
    } else {
      reject(new Error(`Invalid weapon name: ${name}`));
    }
  });
}

async function main() {
  console.log("Valorant - Buying Phase!");
  while (true) {
    console.log("\n Current status:");
    console.log(
      Object.entries(playerBalances)
        .map(
          (elem) =>
            `- Player #${elem[0]}: $${elem[1]}${
              elem[0] in playerWeapons
                ? ` (Has ${playerWeapons[elem[0]].name})`
                : ``
            }${
              elem[0] in playerRequests
                ? ` [Requesting ${playerRequests[elem[0]].name}]`
                : ``
            }`
        )
        .join("\n")
    );
    let player = await getInput("Player #: ");
    let weaponName = await getInput("Weapon: ");
    // Careful: the value that is retrieved through readline's "query()" method is a string, not directly a number!
    // Hence, either use string-type values in the following switch structure, or convert the value to a number using parseInt().
    let mode = await getInput(
      "Are you buying this for yourself (1), fulfilling a request for another player (2) or requesting it for yourself (3)? "
    );
    switch (mode) {
      case "1":
        purchase(weaponName, player, player)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      case "2":
        let recipientName = await getInput("Requesting player #: ");
        purchase(weaponName, player, recipientName)
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.error(err);
          });
        break;
      case "3":
        // Alternative way of calling an async function and retrieving its result / handling potential thrown errors
        try {
          let result = await request(weaponName, player);
          console.log(result);
        } catch (err) {
          console.error(err);
        }
        break;
      default:
        console.log(`Invalid input: ${mode} (expected in range [1,3])`);
        break;
    }
    await setTimeout(1000);
    let shouldContinue = await getInput("Continue (y/n)? ");
    if (shouldContinue !== "y") {
      break;
    }
  }
  console.log("Valorant - Buying Phase - Over!");
  console.log("Sorted player balances: ");
  // Note that we use the toSorted() method here, as sort() performs the sort in-place, meaning
  // it directly modified your original array. In this case, we want a new array as a result, hence
  // why we use toSorted().
  console.log(
    Object.entries(playerBalances)
      .toSorted((a, b) => b[1] - a[1])
      .map((elem) => `- Player #${elem[0]}: $${elem[1]}`)
      .join("\n")
  );

  // When you open a stream using readline's createInterface(), the stream will remain open
  // until you manually close it. If you do not close it, your program will actually not automatically
  // exit once you exit the above while-loop.
  rl.close();
}

main();
// Careful: do not call rl.close() here, as your main() function is asynchronous, meaning Javascript would execute rl.close() immediately after
// launching the execution of your main() function. The result would be that your program would prematurely close and no user input would ever be requested,
// as the input stream opened by readline has already been closed!
// ---------------------
// The main issue which could occur if your program were to be a real multiplayer game is related to the requests:
// If two players attempt to fulfil the same player's weapon request, the handling may happen at the same time,
// leading to the request being ultimately fulfilled, but both buying players' balance could be reduced, even
// though only one of them should have bought the weapon.
// The solution in such cases is to make use of proper synchronization and data locking mechanisms, which in the case
// of the database MongoDB are provided through various data access and modifications methods.

// Note that the player balance itself is not an issue, as each player has their own balance which other players never
// access either.