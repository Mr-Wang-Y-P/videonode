import axios from "axios"; // 引入axios库用于发送HTTP请求
import * as cheerio from "cheerio"; // 引入cheerio库用于解析HTML
// import { readFile, writeFile } from "fs/promises"; // 引入fs/promises库用于异步文件操作
// import { existsSync } from "fs"; // 引入fs库检查文件是否存在
// import puppeteer from "puppeteer";

const url = "https://www.welingo.com"; // 要爬取的网页URL

// const typesArr = [];

// 爬取数据的函数
async function scrapeType() {
  try {
    // 发送GET请求获取网页内容
    const response = await axios.get(url);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    console.log("开始获取数据...");
    // console.log(response.data);
    // 提取需要的数据
    const data = [];

    $(".container .row")
      .find(".astdui-padnnel.astdui-padnnel-bg.clearfix")
      .each((index, element) => {
        const titleText = $(element)
          .find(".padding-0 .astdui-padnnel__head .title a")
          .text()
          .trim();
        const titleUrl = $(element)
          .find(".padding-0 .astdui-padnnel__head .title a")
          .attr("href");
        const cleanTitleText = titleText.replace("热门", "");

        const liElements = $(element).find(".astdui-padnnel__head .nav li");

        const videoElements = $(element).find(
          ".aaa-dddd-6.zhenshuai-4.ajdfnv-3"
        );
        if (titleText && titleUrl && videoElements.length > 0) {
          data[index] = {
            title: cleanTitleText,
            url: titleUrl,
            data: [],
            videoList: [],
          };
        } else {
          return;
        }
        liElements.each((liIndex, liElement) => {
          // 查找当前 li 元素下的 a 链接
          const aLink = $(liElement).find("a");
          const href = aLink.attr("href");
          // 获取 a 链接内的文本并去除首尾空格
          const name = aLink.text().trim();
          data[index].data.push({
            href: href,
            name: name,
          });
        });
        videoElements.each((videoIndex, videoElement) => {
          const videoLink = $(videoElement).find("a");
          const videoHref = videoLink.attr("href");
          const videoImg = videoLink.attr("data-original");
          const videoLength = videoLink
            .find(".aecccdfg.dfgdfgf4532328")
            .text()
            .trim();
          const title = $(videoElement).find(".title a").text().trim();
          const avators = $(videoElement).find("p.text").text().trim();
          const imgUrl =
            videoImg && videoImg.startsWith("http") ? videoImg : url + videoImg;
          if (videoHref && title) {
            data[index].videoList.push({
              href: videoHref,
              title: title,
              avators: avators,
              img: imgUrl,
              length: videoLength,
            });
          }
        });
      });
    // 将数据保存到文件中
    // await writeFile("typesArr.json", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("爬取数据出错:", error);
    return null;
  }
}

async function scrapeTypeData(params) {
  try {
    const newUrl = url + params;
    // 发送GET请求获取网页内容
    const response = await axios.get(newUrl);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    console.log("开始获取数据...");
    // console.log(response.data);
    // 提取需要的数据
    const data = [];

    $(".container .row")
      .find(".astdui-padnnel.astdui-padnnel-bg.clearfix")
      .each((index, element) => {
        const titleText = $(element)
          .find(".padding-0 .astdui-padnnel__head .title a")
          .text()
          .trim();
        const titleUrl = $(element)
          .find(".padding-0 .astdui-padnnel__head .title a")
          .attr("href");
        // const cleanTitleText = titleText.replace("热门", "");

        const videoElements = $(element).find(
          ".aaa-dddd-6.zhenshuai-4.ajdfnv-3"
        );
        if (titleText && titleUrl && videoElements.length > 0) {
          data[index] = {
            title: titleText,
            url: titleUrl,
            videoList: [],
          };
        } else {
          return;
        }
        videoElements.each((videoIndex, videoElement) => {
          const videoLink = $(videoElement).find("a");
          const videoHref = videoLink.attr("href");
          const videoImg = videoLink.attr("data-original");
          const videoLength = videoLink
            .find(".aecccdfg.dfgdfgf4532328")
            .text()
            .trim();
          const title = $(videoElement).find(".title a").text().trim();
          const avators = $(videoElement).find("p.text").text().trim();
          const imgUrl =
            videoImg && videoImg.startsWith("http") ? videoImg : url + videoImg;
          if (videoHref && title) {
            data[index].videoList.push({
              href: videoHref,
              title: title,
              avators: avators,
              img: imgUrl,
              length: videoLength,
            });
          }
        });
      });
    // 将数据保存到文件中
    // await writeFile("typesArr.json", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("爬取数据出错:", error);
    return null;
  }
}

