package configs

import (
    "log"
    "os"
    "github.com/joho/godotenv"
)

func EnvMongoURI() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("MONGOURI")
}

func EnvApiKeyName() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("API_KEY_NAME")
}

func EnvApiPrivateKey() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("API_PRIVATE_KEY")
}

func TokenLifeSpan() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("TOKEN_HOUR_LIFESPAN")
}

func PoolName() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("POOL_NAME")
}

func RpcUrl() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("RPC_URL")
}

func Network() string {
    err := godotenv.Load()
    if err != nil {
        log.Fatalf("Error loading .env file %v", err)
    }

    return os.Getenv("NETWORK")
}