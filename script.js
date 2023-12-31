function fetchData() {
  const username = document.getElementById('username').value;
  const errorMessage = document.getElementById('error-message');
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = `0%`;
  errorMessage.textContent = '';
  
  fetch(`https://api.saienterprises.ru/v2/teslaStatistic/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching data: Server returnedв ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      fillStats(data);
    })
    .catch(error => {
      
      errorMessage.textContent = "Произошла ошибка во время запроса к серверу. Возможно, указанный вами пользователь заблокирован или не существует.";
      errorMessage.style.display = "block";
    });
  
  fetch(`https://api.saienterprises.ru/v2/teslaClans/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching data: Server returnedв ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      createPositiveScoreChart(data);
    })
    .catch(error => {
      
      errorMessage.textContent = "Произошла ошибка во время запроса к серверу. Возможно, указанный вами пользователь не существует, заблокирован или не состоит в клане.";
      errorMessage.style.display = "block";
    });


  fetch(`https://api.saienterprises.ru/v2/teslaProfile/${username}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching data: Server returnedв ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const profile = data[0].profile;
      
      const profileNickname = document.getElementById('profile-nickname');
      
      const profilePicture = document.getElementById('profile-picture');
      profilePicture.src = profile.avatarImageUrl;
      const profileDetails = document.getElementById('profile-details');

      const ratingsContainer = document.getElementById('ratings-container');
      
      profileNickname.textContent = profile.nickname;
      const positiveRatings = parseInt(profile.accountData.positiveRatings);
      const neutralRatings = parseInt(profile.accountData.neutralRatings);
      const negativeRatings = parseInt(profile.accountData.negativeRatings);
      const messages = parseInt(profile.accountData.messages);
      
      profileDetails.innerHTML = `
        <p>На сервере с ${new Date(profile.registration * 1000).toLocaleDateString()}</p>
        <p>Сообщений: ${messages}</p>
        <p>Рейтинги: 
          <font color="#62A201">${positiveRatings}</font>
          <font color="#767676"> / </font>
          <font color="#2980B9">${neutralRatings}</font>
          <font color="#767676"> / </font>
          <font color="#D90B00">${negativeRatings}</font>
        </p>
        <p>Достижений: ${profile.achievements}</p>
        <p>Баллов: ${parseInt(profile.accountData.points, 10)}</p>
        <p>Звание: ${profile.rankForum}</p>
      `;
      
      const points = parseInt(profile.accountData.points, 10);
      const registrationDate = new Date(profile.registration * 1000)

      const currentDate = new Date();
      const threeYearsAgo = new Date(currentDate);
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      let progress = 0;
      if (points < 300) {
      const ratingsPercentage = (positiveRatings < 7000) ? positiveRatings / 7000 : 1;
      const messagesPercentage = (messages < 5000) ? messages / 5000 : 1;

      const timeDifference = currentDate - registrationDate;
      const threeYearsInMilliseconds = 3 * 365 * 24 * 60 * 60 * 1000;

      const timePercentage = (timeDifference >= threeYearsInMilliseconds) ? 1 : timeDifference / threeYearsInMilliseconds;

      progress = (ratingsPercentage + messagesPercentage + timePercentage) / 3 * 100;
      progress = Math.min(progress, 100);
      } else {
        progress = 100;
      }

      progressBar.style.width = `${progress}%`;
      const progressText = document.getElementById('progress-text');
      progressText.textContent += ` (${progress.toFixed(2)}%)`

      const profileRatings = profile.ratings;
      const allRatings = Object.entries(profileRatings).map(([rating, values]) => ({
        rating,
        received: parseInt(values["Получено"]),
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
      errorMessage.textContent = "Произошла ошибка во время запроса к серверу. Возможно, указанный вами пользователь заблокирован или не существует.";
      errorMessage.style.display = "block";
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
    const errorMessage = document.getElementById('error-message');
    const profileContainer = document.getElementById('profile-container');
    profileContainer.style.display = 'flex';
  }
}

const modeNames = {
  BEDWARS: 'БедВарс',
  BUILD_BATTLE: 'Битва строителей',
  HUNGER_GAMES: 'Голодные игры',
  CROCODILE: 'Крокодил',
  SHEEP_WARS: 'Овечки',
  HIDE_AND_SEEK: 'Прятки',
  SKY_WARS: 'СкайВарс',
  SPEED_BUILDERS: 'СпидБилдерс',
  TNT_RUN: 'ТнтРан',
  ANNEXATION: 'Аннексия',
  FAST_BEDWARS: 'Быстрый БедВарс',
  MIX_GAME: 'МиксГейм',
  MURDER_MYSTERY: 'Тайна убийства',
  CLASSIC_SURVIVAL: 'Классическое Выживание',
  COUNTER_STRIKE: 'Контр-Страйк',
  DEATH_RUN: 'ДезРан',
  T_ARCADA: 'ТАркада'
};

const coefficientCalculations = {
  BEDWARS: { key1: 'Убийств:', key2: 'Смертей:', label: 'Коэффициент У/С' },
  BUILD_BATTLE: { key1: 'Побед:', key2: 'Сыгранных партий:', label: 'Винрейт' },
  HUNGER_GAMES: { key1: 'Убийств:', key2: 'Смертей:', label: 'Коэффициент У/С' },
  CROCODILE: { key1: 'Победы:', key2: 'Поражения:', label: 'Винрейт' },
  SKY_WARS: { key1: 'Убийств:', key2: 'Смертей:', label: 'Коэффициент У/С' },
  TNT_RUN: { key1: 'Побед:', key2: 'Сыгранных партий:', label: 'Винрейт' },
  FAST_BEDWARS: { key1: 'Убийств:', key2: 'Смертей:', label: 'Коэффициент У/С' },
  MIX_GAME: { key1: 'Побед:', key2: 'Поражений:', label: 'Винрейт' },
  COUNTER_STRIKE: { key1: 'Убийств:', key2: 'Смертей:', label: 'Коэффициент У/С' },
  DEATH_RUN: { key1: 'Побед:', key2: 'Сыгранных партий:', label: 'Винрейт' }
};


function fillStats(response) {
  const statItems = document.querySelectorAll('.stat-item');
  const modeKeys = Object.keys(response).filter(key => key !== 'nickname');

  const keysToShow = {
    BEDWARS: ['Очков', 'Побед', 'Убийств'],
    BUILD_BATTLE: ['Побед', 'Сыгранных партий'],
    HUNGER_GAMES: ['Побед', 'Убийств'],
    CROCODILE: ['Очков', 'Побед'],
    SHEEP_WARS: ['Побед', 'Убийств', 'Коэффициент У/C'],
    HIDE_AND_SEEK: ['Побед', 'Убито хайдеров', 'Убито охотников'],
    SKY_WARS: ['Побед', 'Убийств'],
    SPEED_BUILDERS: ['Побед', 'Идеальные постройки'],
    TNT_RUN: ['Побед', 'Поражений'],
    ANNEXATION: ['Побед', 'Убийств'],
    FAST_BEDWARS: ['Очков', 'Побед', 'Убийств'],
    MIX_GAME: ['Побед', 'Лучшее время', 'Лучший уровень'],
    MURDER_MYSTERY: ['Побед', 'Убийств', 'Очков'],
    CLASSIC_SURVIVAL: ['Часов на режиме' ,'Убито игроков', 'Убито мобов'],
    COUNTER_STRIKE: ['Побед', 'Убийств', 'Хэдшотов'],
    DEATH_RUN: ['Очков', 'Побед', 'Убийств']
  };

  for (let index = 0; index < statItems.length; index++) {
    const statItem = statItems[index];
    const mode = modeKeys[index];
    const modeStats = response[mode];
    const keys = keysToShow[mode] || Object.keys(modeStats); // Если нет настроенных ключей, покажите все

    statItem.innerHTML = '';
    
    const modeImage = document.createElement('img');
    modeImage.className = "minigame-icon";
    modeImage.src = `./minigame-icons/${mode}.jpg`;
    modeImage.alt = mode;
    statItem.appendChild(modeImage);

    for (const stat of keys) {
      const value = modeStats[stat];
      const statInfo = document.createElement('p');
      statInfo.textContent = `${stat}: ${value}`;
      statItem.appendChild(statInfo);
    }

    if (coefficientCalculations[mode]) {
      const { key1, key2, label } = coefficientCalculations[mode];
      const value1 = modeStats[key1];
      const value2 = modeStats[key2];
      if (value1 && value2) {
        const coefficient = calculateCoefficient(value1, value2);
        const coefficientInfo = document.createElement('p');
        coefficientInfo.textContent = `${label}: ${coefficient}`;
        statItem.appendChild(coefficientInfo);
      }
    }
    
  }
}

function calculateCoefficient(value1, value2) {
  const num1 = parseInt(value1);
  const num2 = parseInt(value2);
  return (num2 !== 0) ? (num1 / num2).toFixed(2) : num1.toFixed(2);
}


function createPositiveScoreChart(response) {
  const clanScoreData = response.clanScoreMinigame;
  const chartContainer = document.querySelector('.profile-score-container .chart');

  chartContainer.innerHTML = ''; // Очистить содержимое диаграммы

  const sortedModes = Object.keys(clanScoreData)
    .filter(mode => parseInt(clanScoreData[mode]) > 0)
    .sort((a, b) => parseInt(clanScoreData[b]) - parseInt(clanScoreData[a]));

  for (const mode of sortedModes) {
    const value = parseInt(clanScoreData[mode]);
    const percentage = (value / parseInt(response.clanscore)) * 100;

    const pipeContainer = document.createElement('div');
    pipeContainer.classList.add('pipe');

    const pipe = document.createElement('div');
    pipe.style.width = `${percentage}%`;
    pipeContainer.appendChild(pipe);
    const text = document.createElement('p');
    text.textContent = modeNames[mode] + ` ${percentage.toFixed(2)}%`;
    chartContainer.appendChild(text);
    chartContainer.appendChild(pipeContainer);
    
  }
}


window.onload = function() {
  openPopup();
};


