import express from 'express';
import {  scrapeType,scrapeTypeData,videoListData,videoPlayData,videoInfoData,searchData } from './cheerio/index.js';
import cors from 'cors';
import bodyParser from 'body-parser';

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 定义端口
const port = 8870;

// 直接定义 POST 请求路由
app.post('/scrapeType', async (req, res, next) => {
  try {
    const data = await scrapeType();
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

app.post('/scrapeTypeData', async (req, res, next) => {
  try {
    const params = req.body?.params;
    if (!params) {
      return res.status(400).json({ error: '请求体需要包含 params 参数' });
    }
    const data = await scrapeTypeData(params);
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

app.post('/videoListData', async (req, res, next) => {
  try {
    const params = req.body?.params;
    if (!params) {
      return res.status(400).json({ error: '请求体需要包含 params 参数' });
    }
    const data = await videoListData(params);
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

app.post('/videoPlayData', async (req, res, next) => {
  try {
    const params = req.body?.params;
    if (!params) {
      return res.status(400).json({ error: '请求体需要包含 params 参数' });
    }
    const data = await videoPlayData(params);
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

app.post('/videoInfoData', async (req, res, next) => {
  try {
    const params = req.body?.params;
    if (!params) {
      return res.status(400).json({ error: '请求体需要包含 params 参数' });
    }
    const data = await videoInfoData(params);
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

app.post('/searchData', async (req, res, next) => {
  try {
    const params = req.body?.params;
    if (!params) {
      return res.status(400).json({ error: '请求体需要包含 params 参数' });
    }
    const data = await searchData(params);
    if (data) {
      res.json(data);
    } else {
      res.status(500).json({ error: '获取数据失败' });
    }
  } catch (error) {
    // 将错误传递给错误处理中间件
    next(error);
  }
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误，请稍后再试' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});