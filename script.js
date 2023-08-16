function fetchData() {
    const username = document.getElementById('username').value;
    const responseContainer = document.getElementById('response');
  
    fetch(`https://api.saienterprises.ru/v2/apiTeslaCraft/${username}`)
      .then(response => response.json())
      .then(data => {
        const profile = data[0].profile;
        
        const nickname = profile.nickname;
        const registration = new Date(profile.registration);
        const messages = parseInt(profile.forumData.messages.replace(/\s+/g, ''));
        const positiveRatings = parseInt(profile.forumData.positiveRatings.replace(/\s+/g, ''));
        const neutralRatings = parseInt(profile.forumData.neutralRatings.replace(/\s+/g, ''));
        const negativeRatings = parseInt(profile.forumData.negativeRatings.replace(/\s+/g, ''));
        const achievements = profile.achievements;
        const points = parseInt(profile.forumData.points);
        const rankForum = profile.rankForum;
        
        const profileContainer = document.getElementById('profile-container');
        const profileNickname = document.getElementById('profile-nickname');
        const profilePicture = document.getElementById('profile-picture');
        profilePicture.src = profile.avatarImageUrl;
        const profileDetails = document.getElementById('profile-details');

        const inputContainer = document.getElementById('input-container');
        inputContainer.style.display = 'none';

        profileNickname.textContent = nickname;
        profileDetails.innerHTML = `
          <p>Дата регистрации: ${registration.toLocaleDateString()}</p>
          <p>Сообщений: ${messages}</p>
          <p>Рейтинги: <font color="#62A201">${positiveRatings}</font> ${neutralRatings} <font color="#D90B00">${negativeRatings}</font></p>
          <p>Достижений: ${achievements}</p>
          <p>Баллов: ${points}</p>
          <p>Звание: ${rankForum}</p>
        `;

        profileContainer.style.display = 'block';

  })
}