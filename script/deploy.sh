git pull origin develop;
pnpm build;
pm2 stop prod-server;
pm2 start pnpm --name prod-server -- start:prod;