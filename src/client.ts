import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './proto/person';
import { PersonServiceClient } from './proto/person/PersonService';
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

const client = new proto.person.PersonService(
    'localhost:50051',
    grpc.credentials.createInsecure()
) as PersonServiceClient;

// Criar uma nova pessoa
client.CreatePerson(
    { person: { name: 'João', age: 30 } },
    (err, response) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Person created:', response?.person);

            // Buscar a pessoa criada
            client.GetPerson({ id: response!.person!.id }, (err, response) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Person fetched:', response?.person);
                }
            });
        }
    }
);
