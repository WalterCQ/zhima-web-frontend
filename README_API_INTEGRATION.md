# 知马网 API 集成

本项目封装了 Duducar/知马相关接口，供前端页面直接调用。

## 基本信息

- Base URL: `http://duducar.cloud:8888`
- Auth: Bearer Token
- API 封装: `src/api/duducar-integration.js`
- 测试页面: `src/views/test/ApiTestPage.vue`

## 快速使用

```js
import duducarAPI from '@/api/duducar-integration'

const result = await duducarAPI.user.login({
  type: 'password',
  phone: '+86 15365201234',
  identifier: 'your-password'
})

localStorage.setItem('access_token', result.data.accessToken)
```

## 文档

- `docs/API_QUICK_REFERENCE.md`: 接口速查
- `docs/API_MAPPING.md`: 旧接口到新接口的映射
- `docs/API_INTEGRATION_SUMMARY.md`: 集成范围总结
- `docs/APIDOC`: 原始接口文档

## 注意

真实 token、账号、密码只放在本地环境或后端，不要提交到仓库。
