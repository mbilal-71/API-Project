// const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

// const dropdowns = document.querySelectorAll("select");
// const btn = document.querySelector("form button");
// const fromCurr = document.querySelector(".from select");
// const toCurr = document.querySelector(".to select");
// const msg = document.querySelector(".msg");

// for (let select of dropdowns) {
//   for (let code in countryList) {
//     let newOption = document.createElement("option");
//     newOption.innerText = code;
//     newOption.value = code;
//     if (select.name === "from" && code === "USD") {
//       newOption.selected = "selected";
//     } else if (select.name === "to" && code === "PKR") {
//       newOption.selected = "selected";
//     }
//     select.append(newOption);
//   }
//   select.addEventListener("change", (evt) => {
//     updateflag(evt.target);
//   });
// }

// const updateflag = (element) => {
//   let code = element.value;
//   let countryCode = countryList[code];
//   let newsrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
//   let img = element.parentElement.querySelector("img");
//   img.src = newsrc;
// };
// btn.addEventListener("click", async (evt) => {
//   evt.preventDefault();
//   let amount = document.querySelector(".amount input");
//   let amtval = amount.value;
//   if (amtval === "" || amtval < 1) {
//     amtval = 0;
//     amount.value = 0;
//   }

//   const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}`;
//   let response = await fetch(URL);
//   console.log(response);
//   let data = await response.json();
//   console.log(data);
// });

// [NEW CODE]:

// API Configuration
const BASE_URL = "https://api.exchangerate-api.com/v4/latest/";

// Get DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.getElementById("btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Add event listener to update flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Function to update flag image based on selected currency
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to get exchange rate and convert currency
const getExchangeRate = async () => {
  let amount = amountInput.value;

  // Validate amount input
  if (amount === "" || amount < 1) {
    amount = 0;
    amountInput.value = "0";
  }

  try {
    // Show loading message
    msg.innerText = "Loading...";
    btn.innerText = "Getting Rate...";
    btn.disabled = true;

    // Fetch exchange rates from API
    const response = await fetch(`${BASE_URL}${fromCurr.value}`);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    // Get the exchange rate for target currency
    const rate = data.rates[toCurr.value];

    if (!rate) {
      throw new Error("Exchange rate not available");
    }

    // Calculate converted amount
    const finalAmount = (amount * rate).toFixed(2);

    // Display the result
    msg.innerText = `${amount} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Error:", error);
    msg.innerText = "Error fetching exchange rate. Please try again.";
  } finally {
    // Re-enable button
    btn.innerText = "Get Exchange Rate";
    btn.disabled = false;
  }
};

// Event listener for button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  getExchangeRate();
});

// Event listener for Enter key in amount input
amountInput.addEventListener("keypress", (evt) => {
  if (evt.key === "Enter") {
    evt.preventDefault();
    getExchangeRate();
  }
});

// Initial exchange rate calculation on page load
window.addEventListener("load", () => {
  getExchangeRate();
});
