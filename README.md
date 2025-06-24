# @veksa/protobuf-codec

[![npm version](https://img.shields.io/npm/v/@veksa/protobuf-codec.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/protobuf-codec)
[![npm downloads](https://img.shields.io/npm/dm/@veksa/protobuf-codec.svg?style=flat-square)](https://www.npmjs.com/package/@veksa/protobuf-codec)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE.md)

Protocol Buffers codec implementation for @veksa/transport messaging layer

## Installation

@veksa/protobuf-codec requires **TypeScript 5.8 or later**.

### Using npm or yarn

```bash
# npm
npm install @veksa/protobuf-codec

# yarn
yarn add @veksa/protobuf-codec
```

## Features

- Protocol Buffers encoding/decoding for @veksa/transport
- Efficient binary serialization and deserialization
- Support for all Protocol Buffers data types
- Type-safe message handling with TypeScript
- Customizable field definitions through simple arrays
- Lightweight implementation with minimal dependencies
- Full integration with @veksa/transport messaging system

## Basic Usage

```typescript
import { createProtobufCodec } from '@veksa/protobuf-codec';

// Define message field structures as arrays
const userMessageFields = [
  [1, 'id', 'uint32', 1],
  [2, 'name', 'string', 1],
  [3, 'email', 'string', 0],
  [4, 'active', 'bool', 0]
];

const settingsMessageFields = [
  [1, 'theme', 'string', 1],
  [2, 'notifications', 'bool', 1]
];

// Create a codec with a map of message types to field definitions
const codec = createProtobufCodec({
  1: userMessageFields,     // User message type
  2: settingsMessageFields  // Settings message type
});

// Encode a message
const encodedMessage = codec.encode({
  payloadType: 1,  // User message
  payload: {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com',
    active: true
  },
  clientMsgId: 'msg-123'
});

// Decode a message
const decodedMessage = codec.decode(encodedMessage);
```

## API Reference

### createProtobufCodec(apiMap)

Creates a new Protocol Buffers codec that implements the `ITransportCodec` interface.

- `apiMap` (Record<number, FieldItem[]>): A map of payload types to field definitions

Returns an `ITransportCodec` object with the following methods:

- `encode(message: IMessage): ArrayBuffer | string | undefined`
- `decode(buffer: ArrayBuffer | string): IMessage | undefined`

### FieldItem Format

Field items are defined as arrays with the following structure:

```typescript
// [tag, name, type, required, oneof?, anyof?]
type FieldItem = [number, string, FieldType, 0 | 1, string?, string?];
```

Where:
- `tag` (number): The field number
- `name` (string): The field name
- `type` (FieldType): The field type (e.g., 'string', 'uint32')
- `required` (0 | 1): Whether the field is required (1) or optional (0)
- `oneof` (string?): Optional oneof group name
- `anyof` (string?): Optional anyof group name

### Supported Field Types

- Simple types: 'string', 'int32', 'uint32', 'bool', 'bytes', etc.
- Maps: ['map', keyType, valueType]
- Repeated fields: ['repeated-simple', fieldType] or ['repeated-packed', fieldType]
- Wrapped fields: ['wrapper', simpleType]
- Nested messages: FieldItem[]

## Contributing

This project welcomes contributions and suggestions.

## License

[MIT](LICENSE.md)
