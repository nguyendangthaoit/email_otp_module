# node_web_api
structure node api

# ev
DATABASE = "CRUD"
MONGO_PATH = "mongodb://localhost/"
PORT = 3333
JWT_SECRET = "crud"
EMAIL_SEND = ""
EMAIL_PASS = ""


# to start

# run redis docker
1,run to get image redis docker: 
docker pull redis
2, run create a redis container:
docker run -d --name otpRedis -p 127.0.0.2:6379:6379 redis
3 ,run if there is a image redis then it is finished
docker ps -a


# project
1, run to install module
npm i
2, run to project
npm run dev


# test otp module
1,run api to get otp.
http://127.0.0.1:3333/api/v1/account/generateOtpEmail?email=demo@dso.org.sg
2, run api to check otp 
http://127.0.0.1:3333/api/v1/account/checkOtp?email=email=demo@dso.org.sg&otp=874425