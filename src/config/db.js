const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // 这里使用内存数据库或本地MongoDB连接
    const conn = await mongoose.connect('mongodb://localhost:27017/contactsdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;