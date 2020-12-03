Gil's container logging service (v. 1.0)

Used port = 3000

How to use:

run sample containers:
	1. go to the test folder (./test)
	2. run the ./run.sh script
	3. 3 containers will be built and ran in 3 separate terminal tabs. 

user npm start to run the server.


Create a container:
	to see a list of the containers running on your system and access their 
	id and name, use docker ps. 

	to add a containers to the server data base, either:
		
		1. submit a POST request on postman at localhost:3000/api/containers 
		using the following body raw format (all 4 fields are mandatory)
			{
   			  "name": "con1",
    		  "dockerId": "c4a86082942d",
    		  "dockerIp": "0.0.0.0",
    		  "dockerPort": 9000
			}

		2. use the front end interface by going to http://localhost:3000/create 
		in your browser of choice and following the instructions there.

Read container:
	1. go to http://localhost:3000/read. there you will find an input field and 
	a load button. Clicking on load when there is nothing in the field will pull
	up the records of every container in the system. You can then click on the 
	id of one of them which will enter it into the input field. Click load
	again the the log file for that specific entry will be pulled up.

	2. make a GET request on postman specifying the dockerId of
	any specific container to pull up its information. Make a request without
	specifying anything to pull up records of all the containers in the system.

Update container:
	1. go to http://localhost:3000/update and use the interface there to update
	any specific containers information by first loading its info using its 
	dockerId and then changing the field and submitting. 


Delete container:
	1. go to http://localhost:3000/delete. enter the dockerId of the container
	you'd like to delete and then press submit.

	2. do the same in postman

at the current configuration, log files are saved into a folder titled Logs with
log_<dockerId>.txt as their name format.

![Screenshot from 2020-12-03 10-58-39](https://user-images.githubusercontent.com/61935926/100987629-6c47be00-3557-11eb-91f5-0074e525de31.png)
![Screenshot from 2020-12-03 10-58-52](https://user-images.githubusercontent.com/61935926/100987625-6baf2780-3557-11eb-89bc-93b0f7da5373.png)
![Screenshot from 2020-12-03 10-59-39](https://user-images.githubusercontent.com/61935926/100987623-6b169100-3557-11eb-8619-c868c439636e.png)
![Screenshot from 2020-12-03 10-59-54](https://user-images.githubusercontent.com/61935926/100987604-681ba080-3557-11eb-8ea4-7510ea0318cb.png)
![Screenshot from 2020-12-03 11-00-55](https://user-images.githubusercontent.com/61935926/100987601-67830a00-3557-11eb-8d12-32f5be79d332.png)



