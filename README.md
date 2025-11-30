# 联系人管理系统 - 后端

## 项目简介
这是一个简单的联系人管理系统后端，使用Node.js + Express开发，提供RESTful API接口，支持MongoDB数据库。

## 技术栈
- Node.js
- Express
- MongoDB
- Mongoose
- CORS


## 功能特性
1. 联系人的增删改查
2. 联系人搜索（支持姓名、手机号、邮箱）
3. 数据验证（手机号唯一性检查等）
4. 错误处理

## 安装和运行

### 前提条件
- Node.js 14+
- MongoDB 4+

### 安装步骤
1. 克隆项目（如果需要）
2. 安装依赖
```bash
npm install
```
3. 配置环境变量（可选，默认连接本地MongoDB）
4. 启动服务器
```bash
npm run dev  # 使用nodemon开发模式
# 或
node src/app.js
```

## API接口文档

### 联系人接口

#### 获取联系人列表
- **URL**: `/api/contacts`
- **Method**: `GET`
- **查询参数**:
  - `search`: 搜索关键词（可选，支持姓名、手机号、邮箱）
- **成功响应**:
  ```json
  [
    {
      "_id": "5f8c...",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
  ```

#### 获取单个联系人
- **URL**: `/api/contacts/:id`
- **Method**: `GET`
- **成功响应**:
  ```json
  {
    "_id": "5f8c...",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### 添加联系人
- **URL**: `/api/contacts`
- **Method**: `POST`
- **请求体**:
  ```json
  {
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  }
  ```
- **成功响应**:
  ```json
  {
    "_id": "5f8c...",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
  ```

#### 更新联系人
- **URL**: `/api/contacts/:id`
- **Method**: `PUT`
- **请求体**:
  ```json
  {
    "name": "张三(已更新)",
    "phone": "13900139000",
    "email": "zhangsan-new@example.com"
  }
  ```
- **成功响应**:
  ```json
  {
    "_id": "5f8c...",
    "name": "张三(已更新)",
    "phone": "13900139000",
    "email": "zhangsan-new@example.com",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  }
  ```

#### 删除联系人
- **URL**: `/api/contacts/:id`
- **Method**: `DELETE`
- **成功响应**:
  ```json
  { "msg": "联系人删除成功" }
  ```

## 数据模型
联系人模型包含以下字段：
- `name`: 姓名（必填）
- `phone`: 手机号（必填，唯一）
- `email`: 邮箱（可选）
- `createdAt`: 创建时间（自动生成）
- `updatedAt`: 更新时间（自动生成）

## 注意事项
1. 默认端口使用5000
2. MongoDB默认连接地址：`mongodb://localhost:27017/contacts-manager`
3. 开发模式使用nodemon自动重启