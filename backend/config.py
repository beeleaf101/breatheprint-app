import os
from datetime import timedelta
from typing import Optional

class Config:
    """Base configuration class for BreathePrint backend"""
    
    # Application Settings
    APP_NAME = "BreathePrint"
    APP_VERSION = "1.0.0"
    DEBUG = False
    TESTING = False
    
    # Secret Key for session management and JWT
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///breatheprint.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # CORS Settings (for React frontend)
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://breatheprint.app'
    ]
    
    # JWT Authentication
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or SECRET_KEY
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # API Rate Limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_DEFAULT = "100 per hour"
    RATELIMIT_STORAGE_URL = "memory://"
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
    # NASA API Configuration
    # Get your free API key at: https://api.nasa.gov/
    NASA_API_KEY = os.environ.get('NASA_API_KEY')  # REQUIRED - No default
    NASA_BASE_URL = 'https://api.nasa.gov'
    
    # NASA TEMPO Satellite Data
    # TEMPO provides NO2, O3, and other air quality measurements
    NASA_TEMPO_API_URL = os.environ.get('NASA_TEMPO_API_URL') or f'{NASA_BASE_URL}/tempo'
    
    # OpenAQ API Configuration
    # Real-time air quality data from monitoring stations worldwide
    OPENAQ_API_URL = 'https://api.openaq.org/v2'
    OPENAQ_API_KEY = os.environ.get('OPENAQ_API_KEY')  # Optional but recommended
    
    # API Timeout Settings
    API_REQUEST_TIMEOUT = 10  # seconds
    API_MAX_RETRIES = 3
    
    # Air Quality Data Cache
    AQ_CACHE_TIMEOUT = 3600  # 1 hour in seconds
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # Geolocation Settings
    DEFAULT_SEARCH_RADIUS_KM = 10
    MAX_SEARCH_RADIUS_KM = 100
    GEOLOCATION_PRECISION = 6  # Decimal places for lat/lon
    
    # Kuwait Region Configuration
    KUWAIT_REGIONS = {
        'Kuwait City': {'lat': 29.3759, 'lon': 47.9774, 'type': 'urban'},
        'Hawalli': {'lat': 29.3326, 'lon': 48.0289, 'type': 'residential'},
        'Salmiya': {'lat': 29.3336, 'lon': 48.0747, 'type': 'coastal'},
        'Ahmadi': {'lat': 29.0769, 'lon': 48.0839, 'type': 'industrial'},
        'Jahra': {'lat': 29.3375, 'lon': 47.6581, 'type': 'desert'},
        'Farwaniya': {'lat': 29.2770, 'lon': 47.9589, 'type': 'residential'},
    }
    
    # Email Configuration (for notifications)
    MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'smtp.gmail.com'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'noreply@breatheprint.app'
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL') or 'INFO'
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOG_FILE = 'logs/breatheprint.log'
    
    # Celery Configuration (for background tasks)
    CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL') or 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND') or 'redis://localhost:6379/0'
    
    # Map Configuration
    MAP_DEFAULT_CENTER = {'lat': 29.3759, 'lon': 47.9774}  # Kuwait City
    MAP_DEFAULT_ZOOM = 11
    
    # Report Settings
    MIN_REPORT_DESCRIPTION_LENGTH = 10
    MAX_REPORT_DESCRIPTION_LENGTH = 1000
    REPORT_MODERATION_ENABLED = True
    
    # AQI Thresholds
    AQI_BREAKPOINTS = {
        'good': (0, 50),
        'moderate': (51, 100),
        'unhealthy_sensitive': (101, 150),
        'unhealthy': (151, 200),
        'very_unhealthy': (201, 300),
        'hazardous': (301, 500)
    }
    
    # Weather API Configuration
    WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
    WEATHER_CACHE_TIMEOUT = 1800  # 30 minutes
    
    # Admin Settings
    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL') or 'admin@breatheprint.app'
    ENABLE_ADMIN_PANEL = True
    
    @staticmethod
    def init_app(app):
        """Initialize application with this config"""
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(os.path.dirname(Config.LOG_FILE), exist_ok=True)


class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    RATELIMIT_ENABLED = False
    
    # Use local development database
    SQLALCHEMY_DATABASE_URI = 'sqlite:///breatheprint_dev.db'


class TestingConfig(Config):
    """Testing environment configuration"""
    TESTING = True
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///breatheprint_test.db'
    RATELIMIT_ENABLED = False
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Production environment configuration"""
    DEBUG = False
    
    # Production database (PostgreSQL recommended)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://user:password@localhost/breatheprint'
    
    # Production Redis for caching
    REDIS_URL = os.environ.get('REDIS_URL') or 'redis://localhost:6379/0'
    
    # Stricter rate limiting in production
    RATELIMIT_DEFAULT = "50 per hour"
    
    # Production logging
    LOG_LEVEL = 'WARNING'
    
    @classmethod
    def init_app(cls, app):
        Config.init_app(app)
        
        # Production-specific initialization
        import logging
        from logging.handlers import RotatingFileHandler
        
        file_handler = RotatingFileHandler(
            cls.LOG_FILE,
            maxBytes=10240000,  # 10MB
            backupCount=10
        )
        file_handler.setFormatter(logging.Formatter(cls.LOG_FORMAT))
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config(env: Optional[str] = None) -> Config:
    """
    Get configuration object based on environment
    
    Args:
        env: Environment name ('development', 'testing', 'production')
        
    Returns:
        Config object for the specified environment
    """
    if env is None:
        env = os.environ.get('FLASK_ENV', 'development')
    
    return config.get(env, config['default'])