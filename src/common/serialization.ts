
export interface ISerializationInfo
{
    id: string;
    schema: number;
}

export interface ISerialized
{
    serialization: ISerializationInfo;
    [others: string]: any;                   // Any other properties are allowed
}

export interface ISerializable
{
    serialize(): ISerialized;
}

export interface ISerializationAide
{
    readonly serializationId: string;
    deserialize(serialized: ISerialized): ISerializable | undefined;
}
