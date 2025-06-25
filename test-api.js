// 简单的API测试脚本
const API_BASE = 'http://localhost:3000/api';

// 测试健康检查
async function testHealth() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('健康检查:', data);
    return true;
  } catch (error) {
    console.error('健康检查失败:', error);
    return false;
  }
}

// 测试登录
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone: '17682332276',
        password: '123456'
      })
    });
    
    const data = await response.json();
    console.log('登录测试:', data);
    
    if (data.success) {
      return data.data.token;
    }
    return null;
  } catch (error) {
    console.error('登录测试失败:', error);
    return null;
  }
}

// 测试发布招聘
async function testCreateJob(token) {
  try {
    const response = await fetch(`${API_BASE}/posts/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: '前端工程师',
        company: '测试公司',
        salary: '10-15K',
        recruits: '2人',
        phone: '17682332276',
        tags: 'Vue,React,JavaScript',
        benefits: '五险一金,带薪年假',
        description: '负责前端开发工作'
      })
    });
    
    const data = await response.json();
    console.log('发布招聘测试:', data);
    return data.success;
  } catch (error) {
    console.error('发布招聘测试失败:', error);
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('开始API测试...\n');
  
  // 1. 健康检查
  const healthOk = await testHealth();
  if (!healthOk) {
    console.log('❌ 服务器未启动');
    return;
  }
  
  // 2. 登录测试
  const token = await testLogin();
  if (!token) {
    console.log('❌ 登录失败，无法继续测试');
    return;
  }
  
  // 3. 发布测试
  const jobOk = await testCreateJob(token);
  if (jobOk) {
    console.log('✅ 招聘发布测试通过');
  } else {
    console.log('❌ 招聘发布测试失败');
  }
  
  console.log('\n测试完成');
}

runTests(); 