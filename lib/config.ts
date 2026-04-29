export const siteConfig = {
  name: "NTU EEE 26Fall 室友匹配",
  title: "NTU EEE 26Fall - 室友匹配平台",
  description: "专属EEE学院26fall新生的室友匹配与合租组队平台",
  slogan: "找到合拍室友，开启新加坡留学生活",
  version: "1.0.0"
};
export const authConfig = {
  // JWT令牌过期时间
  sessionExpiresIn: '7 days',
  // 邮箱验证令牌过期时间 (30分钟)
  emailVerificationExpiresIn: 30 * 60 * 1000, // 30 minutes in milliseconds
  // 支持的教育邮箱域名
  allowedEmailDomains: [
    '@ntu.edu.sg'
  ],
  // 学号格式正则表达式 - 适配NTU学号
  studentIdPattern: /^[a-zA-Z0-9]{5,20}$/,
  // 密码强度要求
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  }
};
