package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"strings"
)

var DATABASE_NAME = "MicrosoftService"

func setupTable(db *sql.DB) {
	if _, err := db.Exec("CREATE DATABASE IF NOT EXISTS "+DATABASE_NAME); err != nil {
		panic(err)
	}

	if _, err := db.Exec("USE "+DATABASE_NAME); err != nil {
		panic(err)
	}

	userTable := []string {
		"CREATE TABLE IF NOT EXISTS USER ( ",
	    "EMAIL VARCHAR(254) NOT NULL, ",
	    "ACCESS_TOKEN VARCHAR(1200) NOT NULL, ",
	    "REFRESH_TOKEN VARCHAR(1200) NOT NULL, ", 
	    "ACCESS_TOKEN_EXPIRE DATETIME NOT NULL, ",
		"REFRESH_TOKEN_EXPIRE DATETIME NOT NULL, ",
		"LAST_READ_EMAIL DATETIME NOT NULL, ",
	    "PRIMARY KEY (EMAIL) )"}
	
	if _, err := db.Exec(strings.Join(userTable, "")); err != nil {
		panic(err)
	}

}

func main() {
	fmt.Println("DB PARTY!")

	db, err := sql.Open("mysql", "root:password123@tcp(127.0.0.1:3306)/")
    if err != nil {
		fmt.Println("Connection error")
		panic(err.Error)
	}
	defer db.Close()
	
	setupTable(db)

}