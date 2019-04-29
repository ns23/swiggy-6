const getLatestScore = async () => {
  return new Promise((resolve, reject) => {
    fetch("https://m.cricbuzz.com/match-api/livematches.json", {
      mode: "no-cors"
    })
      .then(resolve(response => response))
      .catch(err => reject(err));
  });
};

console.log(getLatestScore().then(res => console.log(res)));