async function videoListData(href) {
  const newUrl = url + href;
  try {
    // 发送GET请求获取网页内容
    const response = await axios.get(newUrl);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    // console.log("开始爬取数据...");
    // console.log(response.data);
    // 提取需要的数据
    const data = [];
    data.push({
      pageCount: 20,
      videoList: [],
    });
    $(".stui-page.text-center.clearfix")
      .find("li")
      .each((index, element) => {
        const href = $(element).find("a").attr("href");
        const name = $(element).find("a").text().trim();

        if (name === "尾页") {
          const parts = href?.split("-");
          const lastPart = parts[1].split(".")[0];
          data[0].pageCount = parseInt(lastPart);
        }
      });

    $(".container .row .astdui-padnnel-box .clearfix")
      .find("li")
      .each((index, element) => {
        const name = $(element).find(".title a").text().trim();
        const href = $(element).find(".title a").attr("href");
        const avators = $(element).find("div p").text().trim();
        const img = $(element).find(".lazyload").attr("data-original");
        const length = $(element).find(".lazyload aecccdfg").text().trim();
        const imgUrl = img && img.startsWith("http") ? img : url + img;
        const liItem = {
          title: name,
          avators: avators,
          img: imgUrl,
          length: length,
          href: href,
        };

        if (name && href) {
          data[0].videoList.push(liItem);
        }
      });
    // 将数据保存到文件中
    return data;
  } catch (error) {
    console.error("获取数据出错:", error);
    return null;
  }
}

async function videoInfoData(href) {
  const newUrl = url + href;
  try {
    // 发送GET请求获取网页内容
    const response = await axios.get(newUrl);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    // console.log("开始爬取数据...");
    // console.log(response.data);
    // 提取需要的数据
    const data = {};

    const box = $(".container .row");
    const playList = [];
    const titleText = box
      .find(".padding-0  .astdui-padnnel.astdui-padnnel-bg.clearfix")
      .eq(0)
      .find(".aaas.clearfix")
      .eq(0)
      .text()
      .trim();
    const imgNode = box.find(
      ".astdui-padnnel-box .stui-content__thumb .picture"
    );
    const img = imgNode.find("img").attr("data-original");
    const imgHref = imgNode.attr("href");
    const length = imgNode.find(".aecccdfg.dfgdfgf4532328").text().trim();
    const infoBox = box.find(".clearfix .astdui-padnnel-box .dfdgdasdaa");
    const title = infoBox.find(".title").text().trim();
    const score = infoBox.find(".score").text().trim();
    const typeInfo = infoBox.find(".data").eq(0).text().trim();
    const avators = infoBox.find(".data").eq(1).text().trim();
    const time = infoBox.find(".data").eq(3).text().trim();
    const desc = infoBox.find(".desc").text().trim();

    // 查找所有 .astdui-padnnel.astdui-padnnel-bg.clearfix 元素，从索引 1 开始
    const playElements = box
      .find(".astdui-padnnel.astdui-padnnel-bg.clearfix")
      .slice(1);

    playElements.each((index, playElement) => {
      const $playElement = $(playElement);
      const liElements = $playElement.find(
        ".astdui-padnnel_bd .dfs2_plsdfaylidst li"
      );

      // 只有当 li 元素数量大于 0 时才处理
      if (liElements.length > 0) {
        const playName = $playElement
          .find(".astdui-padnnel__head .title")
          .text()
          .trim();
        const playItem = {
          name: playName,
          data: [],
        };

        liElements.each((liIndex, liElement) => {
          const $liElement = $(liElement);
          const name = $liElement.find("a").text().trim();
          const href = $liElement.find("a").attr("href");

          if (name && href) {
            playItem.data.push({
              name,
              href,
            });
          }
        });

        playList.push(playItem);
      }
    });
    const imgUrl = img && img.startsWith("http") ? img : url + img;
    return {
      titleText: titleText,
      title: title,
      score: score,
      typeInfo: typeInfo,
      avators: avators,
      time: time,
      desc: desc,
      img: imgUrl,
      length: length,
      imgHref: imgHref,
      data: playList,
    };
  } catch (error) {
    console.error("获取数据出错:", error);
  }
}

