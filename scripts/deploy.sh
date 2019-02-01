ssh root@95.85.43.196 <<'ENDSSH'
cd /var/www/pi.antn.se
git fetch origin
git reset --hard origin/master
docker system prune --force
docker build -t antonpi .
docker stop antonpi-container || true
docker run --rm -d -p 8888:8888 --env-file .env --name antonpi-container antonpi
ENDSSH
