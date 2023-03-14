package db

import (
	"context"
	"html"
	"strings"
	"waas-example/inter-server/internal/configs"
	"waas-example/inter-server/internal/models"
	"waas-example/inter-server/internal/requests"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection = configs.GetCollection(configs.DB, "users")

func CreateUser(ctx context.Context, registerInput requests.RegisterInput, hashedPassword []byte, poolModel *models.Pool, deviceGroup string) (*mongo.InsertOneResult, error) {
	newUser := models.User{
		Id:          primitive.NewObjectID(),
		Username:    html.EscapeString(strings.TrimSpace(registerInput.Username)),
		Password:    string(hashedPassword),
		DeviceId:    registerInput.DeviceId,
		Pool:        *poolModel,
		DeviceGroup: deviceGroup,
	}

	return userCollection.InsertOne(ctx, newUser)
}

func GetUserByUserName(ctx context.Context, username string) (*models.User, error) {
	var user models.User

	filter := bson.D{{Key: "username", Value: username}}

	err := userCollection.FindOne(ctx, filter).Decode(&user)

	return &user, err
}

func GetUserById(ctx context.Context, userId string) (*models.User, error) {
	var user models.User

	objId, _ := primitive.ObjectIDFromHex(userId)
	filter := bson.D{{Key: "id", Value: objId}}

	err := userCollection.FindOne(ctx, filter).Decode(&user)

	return &user, err
}

func UpdateUserWalletById(ctx context.Context, userId string, walletName string) (*mongo.UpdateResult, error) {
	objId, _ := primitive.ObjectIDFromHex(userId)
	filter := bson.D{{Key: "id", Value: objId}}

	updateWallet := bson.D{{Key: "$set",
		Value: bson.D{
			{Key: "wallet", Value: walletName}},
	}}

	return userCollection.UpdateOne(ctx, filter, updateWallet)
}

func InsertNewUserAddressById(ctx context.Context, userId string, newAddress string) (*mongo.UpdateResult, error) {
	objId, _ := primitive.ObjectIDFromHex(userId)
	filter := bson.D{{Key: "id", Value: objId}}

	address := models.Address{
		Address: newAddress,
	}

	change := bson.M{"$push": bson.M{"addresses": address}}

	return userCollection.UpdateOne(ctx, filter, change)
}
