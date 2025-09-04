import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BudgetTransaction } from '../types';

export const useBudgetTransactions = (budgetId?: string) => {
  const [transactions, setTransactions] = useState<BudgetTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'budgetTransactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    if (budgetId) {
      q = query(
        collection(db, 'budgetTransactions'),
        where('userId', '==', currentUser.uid),
        where('budgetId', '==', budgetId),
        orderBy('date', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as BudgetTransaction[];
      
      setTransactions(transactionsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, budgetId]);

  const addTransaction = async (transactionData: Omit<BudgetTransaction, 'id' | 'userId'>) => {
    if (!currentUser) return;

    await addDoc(collection(db, 'budgetTransactions'), {
      ...transactionData,
      userId: currentUser.uid,
    });
  };

  return { transactions, loading, addTransaction };
};