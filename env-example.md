# 环境变量配置说明

在Vercel部署时，需要在Vercel控制台配置以下环境变量：

## 数据库配置
```
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```

## JWT密钥
```
JWT_SECRET=your_super_secret_jwt_key
```

## 服务器配置
```
PORT=3000
NODE_ENV=production
```

## CORS配置
```
CORS_ORIGIN=https://your-domain.vercel.app
```

> 注意：请将上述配置中的占位符替换为实际的值。 