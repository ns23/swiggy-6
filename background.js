const url = "https://m.cricbuzz.com/match-api/livematches.json";
let prevOver = null;
let sixIndex = -1;
chrome.runtime.onInstalled.addListener(function() {
  setInterval(async () => {
    const resp = await makeXhrRequest("GET", url).catch(err =>
      console.error(err)
    );
    const liveMatch = checkMatchStatus(resp);
    if ((liveMatch !== null) & checkSixIsHit(liveMatch)) {
      // live ipl match is going on check if six is hit
      // send push notification and play alarm
      chrome.notifications.create(
        "name-for-notification",
        {
          type: "basic",
          iconUrl: "turn-notifications-on-button.png",
          title: "Yayy!! Some one hit the six",
          message:
            "Someone hit the six, Open swiggy ,use 'SWIGGY6' & place order"
        },

        function() {}
      );
    }
  }, 5000);
});

const checkMatchStatus = resp => {
  let matches = Object.keys(resp.matches);
  let liveIplMatch = null;
  matches.forEach(match => {
    var currentMatch = resp.matches[match];
    if (
      currentMatch.series.type === "IPL" &&
      currentMatch.state === "inprogress"
    ) {
      liveIplMatch = currentMatch;
    }
  });
  return liveIplMatch;
};

const checkSixIsHit = liveMatch => {
  let latestOver = liveMatch.score.prev_overs.split("|").pop();
  let resp = false;
  if (prevOver === null || latestOver.localeCompare(prevOver) !== 0) {
    //score is changed
    //check if sixer is hit
    let currSixIndex = latestOver.search("6") || latestOver.search("W");
    if (currSixIndex !== -1 && currSixIndex !== sixIndex) {
      resp = true;
    }
  }
  prevOver = latestOver;
  return resp;
};

function makeXhrRequest(method, url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(JSON.parse(xhr.response));
      } else {
        reject(
          Error({
            status: xhr.status,
            statusTextInElse: xhr.statusText
          })
        );
      }
    };
    xhr.onerror = function() {
      reject(
        Error({
          status: xhr.status,
          statusText: xhr.statusText
        })
      );
    };
    xhr.send();
  });
}
