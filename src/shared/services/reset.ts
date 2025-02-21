import { accountsService } from './accounts';
import { transactionsService } from './transactions';
import { storageService } from './storage';

class ResetService {
  private static instance: ResetService;

  private constructor() {}

  public static getInstance(): ResetService {
    if (!ResetService.instance) {
      ResetService.instance = new ResetService();
    }
    return ResetService.instance;
  }

  /**
   * Resets all app data to initial state
   * @param shouldResetToDefaults - If true, accounts will be reset to default accounts. If false, accounts will be cleared.
   */
  public async resetAllData(shouldResetToDefaults: boolean = true): Promise<void> {
    try {
      // Reset transactions first to avoid orphaned transactions
      await transactionsService.resetTransactions();
      
      if (shouldResetToDefaults) {
        // Reset accounts to default state
        await accountsService.resetAccounts();
      } else {
        // Clear all accounts
        await storageService.setAccounts([]);
      }
    } catch (error) {
      console.error('Error resetting app data:', error);
      throw new Error('Failed to reset app data');
    }
  }
}

export const resetService = ResetService.getInstance(); 