ssh root@95.85.43.196 <<'ENDSSH'
cd /var/www/antonpi

git fetch origin
git reset --hard origin/master

yarn prod:run -- --detach
ENDSSH
