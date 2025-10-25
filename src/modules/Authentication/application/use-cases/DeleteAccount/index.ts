import { DeleteAccountInput, DeleteAccountOutput } from "./dto.js";
import AccountGateway from '../../../datasource/Account/gateway.js';
import UseCase from '@/modules/shared/base-use-case.js';

export default class DeleteAccount extends UseCase<DeleteAccountInput, DeleteAccountOutput> {
  constructor(
    private readonly accountGateway: AccountGateway,
  ) {
    super();
  }

  async execute(input: DeleteAccountInput): Promise<DeleteAccountOutput> {
    await this.accountGateway.delete({ id: input.id });

    return {
      id: input.id,
    };
  }
}
