function fetchData() {
    const username = document.getElementById('username').value;
    const responseContainer = document.getElementById('response');
    
    fetch(`https://api.saienterprises.ru/v2/apiTeslaCraft/${username}`)
      .then(response => response.json())
      .then(data => {
        responseContainer.textContent = JSON.stringify(data, null, 2);
      })
      .catch(error => {
        responseContainer.textContent = 'An error occurred while fetching data.';
        console.error(error);
      });
  }
  