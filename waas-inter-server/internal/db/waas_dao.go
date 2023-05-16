package db

import (
	"context"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var poolCollection *mongo.Collection = configs.GetCollection(configs.DB, "pools")

func GetPoolByDisplayName(ctx context.Context, name string) (*models.Pool, error) {
	var poolModel models.Pool

	filter := bson.D{{Key: "displayName", Value: name}}

	err := poolCollection.FindOne(ctx, filter).Decode(&poolModel)
	if err != nil {
		return nil, err
	}
	return &poolModel, nil
}

func CreateNewPool(ctx context.Context, poolName string, poolDisplayName string) (*mongo.InsertOneResult, error) {
	poolModel := models.Pool{
		Id:          primitive.NewObjectID(),
		Name:        poolName,
		DisplayName: poolDisplayName,
	}
	return poolCollection.InsertOne(ctx, poolModel)
}