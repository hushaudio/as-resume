module.exports = {
  apps: [
    {
      name: "as-resume",
      // Use npm start so Next.js start script is honored
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3456,
      },
      // Restart behavior
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
    },
  ],
};


