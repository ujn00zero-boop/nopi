import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types';

export const useTransactions = (goalId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    let q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    if (goalId) {
      q = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        where('goalId', '==', goalId),
        orderBy('date', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as Transaction[];
      
      setTransactions(transactionsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser, goalId]);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'userId'>) => {
    if (!currentUser) return;

    await addDoc(collection(db, 'transactions'), {
      ...transactionData,
      userId: currentUser.uid,
    });
  };

  return { transactions, loading, addTransaction };
};