# poker-graphql

A GraphQL + Express app to query Poker stats from a MongoDB database.

### To Run

* Install dependencies
```shell
cd server
npm install
```

* Start server
```shell
node app.js
```

* Navigate to <http://localhost:4000/graphql> on any browser

### To Inspect database
```shell
mongo
use poker
db.players.find().pretty()
db.games.find().pretty()
```

### Types
```
Player{
  id: ID
  name: String
  winnings: Int
  gamesPlayed: [Game]
  gamesWon: [Game]
}

Game{
  id: ID
  name: String
  prizeMoney: Int
}
```

### Queries
```
players: [Player]

playerById(id: ID): Player

playerByName(name: String): Player

games: [Game]

gameById(id: ID): Game

gameByName(name: String): Game
```

### Mutations
```
addPlayer(
name: String,
winnings: Int,
gamesPlayed: [ID],
gamesWon: [ID]
): Player

addGame(
gameId: ID,
name: String,
prizeMoney: Int
): Game
```

### Suggested Sample Mutations
```
mutation{
  addGame(gameId: "1", name: "20k High Roller", prizeMoney: 20000) {
    id
    name
    prizeMoney
  }
}

mutation {
  addGame(gameId: "2", name: "1mil Cashgame", prizeMoney: 1000000) {
    id
    name
    prizeMoney
  }
}

mutation{
  addGame(gameId: "3", name: "WSOP", prizeMoney: 2500000) {
    id
    name
    prizeMoney
  }
}

mutation {
  addPlayer(name: "Phil Ivey", winnings: 123456, gamesPlayed: ["1", "2", "3"], gamesWon: ["3"]) {
    id
    name
    winnings
    gamesPlayed{
    	name
    	prizeMoney
    }
    gamesWon{
      name
      prizeMoney
    }
  }
}
```
