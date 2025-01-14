module.exports = function override(config, env) {
  // ... 기존 설정 ...

  if (config.devServer) {
    config.devServer.allowedHosts = ['localhost']; // 또는 ['.']로 설정
  }

  return config;
};
