import { ITransaction } from '../types/transaction';
import { storageService } from './storage';
import { accountsService } from './accounts';

export interface Transaction {
  id: string;
  type: ITransaction['type'];
  amount: number;
  category: ITransaction['category'];
  sourceAccount: ITransaction['sourceAccount'];
  destinationAccount: ITransaction['destinationAccount'];
  incomeSource: ITransaction['incomeSource'];
  date: Date;
  note?: string;
}

interface StoredTransaction extends Omit<Transaction, 'date'> {
  date: string;
}

class TransactionsService {
  private static instance: TransactionsService;
  private transactions: Transaction[] = [];

  private constructor() {
    this.initializeTransactions();
  }

  private async initializeTransactions() {
    try {
      const storedTransactions = await storageService.getTransactions();
      if (storedTransactions) {
        this.transactions = (storedTransactions as unknown as StoredTransaction[]).map(t => ({
          ...t,
          date: new Date(t.date),
        }));
      } else {
        this.transactions = [];
        await storageService.setTransactions([]);
      }
    } catch (error) {
      console.error('Error initializing transactions:', error);
      this.transactions = [];
    }
  }

  private async saveTransactions(): Promise<void> {
    const storedTransactions: StoredTransaction[] = this.transactions.map(t => ({
      ...t,
      date: t.date.toISOString(),
    }));
    await storageService.setTransactions(storedTransactions as unknown as Transaction[]);
  }

  public static getInstance(): TransactionsService {
    if (!TransactionsService.instance) {
      TransactionsService.instance = new TransactionsService();
    }
    return TransactionsService.instance;
  }

  public async createTransaction(state: ITransaction & { note?: string }): Promise<Transaction> {
    if (!state.amount.value) {
      throw new Error('Amount is required');
    }

    if (state.type === 'expense' && !state.sourceAccount) {
      throw new Error('Source account is required for expense');
    }

    if (state.type === 'income' && !state.destinationAccount) {
      throw new Error('Destination account is required for income');
    }

    if (state.type === 'transfer' && (!state.sourceAccount || !state.destinationAccount)) {
      throw new Error('Both accounts are required for transfer');
    }

    if (state.type === 'expense' && !state.category) {
      throw new Error('Category is required for expense');
    }

    const amount = parseFloat(state.amount.value);

    // Get fresh account data before updating
    let sourceAccount = state.sourceAccount;
    let destinationAccount = state.destinationAccount;

    if (sourceAccount?.id) {
      const freshSourceAccount = await accountsService.getAccountById(sourceAccount.id);
      if (!freshSourceAccount) {
        throw new Error('Source account not found');
      }
      if (!('balance' in freshSourceAccount)) {
        throw new Error('Invalid source account type');
      }
      sourceAccount = freshSourceAccount as typeof sourceAccount;
    }

    if (destinationAccount?.id) {
      const freshDestinationAccount = await accountsService.getAccountById(destinationAccount.id);
      if (!freshDestinationAccount) {
        throw new Error('Destination account not found');
      }
      if (!('balance' in freshDestinationAccount)) {
        throw new Error('Invalid destination account type');
      }
      destinationAccount = freshDestinationAccount as typeof destinationAccount;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: state.type,
      amount,
      category: state.category,
      sourceAccount,
      destinationAccount,
      incomeSource: state.incomeSource,
      date: new Date(),
      note: state.note,
    };

    // Update account balances with fresh data
    if (transaction.type === 'expense' && sourceAccount && 'balance' in sourceAccount) {
      await accountsService.updateAccount(sourceAccount.id, {
        balance: sourceAccount.balance - amount,
      });
    } else if (
      transaction.type === 'income' &&
      destinationAccount &&
      'balance' in destinationAccount
    ) {
      await accountsService.updateAccount(destinationAccount.id, {
        balance: destinationAccount.balance + amount,
      });
    } else if (transaction.type === 'transfer') {
      if (sourceAccount && 'balance' in sourceAccount) {
        await accountsService.updateAccount(sourceAccount.id, {
          balance: sourceAccount.balance - amount,
        });
      }
      if (destinationAccount && 'balance' in destinationAccount) {
        await accountsService.updateAccount(destinationAccount.id, {
          balance: destinationAccount.balance + amount,
        });
      }
    }

    // Save transaction after account updates
    this.transactions.push(transaction);
    await this.saveTransactions();

    return transaction;
  }

  public async getTransactions(): Promise<Transaction[]> {
    const storedTransactions = await storageService.getTransactions();
    if (!storedTransactions) return [];

    this.transactions = (storedTransactions as unknown as StoredTransaction[]).map(t => ({
      ...t,
      date: new Date(t.date),
    }));

    return this.transactions;
  }

  public async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(
      t => t.sourceAccount?.id === accountId || t.destinationAccount?.id === accountId,
    );
  }

  public async getTransactionsByCategory(categoryId: string): Promise<Transaction[]> {
    const transactions = await this.getTransactions();
    return transactions.filter(t => t.category?.id === categoryId);
  }

  // Reset all transactions data
  public async resetTransactions(): Promise<void> {
    this.transactions = [];
    await storageService.setTransactions([]);
  }
}

export const transactionsService = TransactionsService.getInstance();
