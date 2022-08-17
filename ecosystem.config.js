module.exports = {
  apps: [
    {
      name: 'geese',
      script: './server.js',
      instances: 2,
      max_restarts: 3,
      env: {
        NODE_ENV: 'production',
      },
      watch: true,
      merge_logs: true,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      instance_var: 'NODE_APP_INSTANCE',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SS',
      error_file: '/var/log/geese/error.log',
      out_file: '/var/log/geese/out.log',
    },
  ],
};
