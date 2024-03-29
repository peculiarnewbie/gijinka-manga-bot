var axios = require("axios");

async function getThreadList(board) {
  try {
    const res = await axios({
      method: "GET",
      url: `https://a.4cdn.org/${board}/threads.json`,
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

async function getCatalog(board) {
  const catalogArr = [];
  try {
    const res = await axios({
      method: "GET",
      url: `https://a.4cdn.org/${board}/catalog.json`,
    }).then((res) => {
      res.data.forEach((page) => {
        page.threads.forEach((item) => {
          const catalogObj = {
            thread: item.no,
            title: item.sub,
            reply: item.replies,
          };
          catalogArr.push(catalogObj);
        });
      });
      catalogArr.sort((a, b) => b.reply - a.reply);
      console.log("array sorter");
      return catalogArr;
    });
  } catch (e) {
    console.error(e);
  }
}

async function getThread(board, thread) {
  try {
    const res = await axios({
      method: "GET",
      url: `https://a.4cdn.org/${board}/thread/${thread}.json`,
    });
    return res.data;
  } catch (e) {
    console.error(e);
  }
}

// const listThread = [];
// let listing = getThreadList("vt")
//   .then((resp) => {
//     resp.forEach((page) => {
//       page.threads.forEach((arr) => {
//         listThread.push(arr.no);
//       });
//     });
//     return listThread;
//   })
//   .catch((e) => {
//     console.log(e);
//     return e;
//   });

// const catalogArr = [];
// const catalogList = getCatalog(board).then((resp) => {
//   resp.forEach((page) => {
//     page.threads.forEach((item) => {
//       const catalogObj = {
//         thread: item.no,
//         title: item.sub,
//         reply: item.replies,
//       };
//       catalogArr.push(catalogObj);
//     });
//   });
//   catalogArr.sort((a, b) => b.reply - a.reply);
//   return catalogArr;
// });

// const vava = getCatalog("vt")
// console.log(vava)