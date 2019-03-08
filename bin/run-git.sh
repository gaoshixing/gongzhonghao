#!/bin/sh
export M2_HOME=/home/ivygate/apache-maven-3.3.9
export PATH=$M2_HOME/bin:$PATH
export MAVEN_OPTS="-Xms256m -Xmx512m -XX:PermSize=128m -XX:MaxPermSize=256m"

cd /home/ivygate/spoc-market-wechat-web/
git pull
mvn clean compile 
pid=$(ps aux | grep "spoc-market-wechat-web" | grep "jetty:run" | awk '{print $2}')
[ -n "$pid" ] && echo $pid && kill -9 $pid 
echo "ready to go background"
sleep 1
nohup mvn -U jetty:run >/var/log/spoc-market-wechat-web.log 2>&1 </dev/null & 
echo "ewechat is in backgrund"
sleep 1
ps aux | grep "spoc"
  

