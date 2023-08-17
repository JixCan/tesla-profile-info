function fetchData() {
  const username = document.getElementById('username').value;
  
  const profileStats = document.getElementById('profile-stats');
  const loadingIndicator = document.getElementById('loading-indicator');
  loadingIndicator.style.display = "block";
  profileStats.style.filter = "blur(0px)";
  
  fetch(`https://api.saienterprises.ru/v2/teslaStatistic/${username}`)
  .then(response => response.json())
  .then(data => {
    
    fillStats(data);
    profileStats.style.filter = "none";
    loadingIndicator.style.display = "none";
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });


  fetch(`https://api.saienterprises.ru/v2/teslaProfile/${username}`)
    .then(response => response.json())
    .then(data => {

      const profile = data[0].profile;
      
      
      const profileNickname = document.getElementById('profile-nickname');
      const profilePicture = document.getElementById('profile-picture');
      profilePicture.src = profile.avatarImageUrl;
      const profileDetails = document.getElementById('profile-details');

      const ratingsContainer = document.getElementById('ratings-container');
      
      profileNickname.textContent = profile.nickname;
      profileDetails.innerHTML = `
      <p>Дата регистрации: ${new Date(profile.registration).toLocaleDateString()}</p>
      <p>Сообщений: ${parseInt(profile.forumData.messages?.replace(/\s+/g, ''), 10) ?? 0}</p>
      <p>Рейтинги: 
        <font color="#62A201">${parseInt(profile.forumData.positiveRatings?.replace(/\s+/g, ''), 10) ?? 0}</font>
        <font color="#767676"> / </font>
        <font color="#2980B9">${parseInt(profile.forumData.neutralRatings?.replace(/\s+/g, ''), 10) ?? 0}</font>
        <font color="#767676"> / </font>
        <font color="#D90B00">${parseInt(profile.forumData.negativeRatings?.replace(/\s+/g, ''), 10) ?? 0}</font>
      </p>
      <p>Достижений: ${profile.achievements}</p>
      <p>Баллов: ${parseInt(profile.forumData.points, 10) ?? 0}</p>
      <p>Звание: ${profile.rankForum}</p>
    `;
    
      const profileRatings = profile.ratings;
      const allRatings = Object.entries(profileRatings).map(([rating, values]) => ({
        rating,
        received: parseInt(values["Получено"].replace(/\s+/g, ''), 10),
      }));
      
      allRatings.sort((a, b) => b.received - a.received);
      
      const topThreeRatings = allRatings.slice(0, 3);

      ratingsContainer.innerHTML = '';

      function appendRatingElement(imagePath, received) {
        const container = document.createElement("div");
        container.classList.add("rating-container");
      
        const img = document.createElement("img");
        img.src = imagePath;
        img.classList.add("rating-image");
      
        const label = document.createElement("p");
        label.textContent = received;
        label.classList.add("rating-label");
      
        container.appendChild(img);
        container.appendChild(label);
      
        ratingsContainer.appendChild(container);
      }
      

      for (const { rating, received } of topThreeRatings) {
        const imagePath = `./rating-icons/${rating.toLowerCase()}.png`;
        appendRatingElement(imagePath, received);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}

function openPopup() {
  document.getElementById("overlay").style.display = "block";
  document.getElementById("popup").style.display = "block";
}

function closePopupAndFetch() {
  const username = document.getElementById("username").value;
  if (username.trim() !== "") {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
    fetchData();
  }
}

function fillStats(response) {
  const statItems = document.querySelectorAll('.stat-item');
  const modeKeys = Object.keys(response).filter(key => key !== 'nickname');

  for (let index = 0; index < statItems.length; index++) {
    const statItem = statItems[index];
    const mode = modeKeys[index];
    const modeStats = response[mode];
    
    statItem.innerHTML = '';
    
    const modeTitle = document.createElement('h3');
    modeTitle.textContent = mode;
    statItem.appendChild(modeTitle);

    for (const stat in modeStats) {
      const value = modeStats[stat];
      const statInfo = document.createElement('p');
      statInfo.textContent = `${stat} ${value}`;
      statItem.appendChild(statInfo);
    }
  }
}


window.onload = function() {
  openPopup();
};


