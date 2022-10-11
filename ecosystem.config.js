module.exports = {
  apps: [
    {
      name: 'geese',
      script: './server.js',
      instances: 2,
      max_restarts: 3,
      env: {
        NEXT_PUBLIC_ENV: 'production',
        NODE_PORT: '3000',
      },
      watch: true,
      merge_logs: true,
      exec_mode: 'cluster',
      max_memory_restart: '1G',
      instance_var: 'NODE_APP_INSTANCE',
      log_date_format: 'YYYY-MM-DD HH:mm:ss:SS',
      error_file: '/data/logs/geese_err.log',
      out_file: '/data/logs/geese_out.log',
    },
  ],
};