async function videoPlayData(href) {
  const newUrl = url + href;
  try {
    // 发送GET请求获取网页内容
    const response = await axios.get(newUrl);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    // console.log("开始爬取数据...");
    // 提取需要的数据

    const box = $(".container .row");
    const playList = [];
    const videoNode = box
      .find(".astdui-padnnel.astdui-padnnel-bg.clearfix")
      .eq(0);

    const video = box.find(".sbmfj4__video").eq(0);

    // 提取包含视频信息的script内容
    const scriptContent = video
      .find('script[type="text/javascript"]')
      .first()
      .html();
    // 从script中解析player_aaaa变量
    let videoHref = null;
    let type = "url";
    if (scriptContent) {
      const regex = /var\s+player_aaaa\s*=\s*({.*})/;
      const playerMatch = regex.exec(scriptContent);
      if (playerMatch && playerMatch[1]) {
        try {
          // 将提取的字符串转换为JSON对象
          let playerData = JSON.parse(playerMatch[1]);
          // console.log(playerData);
          // videoHref = playerData.url;
          if (playerData.from == "ucyunbo") {
            videoHref = "https://ok.70066.cc/dplayer/" + playerData.url;
          } else if (playerData.from == "BBA") {
            videoHref = "https://ok.70066.cc/nbcj/" + playerData.url;
          } else {
            type = "iframe";
            if (playerData.encrypt == "1") {
              // 类型1：仅需要unescape解码
              playerData.url = unescape(playerData.url);
            } else if (playerData.encrypt == "2") {
              // 类型2：需要base64解码后再unescape
              playerData.url = unescape(base64decode(playerData.url));
            }
            // encrypt为0时不需要处理，直接使用原始URL

            videoHref = playerData.url;
          }
        } catch (e) {
          console.error("解析player数据出错:", e);
          return null;
        }
      }
    }
    const infoBox = videoNode.find(".detail");
    const title = infoBox.find(".title a").text().trim();
    const titleHref = infoBox.find(".title a").attr("href");
    const lastHref = infoBox.find(".more-btn li a").eq(2).attr("href");
    const nextHref = infoBox.find(".more-btn li a").eq(3).attr("href");
    const desc = infoBox.find(".data.margin-0").text().trim();

    // 查找所有 .astdui-padnnel.astdui-padnnel-bg.clearfix 元素，从索引 1 开始
    const playElements = box
      .find(".astdui-padnnel.astdui-padnnel-bg.clearfix")
      .slice(1);

    playElements.each((index, playElement) => {
      const $playElement = $(playElement);
      const liElements = $playElement.find(
        ".astdui-padnnel_bd .dfs2_plsdfaylidst li"
      );

      // 只有当 li 元素数量大于 0 时才处理
      if (liElements.length > 0) {
        const playName = $playElement
          .find(".astdui-padnnel__head .title")
          .text()
          .trim();
        const playItem = {
          name: playName,
          data: [],
        };

        liElements.each((liIndex, liElement) => {
          const $liElement = $(liElement);
          const name = $liElement.find("a").text().trim();
          const href = $liElement.find("a").attr("href");

          if (name && href) {
            playItem.data.push({
              name,
              href,
            });
          }
        });

        playList.push(playItem);
      }
    });

    return {
      title: title,
      videoHref: videoHref,
      titleHref: titleHref,
      lastHref: lastHref,
      nextHref: nextHref,
      desc: desc,
      data: playList,
      type: type,
    };
  } catch (error) {
    console.error("获取数据出错:", error);
    return null;
  }
}

