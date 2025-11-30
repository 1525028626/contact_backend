# 后端代码规范

## 文件命名规范
- JavaScript文件：使用小驼峰命名法，如 `contactRoutes.js`
- 配置文件：使用小驼峰命名法，如 `db.js`
- 模型文件：使用大驼峰命名法，如 `Contact.js`

## JavaScript规范
1. **缩进**：使用2个空格
2. **变量声明**：使用 `const` 和 `let`，避免使用 `var`
3. **命名规则**：
   - 变量和函数：小驼峰命名法，如 `userName`, `getContacts()`
   - 常量：全大写，下划线连接，如 `DB_URI`
   - 类和模型：大驼峰命名法，如 `Contact`
4. **字符串**：使用单引号 `'string'`
5. **箭头函数**：优先使用箭头函数，特别是在回调函数中
6. **分号**：每个语句结束加分号
7. **注释**：
   - 函数/方法注释：简要说明功能、参数和返回值
   - 代码块注释：复杂逻辑添加说明
   - 单行注释：`// 注释内容`

## Express应用规范
1. **路由定义**：使用RESTful风格的路由
2. **中间件使用**：
   - 按顺序加载中间件
   - 错误处理中间件放在最后
3. **路由处理函数**：
   - 使用`async/await`处理异步操作
   - 正确处理错误，返回适当的状态码
4. **请求验证**：使用`if`语句或验证库检查请求数据

## 数据库操作规范
1. **模型定义**：使用Mongoose Schema定义数据模型
2. **查询操作**：使用async/await处理数据库查询
3. **错误处理**：捕获数据库操作错误并返回适当的响应
4. **索引使用**：为常用查询字段创建索引，如手机号

## 错误处理规范
1. **错误响应格式**：统一返回错误信息格式
   ```json
   { "error": "错误描述" }
   ```
2. **状态码**：使用适当的HTTP状态码
   - 200：成功
   - 201：创建成功
   - 400：请求错误
   - 404：资源不存在
   - 500：服务器错误
3. **错误日志**：使用`console.error`记录错误信息

## 代码示例

### 路由示例
```javascript
// 正确的路由示例
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @desc    获取所有联系人
// @route   GET /api/contacts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: search },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const contacts = await Contact.find(query);
    res.json(contacts);
  } catch (error) {
    console.error('获取联系人失败:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// ... 其他路由

module.exports = router;
```

### 模型示例
```javascript
// 正确的模型示例
const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
      '请输入有效的邮箱地址'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', ContactSchema);
```

### 数据库配置示例
```javascript
// 正确的数据库配置示例
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/contacts-manager', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB 连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```