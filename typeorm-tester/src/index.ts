import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { Person } from "./entity/Person";
import "dotenv/config";

(async function main() {
  let retries = 5;

  const connection: Connection = await new Promise<Connection>(
    async (resolve, reject) => {
      // Create a loop to set up retries, as DB may not be fully initialized by the time we reach this code here
      while (retries) {
        try {
          //resolve the Promise on line 10 with the connection, if we end up getting a successful connection
          let connection = await createConnection();
          resolve(connection);
          break;
        } catch (e) {
          // Just log the error and decrement if createConnection() returns an error.
          console.error(e);
          retries -= 1;
          console.log(`Retries left: ${retries}`);
        }
        reject();
        //wait 5s before jumping out of while-loop
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  );

  // const person: Person = new Person();
  // createPerson(person, "guyguy", "help me");

  // await connection.getRepository(Person).save(person);
  // await connection.manager.save(person);
  // console.log("Saved a new person with id: " + person.id);

  console.log("Loading users from the database...");
  const people = await connection.manager.find(Person);
  // const realPeople = await connection.getRepository(Person).find();

  console.log("Loaded users:");
  destructPeople(people);
})().catch((e) => console.error(e));

function createPerson(
  p: Person,
  n: string,
  b: string = "This user likes to keep a wall of fog on their life, it seems."
) {
  // this actually works... but I thought in JS things weere pass by value?
  // Does object.assign() somehow have access to the Person instance we passed?
  Object.assign(p, {
    name: n,
    bio: b,
  });
}

function destructPeople(people: Person[]) {
  people.forEach((person: Person) => {
    console.log(JSON.stringify(person), "\n");
  });
}
