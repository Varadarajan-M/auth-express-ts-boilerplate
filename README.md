## Auth Service API


`baseUrl` : https://auth-express-ts.up.railway.app/api

### Available endpoints

- `POST` `/user/register` 
	
	**Sample request** : 

	Headers : 

	    {
		    'content-type' : application/json
	    }

	Body : 
		

		{
		    "email": "Johndoe@company.com",
		    "password":"password",
		    "username":"John doe"
		}
	

		


- `POST` `/user/login` 

	
	**Sample request** : 
	
	Headers : 

	    {
		    'content-type' : application/json
	    }

	Body : 
		

		{
		    "email": "Johndoe@company.com",
		    "password":"password"
		}
	
- `POST` `/user/reset-password` 
	
	**Sample request** : 

	Headers : 

	    {
		    'content-type' : application/json
	    }

	Body : 
		

		{
		    "email": "Johndoe@company.com"
		}
		
- `POST` `/user/update-password` 
	
	**Sample request** : 

	Headers : 		

	    {
		    "content-type" : "application/json",
		    "Authorization" : "Bearer <token here>"
	    }

	Body : 
		

		{
		    "password": "password"
		}

		
- `GET` `/private/content` 
	
	**Sample request** : 

	Headers : 
		
	
	     {
    		    "content-type" : "application/json",
    		    "Authorization" : "Bearer <token here>"
    	 }

