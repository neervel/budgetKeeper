export class UsersStates {
  usersMap = new Map<number, any>();

  constructor() {
    this.usersMap.set(469075562, {
      name: 'Kirill',
      currentPurchases: [],
    });

    this.usersMap.set(511939312, {
      name: 'Lisa',
      currentPurchases: [],
    });
  }

  setCurrentPurchases(chatId: number, currentPurchases: any[]) {
    this.usersMap.set(chatId, { ...this.usersMap.get(chatId), currentPurchases });
  }

  getCurrentPurchases(chatId: number) {
    return this.usersMap.get(chatId).currentPurchases;
  }
}

export const usersStates = new UsersStates();
