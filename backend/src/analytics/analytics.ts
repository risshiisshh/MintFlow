import { db, COLLECTIONS, firebaseAdmin } from '../firebase/firebase';

interface GlobalAnalytics {
  totalTransactions: number;
  totalSponsoredUSD: number;
  polygonTransactions: number;
  baseTransactions: number;
  activeWalletsCount: number;
}

/**
 * Increments analytics metrics in Firestore after a successful transaction
 */
export async function logSuccessfulTransaction(
  eoaAddress: string,
  chain: 'polygon' | 'base',
  gasSavedUSD: number
): Promise<void> {
  const normalizedEOA = eoaAddress.toLowerCase();
  const globalRef = db.collection(COLLECTIONS.ANALYTICS).doc('global');
  const userAnalyticsRef = db.collection(COLLECTIONS.USERS).doc(normalizedEOA);

  try {
    await db.runTransaction(async (transaction) => {
      // 1. Get current global stats
      const globalDoc = await transaction.get(globalRef);
      let globalData: GlobalAnalytics = {
        totalTransactions: 0,
        totalSponsoredUSD: 0,
        polygonTransactions: 0,
        baseTransactions: 0,
        activeWalletsCount: 0,
      };

      if (globalDoc.exists) {
        const data = globalDoc.data();
        globalData = {
          totalTransactions: data?.totalTransactions || 0,
          totalSponsoredUSD: data?.totalSponsoredUSD || 0,
          polygonTransactions: data?.polygonTransactions || 0,
          baseTransactions: data?.baseTransactions || 0,
          activeWalletsCount: data?.activeWalletsCount || 0,
        };
      }

      // 2. Check if user is already registered as active
      const userDoc = await transaction.get(userAnalyticsRef);
      const isNewActiveWallet = !userDoc.exists || !userDoc.data()?.hasMinted;

      // Update user hasMinted flag
      transaction.set(
        userAnalyticsRef,
        {
          hasMinted: true,
          lastMintedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 3. Increment counters
      const updatedGlobalData: GlobalAnalytics = {
        totalTransactions: globalData.totalTransactions + 1,
        totalSponsoredUSD: Number((globalData.totalSponsoredUSD + gasSavedUSD).toFixed(4)),
        polygonTransactions:
          chain === 'polygon'
            ? globalData.polygonTransactions + 1
            : globalData.polygonTransactions,
        baseTransactions:
          chain === 'base'
            ? globalData.baseTransactions + 1
            : globalData.baseTransactions,
        activeWalletsCount: isNewActiveWallet
          ? globalData.activeWalletsCount + 1
          : globalData.activeWalletsCount,
      };

      transaction.set(globalRef, updatedGlobalData, { merge: true });
    });

    console.log(`📊 Analytics logged successfully for ${normalizedEOA} on ${chain}.`);
  } catch (error) {
    console.error('❌ Failed to log analytics:', error);
  }
}

/**
 * Retrieves the global analytics metrics
 */
export async function getGlobalAnalytics(): Promise<GlobalAnalytics> {
  const globalDoc = await db.collection(COLLECTIONS.ANALYTICS).doc('global').get();
  
  if (!globalDoc.exists) {
    return {
      totalTransactions: 0,
      totalSponsoredUSD: 0,
      polygonTransactions: 0,
      baseTransactions: 0,
      activeWalletsCount: 0,
    };
  }

  const data = globalDoc.data() as GlobalAnalytics;
  return {
    totalTransactions: data.totalTransactions || 0,
    totalSponsoredUSD: Number((data.totalSponsoredUSD || 0).toFixed(2)),
    polygonTransactions: data.polygonTransactions || 0,
    baseTransactions: data.baseTransactions || 0,
    activeWalletsCount: data.activeWalletsCount || 0,
  };
}
