const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// 获取所有联系人（支持搜索）
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};
    
    // 如果提供了搜索参数，创建搜索条件
    if (search && search.trim()) {
      // 支持按姓名、手机号或邮箱搜索
      const searchTerm = search.trim();
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } }, // 不区分大小写搜索姓名
        { phone: { $regex: searchTerm } }, // 搜索手机号
        { email: { $regex: searchTerm, $options: 'i' } } // 不区分大小写搜索邮箱
      ];
    }
    
    const contacts = await Contact.find(query);
    res.json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取联系人失败',
      error: error.message
    });
  }
});

// 添加新联系人
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    // 验证姓名
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: '姓名不能为空且长度不少于2个字符'
      });
    }
    
    // 验证手机号
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空且必须是10-15位纯数字'
      });
    }
    
    // 检查手机号是否已存在
    const existingPhone = await Contact.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被使用'
      });
    }
    
    // 如果提供了邮箱，验证邮箱格式和唯一性
    if (email) {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }
      
      const existingEmail = await Contact.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: '该邮箱已被使用'
        });
      }
    }
    
    const newContact = new Contact({ name, phone, email });
    await newContact.save();
    
    res.status(201).json({
      success: true,
      message: '联系人添加成功',
      data: newContact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加联系人失败',
      error: error.message
    });
  }
});

// 根据ID获取联系人
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '未找到该联系人'
      });
    }
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取联系人失败',
      error: error.message
    });
  }
});

// 更新联系人
router.put('/:id', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    
    // 首先从数据库获取最新的联系人数据
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '未找到该联系人'
      });
    }
    
    // 验证姓名
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: '姓名不能为空且长度不少于2个字符'
      });
    }
    
    // 验证手机号
    if (!phone || !/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: '手机号不能为空且必须是10-15位纯数字'
      });
    }
    
    // 如果手机号被修改，检查是否与其他联系人重复
    if (phone !== contact.phone) {
      const existingPhone = await Contact.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: '该手机号已被使用'
        });
      }
    }
    
    // 如果提供了邮箱，验证邮箱格式和唯一性
    if (email) {
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }
      
      // 如果邮箱被修改，检查是否与其他联系人重复
      if (email !== contact.email) {
        const existingEmail = await Contact.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: '该邮箱已被使用'
          });
        }
      }
    }
    
    // 更新联系人数据
    contact.name = name;
    contact.phone = phone;
    contact.email = email;
    
    await contact.save();
    
    res.json({
      success: true,
      message: '联系人更新成功',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新联系人失败',
      error: error.message
    });
  }
});

// 删除联系人
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: '未找到该联系人'
      });
    }
    
    res.json({
      success: true,
      message: '联系人删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '删除联系人失败',
      error: error.message
    });
  }
});

module.exports = router;