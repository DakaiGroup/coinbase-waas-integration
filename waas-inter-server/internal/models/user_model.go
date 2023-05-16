package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id          primitive.ObjectID `json:"id,omitempty" bson:"id,omitempty"`
	Username    string             `json:"username" bson:"username,binding:required"`
	Password    string             `json:"password,omitempty" bson:"password,binding:required"`
	Pool        Pool               `json:"pool,omitempty" bson:"pool,omitempty"`
	DeviceId    string             `json:"deviceId,omitempty" bson:"deviceId,omitempty"`
	DeviceGroup string             `json:"deviceGroup,omitempty" bson:"deviceGroup,omitempty"`
	Wallet      string             `json:"wallet,omitempty" bson:"wallet,omitempty"`
	Addresses   []Address          `json:"addresses,omitempty" bson:"addresses,omitempty"`
}

type Address struct {
	Address string `json:"address,omitempty" bson:"address,omitempty"`
}

type Pool struct {
	Id          primitive.ObjectID `json:"id,omitempty" bson:"id,omitempty"`
	Name        string             `json:"name,omitempty" bson:"name,omitempty"`
	DisplayName string             `json:"displayName,omitempty" bson:"displayName,omitempty"`
}
