package main 

import (
	"encoding/json"	
	"fmt"
	"log"
	"io/ioutil"
	"net/http"
);

type UserResquest struct {
	user User
}

type User struct {
  name string
  email string
  microsoftRefreshToken string
}

func addOrUpdateUser(writer http.ResponseWriter, req *http.Request) {
  body, err := ioutil.ReadAll(req.Body)
  if err != nil {
    fmt.Println(err)
  }
  
  var request UserResquest
  err = json.Unmarshal(body, &request)
  if err != nil {
	fmt.Println(err)
  }
  
  fmt.Printf("%+v\n", request)
  fmt.Fprintf(writer, "Success")

}

func setupRoutes() {
	http.HandleFunc("/AddUser", addOrUpdateUser)
}

func main() {
	fmt.Println("Server Active")
	setupRoutes()
	log.Fatal(http.ListenAndServe(":8081", nil))

}

