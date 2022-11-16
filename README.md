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
1,run to get image redis docker:<br /> 
docker pull redis<br />
2, run create a redis container:<br />
docker run -d --name otpRedis -p 127.0.0.2:6379:6379 redis<br />
3 ,run if there is a image redis then it is finished<br />
docker ps -a<br />


# project<br />
1, run to install module<br />
npm i<br />
2, run to project<br />
npm run dev<br />


# test otp module<br />
1,run api to get otp.<br />
http://127.0.0.1:3333/api/v1/account/generateOtpEmail?email=demo@dso.org.sg<br />
2, run api to check otp <br />
http://127.0.0.1:3333/api/v1/account/checkOtp?email=demo@dso.org.sg&otp=874425<br />
