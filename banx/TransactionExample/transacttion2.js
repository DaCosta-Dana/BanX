
const randomDelay = () =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
// Alternative: const { setTimeout } = require("timers/promises");

class Item {
  constructor(name, optional) {
    this.name = name;
    this.optional = optional;
  }
}
var items = [
  new Item("Flashlight", false),
  new Item("EMF Reader", false),
  new Item("Video Camera", false),
  new Item("Crucifix", true),
  new Item("Salt", true),
];

class MaximumItemLimitError extends Error {
  constructor(message, item) {
    super(message);
    this.item = item;
  }
}
class InvalidItemError extends Error {}

var equipment = {};

async function sellEquipment(itemName) {
  await randomDelay();
  itemName = itemName.toLowerCase();
  if (itemName in equipment && equipment[itemName] > 0) {
    equipment[itemName] = equipment[itemName] - 1;
    console.log(`Sold ${itemName}. (${equipment[itemName]})`);
    if (equipment[itemName] === 0) {
      delete equipment[itemName];
    }
  } else {
    console.log(`No ${itemName} to sell.`);
  }
}

async function purchaseItem(itemName) {
  await randomDelay();
  itemName = itemName.toLowerCase();
  // Alternative: use a for-loop to find the matching store item
  let item = items.find((elem) => elem.name.toLowerCase() === itemName);
  if (item) {
    let itemLimit = item.optional ? 2 : 4;
    if (itemName in equipment) {
      if (equipment[itemName] === itemLimit) {
        throw new MaximumItemLimitError(
          `You already own the maximum amount (${itemLimit}) of this item: ${item.name}`,
          item
        );
      } else {
        equipment[itemName] = equipment[itemName] + 1;
      }
    } else {
      equipment[itemName] = 1;
    }
    console.log(`Purchased ${item.name}. (${equipment[itemName]})`);
    return item;
  }
  throw new InvalidItemError(`${itemName} is not a valid item.`);
}
async function purchaseRequiredItems() {
  var requiredItems = items.filter((item) => item.optional === false);
  for (let item of requiredItems) {
    purchaseItem(item.name);
  }
}

// Problem: as purchaseItem and sellEquipment are both asynchronous functions,
// there is no guarantee that line 83 will have finished its execution before line 85 is executed.
// This is due to the fact that Javascript will continue executing each line in your try clause
// if the functions being executed are not synchronous, i.e., they do not block execution of the rest program
// until they've finished.
// The usage of Promise.all() would not fix this issue, as again, the promises you pass to it as an argument
// would not sequentially execute each promise in an exact order and block execution before executing the next promise in the array.
async function testWithRaceCondition() {
  try {
    purchaseItem("crucifix");
    purchaseItem("crucifix");
    sellEquipment("crucifix");
    purchaseItem("crucifix");
    // purchaseRequiredItems();
  } catch (err) {
    console.error(err);
    // To handle specific types of errors, you have to manually check the type of the error
    // using instanceof!
    if (err instanceof InvalidItemError) {
      console.log(
        `Available items: ${items.map((item) => item.name).join(", ")}`
      );
    }
  }
}

// Solution: by using the await keyword, the initial purchaseItem will be executed and finished,
// before moving on to the next statement to execute. That way, you can be sure that sellEquipment("crucifix")
// is not accidentally executed before you've actually made the initial purchase of a crucifix.
async function testWithoutRaceCondition() {
  try {
    await purchaseItem("crucifix");
    await purchaseItem("crucifix");
    await sellEquipment("crucifix");
    await purchaseItem("crucifix");
    // purchaseRequiredItems();
  } catch (err) {
    console.error(err.message);
    if (err instanceof InvalidItemError) {
      console.log(
        `Available items: ${items.map((item) => item.name).join(", ")}`
      );
    }
  }
}

testWithRaceCondition();
// testWithoutRaceCondition();
