import * as uuid from "uuid";
import { EditOwnProfileInput, EditOwnProfileOutput } from "./dto.js";
import AccountGateway from '../../../datasource/Account/gateway.js';
import { Account } from '../../../datasource/Account/model.js';
import UseCase from '@/modules/shared/base-use-case.js';

export default class EditOwnProfile extends UseCase<EditOwnProfileInput, EditOwnProfileOutput> {
  constructor(
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: EditOwnProfileInput): Promise<EditOwnProfileOutput> {
    const id = input.id || uuid.v4();

    const account: Omit<Account, 'created_at' | 'updated_at'> = {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      password: input.password,
      phone: input.phone,
      role: 'TEACHER',
      birth_date: input.birth_date,
    };

    await this.accountGateway.update(account);

    return {
      id,
      name: input.name,
      last_name: input.last_name,
      email: input.email,
      phone: input.phone,
      birth_date: input.birth_date,
    };
  }
}