async function searchData(params) {
  const newUrl = url + params;
  try {
    // 发送GET请求获取网页内容
    const response = await axios.get(newUrl);
    // 使用cheerio解析HTML内容
    const $ = cheerio.load(response.data);
    // console.log("开始爬取数据...");
    // 提取需要的数据
    const data = [];

    const box = $(".container .row .padding-0 .astdui-padnnel-box");
    const title = box.find(".astdui-padnnel__head .title").text().trim();
    data[0] = {
      title: title,
      data: [],
      pageCount: 1,
    };
  
    $(".stui-page.text-center.clearfix").find("li").each((index,element) => {
      const href = $(element).find("a").attr("href");
      const name = $(element).find("a").text().trim();

      if(name === '尾页') {
        const match = href?.match(/(\d+)(?!.*\d)/);
        console.log('match', match)
        if (match && match[1]) {
          data[0].pageCount = parseInt(match[1]);
        }
      }
    });
    const videobox = box.find(".astdui-padnnel_bd .gfsd5d__media li");
    videobox.each((index, element) => {
      const img = $(element).find(".thumb .lazyload").attr("data-original");
      const href = $(element).find(".thumb .lazyload").attr("href");
      const text = $(element).find(".detail .title a").text().trim();
      const author = $(element).find(".detail p").eq(0).text().trim();
      const avators = $(element).find(".detail p").eq(1).text().trim();
      const time = $(element).find(".detail p").eq(2).text().trim();
      const playUrl = $(element)
        .find(".detail p")
        .eq(3)
        .find("a")
        .eq(0)
        .attr("href");
      const detailUrl = $(element)
        .find(".detail p")
        .eq(3)
        .find("a")
        .eq(1)
        .attr("href");
      const imgUrl = img && img.startsWith("http") ? img : url + img;
      const videoItem = {
        img: imgUrl,
        href: href,
        text,
        author,
        avators,
        time,
        playUrl,
        detailUrl,
      };

      if (img && href) {
        data[0].data.push(videoItem);
      }
    });

    // await writeFile("typesArr.json", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    // 处理错误
    console.error("获取数据出错:", error);
    return null;
  }
}

var killErrors = function (value) {
  return true;
};
var onerror = null;
var onerror = killErrors;
var base64EncodeChars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  62,
  -1,
  -1,
  -1,
  63,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  -1,
  -1,
  -1,
  -1,
  -1,
  -1,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  -1,
  -1,
  -1,
  -1,
  -1
);
function base64encode(str) {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2);
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
      out += base64EncodeChars.charAt((c2 & 0xf) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += base64EncodeChars.charAt(c1 >> 2);
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4));
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6));
    out += base64EncodeChars.charAt(c3 & 0x3f);
  }
  return out;
}
function base64decode(str) {
  var c1, c2, c3, c4;
  var i, len, out;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    do {
      c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c1 == -1);
    if (c1 == -1) break;
    do {
      c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
    } while (i < len && c2 == -1);
    if (c2 == -1) break;
    out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
    do {
      c3 = str.charCodeAt(i++) & 0xff;
      if (c3 == 61) return out;
      c3 = base64DecodeChars[c3];
    } while (i < len && c3 == -1);
    if (c3 == -1) break;
    out += String.fromCharCode(((c2 & 0xf) << 4) | ((c3 & 0x3c) >> 2));
    do {
      c4 = str.charCodeAt(i++) & 0xff;
      if (c4 == 61) return out;
      c4 = base64DecodeChars[c4];
    } while (i < len && c4 == -1);
    if (c4 == -1) break;
    out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
  }
  return out;
}
function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f));
    }
  }
  return out;
}
function utf8to16(str) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }
  return out;
}

// searchData('/search/奔跑吧----------1---.html') 搜索
// scrapeType()
// scrapeTypeData(/type/4.html)   // 1,2,3,4
// videoInfoData('/detail/66026.html')  获取视频信息
// videoListData('/type/6-2.html') 获取视频播放列表
// videoPlayData('/play/66026.html') 获取视频播放地址

export {
  scrapeType,
  scrapeTypeData,
  videoListData,
  videoPlayData,
  videoInfoData,
  searchData,
};
