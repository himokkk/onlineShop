 ## Preparation

Follow these steps to set up the project:

1. Create a virtual environment:

   ```sh
   python -m venv venv
   ```

2. Activate the virtual environment:

   ```sh
   source venv/bin/activate
   ```

3. Install the requirements:

   ```sh
   pip install -r requirements/requirements.txt
   ```
   
4. Migrate the database:

   ```sh
   python manage.py migrate
   ```

5. Run the Django server:

   ```sh
   python manage.py runserver
   ```

## Tests

```sh
python manage.py test
```

## Docs
```sh
   python manage.py createsuperuser
   ```
 
 ```schema/swagger-ui/#/```: swagger documentation url

## Deployment

Add additional notes about how to deploy this on a live system.

## Built With

- Django
- Django Rest Framework
- Django Channels

## Authors

Paweł Kwieciński
