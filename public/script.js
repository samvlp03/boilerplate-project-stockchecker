document.getElementById('testForm2').addEventListener('submit', e => {
  e.preventDefault();
  const stock = e.target[0].value;
  const checkbox = e.target[1].checked;
  fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data);
    });
});

document.getElementById('testForm').addEventListener('submit', e => {
  e.preventDefault();
  const stock1 = e.target[0].value;
  const stock2 = e.target[1].value;
  const checkbox = e.target[2].checked;
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('jsonResult').innerText = JSON.stringify(data);
    });
});

// Run all 5 functional API tests and display results
function runFunctionalTests() {
  // Test 1: Viewing one stock
  fetch('/api/stock-prices?stock=GOOG')
    .then(res => res.json())
    .then(data => {
      document.getElementById('test1').innerText = `Test 1: Viewing one stock\n${JSON.stringify(data)}`;
    });

  // Test 2: Viewing one stock and liking it
  fetch('/api/stock-prices?stock=MSFT&like=true')
    .then(res => res.json())
    .then(data => {
      document.getElementById('test2').innerText = `Test 2: Viewing one stock and liking it\n${JSON.stringify(data)}`;
    });

  // Test 3: Viewing the same stock and liking it again
  fetch('/api/stock-prices?stock=MSFT&like=true')
    .then(res => res.json())
    .then(data => {
      document.getElementById('test3').innerText = `Test 3: Viewing the same stock and liking it again\n${JSON.stringify(data)}`;
    });

  // Test 4: Viewing two stocks
  fetch('/api/stock-prices?stock[]=AAPL&stock[]=AMZN')
    .then(res => res.json())
    .then(data => {
      document.getElementById('test4').innerText = `Test 4: Viewing two stocks\n${JSON.stringify(data)}`;
    });

  // Test 5: Viewing two stocks and liking them
  fetch('/api/stock-prices?stock[]=TSLA&stock[]=NFLX&like=true')
    .then(res => res.json())
    .then(data => {
      document.getElementById('test5').innerText = `Test 5: Viewing two stocks and liking them\n${JSON.stringify(data)}`;
    });
}

window.onload = runFunctionalTests;
