function fetchData() {
  const username = document.getElementById('username').value;
  
  fetch(`https://api.saienterprises.ru/v2/teslaProfile/${username}`)
    .then(response => response.json())
    .then(data => {

      const profile = data[0].profile;
      
      const profileContainer = document.getElementById('profile-container');
      const profileNickname = document.getElementById('profile-nickname');
      const profilePicture = document.getElementById('profile-picture');
      profilePicture.src = profile.avatarImageUrl;
      const profileDetails = document.getElementById('profile-details');
      const ratingsContainer = document.getElementById('ratings-container');
      const inputContainer = document.getElementById('input-container')
      inputContainer.style.display = 'none';

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

      // Добавление рейтингов в одну строку
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
      
      profileContainer.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
}
