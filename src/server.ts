import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/person';
import { PersonServiceHandlers } from './proto/person/PersonService';
import { Person } from './proto/person/Person';
import * as path from 'path';

const packageDefinition = protoLoader.loadSync(
    path.resolve(__dirname, './proto/person.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    }
);

const proto = (grpc.loadPackageDefinition(packageDefinition) as unknown) as ProtoGrpcType;

const persons: Person[] = []; // Armazenamento simples em memória

const personService: PersonServiceHandlers = {
    CreatePerson: (call, callback) => {
        const person = call.request.person;
        person.id = persons.length + 1; // Gerar um ID simples
        persons.push(person);
        callback(null, { person });
    },
    GetPerson: (call, callback) => {
        const personId = call.request.id;
        const person = persons.find(p => p.id === personId);
        if (person) {
            callback(null, { person });
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                message: 'Person not found',
            });
        }
    },
};

function main() {
    const server = new grpc.Server();
    server.addService(proto.person.PersonService.service, personService);
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
