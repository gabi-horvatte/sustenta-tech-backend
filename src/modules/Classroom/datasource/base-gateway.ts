export default interface TableDataGateway<
  DBRecord extends Record<string, unknown>,
  Identifier extends Record<string, string | number>
> {
  insert(data: Omit<DBRecord, 'created_at' | 'updated_at'>): Promise<void>;
  update(data: Omit<DBRecord, 'created_at' | 'updated_at'>): Promise<void>;
  delete(id: Identifier): Promise<void>;
  findById(id: Identifier): Promise<DBRecord | null>;
}