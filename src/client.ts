import * as grpc from '@grpc/grpc-js';
import { PersonServiceClient } from './proto/person_grpc_pb';
import { Person, PersonId, PersonRequest } from './proto/person_pb';

const client = new PersonServiceClient(
    'localhost:50051',
    grpc.credentials.createInsecure()
) as PersonServiceClient;


const person = new Person();
person.setName("Edson Azevedo");
person.setAge(10);

const request = new PersonRequest();
request.setPerson(person);


client.createPerson(request,
    (err, response) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Person created:', response?.getPerson());

            const reqGetPerson = new PersonId();

            reqGetPerson.setId(1);

            client.getPerson(reqGetPerson, (err, response) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Person fetched:', response?.getPerson());
                }
            });
        }
    }
);
