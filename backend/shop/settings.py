import datetime
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-p4igq(68n%t+2zan!wg81d*co%1zub7$qoc^ct@%jbkt+c_$22"

DEBUG = True
USE_TZ = True
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    "daphne",
    "chat",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "categories",
    "channels",
    "orders",
    "products",
    "users",
    "django_extensions",
    "drf_spectacular",
]
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # React frontend running on localhost
]

ASGI_APPLICATION = "shop.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}


GRAPH_MODELS = {
    "all_applications": True,
    "group_models": True,
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = "shop.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "shop.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "shop",
        "USER": "shop",
        "PASSWORD": "qwerty123",
        "HOST": "127.0.0.1",
        "PORT": "5432",
    }
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"


# current_file_path = os.getcwd()
# config_path = os.path.join(current_file_path, "shop", "config.ini")
# config = configparser.ConfigParser()
# config.read(config_path)
#
# EMAIL_HOST = config.get("SMTP", "HOST")
# EMAIL_PORT = config.get("SMTP", "PORT")
# EMAIL_USE_TLS = True  # Set it to False if your server does not use TLS/SSL
# EMAIL_HOST_USER = config.get("SMTP", "HOST_USER")
# EMAIL_HOST_PASSWORD = config.get("SMTP", "HOST_PASSWORD")

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": datetime.timedelta(days=1),
    "REFRESH_TOKEN_LIFETIME": datetime.timedelta(days=365),
}

MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"

SPECTACULAR_SETTINGS = {
    "TITLE": "Online Shop API",
    "SERVE_PERMISSIONS": ["rest_framework.permissions.IsAdminUser"],
    "SERVE_AUTHENTICATION": ["rest_framework.authentication.BasicAuthentication"],
    "SWAGGER_UI_SETTINGS": {
        "deepLinking": True,
        "persistAuthorization": True,
        "displayOperationId": True,
    },
}