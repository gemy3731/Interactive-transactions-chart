let searchByNameInput = $("#searchByNameInput");
let searchByAmountInput = $("#searchByAmountInput");
(async function () {
  let myHttps = await fetch("../customer.json");
  let data = await myHttps.json();
  let customerData = [];
  data.transactions.forEach((transaction) => {
    let customer = data.customers.find(
      (cust) => cust.id == transaction.customer_id
    );
    let customerName = customer.name;
    customerData.push({
      id: transaction.customer_id,
      name: customerName,
      amount: transaction.amount,
      date: transaction.date,
    });
  });
  displayData(customerData);
  $(searchByNameInput).on("input", (e)=> {
    filterByName(e.target.value, customerData);
  });
  $(searchByAmountInput).on("input", (e)=> {
    filterByAmount(e.target.value, customerData);
  });

  $(".selectCustomer").on("click", (e)=> {
    updateChart(e.target.id,customerData)
  });
})();

function displayData(data) {
  let container = "";
  for (let i = 0; i < data.length; i++) {
    container += `<tr>
        <td>${data[i].name}</td>
        <td>${data[i].amount} $</td>
        <td>${data[i].date}</td>
        <td><button id="${data[i].id}" class="btn btn-primary selectCustomer">Select</button></td>
      </tr>`;
  }
  $("tbody").html(container);
}

function filterByName(searchValue, data) {
  let filteredItem = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].name.toLowerCase().includes(searchValue.toLowerCase())) {
      filteredItem.push(data[i]);
    }
  }
  displayData(filteredItem);
}
function filterByAmount(searchValue, data) {
  let filteredItem = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].amount.toString().includes(searchValue.toString())) {
      filteredItem.push(data[i]);
    }
  }
  displayData(filteredItem);
}


let myChart = null;

 const updateChart = function (id,customerData) {
   let customerTransactions = customerData.filter(
     (data) => data.id == id
   );
   let transactionsPerDay = customerTransactions.reduce((x, y) => {
     let date = y.date;
     if (!x[date]) {
       x[date] = 0;
     }
     x[date] += y.amount;
     return x;
    }, {});
    const ctx = document.getElementById(`myChart`);
    const chartData = {labels:Object.keys(transactionsPerDay),
      datasets:[{label:"Transactions per day",
                data:Object.values(transactionsPerDay),borderWidth:1}]
    }
    if(myChart){
      myChart.destroy()
    }
    myChart = new Chart(ctx.getContext("2d"),
  {
    type : "bar",
    data : chartData
  })
}

