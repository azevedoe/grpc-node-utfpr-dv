import * as grpc from '@grpc/grpc-js';
import { type Person, type PersonRequest, PersonResponse, type PersonId } from './proto/person_pb';
import { PersonServiceService } from './proto/person_grpc_pb';

const persons: Person[] = []; 

function createPerson(call: grpc.ServerUnaryCall<PersonRequest, PersonResponse>, callback: grpc.sendUnaryData<PersonResponse>) {
    const person = call.request.getPerson();

    if (person) {
        person.setId(persons.length + 1);

        persons.push(person);

        const response = new PersonResponse();
        response.setPerson(person);

        callback(null, response);
    }
}

function getPerson(call: grpc.ServerUnaryCall<PersonId, PersonResponse>, callback: grpc.sendUnaryData<PersonResponse>) {
    const personId = call.request.getId();
    
    const person = persons.find(p => p.getId() === personId);

    if (person) {
        const response = new PersonResponse();
        response.setPerson(person);
        callback(null, response);
    } else {
        callback({
            code: grpc.status.NOT_FOUND,
            message: 'Person not found',
        });
    }
}

function main() {
    const server = new grpc.Server();
    server.addService(PersonServiceService, {
        createPerson,
        getPerson
    });
    
    server.bindAsync(
        '0.0.0.0:50051',
        grpc.ServerCredentials.createInsecure(),
        (err, port) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Server running on port ${port}`);
            server.start();
        }
    );
}

main();
