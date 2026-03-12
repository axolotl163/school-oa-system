import axios from 'axios';

async function testAdminPhone() {
  try {
    // 测试管理员登录
    console.log('=== 测试管理员登录 ===');
    const adminLoginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      username: 'admin',
      password: 'admin'
    });
    console.log('管理员登录响应:', adminLoginResponse.data);
    if (adminLoginResponse.data.success) {
      console.log('管理员手机号:', adminLoginResponse.data.user.phone);
      console.log('管理员用户信息:', adminLoginResponse.data.user);
    } else {
      console.log('管理员登录失败:', adminLoginResponse.data.message);
    }
    
    // 测试更新管理员手机号
    console.log('\n=== 测试更新管理员手机号 ===');
    if (adminLoginResponse.data.success) {
      const updateResponse = await axios.post('http://localhost:3000/api/profile/update-profile', {
        phone: '13900000000'
      }, {
        headers: {
          'x-username': 'admin'
        }
      });
      console.log('更新手机号响应:', updateResponse.data);
      
      // 再次登录，验证手机号是否更新成功
      console.log('\n=== 再次测试管理员登录（验证手机号更新） ===');
      const loginAgainResponse = await axios.post('http://localhost:3000/api/auth/login', {
        username: 'admin',
        password: 'admin'
      });
      console.log('管理员登录响应:', loginAgainResponse.data);
      if (loginAgainResponse.data.success) {
        console.log('管理员手机号:', loginAgainResponse.data.user.phone);
        console.log('管理员用户信息:', loginAgainResponse.data.user);
      }
    }
    
  } catch (error) {
    console.error('测试失败:', error);
    if (error.response) {
      console.error('错误响应:', error.response.data);
      console.error('错误状态码:', error.response.status);
    }
  }
}

testAdminPhone();