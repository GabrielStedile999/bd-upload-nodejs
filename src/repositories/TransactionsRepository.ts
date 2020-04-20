import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Accumulator {
  income: number;
  outcome: number;
  total: number;
}

const getIncomesAndOutcomes = (
  accumulator: Accumulator,
  transaction: Transaction,
): Accumulator => {
  if (transaction.type === 'income') {
    accumulator.income += Number(transaction.value);
  } else {
    accumulator.outcome += Number(transaction.value);
  }
  return accumulator;
};

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async findByTitle(title: string): Promise<Transaction | null> {
    const findTransaction = await this.findOne({
      where: { title },
    });

    return findTransaction || null;
  }

  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();

    const accumulator = { income: 0, outcome: 0, total: 0 };
    const { income, outcome } = allTransactions.reduce(
      getIncomesAndOutcomes,
      accumulator,
    );
    const total = income - outcome;

    return { income, outcome, total };
  }
}

export default TransactionsRepository;
